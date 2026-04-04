"""Вакансии и объявления о поиске работы на портале Работа-Ялта"""
import json
import os
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Token",
}

def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def t(name: str) -> str:
    schema = os.environ.get("MAIN_DB_SCHEMA", "public")
    return f"{schema}.{name}"

def get_user_by_token(cur, token: str):
    if not token:
        return None
    cur.execute(
        f"SELECT u.id, u.name, u.email, u.role FROM {t('users')} u "
        f"JOIN {t('user_sessions')} s ON s.user_id = u.id "
        f"WHERE s.token = %s AND s.expires_at > NOW()",
        (token,)
    )
    return cur.fetchone()

def resp(status: int, data) -> dict:
    return {"statusCode": status, "headers": CORS, "body": json.dumps(data, ensure_ascii=False, default=str)}

def handler(event: dict, context) -> dict:
    """Вакансии: action=list|create|my|delete|update"""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    headers = event.get("headers", {})
    token = headers.get("X-Session-Token", "")
    body = json.loads(event.get("body") or "{}")
    action = body.get("action", "list")

    conn = get_db()
    cur = conn.cursor()

    # Публичный список вакансий
    if action == "list":
        specialty = body.get("specialty", "")
        role_filter = body.get("role", "")
        limit = int(body.get("limit", 20))

        where = ["v.is_active = TRUE"]
        params = []
        if specialty:
            where.append("v.specialty = %s")
            params.append(specialty)
        if role_filter:
            where.append("u.role = %s")
            params.append(role_filter)

        where_sql = " AND ".join(where)
        cur.execute(
            f"SELECT v.id, v.title, v.company, v.specialty, v.salary_from, v.salary_to, "
            f"v.city, v.schedule, v.experience_required, v.description, "
            f"v.contact_phone, v.contact_email, v.created_at, u.name, u.role "
            f"FROM {t('vacancies')} v JOIN {t('users')} u ON u.id = v.user_id "
            f"WHERE {where_sql} ORDER BY v.created_at DESC LIMIT %s",
            params + [limit]
        )
        rows = cur.fetchall()
        keys = ["id","title","company","specialty","salary_from","salary_to","city",
                "schedule","experience_required","description","contact_phone","contact_email",
                "created_at","author_name","author_role"]
        result = []
        for r in rows:
            item = dict(zip(keys, r))
            item["contact_phone"] = ""
            item["contact_email"] = ""
            result.append(item)
        conn.close()
        return resp(200, result)

    # Мои вакансии
    if action == "my":
        user = get_user_by_token(cur, token)
        if not user:
            conn.close()
            return resp(401, {"error": "Не авторизован"})
        cur.execute(
            f"SELECT id, title, company, specialty, salary_from, salary_to, city, "
            f"schedule, experience_required, description, contact_phone, contact_email, "
            f"is_active, created_at FROM {t('vacancies')} WHERE user_id = %s AND is_active = TRUE ORDER BY created_at DESC",
            (user[0],)
        )
        rows = cur.fetchall()
        conn.close()
        keys = ["id","title","company","specialty","salary_from","salary_to","city",
                "schedule","experience_required","description","contact_phone","contact_email",
                "is_active","created_at"]
        return resp(200, [dict(zip(keys, r)) for r in rows])

    # Создать вакансию/объявление
    if action == "create":
        user = get_user_by_token(cur, token)
        if not user:
            conn.close()
            return resp(401, {"error": "Не авторизован"})

        title = body.get("title", "").strip()
        specialty = body.get("specialty", "").strip()
        if not title or not specialty:
            conn.close()
            return resp(400, {"error": "Заполните название и специальность"})

        cur.execute(
            f"INSERT INTO {t('vacancies')} (user_id, title, company, specialty, salary_from, salary_to, "
            f"city, schedule, experience_required, description, contact_phone, contact_email) "
            f"VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id",
            (
                user[0], title,
                body.get("company", ""),
                specialty,
                body.get("salary_from") or None,
                body.get("salary_to") or None,
                body.get("city", "Ялта"),
                body.get("schedule", ""),
                body.get("experience_required", ""),
                body.get("description", ""),
                body.get("contact_phone", ""),
                body.get("contact_email", ""),
            )
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        conn.close()
        return resp(200, {"ok": True, "id": new_id})

    # Удалить
    if action == "delete":
        user = get_user_by_token(cur, token)
        if not user:
            conn.close()
            return resp(401, {"error": "Не авторизован"})
        vacancy_id = body.get("id")
        cur.execute(
            f"UPDATE {t('vacancies')} SET is_active = FALSE WHERE id = %s AND user_id = %s",
            (vacancy_id, user[0])
        )
        conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    # Получить телефон после оплаты
    if action == "get_phone":
        user = get_user_by_token(cur, token)
        if not user:
            conn.close()
            return resp(401, {"error": "Не авторизован"})
        vacancy_id = body.get("vacancy_id")
        cur.execute(
            f"SELECT id FROM {t('phone_access')} "
            f"WHERE user_id = %s AND vacancy_id = %s AND payment_status = 'succeeded' AND expires_at > NOW()",
            (user[0], vacancy_id)
        )
        if not cur.fetchone():
            conn.close()
            return resp(403, {"error": "Нет доступа. Оплатите, чтобы увидеть номер"})
        cur.execute(
            f"SELECT contact_phone, contact_email FROM {t('vacancies')} WHERE id = %s AND is_active = TRUE",
            (vacancy_id,)
        )
        row = cur.fetchone()
        conn.close()
        if not row:
            return resp(404, {"error": "Вакансия не найдена"})
        return resp(200, {"contact_phone": row[0], "contact_email": row[1]})

    conn.close()
    return resp(404, {"error": "Неизвестное действие"})
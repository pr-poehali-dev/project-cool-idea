"""Регистрация, вход и личный кабинет пользователей сайта Работа-Ялта"""
import json
import os
import hashlib
import secrets
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Token",
}

def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def make_token() -> str:
    return secrets.token_hex(32)

def get_user_by_token(cur, token: str):
    cur.execute(
        "SELECT u.id, u.name, u.email, u.role FROM users u "
        "JOIN user_sessions s ON s.user_id = u.id "
        "WHERE s.token = %s AND s.expires_at > NOW()",
        (token,)
    )
    return cur.fetchone()

def resp(status: int, data: dict) -> dict:
    return {"statusCode": status, "headers": CORS, "body": json.dumps(data, ensure_ascii=False)}

def handler(event: dict, context) -> dict:
    """Пользователи: action=register|login|logout|me|update_profile"""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    headers = event.get("headers", {})
    token = headers.get("X-Session-Token", "")
    body = json.loads(event.get("body") or "{}")
    action = body.get("action", "me")

    if action == "me":
        if not token:
            return resp(401, {"error": "Не авторизован"})
        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            "SELECT u.id, u.name, u.email, u.role, u.phone, u.specialty, u.experience, u.city, u.about "
            "FROM users u JOIN user_sessions s ON s.user_id = u.id "
            "WHERE s.token = %s AND s.expires_at > NOW()",
            (token,)
        )
        user = cur.fetchone()
        conn.close()
        if not user:
            return resp(401, {"error": "Сессия истекла"})
        return resp(200, {
            "id": user[0], "name": user[1], "email": user[2], "role": user[3],
            "phone": user[4] or "", "specialty": user[5] or "",
            "experience": user[6] or "", "city": user[7] or "", "about": user[8] or ""
        })

    if action == "update_profile":
        if not token:
            return resp(401, {"error": "Не авторизован"})
        conn = get_db()
        cur = conn.cursor()
        user = get_user_by_token(cur, token)
        if not user:
            conn.close()
            return resp(401, {"error": "Сессия истекла"})
        cur.execute(
            "UPDATE users SET name=%s, phone=%s, specialty=%s, experience=%s, city=%s, about=%s WHERE id=%s",
            (
                body.get("name", user[1]).strip(),
                body.get("phone", ""),
                body.get("specialty", ""),
                body.get("experience", ""),
                body.get("city", ""),
                body.get("about", ""),
                user[0]
            )
        )
        conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    if action == "register":
        name = body.get("name", "").strip()
        email = body.get("email", "").strip().lower()
        password = body.get("password", "")
        role = body.get("role", "worker")

        if not name or not email or not password:
            return resp(400, {"error": "Заполните все поля"})
        if len(password) < 6:
            return resp(400, {"error": "Пароль минимум 6 символов"})
        if role not in ("worker", "employer"):
            role = "worker"

        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cur.fetchone():
            conn.close()
            return resp(409, {"error": "Email уже зарегистрирован"})

        pw_hash = hash_password(password)
        cur.execute(
            "INSERT INTO users (name, email, password_hash, role) VALUES (%s, %s, %s, %s) RETURNING id",
            (name, email, pw_hash, role)
        )
        user_id = cur.fetchone()[0]
        token_val = make_token()
        cur.execute(
            "INSERT INTO user_sessions (user_id, token, expires_at) VALUES (%s, %s, NOW() + INTERVAL '30 days')",
            (user_id, token_val)
        )
        conn.commit()
        conn.close()
        return resp(200, {"token": token_val, "name": name, "email": email, "role": role})

    if action == "login":
        email = body.get("email", "").strip().lower()
        password = body.get("password", "")

        if not email or not password:
            return resp(400, {"error": "Введите email и пароль"})

        conn = get_db()
        cur = conn.cursor()
        pw_hash = hash_password(password)
        cur.execute(
            "SELECT id, name, email, role FROM users WHERE email = %s AND password_hash = %s",
            (email, pw_hash)
        )
        user = cur.fetchone()
        if not user:
            conn.close()
            return resp(401, {"error": "Неверный email или пароль"})

        token_val = make_token()
        cur.execute(
            "INSERT INTO user_sessions (user_id, token, expires_at) VALUES (%s, %s, NOW() + INTERVAL '30 days')",
            (user[0], token_val)
        )
        conn.commit()
        conn.close()
        return resp(200, {"token": token_val, "name": user[1], "email": user[2], "role": user[3]})

    if action == "logout":
        if token:
            conn = get_db()
            cur = conn.cursor()
            cur.execute("UPDATE user_sessions SET expires_at = NOW() WHERE token = %s", (token,))
            conn.commit()
            conn.close()
        return resp(200, {"ok": True})

    if action == "save_vacancy":
        if not token:
            return resp(401, {"error": "Не авторизован"})
        conn = get_db()
        cur = conn.cursor()
        user = get_user_by_token(cur, token)
        if not user:
            conn.close()
            return resp(401, {"error": "Сессия истекла"})
        vacancy_id = body.get("vacancy_id")
        if not vacancy_id:
            conn.close()
            return resp(400, {"error": "Не указан vacancy_id"})
        cur.execute(
            "INSERT INTO saved_contacts (user_id, vacancy_id) VALUES (%s, %s) ON CONFLICT DO NOTHING",
            (user[0], vacancy_id)
        )
        conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    if action == "my_saved":
        if not token:
            return resp(401, {"error": "Не авторизован"})
        conn = get_db()
        cur = conn.cursor()
        user = get_user_by_token(cur, token)
        if not user:
            conn.close()
            return resp(401, {"error": "Сессия истекла"})
        cur.execute(
            "SELECT v.id, v.title, v.specialty, v.city, v.salary_from, v.salary_to, "
            "v.contact_phone, v.contact_email, v.description, sc.paid, sc.created_at "
            "FROM saved_contacts sc JOIN vacancies v ON v.id = sc.vacancy_id "
            "WHERE sc.user_id = %s ORDER BY sc.created_at DESC",
            (user[0],)
        )
        rows = cur.fetchall()
        conn.close()
        keys = ["id","title","specialty","city","salary_from","salary_to","contact_phone","contact_email","description","paid","saved_at"]
        return resp(200, [dict(zip(keys, r)) for r in rows])

    if action == "unsave_vacancy":
        if not token:
            return resp(401, {"error": "Не авторизован"})
        conn = get_db()
        cur = conn.cursor()
        user = get_user_by_token(cur, token)
        if not user:
            conn.close()
            return resp(401, {"error": "Сессия истекла"})
        vacancy_id = body.get("vacancy_id")
        cur.execute(
            "DELETE FROM saved_contacts WHERE user_id = %s AND vacancy_id = %s",
            (user[0], vacancy_id)
        )
        conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    return resp(404, {"error": "Неизвестное действие"})
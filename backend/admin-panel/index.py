"""Админ-панель: управление пользователями и объявлениями"""
import json
import os
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}

def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def check_admin(session_id: str) -> bool:
    if not session_id:
        return False
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "SELECT id FROM admin_sessions WHERE session_id = %s AND expires_at > NOW()",
        (session_id,)
    )
    row = cur.fetchone()
    conn.close()
    return row is not None

def resp(status: int, data) -> dict:
    return {"statusCode": status, "headers": CORS, "body": json.dumps(data, ensure_ascii=False, default=str)}

def handler(event: dict, context) -> dict:
    """Админ-панель: action=stats|users|vacancies|delete_user|delete_vacancy|restore_vacancy|edit_user|toggle_block_user"""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    headers = event.get("headers", {})
    session_id = headers.get("X-Session-Id", "")

    if not check_admin(session_id):
        return resp(401, {"error": "Нет доступа"})

    body = json.loads(event.get("body") or "{}")
    action = body.get("action", "stats")
    conn = get_db()
    cur = conn.cursor()

    if action == "stats":
        cur.execute("SELECT COUNT(*) FROM users")
        total_users = cur.fetchone()[0]
        cur.execute("SELECT COUNT(*) FROM users WHERE role = 'employer'")
        employers = cur.fetchone()[0]
        cur.execute("SELECT COUNT(*) FROM users WHERE role = 'worker'")
        workers = cur.fetchone()[0]
        cur.execute("SELECT COUNT(*) FROM vacancies WHERE is_active = TRUE")
        active_vacancies = cur.fetchone()[0]
        cur.execute("SELECT COUNT(*) FROM vacancies")
        total_vacancies = cur.fetchone()[0]
        cur.execute("SELECT COUNT(*) FROM saved_contacts")
        saved = cur.fetchone()[0]
        conn.close()
        return resp(200, {
            "total_users": total_users,
            "employers": employers,
            "workers": workers,
            "active_vacancies": active_vacancies,
            "total_vacancies": total_vacancies,
            "saved_contacts": saved,
        })

    if action == "users":
        role = body.get("role", "")
        search = body.get("search", "")
        where = []
        params = []
        if role:
            where.append("role = %s")
            params.append(role)
        if search:
            where.append("(name ILIKE %s OR email ILIKE %s OR specialty ILIKE %s)")
            params += [f"%{search}%", f"%{search}%", f"%{search}%"]
        where_sql = ("WHERE " + " AND ".join(where)) if where else ""
        cur.execute(
            f"SELECT id, name, email, role, phone, specialty, created_at, is_blocked "
            f"FROM users {where_sql} ORDER BY created_at DESC LIMIT 100",
            params
        )
        rows = cur.fetchall()
        conn.close()
        keys = ["id", "name", "email", "role", "phone", "specialty", "created_at", "is_blocked"]
        return resp(200, [dict(zip(keys, r)) for r in rows])

    if action == "vacancies":
        role_filter = body.get("role", "")
        search = body.get("search", "")
        show_all = body.get("show_all", False)
        where = []
        params = []
        if not show_all:
            where.append("v.is_active = TRUE")
        if role_filter:
            where.append("u.role = %s")
            params.append(role_filter)
        if search:
            where.append("(v.title ILIKE %s OR v.specialty ILIKE %s OR u.name ILIKE %s OR u.email ILIKE %s)")
            params += [f"%{search}%", f"%{search}%", f"%{search}%", f"%{search}%"]
        where_sql = ("WHERE " + " AND ".join(where)) if where else ""
        cur.execute(
            f"SELECT v.id, v.title, v.specialty, v.city, v.salary_from, v.salary_to, "
            f"v.contact_phone, v.contact_email, v.description, v.is_active, v.created_at, "
            f"u.id, u.name, u.email, u.role "
            f"FROM vacancies v JOIN users u ON u.id = v.user_id "
            f"{where_sql} ORDER BY v.created_at DESC LIMIT 100",
            params
        )
        rows = cur.fetchall()
        conn.close()
        keys = ["id","title","specialty","city","salary_from","salary_to","contact_phone","contact_email",
                "description","is_active","created_at","user_id","user_name","user_email","user_role"]
        return resp(200, [dict(zip(keys, r)) for r in rows])

    if action == "edit_user":
        import hashlib
        user_id = body.get("user_id")
        name = body.get("name", "").strip()
        email = body.get("email", "").strip()
        phone = body.get("phone", "").strip()
        new_password = body.get("new_password", "").strip()
        updates = []
        params = []
        if name:
            updates.append("name = %s"); params.append(name)
        if email:
            updates.append("email = %s"); params.append(email)
        if phone is not None:
            updates.append("phone = %s"); params.append(phone)
        if new_password:
            pw_hash = hashlib.sha256(new_password.encode()).hexdigest()
            updates.append("password_hash = %s"); params.append(pw_hash)
        if not updates:
            conn.close()
            return resp(400, {"error": "Нечего обновлять"})
        params.append(user_id)
        cur.execute(f"UPDATE users SET {', '.join(updates)} WHERE id = %s", params)
        conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    if action == "toggle_block_user":
        user_id = body.get("user_id")
        block = body.get("block", True)
        cur.execute("UPDATE users SET is_blocked = %s WHERE id = %s", (block, user_id))
        if block:
            cur.execute("UPDATE user_sessions SET expires_at = NOW() WHERE user_id = %s", (user_id,))
        conn.commit()
        conn.close()
        return resp(200, {"ok": True, "is_blocked": block})

    if action == "delete_user":
        user_id = body.get("user_id")
        cur.execute("UPDATE vacancies SET is_active = FALSE WHERE user_id = %s", (user_id,))
        cur.execute("UPDATE user_sessions SET expires_at = NOW() WHERE user_id = %s", (user_id,))
        cur.execute("DELETE FROM users WHERE id = %s", (user_id,))
        conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    if action == "delete_vacancy":
        vacancy_id = body.get("vacancy_id")
        cur.execute("UPDATE vacancies SET is_active = FALSE WHERE id = %s", (vacancy_id,))
        conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    if action == "restore_vacancy":
        vacancy_id = body.get("vacancy_id")
        cur.execute("UPDATE vacancies SET is_active = TRUE WHERE id = %s", (vacancy_id,))
        conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    conn.close()
    return resp(404, {"error": "Неизвестное действие"})
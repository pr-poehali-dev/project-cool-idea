"""Авторизация администратора сайта Работа-Ялта"""
import json
import os
import hashlib
import secrets
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}

def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def check_session(session_id: str) -> bool:
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

def handler(event: dict, context) -> dict:
    """Авторизация: GET — проверка сессии, POST action=login|logout"""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    headers = event.get("headers", {})
    session_id = headers.get("X-Session-Id", "")

    if method == "GET":
        ok = check_session(session_id)
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"authenticated": ok})}

    body = json.loads(event.get("body") or "{}")
    action = body.get("action", "login")

    if action == "check":
        ok = check_session(session_id)
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"authenticated": ok})}

    if action == "logout":
        if session_id:
            conn = get_db()
            cur = conn.cursor()
            cur.execute("DELETE FROM admin_sessions WHERE session_id = %s", (session_id,))
            conn.commit()
            conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

    login = body.get("login", "")
    password = body.get("password", "")
    admin_login = os.environ.get("ADMIN_LOGIN", "")
    admin_password = os.environ.get("ADMIN_PASSWORD", "")

    if not admin_login or not admin_password:
        return {"statusCode": 500, "headers": CORS, "body": json.dumps({"error": "Сервер не настроен"})}

    login_ok = secrets.compare_digest(login, admin_login)
    password_ok = secrets.compare_digest(password, admin_password)

    if not login_ok or not password_ok:
        return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Неверный логин или пароль"})}

    new_session = hashlib.sha256(secrets.token_bytes(32)).hexdigest()
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO admin_sessions (session_id, expires_at) VALUES (%s, NOW() + INTERVAL '7 days')",
        (new_session,)
    )
    conn.commit()
    conn.close()
    return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True, "sessionId": new_session})}

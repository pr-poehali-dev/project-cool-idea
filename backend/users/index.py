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
    """Пользователи: action=register|login|logout|me"""
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
        user = get_user_by_token(cur, token)
        conn.close()
        if not user:
            return resp(401, {"error": "Сессия истекла"})
        return resp(200, {"id": user[0], "name": user[1], "email": user[2], "role": user[3]})

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

    return resp(404, {"error": "Неизвестное действие"})

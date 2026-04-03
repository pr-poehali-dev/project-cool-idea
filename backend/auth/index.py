"""Авторизация администратора сайта Работа-Ялта. v2"""
import json
import os
import hashlib
import secrets

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}

# Простое хранилище сессий в памяти (живёт пока функция активна)
_sessions: dict[str, bool] = {}


def handler(event: dict, context) -> dict:
    """Авторизация: GET — проверка сессии, POST action=login|logout|check"""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    headers = event.get("headers", {})
    session_id = headers.get("X-Session-Id", "")

    if method == "GET":
        ok = bool(session_id and session_id in _sessions)
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"authenticated": ok})}

    body = json.loads(event.get("body") or "{}")
    action = body.get("action", "login")

    if action == "check":
        ok = session_id in _sessions
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"authenticated": ok})}

    if action == "logout":
        _sessions.pop(session_id, None)
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

    password = body.get("password", "")
    admin_password = os.environ.get("ADMIN_PASSWORD", "")

    if not admin_password:
        return {"statusCode": 500, "headers": CORS, "body": json.dumps({"error": "Сервер не настроен"})}

    if not secrets.compare_digest(password, admin_password):
        return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Неверный пароль"})}

    new_session = hashlib.sha256(secrets.token_bytes(32)).hexdigest()
    _sessions[new_session] = True
    return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True, "sessionId": new_session})}
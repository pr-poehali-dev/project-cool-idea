"""Платежи ЮКасса: создание платежа за доступ к номеру телефона (500 руб., 24 часа)"""
import json
import os
import uuid
import psycopg2
import urllib.request
import urllib.parse
import base64

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
        f"SELECT u.id, u.name, u.email FROM {t('users')} u "
        f"JOIN {t('user_sessions')} s ON s.user_id = u.id "
        f"WHERE s.token = %s AND s.expires_at > NOW()",
        (token,)
    )
    return cur.fetchone()

def resp(status: int, data) -> dict:
    return {"statusCode": status, "headers": CORS, "body": json.dumps(data, ensure_ascii=False, default=str)}

def yookassa_request(method: str, path: str, data: dict = None) -> dict:
    shop_id = os.environ["YOOKASSA_SHOP_ID"]
    secret_key = os.environ["YOOKASSA_SECRET_KEY"]
    credentials = base64.b64encode(f"{shop_id}:{secret_key}".encode()).decode()
    
    url = f"https://api.yookassa.ru/v3{path}"
    headers = {
        "Authorization": f"Basic {credentials}",
        "Content-Type": "application/json",
        "Idempotence-Key": str(uuid.uuid4()),
    }
    
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode())

def handler(event: dict, context) -> dict:
    """Создание платежа ЮКасса за доступ к телефону вакансии"""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    headers = event.get("headers", {})
    token = headers.get("X-Session-Token", "")
    body = json.loads(event.get("body") or "{}")
    action = body.get("action", "")

    conn = get_db()
    cur = conn.cursor()

    # Проверка: есть ли уже активный доступ
    if action == "check_access":
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
        has_access = cur.fetchone() is not None
        conn.close()
        return resp(200, {"has_access": has_access})

    # Создать платёж
    if action == "create_payment":
        user = get_user_by_token(cur, token)
        if not user:
            conn.close()
            return resp(401, {"error": "Не авторизован"})
        
        vacancy_id = body.get("vacancy_id")
        return_url = body.get("return_url", "https://rabota-yalta.ru")
        
        # Проверяем есть ли уже активный доступ
        cur.execute(
            f"SELECT id FROM {t('phone_access')} "
            f"WHERE user_id = %s AND vacancy_id = %s AND payment_status = 'succeeded' AND expires_at > NOW()",
            (user[0], vacancy_id)
        )
        if cur.fetchone():
            conn.close()
            return resp(200, {"already_paid": True})
        
        # Создаём платёж в ЮКассе
        payment_data = {
            "amount": {"value": "500.00", "currency": "RUB"},
            "confirmation": {
                "type": "redirect",
                "return_url": return_url
            },
            "capture": True,
            "description": f"Доступ к контактам исполнителя (вакансия #{vacancy_id}) на 24 часа",
            "metadata": {
                "user_id": str(user[0]),
                "vacancy_id": str(vacancy_id)
            }
        }
        
        payment = yookassa_request("POST", "/payments", payment_data)
        payment_id = payment["id"]
        confirmation_url = payment["confirmation"]["confirmation_url"]
        
        # Записываем в БД как pending
        cur.execute(
            f"INSERT INTO {t('phone_access')} (user_id, vacancy_id, payment_id, payment_status, amount) "
            f"VALUES (%s, %s, %s, 'pending', 500)",
            (user[0], vacancy_id, payment_id)
        )
        conn.commit()
        conn.close()
        
        return resp(200, {"payment_id": payment_id, "confirmation_url": confirmation_url})

    conn.close()
    return resp(404, {"error": "Неизвестное действие"})

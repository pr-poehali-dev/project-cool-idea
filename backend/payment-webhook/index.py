"""Вебхук от ЮКасса: обработка подтверждения оплаты за доступ к телефону"""
import json
import os
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def t(name: str) -> str:
    schema = os.environ.get("MAIN_DB_SCHEMA", "public")
    return f"{schema}.{name}"

def resp(status: int, data) -> dict:
    return {"statusCode": status, "headers": CORS, "body": json.dumps(data, ensure_ascii=False)}

def handler(event: dict, context) -> dict:
    """Вебхук ЮКасса: обновляет статус платежа и открывает доступ к телефону на 24 часа"""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    body = json.loads(event.get("body") or "{}")
    event_type = body.get("type", "")
    payment_obj = body.get("object", {})
    
    if event_type != "payment.succeeded":
        return resp(200, {"ok": True, "ignored": True})
    
    payment_id = payment_obj.get("id")
    status = payment_obj.get("status")
    
    if not payment_id or status != "succeeded":
        return resp(200, {"ok": True})
    
    conn = get_db()
    cur = conn.cursor()
    
    cur.execute(
        f"UPDATE {t('phone_access')} "
        f"SET payment_status = 'succeeded', expires_at = NOW() + INTERVAL '24 hours' "
        f"WHERE payment_id = %s AND payment_status = 'pending'",
        (payment_id,)
    )
    conn.commit()
    conn.close()
    
    return resp(200, {"ok": True})

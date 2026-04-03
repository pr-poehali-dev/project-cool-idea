"""Каталог аренды спецтехники"""
import json
import os
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def t(name: str) -> str:
    schema = os.environ.get("MAIN_DB_SCHEMA", "public")
    return f"{schema}.{name}"

def resp(status: int, data) -> dict:
    return {"statusCode": status, "headers": CORS, "body": json.dumps(data, ensure_ascii=False, default=str)}

def handler(event: dict, context) -> dict:
    """Возвращает технику для аренды по категории или всё сразу"""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    params = event.get("queryStringParameters") or {}
    category = params.get("category", "")

    conn = get_db()
    cur = conn.cursor()

    if category:
        cur.execute(
            f"SELECT id, category, title, description, specs, price, image_url, tags "
            f"FROM {t('rental_machines')} WHERE is_active = TRUE AND category = %s "
            f"ORDER BY sort_order, id",
            (category,)
        )
    else:
        cur.execute(
            f"SELECT id, category, title, description, specs, price, image_url, tags "
            f"FROM {t('rental_machines')} WHERE is_active = TRUE "
            f"ORDER BY category, sort_order, id"
        )

    rows = cur.fetchall()
    conn.close()

    keys = ["id", "category", "title", "description", "specs", "price", "image_url", "tags"]
    machines = [dict(zip(keys, r)) for r in rows]

    for m in machines:
        if m["specs"]:
            m["specs"] = [s.strip() for s in m["specs"].split(",") if s.strip()]
        else:
            m["specs"] = []
        if m["tags"]:
            m["tags"] = [tag.strip() for tag in m["tags"].split(",") if tag.strip()]
        else:
            m["tags"] = []

    return resp(200, machines)

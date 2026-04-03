"""Каталог магазина: получение товаров по категории"""
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

def resp(status: int, data) -> dict:
    return {"statusCode": status, "headers": CORS, "body": json.dumps(data, ensure_ascii=False, default=str)}

def handler(event: dict, context) -> dict:
    """Возвращает товары магазина по категории или все сразу"""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    params = event.get("queryStringParameters") or {}
    category = params.get("category", "")

    conn = get_db()
    cur = conn.cursor()

    if category:
        cur.execute(
            "SELECT id, category, title, description, price, image_url, tags, sort_order "
            "FROM shop_products WHERE is_active = TRUE AND category = %s "
            "ORDER BY sort_order, id",
            (category,)
        )
    else:
        cur.execute(
            "SELECT id, category, title, description, price, image_url, tags, sort_order "
            "FROM shop_products WHERE is_active = TRUE "
            "ORDER BY category, sort_order, id"
        )

    rows = cur.fetchall()
    conn.close()

    keys = ["id", "category", "title", "description", "price", "image_url", "tags", "sort_order"]
    products = [dict(zip(keys, r)) for r in rows]

    for p in products:
        if p["tags"]:
            p["tags"] = [t.strip() for t in p["tags"].split(",") if t.strip()]
        else:
            p["tags"] = []

    return resp(200, products)

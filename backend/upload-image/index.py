"""Загрузка изображений в S3. Принимает base64, возвращает CDN URL."""
import json
import os
import base64
import uuid
import boto3
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}

def resp(status: int, data) -> dict:
    return {"statusCode": status, "headers": CORS, "body": json.dumps(data, ensure_ascii=False)}

def check_admin(session_id: str) -> bool:
    if not session_id:
        return False
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()
    cur.execute("SELECT id FROM admin_sessions WHERE session_id = %s AND expires_at > NOW()", (session_id,))
    row = cur.fetchone()
    conn.close()
    return row is not None

def handler(event: dict, context) -> dict:
    """Загружает base64-изображение в S3 и возвращает CDN URL"""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    headers = event.get("headers", {})
    session_id = headers.get("X-Session-Id", "")

    if not check_admin(session_id):
        return resp(401, {"error": "Нет доступа"})

    body = json.loads(event.get("body") or "{}")
    image_data = body.get("image", "")
    mime_type = body.get("mime_type", "image/jpeg")

    if not image_data:
        return resp(400, {"error": "Нет данных изображения"})

    if "," in image_data:
        image_data = image_data.split(",", 1)[1]

    file_bytes = base64.b64decode(image_data)

    ext = "jpg"
    if mime_type == "image/png":
        ext = "png"
    elif mime_type == "image/webp":
        ext = "webp"
    elif mime_type == "image/gif":
        ext = "gif"

    file_key = f"shop/{uuid.uuid4()}.{ext}"

    s3 = boto3.client(
        "s3",
        endpoint_url="https://bucket.poehali.dev",
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    )

    s3.put_object(
        Bucket="files",
        Key=file_key,
        Body=file_bytes,
        ContentType=mime_type,
    )

    cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{file_key}"

    return resp(200, {"url": cdn_url})

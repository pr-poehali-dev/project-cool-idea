import func2url from "../../backend/func2url.json"

const API = func2url.users
const TOKEN_KEY = "user_token"

export function getToken(): string {
  return localStorage.getItem(TOKEN_KEY) || ""
}

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export async function apiUsers(body: object) {
  const token = getToken()
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "X-Session-Token": token } : {}),
    },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return { ok: res.ok, status: res.status, data }
}

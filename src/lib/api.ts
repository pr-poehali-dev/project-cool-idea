import func2url from "../../backend/func2url.json"
import { getToken } from "./auth"

export async function apiVacancies(body: object) {
  const token = getToken()
  const res = await fetch(func2url.vacancies, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "X-Session-Token": token } : {}),
    },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return { ok: res.ok, data }
}

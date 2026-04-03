import func2url from "../../../backend/func2url.json"

export type Tab = "stats" | "employers" | "workers" | "vacancies_employer" | "vacancies_worker" | "shop"

export interface Stats {
  total_users: number; employers: number; workers: number
  active_vacancies: number; total_vacancies: number; saved_contacts: number
}

export interface User {
  id: number; name: string; email: string; role: string; phone: string; specialty: string; created_at: string; is_blocked: boolean
}

export interface Vacancy {
  id: number; title: string; specialty: string; city: string
  salary_from: number | null; salary_to: number | null
  contact_phone: string; contact_email: string; description: string
  is_active: boolean; created_at: string
  user_id: number; user_name: string; user_email: string; user_role: string
}

export interface ShopProduct {
  id: number; category: string; title: string; description: string
  price: string; image_url: string; tags: string; is_active: boolean; sort_order: number; created_at: string
}

export interface EditState {
  name: string; email: string; phone: string; new_password: string; confirm_password: string
}

export function getToken() { return localStorage.getItem("admin_session") || "" }

export async function api(action: string, extra: object = {}) {
  const res = await fetch(func2url["admin-panel"], {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Session-Id": getToken() },
    body: JSON.stringify({ action, ...extra }),
  })
  return res.json()
}

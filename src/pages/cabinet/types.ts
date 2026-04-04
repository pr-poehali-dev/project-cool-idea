export interface User {
  id: number; name: string; email: string; role: string
  phone: string; specialty: string; experience: string; city: string; about: string
}

export interface Vacancy {
  id: number; title: string; company: string; specialty: string
  salary_from: number | null; salary_to: number | null
  city: string; schedule: string; description: string
  contact_phone: string; contact_email: string; is_active: boolean
}

export interface SavedContact {
  id: number; title: string; specialty: string; city: string
  salary_from: number | null; salary_to: number | null
  contact_phone: string; contact_email: string; description: string; paid: boolean
}

export type Tab = "overview" | "profile" | "vacancies" | "new_vacancy" | "saved" | "purchases"

export const SPECIALTIES = [
  "Сварщик","Каменщик","Штукатур","Плиточник","Маляр","Электрик","Сантехник",
  "Монтажник","Плотник","Кровельщик","Бетонщик","Арматурщик","Оператор спецтехники",
  "Прораб","Геодезист","Инженер-строитель","Дорожный рабочий","Асфальтировщик",
  "Изолировщик","Стекольщик","Облицовщик","Паркетчик","Лепщик","Трубопроводчик",
  "Такелажник","Разнорабочий","Водитель спецтехники","Экскаваторщик","Крановщик",
  "Бульдозерист","Сигналист","Охранник объекта","Другое"
]
export const SCHEDULES = ["Полный день","Вахта","Гибкий","Подработка"]
export const EXPERIENCES = ["Без опыта","1–3 года","3–5 лет","Более 5 лет"]
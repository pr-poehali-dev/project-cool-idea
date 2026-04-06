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
  // Земляные и подготовительные работы
  "Разнорабочий","Землекоп","Подсобный рабочий","Грузчик",
  // Каменные и кладочные работы
  "Каменщик","Кладка блока / кирпича","Кладка плитки / камня","Печник",
  // Штукатурные и отделочные работы
  "Штукатур (ручная)","Штукатур (механическая)","Маляр","Отделочник","Гипсокартонщик",
  // Плиточные и напольные работы
  "Плиточник","Укладчик ламината / паркета","Мастер по наливным полам",
  // Сварочные и металлоконструкции
  "Сварщик (электросварка)","Сварщик (аргон)","Оператор сварочных роботов","Слесарь-сборщик металлоконструкций","Арматурщик",
  // Бетонные и монолитные работы
  "Бетонщик","Опалубщик","Монолитчик",
  // Кровельные и фасадные работы
  "Кровельщик","Фасадчик","Монтажник вентилируемых фасадов","Утеплительщик",
  // Инженерные коммуникации
  "Сантехник","Электрик","Вентиляционщик","Монтажник слаботочных систем",
  // Плотницкие и столярные работы
  "Плотник","Столяр","Монтажник деревянных конструкций","Установщик окон / дверей",
  // Мастера и руководители
  "Прораб","Мастер участка","Бригадир","Технадзор","Инженер ПТО",
  // Спецтехника и механизация
  "Машинист экскаватора","Машинист крана","Водитель самосвала","Оператор бетононасоса",
  // Вспомогательные профессии
  "Сторож / охранник объекта","Уборщик территории","Водитель категории B/C","Кладовщик стройматериалов",
]
export const SCHEDULES = ["Полный день","Вахта","Гибкий","Подработка"]
export const EXPERIENCES = ["Без опыта","1–3 года","3–5 лет","Более 5 лет"]
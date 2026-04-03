import { useEffect, useState } from "react"
import { apiVacancies } from "@/lib/api"
import Icon from "@/components/ui/icon"
import { ContactModal } from "./ContactModal"

interface VacancyCard {
  id: number; title: string; company: string; specialty: string
  salary_from: number | null; salary_to: number | null
  city: string; schedule: string; experience_required: string
  description: string; contact_phone: string; contact_email: string
  author_name: string; author_role: string; created_at: string
}

const SPECIALTIES = [
  "Все","Сварщик","Каменщик","Штукатур","Плиточник","Маляр","Электрик","Сантехник",
  "Монтажник","Плотник","Кровельщик","Бетонщик","Арматурщик","Оператор спецтехники",
  "Прораб","Геодезист","Инженер-строитель","Дорожный рабочий","Асфальтировщик",
  "Изолировщик","Стекольщик","Облицовщик","Паркетчик","Трубопроводчик",
  "Такелажник","Разнорабочий","Водитель спецтехники","Экскаваторщик","Крановщик",
  "Бульдозерист","Охранник объекта","Другое"
]

const SPECIALTY_PHOTOS: Record<string, string> = {
  "Сварщик": "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/8ece6b4a-6f00-4dbf-86f8-91b43c06ab13.jpg",
  "Каменщик": "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/08289b00-aa45-4bc1-8e68-e0e3211c2cfc.jpg",
  "Штукатур": "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/cfe83042-cdeb-4667-89f5-a32645845fe9.jpg",
  "Плиточник": "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/7b37f255-4d0f-4ec3-b498-9bfda545215e.jpg",
  "Маляр": "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/6a140130-e604-4056-886b-f819740787dd.jpg",
  "Электрик": "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/9d016ecd-20c7-4e5f-ad82-3b8c4699e67c.jpg",
  "Сантехник": "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/99bc13bf-8c59-49d6-9f4e-840671981018.jpg",
  "Плотник": "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/e5731c4d-5ea6-4e26-96d0-d417e65c8ef2.jpg",
  "Прораб": "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/38715a13-63ef-41d6-940d-a0f37b8b1299.jpg",
  "Экскаваторщик": "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/5671a3dc-c626-4a20-9831-0c4a68dd27ff.jpg",
  "Разнорабочий": "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/c5078601-59cc-4e4e-a8fc-38284e38f828.jpg",
  "Бетонщик": "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/c5078601-59cc-4e4e-a8fc-38284e38f828.jpg",
  "Арматурщик": "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/c5078601-59cc-4e4e-a8fc-38284e38f828.jpg",
  "Монтажник": "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/38715a13-63ef-41d6-940d-a0f37b8b1299.jpg",
  "Кровельщик": "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/c5078601-59cc-4e4e-a8fc-38284e38f828.jpg",
  "Оператор спецтехники": "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/5671a3dc-c626-4a20-9831-0c4a68dd27ff.jpg",
  "Крановщик": "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/5671a3dc-c626-4a20-9831-0c4a68dd27ff.jpg",
  "Бульдозерист": "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/5671a3dc-c626-4a20-9831-0c4a68dd27ff.jpg",
  "Водитель спецтехники": "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/5671a3dc-c626-4a20-9831-0c4a68dd27ff.jpg",
  "Дорожный рабочий": "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/c5078601-59cc-4e4e-a8fc-38284e38f828.jpg",
  "Асфальтировщик": "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/c5078601-59cc-4e4e-a8fc-38284e38f828.jpg",
  "Облицовщик": "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/7b37f255-4d0f-4ec3-b498-9bfda545215e.jpg",
  "Паркетчик": "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/7b37f255-4d0f-4ec3-b498-9bfda545215e.jpg",
  "Стекольщик": "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/38715a13-63ef-41d6-940d-a0f37b8b1299.jpg",
  "Изолировщик": "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/c5078601-59cc-4e4e-a8fc-38284e38f828.jpg",
  "Трубопроводчик": "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/99bc13bf-8c59-49d6-9f4e-840671981018.jpg",
  "Такелажник": "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/c5078601-59cc-4e4e-a8fc-38284e38f828.jpg",
  "Геодезист": "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/38715a13-63ef-41d6-940d-a0f37b8b1299.jpg",
  "Инженер-строитель": "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/38715a13-63ef-41d6-940d-a0f37b8b1299.jpg",
  "Охранник объекта": "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/38715a13-63ef-41d6-940d-a0f37b8b1299.jpg",
}

const DEFAULT_PHOTO = "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/c5078601-59cc-4e4e-a8fc-38284e38f828.jpg"

function getSpecialtyPhoto(specialty: string): string {
  return SPECIALTY_PHOTOS[specialty] || DEFAULT_PHOTO
}

export function VacanciesBoard() {
  const [cards, setCards] = useState<VacancyCard[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("Все")
  const [roleFilter, setRoleFilter] = useState<"" | "employer" | "worker">("")
  const [expanded, setExpanded] = useState<number | null>(null)
  const [contactVacancy, setContactVacancy] = useState<VacancyCard | null>(null)

  const load = async () => {
    setLoading(true)
    const body: Record<string, string> = { action: "list" }
    if (filter !== "Все") body.specialty = filter
    if (roleFilter) body.role = roleFilter
    const { data } = await apiVacancies(body)
    setCards(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [filter, roleFilter])

  const formatSalary = (from: number | null, to: number | null) => {
    if (!from && !to) return null
    if (from && to) return `${from.toLocaleString()} – ${to.toLocaleString()} ₽`
    if (from) return `от ${from.toLocaleString()} ₽`
    return `до ${to!.toLocaleString()} ₽`
  }

  return (
    <section id="vacancies" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <p className="text-sm tracking-[0.3em] uppercase text-orange-500 mb-3">Площадка</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Вакансии и соискатели</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">Работодатели размещают вакансии — специалисты находят работу</p>
        </div>

        {/* Фильтры по типу */}
        <div className="flex justify-center gap-2 mb-6">
          {([["","Все объявления"],["employer","Вакансии"],["worker","Соискатели"]] as [typeof roleFilter, string][]).map(([val, label]) => (
            <button key={val} onClick={() => setRoleFilter(val)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${roleFilter===val ? "bg-primary text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-orange-300"}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Фильтр по специальности */}
        <div className="flex gap-2 flex-wrap justify-center mb-10">
          {SPECIALTIES.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${filter===s ? "bg-orange-500 text-white" : "bg-white text-gray-500 border border-gray-200 hover:border-orange-300"}`}>
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">Загружаем объявления...</div>
        ) : cards.length === 0 ? (
          <div className="text-center py-16">
            <Icon name="Inbox" size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400">Объявлений пока нет</p>
            <a href="/cabinet" className="mt-4 inline-block text-orange-500 text-sm font-medium hover:text-orange-600">
              Разместить первое →
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {cards.map(c => (
              <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all overflow-hidden">
                <div className="relative h-40 overflow-hidden">
                  <img src={getSpecialtyPhoto(c.specialty)} alt={c.specialty}
                    className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${c.author_role==="employer" ? "bg-blue-500 text-white" : "bg-green-500 text-white"}`}>
                      {c.author_role==="employer" ? "Вакансия" : "Соискатель"}
                    </span>
                    <span className="text-xs text-white/80">{c.city}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{c.title}</h3>
                  {c.company && <p className="text-sm text-gray-500 mb-2">{c.company}</p>}

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">{c.specialty}</span>
                    {c.schedule && <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">{c.schedule}</span>}
                    {c.experience_required && <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">{c.experience_required}</span>}
                  </div>

                  {formatSalary(c.salary_from, c.salary_to) && (
                    <p className="text-orange-500 font-bold text-sm mb-3">{formatSalary(c.salary_from, c.salary_to)}</p>
                  )}

                  {c.description && (
                    <p className="text-gray-500 text-sm line-clamp-2 mb-3">{c.description}</p>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <button onClick={() => setExpanded(expanded===c.id ? null : c.id)}
                      className="text-gray-400 text-sm hover:text-gray-600 transition-colors">
                      {expanded===c.id ? "Свернуть ↑" : "Подробнее ↓"}
                    </button>
                    <button onClick={() => setContactVacancy(c)}
                      className="flex items-center gap-1.5 bg-orange-500 text-white text-sm px-4 py-2 rounded-xl font-semibold hover:bg-orange-600 transition-colors">
                      <Icon name="Phone" size={14} />
                      Связаться
                    </button>
                  </div>

                  {expanded===c.id && c.description && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-gray-600 text-sm">{c.description}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <a href="/auth" className="inline-flex items-center gap-2 bg-orange-500 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-orange-600 transition-colors text-sm">
            <Icon name="Plus" size={18} />
            Разместить объявление
          </a>
        </div>
      </div>

      <ContactModal
        vacancy={contactVacancy}
        onClose={() => setContactVacancy(null)}
      />
    </section>
  )
}
import { useEffect, useState } from "react"
import { apiVacancies } from "@/lib/api"
import Icon from "@/components/ui/icon"

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

export function VacanciesBoard() {
  const [cards, setCards] = useState<VacancyCard[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("Все")
  const [roleFilter, setRoleFilter] = useState<"" | "employer" | "worker">("")
  const [expanded, setExpanded] = useState<number | null>(null)

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
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${c.author_role==="employer" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}`}>
                      {c.author_role==="employer" ? "Вакансия" : "Соискатель"}
                    </span>
                    <span className="text-xs text-gray-400">{c.city}</span>
                  </div>

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

                  <button onClick={() => setExpanded(expanded===c.id ? null : c.id)}
                    className="text-orange-500 text-sm font-medium hover:text-orange-600 transition-colors">
                    {expanded===c.id ? "Свернуть ↑" : "Подробнее ↓"}
                  </button>

                  {expanded===c.id && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                      {c.description && <p className="text-gray-600 text-sm">{c.description}</p>}
                      <div className="flex flex-col gap-1 mt-3">
                        {c.contact_phone && (
                          <a href={`tel:${c.contact_phone}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-orange-500 transition-colors">
                            <Icon name="Phone" size={14} />{c.contact_phone}
                          </a>
                        )}
                        {c.contact_email && (
                          <a href={`mailto:${c.contact_email}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-orange-500 transition-colors">
                            <Icon name="Mail" size={14} />{c.contact_email}
                          </a>
                        )}
                        {!c.contact_phone && !c.contact_email && (
                          <p className="text-gray-400 text-xs">Контакты не указаны</p>
                        )}
                      </div>
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
    </section>
  )
}
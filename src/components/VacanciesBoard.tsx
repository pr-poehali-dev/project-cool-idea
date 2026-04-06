import { useEffect, useState } from "react"
import { apiVacancies } from "@/lib/api"
import { apiUsers, getToken } from "@/lib/auth"
import Icon from "@/components/ui/icon"
import { ContactModal } from "./ContactModal"
import { getSpecialtyPhoto } from "@/lib/specialtyPhotos"

interface VacancyCard {
  id: number; title: string; company: string; specialty: string
  salary_from: number | null; salary_to: number | null
  city: string; schedule: string; experience_required: string
  description: string; contact_phone: string; contact_email: string
  author_name: string; author_role: string; created_at: string
}

const SPECIALTIES = [
  "Все",
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


const EMPLOYMENT_TYPES = ["Постоянная","Временная / сезонная","Разовые задания","Вахтовый метод","Удалённая"]
const QUALIFICATIONS = ["Без опыта","Начинающий специалист","Опытный мастер","Высококвалифицированный"]
const SALARY_RANGES = ["До 30 000 ₽","30 000 – 50 000 ₽","50 000 – 80 000 ₽","От 80 000 ₽","По договорённости"]
const CITIES = ["Симферополь","Ялта","Севастополь","Керчь","Феодосия","Евпатория","Алушта","Судак","Саки","Бахчисарай","Джанкой","Белогорск"]

export function VacanciesBoard() {
  const [cards, setCards] = useState<VacancyCard[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("Все")
  const [roleFilter, setRoleFilter] = useState<"" | "employer" | "worker">("")
  const [employment, setEmployment] = useState("")
  const [qualification, setQualification] = useState("")
  const [salaryRange, setSalaryRange] = useState("")
  const [city, setCity] = useState("")
  const [expanded, setExpanded] = useState<number | null>(null)
  const [contactVacancy, setContactVacancy] = useState<VacancyCard | null>(null)
  const [saved, setSaved] = useState<Set<number>>(new Set())
  const [saving, setSaving] = useState<number | null>(null)

  const activeFiltersCount = [employment, qualification, salaryRange, city].filter(Boolean).length

  const resetFilters = () => { setEmployment(""); setQualification(""); setSalaryRange(""); setCity("") }

  const filterCards = (list: VacancyCard[]) => {
    return list.filter(c => {
      if (salaryRange) {
        const from = c.salary_from ?? 0
        const to = c.salary_to ?? c.salary_from ?? 0
        const avg = (from + to) / 2 || from || to
        if (salaryRange === "До 30 000 ₽" && avg >= 30000) return false
        if (salaryRange === "30 000 – 50 000 ₽" && (avg < 30000 || avg > 50000)) return false
        if (salaryRange === "50 000 – 80 000 ₽" && (avg < 50000 || avg > 80000)) return false
        if (salaryRange === "От 80 000 ₽" && avg < 80000) return false
      }
      if (qualification && c.experience_required && !c.experience_required.toLowerCase().includes(qualification.toLowerCase())) return false
      if (employment && c.schedule && !c.schedule.toLowerCase().includes(employment.toLowerCase())) return false
      if (city && !c.city?.toLowerCase().includes(city.toLowerCase())) return false
      return true
    })
  }

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

  useEffect(() => {
    if (getToken()) {
      apiUsers({ action: "my_saved" }).then(({ data }) => {
        if (Array.isArray(data)) {
          setSaved(new Set(data.map((s: { id: number }) => s.id)))
        }
      })
    }
  }, [])

  const toggleSave = async (c: VacancyCard) => {
    if (!getToken()) {
      localStorage.setItem("pending_save_vacancy", String(c.id))
      window.location.href = "/auth"
      return
    }
    setSaving(c.id)
    if (saved.has(c.id)) {
      await apiUsers({ action: "unsave_vacancy", vacancy_id: c.id })
      setSaved(prev => { const s = new Set(prev); s.delete(c.id); return s })
    } else {
      await apiUsers({ action: "save_vacancy", vacancy_id: c.id })
      setSaved(prev => new Set([...prev, c.id]))
    }
    setSaving(null)
  }

  const formatSalary = (from: number | null, to: number | null) => {
    if (!from && !to) return null
    if (from && to) return `${from.toLocaleString()} – ${to.toLocaleString()} ₽`
    if (from) return `от ${from.toLocaleString()} ₽`
    return `до ${to!.toLocaleString()} ₽`
  }

  return (
    <section id="vacancies" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-10">
          <p className="text-sm tracking-[0.3em] uppercase text-yellow-500 mb-3">Площадка</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Вакансии и соискатели</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">Работодатели размещают вакансии — специалисты находят работу</p>
        </div>

        {/* Вкладки */}
        <div className="flex justify-center gap-2 mb-6">
          {([["","Все объявления"],["employer","Вакансии"],["worker","Соискатели"]] as [typeof roleFilter, string][]).map(([val, label]) => (
            <button key={val} onClick={() => setRoleFilter(val)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${roleFilter===val ? "bg-primary text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-yellow-300"}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Города */}
        <div className="flex gap-2 flex-wrap justify-center mb-4">
          {CITIES.map(c => (
            <button key={c} onClick={() => setCity(city === c ? "" : c)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${city === c ? "bg-primary text-white" : "bg-white text-gray-500 border border-gray-200 hover:border-primary/40"}`}>
              <Icon name="MapPin" size={11} />
              {c}
            </button>
          ))}
        </div>

        {/* Основной layout: фильтры слева + специальности+карточки справа */}
        <div className="flex gap-6 items-start">

          {/* Панель фильтров (слева, sticky) */}
          <aside className="hidden lg:block w-56 flex-shrink-0 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm sticky top-24">
            <div className="flex items-center justify-between mb-5">
              <span className="font-semibold text-gray-800 flex items-center gap-2">
                <Icon name="SlidersHorizontal" size={16} className="text-yellow-500" />
                Фильтры
              </span>
              {activeFiltersCount > 0 && (
                <button onClick={resetFilters} className="text-xs text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1">
                  <Icon name="X" size={12} />
                  Сбросить
                </button>
              )}
            </div>

            {/* Тип занятости */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Тип занятости</p>
              <div className="flex flex-col gap-1">
                {EMPLOYMENT_TYPES.map(e => (
                  <button key={e} onClick={() => setEmployment(employment === e ? "" : e)}
                    className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl text-left transition-all ${employment === e ? "bg-yellow-50 text-yellow-700 font-semibold border border-yellow-200" : "text-gray-600 hover:bg-gray-50 border border-transparent"}`}>
                    <span className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${employment === e ? "border-yellow-500 bg-yellow-500" : "border-gray-300"}`} />
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Квалификация */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Квалификация</p>
              <div className="flex flex-col gap-1">
                {QUALIFICATIONS.map(q => (
                  <button key={q} onClick={() => setQualification(qualification === q ? "" : q)}
                    className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl text-left transition-all ${qualification === q ? "bg-yellow-50 text-yellow-700 font-semibold border border-yellow-200" : "text-gray-600 hover:bg-gray-50 border border-transparent"}`}>
                    <span className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${qualification === q ? "border-yellow-500 bg-yellow-500" : "border-gray-300"}`} />
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Зарплата */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Зарплата</p>
              <div className="flex flex-col gap-1">
                {SALARY_RANGES.map(r => (
                  <button key={r} onClick={() => setSalaryRange(salaryRange === r ? "" : r)}
                    className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl text-left transition-all ${salaryRange === r ? "bg-yellow-50 text-yellow-700 font-semibold border border-yellow-200" : "text-gray-600 hover:bg-gray-50 border border-transparent"}`}>
                    <span className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${salaryRange === r ? "border-yellow-500 bg-yellow-500" : "border-gray-300"}`} />
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Правая колонка: специальности + карточки */}
          <div className="flex-1 min-w-0">

            {/* Специальности */}
            <div className="flex gap-2 flex-wrap mb-5">
              {SPECIALTIES.map(s => (
                <button key={s} onClick={() => setFilter(s)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${filter===s ? "bg-yellow-500 text-white" : "bg-white text-gray-500 border border-gray-200 hover:border-yellow-300"}`}>
                  {s}
                </button>
              ))}
            </div>

            {/* Мобильные фильтры */}
            <div className="flex gap-2 mb-4 lg:hidden">
              {[
                { label: "Занятость", value: employment, options: EMPLOYMENT_TYPES, set: setEmployment },
                { label: "Уровень", value: qualification, options: QUALIFICATIONS, set: setQualification },
                { label: "Зарплата", value: salaryRange, options: SALARY_RANGES, set: setSalaryRange },
              ].map(f => (
                <select key={f.label} value={f.value} onChange={e => f.set(e.target.value)}
                  className={`flex-1 border rounded-xl px-2 py-2 text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-yellow-300 ${f.value ? "border-yellow-400 bg-yellow-50 text-yellow-700" : "border-gray-200 bg-white text-gray-500"}`}>
                  <option value="">{f.label}</option>
                  {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ))}
              {activeFiltersCount > 0 && (
                <button onClick={resetFilters} className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-red-400 text-xs transition-all">
                  <Icon name="X" size={14} />
                </button>
              )}
            </div>

            {/* Счётчик результатов */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-400">
                {loading ? "Загружаем..." : `Найдено: ${filterCards(cards).length} объявлений`}
              </p>
              {activeFiltersCount > 0 && (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
                  Активных фильтров: {activeFiltersCount}
                </span>
              )}
            </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">Загружаем объявления...</div>
        ) : filterCards(cards).length === 0 ? (
          <div className="text-center py-16">
            <Icon name="Inbox" size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400">{cards.length === 0 ? "Объявлений пока нет" : "Ничего не найдено по выбранным фильтрам"}</p>
            {cards.length === 0 ? (
              <a href="/cabinet" className="mt-4 inline-block text-yellow-500 text-sm font-medium hover:text-yellow-600">Разместить первое →</a>
            ) : (
              <button onClick={resetFilters} className="mt-4 inline-block text-yellow-500 text-sm font-medium hover:text-yellow-600">Сбросить фильтры →</button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filterCards(cards).map(c => (
              <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-yellow-200 transition-all overflow-hidden">
                <div className="relative h-40 overflow-hidden">
                  <img src={getSpecialtyPhoto(c.specialty)} alt={c.specialty}
                    className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <button
                    onClick={() => toggleSave(c)}
                    disabled={saving === c.id}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center transition-all"
                    title={saved.has(c.id) ? "В избранном" : "Добавить в избранное"}
                  >
                    <Icon
                      name="Bookmark"
                      size={16}
                      className={saved.has(c.id) ? "text-yellow-400 fill-yellow-400" : "text-white"}
                    />
                  </button>
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
                    <p className="text-yellow-500 font-bold text-sm mb-3">{formatSalary(c.salary_from, c.salary_to)}</p>
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
                      className="flex items-center gap-1.5 bg-yellow-500 text-white text-sm px-4 py-2 rounded-xl font-semibold hover:bg-yellow-600 transition-colors">
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

            <div className="text-center mt-8">
              <a href="/auth" className="inline-flex items-center gap-2 bg-yellow-500 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-yellow-600 transition-colors text-sm">
                <Icon name="Plus" size={18} />
                Разместить объявление
              </a>
            </div>
          </div>{/* end flex-1 */}
        </div>{/* end flex gap-6 */}
      </div>

      <ContactModal
        vacancy={contactVacancy}
        onClose={() => setContactVacancy(null)}
      />
    </section>
  )
}
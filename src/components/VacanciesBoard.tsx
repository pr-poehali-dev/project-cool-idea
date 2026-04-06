import { useEffect, useState } from "react"
import { apiVacancies } from "@/lib/api"
import { apiUsers, getToken } from "@/lib/auth"
import Icon from "@/components/ui/icon"
import { VacancyCard as VacancyCardComponent } from "./VacancyCard"
import { VacanciesFilterPanel } from "./VacanciesFilterPanel"
import { VacancyCard, SALARY_RANGES } from "./vacanciesTypes"

export function VacanciesBoard() {
  const [cards, setCards] = useState<VacancyCard[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("Все")
  const [roleFilter, setRoleFilter] = useState<"" | "employer" | "worker">("")
  const [employment, setEmployment] = useState("")
  const [qualification, setQualification] = useState("")
  const [salaryRange, setSalaryRange] = useState("")
  const [city, setCity] = useState("")
  const [saved, setSaved] = useState<Set<number>>(new Set())
  const [saving, setSaving] = useState<number | null>(null)
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ specialty: false, city: false, employment: false, qualification: false, salary: false })
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const toggleSection = (key: string) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }))

  const activeFiltersCount = [filter !== "Все" ? filter : "", employment, qualification, salaryRange, city].filter(Boolean).length

  const resetFilters = () => { setFilter("Все"); setOpenGroup(null); setEmployment(""); setQualification(""); setSalaryRange(""); setCity("") }

  const filterCards = (list: VacancyCard[]) => {
    return list.filter(c => {
      if (salaryRange) {
        const from = c.salary_from ?? 0
        const to = c.salary_to ?? c.salary_from ?? 0
        const avg = (from + to) / 2 || from || to
        if (salaryRange === SALARY_RANGES[0] && avg >= 30000) return false
        if (salaryRange === SALARY_RANGES[1] && (avg < 30000 || avg > 50000)) return false
        if (salaryRange === SALARY_RANGES[2] && (avg < 50000 || avg > 80000)) return false
        if (salaryRange === SALARY_RANGES[3] && avg < 80000) return false
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

  const filterState = { filter, city, employment, qualification, salaryRange, openGroup, openSections }
  const filterActions = { setFilter, setCity, setEmployment, setQualification, setSalaryRange, setOpenGroup, toggleSection, resetFilters }

  return (
    <section id="vacancies" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-10">
          <p className="text-sm tracking-[0.3em] uppercase text-yellow-500 mb-3">Площадка</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Вакансии и соискатели</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">Работодатели размещают вакансии — специалисты находят работу</p>
        </div>

        {/* Вкладки */}
        <div className="flex gap-2 mb-6">
          {([["","Все объявления"],["employer","Вакансии"],["worker","Соискатели"]] as [typeof roleFilter, string][]).map(([val, label]) => (
            <button key={val} onClick={() => setRoleFilter(val)}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${roleFilter===val ? "bg-primary text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-yellow-300"}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Мобильная кнопка фильтров — вне flex, над карточками */}
        <div className="mb-4 lg:hidden">
          <button onClick={() => setMobileFiltersOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium shadow-sm hover:border-yellow-300 transition-all">
            <Icon name="SlidersHorizontal" size={16} className="text-yellow-500" />
            <span className="flex-1 text-left">Фильтры</span>
            {activeFiltersCount > 0 && (
              <span className="bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{activeFiltersCount}</span>
            )}
          </button>
          {activeFiltersCount > 0 && (
            <button onClick={resetFilters} className="mt-2 text-xs text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1">
              <Icon name="X" size={12} /> Сбросить фильтры
            </button>
          )}
        </div>

        {/* Основной layout: фильтры слева + карточки справа */}
        <div className="flex gap-6 items-start">

          <VacanciesFilterPanel
            {...filterState}
            {...filterActions}
            activeFiltersCount={activeFiltersCount}
            mobileFiltersOpen={mobileFiltersOpen}
            setMobileFiltersOpen={setMobileFiltersOpen}
          />

          {/* Правая колонка: карточки */}
          <div className="flex-1 min-w-0">

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
                  <VacancyCardComponent
                    key={c.id}
                    card={c}
                    saved={saved.has(c.id)}
                    saving={saving === c.id}
                    onToggleSave={toggleSave}
                  />
                ))}
              </div>
            )}

            <div className="text-center mt-8">
              <a href="/auth" className="inline-flex items-center gap-2 bg-yellow-500 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-yellow-600 transition-colors text-sm">
                <Icon name="Plus" size={18} />
                Разместить объявление
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
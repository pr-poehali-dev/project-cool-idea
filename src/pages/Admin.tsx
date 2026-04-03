import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import func2url from "../../backend/func2url.json"
import Icon from "@/components/ui/icon"

type Tab = "stats" | "employers" | "workers" | "vacancies_employer" | "vacancies_worker"

interface Stats {
  total_users: number; employers: number; workers: number
  active_vacancies: number; total_vacancies: number; saved_contacts: number
}
interface User { id: number; name: string; email: string; role: string; phone: string; specialty: string; created_at: string }
interface Vacancy {
  id: number; title: string; specialty: string; city: string
  salary_from: number | null; salary_to: number | null
  contact_phone: string; contact_email: string; description: string
  is_active: boolean; created_at: string
  user_id: number; user_name: string; user_email: string; user_role: string
}

function getToken() { return localStorage.getItem("admin_session") || "" }

async function api(action: string, extra: object = {}) {
  const res = await fetch(func2url["admin-panel"], {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Session-Id": getToken() },
    body: JSON.stringify({ action, ...extra }),
  })
  return res.json()
}

export default function Admin() {
  const [checking, setChecking] = useState(true)
  const [tab, setTab] = useState<Tab>("stats")
  const [stats, setStats] = useState<Stats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [vacancies, setVacancies] = useState<Vacancy[]>([])
  const [search, setSearch] = useState("")
  const [showAll, setShowAll] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const check = async () => {
      if (!ADMIN_TOKEN) { navigate("/login"); return }
      const res = await fetch(func2url.auth, { headers: { "X-Session-Id": ADMIN_TOKEN } })
      const data = await res.json()
      if (!data.authenticated) { localStorage.removeItem("admin_session"); navigate("/login") }
      else { setChecking(false) }
    }
    check()
  }, [navigate])

  useEffect(() => {
    if (checking) return
    if (tab === "stats") api("stats").then(setStats)
    if (tab === "employers") api("users", { role: "employer", search }).then(d => setUsers(Array.isArray(d) ? d : []))
    if (tab === "workers") api("users", { role: "worker", search }).then(d => setUsers(Array.isArray(d) ? d : []))
    if (tab === "vacancies_employer") api("vacancies", { role: "employer", search, show_all: showAll }).then(d => setVacancies(Array.isArray(d) ? d : []))
    if (tab === "vacancies_worker") api("vacancies", { role: "worker", search, show_all: showAll }).then(d => setVacancies(Array.isArray(d) ? d : []))
  }, [tab, checking, showAll])

  const doSearch = () => {
    if (tab === "employers") api("users", { role: "employer", search }).then(d => setUsers(Array.isArray(d) ? d : []))
    if (tab === "workers") api("users", { role: "worker", search }).then(d => setUsers(Array.isArray(d) ? d : []))
    if (tab === "vacancies_employer") api("vacancies", { role: "employer", search, show_all: showAll }).then(d => setVacancies(Array.isArray(d) ? d : []))
    if (tab === "vacancies_worker") api("vacancies", { role: "worker", search, show_all: showAll }).then(d => setVacancies(Array.isArray(d) ? d : []))
  }

  const deleteUser = async (id: number) => {
    if (!confirm("Удалить пользователя и все его объявления?")) return
    await api("delete_user", { user_id: id })
    setUsers(prev => prev.filter(u => u.id !== id))
  }

  const deleteVacancy = async (id: number) => {
    await api("delete_vacancy", { vacancy_id: id })
    setVacancies(prev => prev.map(v => v.id === id ? { ...v, is_active: false } : v))
  }

  const restoreVacancy = async (id: number) => {
    await api("restore_vacancy", { vacancy_id: id })
    setVacancies(prev => prev.map(v => v.id === id ? { ...v, is_active: true } : v))
  }

  const logout = async () => {
    await fetch(func2url.auth, { method: "POST", headers: { "Content-Type": "application/json", "X-Session-Id": ADMIN_TOKEN }, body: JSON.stringify({ action: "logout" }) })
    localStorage.removeItem("admin_session")
    navigate("/login")
  }

  if (checking) return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="text-white/50 text-sm">Проверка доступа...</div>
    </div>
  )

  const tabs: [Tab, string, string][] = [
    ["stats", "Обзор", "LayoutDashboard"],
    ["employers", "Работодатели", "Building2"],
    ["workers", "Соискатели", "HardHat"],
    ["vacancies_employer", "Вакансии", "Briefcase"],
    ["vacancies_worker", "Объявления соискателей", "FileText"],
  ]

  const isUserTab = tab === "employers" || tab === "workers"
  const isVacancyTab = tab === "vacancies_employer" || tab === "vacancies_worker"

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary py-4 px-6 flex items-center justify-between">
        <a href="/" className="text-white font-bold text-xl tracking-tight">
          Работа-<span className="text-orange-400">Ялта</span>
          <span className="text-white/40 text-sm font-normal ml-3">Админ-панель</span>
        </a>
        <button onClick={logout} className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors">
          <Icon name="LogOut" size={16} />Выйти
        </button>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Навигация */}
        <div className="flex gap-1 bg-white rounded-2xl p-1 shadow-sm border border-gray-100 mb-6 overflow-x-auto">
          {tabs.map(([t, label, icon]) => (
            <button key={t} onClick={() => { setTab(t); setSearch("") }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${tab === t ? "bg-primary text-white shadow" : "text-gray-500 hover:text-gray-800"}`}>
              <Icon name={icon as "User"} size={16} />{label}
            </button>
          ))}
        </div>

        {/* Статистика */}
        {tab === "stats" && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                ["Всего пользователей", stats.total_users, "Users", "blue"],
                ["Работодатели", stats.employers, "Building2", "orange"],
                ["Соискатели", stats.workers, "HardHat", "green"],
                ["Активных объявлений", stats.active_vacancies, "Briefcase", "purple"],
                ["Всего объявлений", stats.total_vacancies, "FileText", "gray"],
                ["Сохранений в избранном", stats.saved_contacts, "Bookmark", "pink"],
              ].map(([label, val, icon, color]) => (
                <div key={label as string} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-${color}-100`}>
                    <Icon name={icon as "User"} size={20} className={`text-${color}-500`} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{val as number}</p>
                  <p className="text-gray-500 text-sm mt-0.5">{label as string}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setTab("employers")} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-left hover:border-orange-300 transition-colors">
                <p className="font-semibold text-gray-800 mb-1">Управление работодателями →</p>
                <p className="text-gray-400 text-sm">Просмотр, поиск, удаление</p>
              </button>
              <button onClick={() => setTab("workers")} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-left hover:border-orange-300 transition-colors">
                <p className="font-semibold text-gray-800 mb-1">Управление соискателями →</p>
                <p className="text-gray-400 text-sm">Просмотр, поиск, удаление</p>
              </button>
            </div>
          </div>
        )}

        {/* Поиск (для вкладок с данными) */}
        {(isUserTab || isVacancyTab) && (
          <div className="flex gap-2 mb-5">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === "Enter" && doSearch()}
              placeholder="Поиск по имени, email, специальности..."
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button onClick={doSearch} className="bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors">
              Найти
            </button>
            {isVacancyTab && (
              <button onClick={() => setShowAll(!showAll)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${showAll ? "bg-gray-800 text-white" : "bg-white border border-gray-200 text-gray-600"}`}>
                {showAll ? "Все" : "Активные"}
              </button>
            )}
          </div>
        )}

        {/* Пользователи */}
        {isUserTab && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">{users.length} записей</p>
            {users.length === 0 && <div className="bg-white rounded-2xl p-10 text-center text-gray-400">Нет данных</div>}
            {users.map(u => (
              <div key={u.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${u.role === "employer" ? "bg-blue-100" : "bg-green-100"}`}>
                      <Icon name={u.role === "employer" ? "Building2" : "HardHat"} size={18} className={u.role === "employer" ? "text-blue-500" : "text-green-500"} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 truncate">{u.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${u.role === "employer" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}`}>
                          {u.role === "employer" ? "Работодатель" : "Соискатель"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{u.email}</p>
                      {u.specialty && <p className="text-xs text-gray-400 mt-0.5">{u.specialty}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {u.phone && (
                      <a href={`tel:${u.phone}`} className="text-gray-400 hover:text-orange-500 transition-colors">
                        <Icon name="Phone" size={16} />
                      </a>
                    )}
                    <span className="text-xs text-gray-400 hidden sm:block">
                      {new Date(u.created_at).toLocaleDateString("ru")}
                    </span>
                    <button onClick={() => deleteUser(u.id)} className="text-gray-300 hover:text-red-500 transition-colors" title="Удалить">
                      <Icon name="Trash2" size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Объявления */}
        {isVacancyTab && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">{vacancies.length} записей</p>
            {vacancies.length === 0 && <div className="bg-white rounded-2xl p-10 text-center text-gray-400">Нет данных</div>}
            {vacancies.map(v => (
              <div key={v.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${v.is_active ? "border-gray-100" : "border-red-100 opacity-60"}`}>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="font-semibold text-gray-900">{v.title}</p>
                        {!v.is_active && <span className="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full">Скрыто</span>}
                      </div>
                      <p className="text-sm text-gray-500">{v.specialty} · {v.city}</p>
                      {(v.salary_from || v.salary_to) && (
                        <p className="text-sm text-orange-500 font-medium mt-0.5">
                          {v.salary_from ? `от ${v.salary_from.toLocaleString()} ₽` : ""}{v.salary_to ? ` до ${v.salary_to.toLocaleString()} ₽` : ""}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Icon name="User" size={11} />{v.user_name} · {v.user_email}
                        </span>
                        {v.contact_phone && (
                          <a href={`tel:${v.contact_phone}`} className="text-xs text-orange-500 flex items-center gap-1 hover:underline">
                            <Icon name="Phone" size={11} />{v.contact_phone}
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-gray-400 hidden sm:block">{new Date(v.created_at).toLocaleDateString("ru")}</span>
                      {v.is_active ? (
                        <button onClick={() => deleteVacancy(v.id)} className="text-gray-300 hover:text-red-500 transition-colors" title="Скрыть">
                          <Icon name="EyeOff" size={16} />
                        </button>
                      ) : (
                        <button onClick={() => restoreVacancy(v.id)} className="text-gray-300 hover:text-green-500 transition-colors" title="Восстановить">
                          <Icon name="Eye" size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  {v.description && <p className="text-xs text-gray-400 mt-2 line-clamp-2">{v.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
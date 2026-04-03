import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import func2url from "../../backend/func2url.json"
import Icon from "@/components/ui/icon"
import { Tab, Stats, User, Vacancy, ShopProduct, getToken, api } from "./admin/types"
import AdminUsers from "./admin/AdminUsers"
import AdminVacancies from "./admin/AdminVacancies"
import AdminShop from "./admin/AdminShop"
import AdminRental from "./admin/AdminRental"

interface RentalMachine {
  id: number; category: string; title: string; description: string
  specs: string; price: string; image_url: string; tags: string
  is_active: boolean; sort_order: number
}

export default function Admin() {
  const [checking, setChecking] = useState(true)
  const [tab, setTab] = useState<Tab>("stats")
  const [stats, setStats] = useState<Stats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [vacancies, setVacancies] = useState<Vacancy[]>([])
  const [search, setSearch] = useState("")
  const [showAll, setShowAll] = useState(false)
  // Shop state
  const [shopProducts, setShopProducts] = useState<ShopProduct[]>([])
  const [shopCategory, setShopCategory] = useState("")
  const [shopSearch, setShopSearch] = useState("")
  // Rental state
  const [rentalMachines, setRentalMachines] = useState<RentalMachine[]>([])
  const [rentalCategory, setRentalCategory] = useState("")
  const [rentalSearch, setRentalSearch] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const check = async () => {
      const token = getToken()
      if (!token) { navigate("/login"); return }
      const res = await fetch(func2url.auth, { headers: { "X-Session-Id": token } })
      let data = await res.json()
      if (typeof data === "string") data = JSON.parse(data)
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
    if (tab === "shop") api("shop_products", { category: shopCategory, search: shopSearch }).then(d => setShopProducts(Array.isArray(d) ? d : []))
    if (tab === "rental") api("rental_machines", { category: rentalCategory, search: rentalSearch }).then(d => setRentalMachines(Array.isArray(d) ? d : []))
  }, [tab, checking, showAll])

  const doSearch = () => {
    if (tab === "employers") api("users", { role: "employer", search }).then(d => setUsers(Array.isArray(d) ? d : []))
    if (tab === "workers") api("users", { role: "worker", search }).then(d => setUsers(Array.isArray(d) ? d : []))
    if (tab === "vacancies_employer") api("vacancies", { role: "employer", search, show_all: showAll }).then(d => setVacancies(Array.isArray(d) ? d : []))
    if (tab === "vacancies_worker") api("vacancies", { role: "worker", search, show_all: showAll }).then(d => setVacancies(Array.isArray(d) ? d : []))
  }

  const loadShop = () => api("shop_products", { category: shopCategory, search: shopSearch }).then(d => setShopProducts(Array.isArray(d) ? d : []))
  const loadRental = () => api("rental_machines", { category: rentalCategory, search: rentalSearch }).then(d => setRentalMachines(Array.isArray(d) ? d : []))

  const logout = async () => {
    await fetch(func2url.auth, { method: "POST", headers: { "Content-Type": "application/json", "X-Session-Id": getToken() }, body: JSON.stringify({ action: "logout" }) })
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
    ["shop", "Магазин", "ShoppingBag"],
    ["rental", "Аренда техники", "Truck"],
  ]

  const isUserTab = tab === "employers" || tab === "workers"
  const isVacancyTab = tab === "vacancies_employer" || tab === "vacancies_worker"

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary py-4 px-6 flex items-center justify-between">
        <a href="/" className="text-white font-bold text-xl tracking-tight">
          Работа-<span className="text-yellow-400">Ялта</span>
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
            <button key={t} onClick={() => { setTab(t as Tab); setSearch("") }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${tab === t ? "bg-primary text-white shadow" : "text-gray-500 hover:text-gray-800"}`}>
              <Icon name={icon as "User"} size={16} />{label}
            </button>
          ))}
        </div>

        {/* Статистика */}
        {tab === "stats" && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {([
                ["Всего пользователей", stats.total_users, "Users", "blue", null],
                ["Работодатели", stats.employers, "Building2", "yellow", "employers"],
                ["Соискатели", stats.workers, "HardHat", "green", "workers"],
                ["Активных объявлений", stats.active_vacancies, "Briefcase", "purple", "vacancies_employer"],
                ["Всего объявлений", stats.total_vacancies, "FileText", "gray", "vacancies_employer"],
                ["Сохранений в избранном", stats.saved_contacts, "Bookmark", "pink", null],
              ] as [string, number, string, string, Tab | null][]).map(([label, val, icon, color, target]) => (
                <div
                  key={label}
                  onClick={() => target && setTab(target)}
                  className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-sm transition-all ${target ? "cursor-pointer hover:border-yellow-300 hover:shadow-md" : ""}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-${color}-100`}>
                    <Icon name={icon as "User"} size={20} className={`text-${color}-500`} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{val}</p>
                  <p className={`text-sm mt-0.5 ${target ? "text-yellow-500" : "text-gray-500"}`}>{label}{target ? " →" : ""}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setTab("employers")} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-left hover:border-yellow-300 transition-colors">
                <p className="font-semibold text-gray-800 mb-1">Управление работодателями →</p>
                <p className="text-gray-400 text-sm">Просмотр, поиск, удаление</p>
              </button>
              <button onClick={() => setTab("workers")} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-left hover:border-yellow-300 transition-colors">
                <p className="font-semibold text-gray-800 mb-1">Управление соискателями →</p>
                <p className="text-gray-400 text-sm">Просмотр, поиск, удаление</p>
              </button>
            </div>
          </div>
        )}

        {/* Пользователи */}
        {isUserTab && (
          <AdminUsers users={users} setUsers={setUsers} search={search} setSearch={setSearch} doSearch={doSearch} />
        )}

        {/* Объявления */}
        {isVacancyTab && (
          <AdminVacancies vacancies={vacancies} setVacancies={setVacancies} search={search} setSearch={setSearch} showAll={showAll} setShowAll={setShowAll} doSearch={doSearch} />
        )}

        {/* Магазин */}
        {tab === "shop" && (
          <AdminShop shopProducts={shopProducts} setShopProducts={setShopProducts} shopCategory={shopCategory} setShopCategory={setShopCategory} shopSearch={shopSearch} setShopSearch={setShopSearch} loadShop={loadShop} />
        )}

        {/* Аренда техники */}
        {tab === "rental" && (
          <AdminRental machines={rentalMachines} setMachines={setRentalMachines} rentalCategory={rentalCategory} setRentalCategory={setRentalCategory} rentalSearch={rentalSearch} setRentalSearch={setRentalSearch} loadRental={loadRental} />
        )}
      </div>
    </div>
  )
}

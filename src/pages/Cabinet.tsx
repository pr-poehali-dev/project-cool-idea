import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { apiUsers, clearToken } from "@/lib/auth"
import { apiVacancies } from "@/lib/api"
import Icon from "@/components/ui/icon"
import { PaymentModal } from "@/components/PaymentModal"
import { User, Vacancy, SavedContact, Tab } from "./cabinet/types"
import CabinetProfile from "./cabinet/CabinetProfile"
import CabinetVacancies from "./cabinet/CabinetVacancies"
import CabinetSaved from "./cabinet/CabinetSaved"
import CabinetPurchases from "./cabinet/CabinetPurchases"
import { apiPayment } from "@/lib/api"

export default function Cabinet() {
  const [searchParams] = useSearchParams()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>((searchParams.get("tab") as Tab) || "overview")
  const [vacancies, setVacancies] = useState<Vacancy[]>([])
  const [vacancySuccess, setVacancySuccess] = useState(false)
  const [saved, setSaved] = useState<SavedContact[]>([])
  const [payingVacancy, setPayingVacancy] = useState<SavedContact | null>(null)
  const [purchases, setPurchases] = useState<object[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const init = async () => {
      const { ok, data } = await apiUsers({ action: "me" })
      if (!ok) { navigate("/auth"); return }
      setUser(data)
      setLoading(false)
    }
    init()
  }, [navigate])

  const loadVacancies = async () => {
    const { data } = await apiVacancies({ action: "my" })
    setVacancies(Array.isArray(data) ? data : [])
  }

  useEffect(() => {
    if (tab === "vacancies") loadVacancies()
    if (tab === "saved") {
      apiUsers({ action: "my_saved" }).then(({ data }) => setSaved(Array.isArray(data) ? data : []))
    }
    if (tab === "purchases") {
      apiPayment({ action: "my_purchases" }).then(({ data }) => setPurchases(Array.isArray(data) ? data : []))
    }
  }, [tab])

  const logout = async () => {
    await apiUsers({ action: "logout" })
    clearToken()
    navigate("/")
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-400 text-sm">Загрузка...</div>
    </div>
  )

  const isEmployer = user?.role === "employer"
  const roleLabel = isEmployer ? "Работодатель" : "Соискатель"

  const tabs: [Tab, string, string][] = [
    ["overview", "Обзор", "LayoutDashboard"],
    ["profile", "Профиль", "User"],
    ["vacancies", isEmployer ? "Мои вакансии" : "Мои объявления", "Briefcase"],
    ["saved", "Сохранённые", "Bookmark"],
    ...(!isEmployer ? [["purchases", "Мои покупки", "ShoppingBag"] as [Tab, string, string]] : []),
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary py-4 px-6 flex items-center justify-between">
        <a href="/" className="text-white font-bold text-xl tracking-tight">
          Работа-<span className="text-yellow-400">Ялта</span>
        </a>
        <div className="flex items-center gap-4">
          <span className="text-white/60 text-sm hidden sm:block">{user?.name}</span>
          <button onClick={logout} className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors">
            <Icon name="LogOut" size={16} />Выйти
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Навигация */}
        <div className="flex gap-1 bg-white rounded-2xl p-1 shadow-sm border border-gray-100 mb-6 overflow-x-auto">
          {tabs.map(([t, label, icon]) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${tab === t ? "bg-primary text-white shadow" : "text-gray-500 hover:text-gray-800"}`}>
              <Icon name={icon as "User"} size={16} />{label}
            </button>
          ))}
        </div>

        {/* Обзор */}
        {tab === "overview" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Icon name={isEmployer ? "Building2" : "HardHat"} size={28} className="text-yellow-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Привет, {user?.name}!</h1>
                <span className="inline-block mt-1 text-xs bg-yellow-100 text-yellow-600 px-2.5 py-1 rounded-full font-medium">{roleLabel}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={() => setTab("vacancies")} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-left hover:border-yellow-200 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Icon name="Briefcase" size={20} className="text-blue-500" />
                  </div>
                  <h2 className="font-semibold text-gray-900">{isEmployer ? "Мои вакансии" : "Мои объявления"}</h2>
                </div>
                <p className="text-gray-400 text-sm">Управляйте своими объявлениями</p>
              </button>
              <button onClick={() => setTab("profile")} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-left hover:border-yellow-200 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Icon name="User" size={20} className="text-purple-500" />
                  </div>
                  <h2 className="font-semibold text-gray-900">Мой профиль</h2>
                </div>
                <p className="text-gray-400 text-sm">Заполните профиль для лучших результатов</p>
              </button>
              {!isEmployer && (
                <button onClick={() => setTab("purchases")} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-left hover:border-yellow-200 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <Icon name="ShoppingBag" size={20} className="text-green-500" />
                    </div>
                    <h2 className="font-semibold text-gray-900">Мои покупки</h2>
                  </div>
                  <p className="text-gray-400 text-sm">Вакансии с оплаченным доступом к контактам</p>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Профиль */}
        {tab === "profile" && user && (
          <CabinetProfile user={user} setUser={setUser} isEmployer={isEmployer} />
        )}

        {/* Мои вакансии + Новое объявление */}
        {(tab === "vacancies" || tab === "new_vacancy") && (
          <CabinetVacancies
            vacancies={vacancies}
            loadVacancies={loadVacancies}
            isEmployer={isEmployer}
            tab={tab}
            setTab={setTab}
            vacancySuccess={vacancySuccess}
            setVacancySuccess={setVacancySuccess}
          />
        )}

        {/* Сохранённые */}
        {tab === "saved" && (
          <CabinetSaved
            saved={saved}
            setSaved={setSaved}
            setPayingVacancy={setPayingVacancy}
          />
        )}

        {/* Мои покупки */}
        {tab === "purchases" && (
          <CabinetPurchases purchases={purchases as Parameters<typeof CabinetPurchases>[0]["purchases"]} />
        )}
      </div>

      <PaymentModal
        open={!!payingVacancy}
        onClose={() => setPayingVacancy(null)}
        vacancyTitle={payingVacancy?.title || ""}
      />
    </div>
  )
}
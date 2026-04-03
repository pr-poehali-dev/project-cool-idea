import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { apiUsers, clearToken } from "@/lib/auth"
import Icon from "@/components/ui/icon"

interface User {
  id: number
  name: string
  email: string
  role: string
}

export default function Cabinet() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const check = async () => {
      const { ok, data } = await apiUsers({ action: "me" })
      if (!ok) {
        navigate("/auth")
      } else {
        setUser(data)
        setLoading(false)
      }
    }
    check()
  }, [navigate])

  const logout = async () => {
    await apiUsers({ action: "logout" })
    clearToken()
    navigate("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Загрузка...</div>
      </div>
    )
  }

  const roleLabel = user?.role === "employer" ? "Работодатель" : "Соискатель"
  const roleIcon = user?.role === "employer" ? "Building2" : "HardHat"

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary py-4 px-6 flex items-center justify-between">
        <a href="/" className="text-white font-bold text-xl tracking-tight">
          Работа-<span className="text-orange-400">Ялта</span>
        </a>
        <div className="flex items-center gap-4">
          <span className="text-white/60 text-sm hidden sm:block">{user?.email}</span>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
          >
            <Icon name="LogOut" size={16} />
            Выйти
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 max-w-4xl">
        {/* Приветствие */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6 flex items-center gap-4">
          <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Icon name={roleIcon as "Building2"} size={28} className="text-orange-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Привет, {user?.name}!</h1>
            <span className="inline-block mt-1 text-xs bg-orange-100 text-orange-600 px-2.5 py-1 rounded-full font-medium">
              {roleLabel}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Мои заявки */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Icon name="FileText" size={20} className="text-blue-500" />
              </div>
              <h2 className="font-semibold text-gray-900">Мои заявки</h2>
            </div>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Icon name="Inbox" size={36} className="text-gray-200 mb-3" />
              <p className="text-gray-400 text-sm">Заявок пока нет</p>
              <a
                href="/#contact"
                className="mt-4 text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors"
              >
                Найти работу →
              </a>
            </div>
          </div>

          {/* Сохранённые вакансии */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Icon name="Bookmark" size={20} className="text-green-500" />
              </div>
              <h2 className="font-semibold text-gray-900">Сохранённые вакансии</h2>
            </div>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Icon name="BookmarkX" size={36} className="text-gray-200 mb-3" />
              <p className="text-gray-400 text-sm">Нет сохранённых вакансий</p>
              <a
                href="/#vacancies"
                className="mt-4 text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors"
              >
                Смотреть вакансии →
              </a>
            </div>
          </div>

          {/* Мой профиль */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Icon name="User" size={20} className="text-purple-500" />
              </div>
              <h2 className="font-semibold text-gray-900">Мой профиль</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Имя</p>
                <p className="text-gray-800 font-medium">{user?.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Email</p>
                <p className="text-gray-800 font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Тип аккаунта</p>
                <p className="text-gray-800 font-medium">{roleLabel}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

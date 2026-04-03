import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import func2url from "../../backend/func2url.json"
import Icon from "@/components/ui/icon"

export default function Admin() {
  const [checking, setChecking] = useState(true)
  const navigate = useNavigate()
  const sessionId = localStorage.getItem("admin_session") || ""

  useEffect(() => {
    const check = async () => {
      if (!sessionId) { navigate("/login"); return }

      const res = await fetch(func2url.auth, {
        headers: { "X-Session-Id": sessionId },
      })
      const data = await res.json()

      if (!data.authenticated) {
        localStorage.removeItem("admin_session")
        navigate("/login")
      } else {
        setChecking(false)
      }
    }
    check()
  }, [navigate, sessionId])

  const logout = async () => {
    await fetch(func2url.auth, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Session-Id": sessionId },
      body: JSON.stringify({ action: "logout" }),
    })
    localStorage.removeItem("admin_session")
    navigate("/login")
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-white/50 text-sm">Проверка доступа...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary py-4 px-6 flex items-center justify-between">
        <a href="/" className="text-white font-bold text-xl tracking-tight">
          Работа-<span className="text-orange-400">Ялта</span>
          <span className="text-white/40 text-sm font-normal ml-3">Панель управления</span>
        </a>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
        >
          <Icon name="LogOut" size={16} />
          Выйти
        </button>
      </header>

      <main className="container mx-auto px-6 py-10 max-w-5xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Добро пожаловать!</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Icon name="Briefcase" size={20} className="text-orange-500" />
              </div>
              <span className="text-gray-500 text-sm">Вакансии</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">—</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Icon name="Users" size={20} className="text-blue-500" />
              </div>
              <span className="text-gray-500 text-sm">Специалисты</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">—</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Icon name="MessageSquare" size={20} className="text-green-500" />
              </div>
              <span className="text-gray-500 text-sm">Заявки</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">—</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon name="Construction" size={30} className="text-orange-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Панель в разработке</h2>
          <p className="text-gray-400 text-sm max-w-sm mx-auto">
            Здесь появится управление вакансиями, заявками и специалистами. Скоро!
          </p>
        </div>
      </main>
    </div>
  )
}

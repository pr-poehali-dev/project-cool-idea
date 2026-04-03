import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { apiUsers, saveToken } from "@/lib/auth"
import Icon from "@/components/ui/icon"

type Mode = "login" | "register"
type Role = "worker" | "employer"

export default function Auth() {
  const [mode, setMode] = useState<Mode>("login")
  const [role, setRole] = useState<Role>("worker")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const body = mode === "login"
      ? { action: "login", email, password }
      : { action: "register", name, email, password, role }

    const { ok, data } = await apiUsers(body)
    setLoading(false)

    if (!ok) {
      setError(data.error || "Ошибка. Попробуйте снова.")
      return
    }

    saveToken(data.token)

    const pendingId = localStorage.getItem("pending_save_vacancy")
    if (pendingId) {
      localStorage.removeItem("pending_save_vacancy")
      await apiUsers({ action: "save_vacancy", vacancy_id: parseInt(pendingId) })
    }

    navigate("/cabinet")
  }

  return (
    <div className="h-screen overflow-hidden bg-primary flex flex-col items-center justify-center px-4 relative">
      <a
        href="/login"
        title="Вход для сотрудников"
        className="absolute top-4 right-4 flex items-center gap-1.5 text-white/30 hover:text-white/60 text-xs transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
          <polyline points="10 17 15 12 10 7" />
          <line x1="15" y1="12" x2="3" y2="12" />
        </svg>
        Для сотрудников
      </a>
      <div className="w-full max-w-md">
        <div className="text-center mb-5">
          <a href="/" className="text-white font-bold text-2xl tracking-tight">
            Работа-<span className="text-orange-400">Ялта</span>
          </a>
          <p className="text-white/50 text-sm mt-1">Портал трудоустройства строительных специалистов</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Таб переключатель */}
          <div className="flex">
            <button
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${mode === "login" ? "bg-primary text-white" : "bg-gray-50 text-gray-500 hover:text-gray-700"}`}
              onClick={() => { setMode("login"); setError("") }}
            >
              Вход
            </button>
            <button
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${mode === "register" ? "bg-primary text-white" : "bg-gray-50 text-gray-500 hover:text-gray-700"}`}
              onClick={() => { setMode("register"); setError("") }}
            >
              Регистрация
            </button>
          </div>

          <div className="p-6">
            {/* Выбор роли (вход и регистрация) */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
                <button
                  type="button"
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${role === "worker" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}
                  onClick={() => setRole("worker")}
                >
                  Соискатель
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${role === "employer" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}
                  onClick={() => setRole("employer")}
                >
                  Работодатель
                </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {mode === "register" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {role === "worker" ? "Ваше имя" : "Контактное лицо"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Например, Александр"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="email"
                  placeholder="example@mail.ru"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Пароль <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="password"
                  placeholder={mode === "register" ? "Минимум 6 символов" : "Введите пароль"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 rounded-xl px-4 py-2.5">
                  <Icon name="AlertCircle" size={16} />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Загрузка..." : mode === "login" ? "Войти" : "Зарегистрироваться"}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-white/40 text-xs mt-4">
          <a href="/" className="hover:text-white/70 transition-colors">← На главную</a>
        </p>
      </div>
    </div>
  )
}
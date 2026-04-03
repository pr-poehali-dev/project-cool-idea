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
    navigate("/cabinet")
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="text-white font-bold text-2xl tracking-tight">
            Работа-<span className="text-orange-400">Ялта</span>
          </a>
          <p className="text-white/50 text-sm mt-2">Портал трудоустройства строительных специалистов</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Таб переключатель */}
          <div className="flex">
            <button
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${mode === "login" ? "bg-primary text-white" : "bg-gray-50 text-gray-500 hover:text-gray-700"}`}
              onClick={() => { setMode("login"); setError("") }}
            >
              Вход
            </button>
            <button
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${mode === "register" ? "bg-primary text-white" : "bg-gray-50 text-gray-500 hover:text-gray-700"}`}
              onClick={() => { setMode("register"); setError("") }}
            >
              Регистрация
            </button>
          </div>

          <div className="p-8">
            {/* Выбор роли (только при регистрации) */}
            {mode === "register" && (
              <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                <button
                  type="button"
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${role === "worker" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}
                  onClick={() => setRole("worker")}
                >
                  Соискатель
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${role === "employer" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}
                  onClick={() => setRole("employer")}
                >
                  Работодатель
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
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
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
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
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3">
                  <Icon name="AlertCircle" size={16} />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 text-white py-3.5 rounded-xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
              >
                {loading ? "Загрузка..." : mode === "login" ? "Войти" : "Зарегистрироваться"}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-white/40 text-xs mt-6">
          <a href="/" className="hover:text-white/70 transition-colors">← На главную</a>
        </p>
      </div>
    </div>
  )
}

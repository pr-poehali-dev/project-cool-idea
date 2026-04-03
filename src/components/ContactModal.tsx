import { useState } from "react"
import { apiUsers, saveToken, getToken } from "@/lib/auth"
import Icon from "@/components/ui/icon"

interface Vacancy {
  id: number
  title: string
  specialty: string
  city: string
  salary_from: number | null
  salary_to: number | null
  contact_phone: string
  contact_email: string
  description: string
  author_name: string
}

interface ContactModalProps {
  vacancy: Vacancy | null
  onClose: () => void
}

type Step = "register" | "login" | "payment" | "contacts"

export function ContactModal({ vacancy, onClose }: ContactModalProps) {
  const isLoggedIn = !!getToken()
  const [step, setStep] = useState<Step>(isLoggedIn ? "payment" : "register")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  if (!vacancy) return null

  const saveVacancy = async () => {
    await apiUsers({ action: "save_vacancy", vacancy_id: vacancy.id })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const { ok, data } = await apiUsers({ action: "register", name, email, password, role: "employer" })
    setLoading(false)
    if (!ok) { setError(data.error || "Ошибка"); return }
    saveToken(data.token)
    await saveVacancy()
    setStep("payment")
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const { ok, data } = await apiUsers({ action: "login", email, password })
    setLoading(false)
    if (!ok) { setError(data.error || "Ошибка"); return }
    saveToken(data.token)
    await saveVacancy()
    setStep("payment")
  }

  const handlePayment = async () => {
    await saveVacancy()
    setStep("contacts")
  }

  const formatSalary = () => {
    const { salary_from: f, salary_to: t } = vacancy
    if (!f && !t) return null
    if (f && t) return `${f.toLocaleString()} – ${t.toLocaleString()} ₽`
    if (f) return `от ${f.toLocaleString()} ₽`
    return `до ${t!.toLocaleString()} ₽`
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">

        {/* Шапка с карточкой вакансии */}
        <div className="bg-primary p-5">
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs bg-orange-500 text-white px-2.5 py-1 rounded-full font-medium">{vacancy.specialty}</span>
            <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
              <Icon name="X" size={20} />
            </button>
          </div>
          <h3 className="text-white font-bold text-lg">{vacancy.title}</h3>
          <div className="flex items-center gap-3 mt-1.5 text-white/60 text-sm">
            <span className="flex items-center gap-1"><Icon name="MapPin" size={13} />{vacancy.city}</span>
            {formatSalary() && <span className="text-orange-300 font-medium">{formatSalary()}</span>}
          </div>
        </div>

        {/* Шаги */}
        {(step === "register" || step === "login") && (
          <div className="p-6">
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5">
              <button onClick={() => { setStep("register"); setError("") }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${step === "register" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}>
                Регистрация
              </button>
              <button onClick={() => { setStep("login"); setError("") }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${step === "login" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}>
                Уже есть аккаунт
              </button>
            </div>

            <p className="text-gray-500 text-sm mb-4">
              {step === "register"
                ? "Зарегистрируйтесь как работодатель — объявление сохранится в вашем кабинете"
                : "Войдите, чтобы сохранить объявление и получить контакты"}
            </p>

            <form onSubmit={step === "register" ? handleRegister : handleLogin} className="flex flex-col gap-3">
              {step === "register" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ваше имя *</label>
                  <input required type="text" placeholder="Например, Александр"
                    value={name} onChange={e => setName(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input required type="email" placeholder="example@mail.ru"
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Пароль *</label>
                <input required type="password" placeholder="Минимум 6 символов"
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 rounded-xl px-4 py-2.5">
                  <Icon name="AlertCircle" size={15} />{error}
                </div>
              )}
              <button type="submit" disabled={loading}
                className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 mt-1">
                {loading ? "Загрузка..." : step === "register" ? "Зарегистрироваться и продолжить" : "Войти и продолжить"}
              </button>
            </form>
          </div>
        )}

        {step === "payment" && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon name="CheckCircle" size={22} className="text-green-500" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Объявление сохранено!</p>
                <p className="text-sm text-gray-500">Оно появилось в вашем личном кабинете</p>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-5">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="Lock" size={18} className="text-orange-500" />
                <p className="font-semibold text-gray-900 text-sm">Контакты скрыты</p>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Чтобы получить телефон и email исполнителя — оплатите доступ. Это разовый платёж за одно объявление.
              </p>
              <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-orange-200 mb-4">
                <span className="text-gray-700 text-sm">Доступ к контактам</span>
                <span className="font-bold text-gray-900">299 ₽</span>
              </div>
              <button onClick={handlePayment}
                className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
                <Icon name="CreditCard" size={18} />
                Оплатить и получить контакты
              </button>
              <p className="text-center text-gray-400 text-xs mt-3">Оплата через ЮKassa · Безопасно</p>
            </div>

            <button onClick={onClose} className="w-full text-gray-400 text-sm hover:text-gray-600 transition-colors">
              Позже, перейти в кабинет →
            </button>
          </div>
        )}

        {step === "contacts" && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon name="Unlock" size={22} className="text-green-500" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Контакты открыты!</p>
                <p className="text-sm text-gray-500">Свяжитесь с исполнителем удобным способом</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5 space-y-3 mb-5">
              {vacancy.contact_phone && (
                <a href={`tel:${vacancy.contact_phone}`}
                  className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-gray-200 hover:border-orange-300 transition-colors">
                  <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Icon name="Phone" size={18} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Телефон</p>
                    <p className="font-semibold text-gray-900">{vacancy.contact_phone}</p>
                  </div>
                </a>
              )}
              {vacancy.contact_email && (
                <a href={`mailto:${vacancy.contact_email}`}
                  className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-gray-200 hover:border-orange-300 transition-colors">
                  <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name="Mail" size={18} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="font-semibold text-gray-900">{vacancy.contact_email}</p>
                  </div>
                </a>
              )}
              {!vacancy.contact_phone && !vacancy.contact_email && (
                <p className="text-gray-400 text-sm text-center py-4">Контакты не указаны в объявлении</p>
              )}
            </div>

            <a href="/cabinet"
              className="block w-full text-center bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors text-sm">
              Перейти в личный кабинет
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

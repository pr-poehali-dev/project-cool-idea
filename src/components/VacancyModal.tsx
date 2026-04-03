import { useState } from "react"
import Icon from "@/components/ui/icon"

interface VacancyModalProps {
  open: boolean
  onClose: () => void
}

const SPECIALTIES = [
  "Сварщик", "Каменщик", "Штукатур", "Плиточник", "Маляр",
  "Электрик", "Сантехник", "Монтажник", "Плотник", "Кровельщик",
  "Бетонщик", "Арматурщик", "Оператор спецтехники", "Другое"
]

export function VacancyModal({ open, onClose }: VacancyModalProps) {
  const [role, setRole] = useState<"employer" | "worker">("employer")
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    company: "",
    name: "",
    phone: "",
    specialty: "",
    count: "",
    comment: "",
  })

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const handleClose = () => {
    setSubmitted(false)
    setForm({ company: "", name: "", phone: "", specialty: "", count: "", comment: "" })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="bg-primary px-6 py-5 flex items-center justify-between">
          <h2 className="text-white font-bold text-xl">Разместить вакансию</h2>
          <button onClick={handleClose} className="text-white/70 hover:text-white transition-colors">
            <Icon name="X" size={22} />
          </button>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Icon name="CheckCircle" size={32} className="text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Заявка отправлена!</h3>
            <p className="text-gray-500 mb-6">Мы свяжемся с вами в течение 2 часов и поможем разместить вакансию.</p>
            <button
              onClick={handleClose}
              className="bg-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
            >
              Отлично!
            </button>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              <button
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${role === "employer" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}
                onClick={() => setRole("employer")}
              >
                Работодатель
              </button>
              <button
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${role === "worker" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}
                onClick={() => setRole("worker")}
              >
                Соискатель
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {role === "employer" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Название компании <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Например, ООО Стройград"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {role === "employer" ? "Контактное лицо" : "Ваше имя"} <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="Например, Александр"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Телефон <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="tel"
                  placeholder="+7 (999) 000-00-00"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Специальность <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={form.specialty}
                  onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
                >
                  <option value="">Выберите специальность</option>
                  {SPECIALTIES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {role === "employer" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Количество человек</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Например, 5"
                    value={form.count}
                    onChange={(e) => setForm({ ...form, count: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Комментарий</label>
                <textarea
                  rows={3}
                  placeholder={role === "employer" ? "Опишите требования, условия, зарплату..." : "Опишите ваш опыт и пожелания..."}
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-3.5 rounded-xl font-semibold hover:bg-orange-600 transition-colors text-sm mt-1"
              >
                Отправить заявку
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

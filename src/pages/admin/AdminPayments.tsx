import { useState } from "react"
import Icon from "@/components/ui/icon"
import { api } from "./types"

interface Payment {
  id: number
  payment_id: string
  payment_status: string
  amount: number
  created_at: string
  expires_at: string
  user_name: string
  user_email: string
  vacancy_id: number
  vacancy_title: string
  vacancy_specialty: string
}

interface Props {
  payments: Payment[]
  setPayments: (p: Payment[]) => void
}

export default function AdminPayments({ payments, setPayments }: Props) {
  const [search, setSearch] = useState("")

  const doSearch = () => {
    api("payments", { search }).then(d => setPayments(Array.isArray(d) ? d : []))
  }

  const succeeded = payments.filter(p => p.payment_status === "succeeded")
  const totalRevenue = succeeded.reduce((sum, p) => sum + p.amount, 0)

  const statusLabel = (s: string) => {
    if (s === "succeeded") return { label: "Оплачен", cls: "bg-green-100 text-green-700" }
    if (s === "pending") return { label: "Ожидает", cls: "bg-yellow-100 text-yellow-700" }
    return { label: s, cls: "bg-gray-100 text-gray-600" }
  }

  const formatDate = (d: string) => new Date(d).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" })

  const isExpired = (expires: string) => new Date(expires) < new Date()

  return (
    <div className="space-y-4">
      {/* Итого */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mb-3">
            <Icon name="Banknote" size={20} className="text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalRevenue.toLocaleString()} ₽</p>
          <p className="text-sm text-gray-500 mt-0.5">Выручка (успешные)</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-3">
            <Icon name="Receipt" size={20} className="text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{succeeded.length}</p>
          <p className="text-sm text-gray-500 mt-0.5">Успешных платежей</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center mb-3">
            <Icon name="Clock" size={20} className="text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{payments.filter(p => p.payment_status === "pending").length}</p>
          <p className="text-sm text-gray-500 mt-0.5">Ожидают оплаты</p>
        </div>
      </div>

      {/* Поиск */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-2">
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === "Enter" && doSearch()}
          placeholder="Поиск по имени, email или вакансии..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <button onClick={doSearch} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
          Найти
        </button>
      </div>

      {/* Таблица */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {payments.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">Платежей пока нет</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-gray-500 font-medium">Заказчик</th>
                  <th className="text-left px-5 py-3 text-gray-500 font-medium">Вакансия</th>
                  <th className="text-left px-5 py-3 text-gray-500 font-medium">Сумма</th>
                  <th className="text-left px-5 py-3 text-gray-500 font-medium">Статус</th>
                  <th className="text-left px-5 py-3 text-gray-500 font-medium">Дата</th>
                  <th className="text-left px-5 py-3 text-gray-500 font-medium">Доступ до</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payments.map(p => {
                  const { label, cls } = statusLabel(p.payment_status)
                  const expired = isExpired(p.expires_at)
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-gray-900">{p.user_name}</p>
                        <p className="text-gray-400 text-xs">{p.user_email}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-gray-900 max-w-[180px] truncate">{p.vacancy_title}</p>
                        <p className="text-gray-400 text-xs">#{p.vacancy_id} · {p.vacancy_specialty}</p>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-gray-900">{p.amount} ₽</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${cls}`}>{label}</span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">{formatDate(p.created_at)}</td>
                      <td className="px-5 py-3.5">
                        {p.payment_status === "succeeded" ? (
                          <span className={`text-xs ${expired ? "text-gray-400" : "text-green-600 font-medium"}`}>
                            {expired ? "Истёк" : formatDate(p.expires_at)}
                          </span>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

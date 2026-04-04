import Icon from "@/components/ui/icon"

interface Purchase {
  id: number
  payment_id: string
  amount: number
  created_at: string
  expires_at: string
  vacancy_id: number
  vacancy_title: string
  vacancy_specialty: string
  contact_phone: string
  contact_email: string
}

interface Props {
  purchases: Purchase[]
}

export default function CabinetPurchases({ purchases }: Props) {
  const formatDate = (d: string) =>
    new Date(d).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" })

  const isActive = (expires: string) => new Date(expires) > new Date()
  const timeLeft = (expires: string) => {
    const diff = new Date(expires).getTime() - Date.now()
    if (diff <= 0) return null
    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    if (h > 0) return `ещё ${h} ч ${m} мин`
    return `ещё ${m} мин`
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Icon name="ShoppingBag" size={20} className="text-green-600" />
        </div>
        <div>
          <h2 className="font-bold text-gray-900">Мои покупки</h2>
          <p className="text-sm text-gray-400">Вакансии, к контактам которых вы получили доступ</p>
        </div>
      </div>

      {purchases.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon name="CreditCard" size={24} className="text-gray-400" />
          </div>
          <p className="font-medium text-gray-700 mb-1">Покупок пока нет</p>
          <p className="text-sm text-gray-400">После оплаты доступа к вакансии она появится здесь</p>
        </div>
      ) : (
        <div className="space-y-3">
          {purchases.map(p => {
            const active = isActive(p.expires_at)
            const left = timeLeft(p.expires_at)
            return (
              <div key={p.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${active ? "border-green-200" : "border-gray-100"}`}>
                {/* Шапка вакансии */}
                <div className={`px-5 py-3 flex items-center justify-between ${active ? "bg-green-50" : "bg-gray-50"}`}>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>
                      {active ? "Активен" : "Истёк"}
                    </span>
                    <span className="text-xs text-gray-400">#{p.vacancy_id} · {p.vacancy_specialty}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400">{formatDate(p.created_at)}</span>
                    {active && left && (
                      <p className="text-xs text-green-600 font-medium">{left}</p>
                    )}
                    {!active && (
                      <p className="text-xs text-gray-400">Истёк {formatDate(p.expires_at)}</p>
                    )}
                  </div>
                </div>

                {/* Контент */}
                <div className="px-5 py-4">
                  <h3 className="font-semibold text-gray-900 mb-3">{p.vacancy_title}</h3>

                  {active ? (
                    <div className="space-y-2">
                      {p.contact_phone && (
                        <a href={`tel:${p.contact_phone}`}
                          className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5 hover:bg-green-50 transition-colors group">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon name="Phone" size={16} className="text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Телефон</p>
                            <p className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">{p.contact_phone}</p>
                          </div>
                        </a>
                      )}
                      {p.contact_email && (
                        <a href={`mailto:${p.contact_email}`}
                          className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5 hover:bg-blue-50 transition-colors group">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon name="Mail" size={16} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Email</p>
                            <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{p.contact_email}</p>
                          </div>
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-400 text-sm bg-gray-50 rounded-xl px-4 py-2.5">
                      <Icon name="Lock" size={15} />
                      <span>Доступ истёк — контакты скрыты</span>
                    </div>
                  )}
                </div>

                <div className="px-5 pb-3 flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-2">
                  <span>Оплачено {p.amount} ₽</span>
                  <span>ID: {p.payment_id.slice(0, 8)}...</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

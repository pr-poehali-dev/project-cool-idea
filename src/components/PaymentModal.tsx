import { useState } from "react"
import Icon from "@/components/ui/icon"

interface PaymentModalProps {
  open: boolean
  onClose: () => void
  vacancyTitle: string
  amount?: number
}

export function PaymentModal({ open, onClose, vacancyTitle, amount = 299 }: PaymentModalProps) {
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const formatCard = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16)
    return digits.replace(/(.{4})/g, "$1 ").trim()
  }

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4)
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2)
    return digits
  }

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onClose()
    }, 2000)
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">

        {/* Шапка */}
        <div className="bg-primary px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <Icon name="CreditCard" size={18} className="text-orange-400" />
            </div>
            <span className="text-white font-semibold text-sm">Оплата доступа</span>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Сумма */}
        <div className="bg-orange-50 border-b border-orange-100 px-5 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Доступ к контактам</p>
            <p className="text-sm font-medium text-gray-800 truncate max-w-[200px]">{vacancyTitle}</p>
          </div>
          <p className="text-xl font-bold text-gray-900">{amount} ₽</p>
        </div>

        <form onSubmit={handlePay} className="p-5 space-y-4">
          {/* Номер карты */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Номер карты</label>
            <div className="relative">
              <input
                required
                type="text"
                inputMode="numeric"
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={e => setCardNumber(formatCard(e.target.value))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 pr-12 tracking-wider"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                <div className="w-5 h-3 bg-red-500 rounded-sm opacity-80" />
                <div className="w-5 h-3 bg-yellow-400 rounded-sm opacity-80 -ml-2" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Срок действия</label>
              <input
                required
                type="text"
                inputMode="numeric"
                placeholder="MM/YY"
                value={expiry}
                onChange={e => setExpiry(formatExpiry(e.target.value))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">CVV</label>
              <input
                required
                type="password"
                inputMode="numeric"
                placeholder="•••"
                maxLength={3}
                value={cvv}
                onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Имя держателя</label>
            <input
              required
              type="text"
              placeholder="IVAN IVANOV"
              value={name}
              onChange={e => setName(e.target.value.toUpperCase())}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 uppercase tracking-wider"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Обработка...
              </>
            ) : (
              <>
                <Icon name="Lock" size={16} />
                Оплатить {amount} ₽
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
            <Icon name="ShieldCheck" size={13} />
            <span>Защищено ЮKassa · SSL шифрование</span>
          </div>
        </form>
      </div>
    </div>
  )
}

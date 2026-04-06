import { useEffect, useState } from "react"
import Icon from "@/components/ui/icon"
import func2url from "../../backend/func2url.json"

const PHONE = "+7 995 614-14-14"
const PHONE_HREF = "tel:+79956141414"
const TG_HREF = "https://t.me/ug_transfer_online"

const CATEGORY_LABELS: Record<string, string> = {
  excavation: "Земляные работы",
  transport: "Транспорт",
  lifting: "Подъёмная техника",
  road: "Дорожная техника",
}

const CATEGORY_ORDER = ["excavation", "transport", "lifting", "road"]

interface Machine {
  id: number
  category: string
  title: string
  description: string
  specs: string[]
  price: string
  image_url: string
  tags: string[]
}

export default function Rental() {
  const [machines, setMachines] = useState<Machine[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(func2url["rental-catalog"])
      .then(r => r.json())
      .then(data => {
        setMachines(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const categories = CATEGORY_ORDER.filter(cat =>
    machines.some(m => m.category === cat)
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Шапка */}
      <header className="bg-primary py-4 px-6 flex items-center justify-between sticky top-0 z-50">
        <a href="/" className="text-white font-bold text-xl tracking-tight">
          Работа-<span className="text-yellow-400">Крым</span>
        </a>
        <div className="flex items-center gap-3">
          <a href={PHONE_HREF} className="hidden sm:flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors">
            <Icon name="Phone" size={15} />
            {PHONE}
          </a>
          <a href={TG_HREF} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            <Icon name="Send" size={15} />
            Написать
          </a>
        </div>
      </header>

      {/* Герой */}
      <section className="bg-primary text-white py-12 px-6 text-center">
        <p className="text-yellow-400 text-sm tracking-[0.3em] uppercase mb-2">Весь Крым · Работаем без выходных</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">Аренда спецтехники</h1>
        <p className="text-white/70 text-lg max-w-xl mx-auto mb-6">
          Экскаваторы, самосвалы, краны, бульдозеры и другая техника для строительства и вывоза грунта
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href={PHONE_HREF}
            className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            <Icon name="Phone" size={18} />
            Позвонить
          </a>
          <a href={TG_HREF} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            <Icon name="Send" size={18} />
            Написать в Telegram
          </a>
        </div>
      </section>

      {/* Преимущества */}
      <div className="bg-white border-b border-gray-100 py-4 px-4">
        <div className="container mx-auto max-w-5xl flex flex-wrap gap-5 justify-center">
          {[
            ["Truck", "Техника с оператором"],
            ["Clock", "Аренда от 1 часа"],
            ["MapPin", "По всему Крыму"],
            ["Shield", "Страховка включена"],
            ["Zap", "Выезд за 2 часа"],
          ].map(([icon, text]) => (
            <div key={text} className="flex items-center gap-1.5 text-sm text-gray-700">
              <Icon name={icon as "Truck"} size={15} className="text-yellow-500" />
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Каталог */}
      <main className="container mx-auto px-4 max-w-5xl py-10 space-y-12">
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && machines.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Icon name="Truck" size={48} className="mx-auto mb-3 opacity-30" />
            <p>Техника скоро появится</p>
          </div>
        )}

        {!loading && categories.map((cat) => {
          const catMachines = machines.filter(m => m.category === cat)
          return (
            <section key={cat} id={cat}>
              <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span className="w-1 h-7 bg-yellow-500 rounded-full inline-block" />
                {CATEGORY_LABELS[cat] || cat}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {catMachines.map(m => (
                  <div key={m.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                    <div className="h-48 overflow-hidden relative">
                      {m.image_url ? (
                        <img src={m.image_url} alt={m.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <Icon name="Truck" size={40} className="text-gray-300" />
                        </div>
                      )}
                      {m.tags.map(tag => (
                        <span key={tag} className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">{tag}</span>
                      ))}
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{m.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-3 flex-1">{m.description}</p>
                      {m.specs.length > 0 && (
                        <ul className="space-y-1 mb-4">
                          {m.specs.map(s => (
                            <li key={s} className="flex items-center gap-1.5 text-xs text-gray-600">
                              <Icon name="CheckCircle" size={12} className="text-yellow-500 flex-shrink-0" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      )}
                      {m.price && <p className="text-primary font-bold text-base mb-3">{m.price}</p>}
                      <div className="flex gap-2">
                        <a href={PHONE_HREF}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 border border-gray-200 hover:border-primary text-gray-700 hover:text-primary font-medium py-2 rounded-xl transition-colors text-sm">
                          <Icon name="Phone" size={14} />
                          Позвонить
                        </a>
                        <a href={TG_HREF} target="_blank" rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-xl transition-colors text-sm">
                          <Icon name="Send" size={14} />
                          Telegram
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </main>

      {/* Нижняя плашка */}
      <section className="bg-primary text-white py-10 px-6 text-center mt-4">
        <h2 className="text-2xl font-bold mb-2">Нужна техника срочно?</h2>
        <p className="text-white/70 mb-5">Выезд в течение 2 часов по заявке. Работаем без выходных.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href={PHONE_HREF}
            className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors">
            <Icon name="Phone" size={18} />
            {PHONE}
          </a>
          <a href={TG_HREF} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-6 py-3 rounded-xl transition-colors">
            <Icon name="Send" size={18} />
            Написать в Telegram
          </a>
        </div>
      </section>
    </div>
  )
}
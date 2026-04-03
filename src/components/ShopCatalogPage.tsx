import { useEffect, useState } from "react"
import Icon from "@/components/ui/icon"
import func2url from "../../backend/func2url.json"

const PHONE = "+7 995 614-14-14"
const PHONE_HREF = "tel:+79956141414"
const TG_HREF = "https://t.me/ug_transfer_online"

interface DbProduct {
  id: number
  category: string
  title: string
  description: string
  price: string
  image_url: string
  tags: string[]
  sort_order: number
}

export interface ShopCatalogPageProps {
  title: string
  icon: string
  description: string
  heroImage: string
  features: string[]
  category: string
}

export default function ShopCatalogPage({ title, icon, description, heroImage, features, category }: ShopCatalogPageProps) {
  const [products, setProducts] = useState<DbProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${func2url["shop-catalog"]}?category=${category}`)
      .then(r => r.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [category])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Шапка */}
      <header className="bg-primary py-4 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <a href="/shop" className="text-white/60 hover:text-white transition-colors">
            <Icon name="ArrowLeft" size={20} />
          </a>
          <a href="/" className="text-white font-bold text-xl tracking-tight">
            Работа-<span className="text-yellow-400">Ялта</span>
          </a>
        </div>
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

      {/* Хлебные крошки */}
      <div className="bg-white border-b border-gray-100 px-4 py-2.5">
        <div className="container mx-auto max-w-5xl flex items-center gap-2 text-sm text-gray-400">
          <a href="/shop" className="hover:text-primary transition-colors">Магазин</a>
          <Icon name="ChevronRight" size={14} />
          <span className="text-gray-700 font-medium">{title}</span>
        </div>
      </div>

      {/* Герой раздела */}
      <section className="relative h-56 md:h-72 overflow-hidden">
        <img src={heroImage} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <div className="w-12 h-12 rounded-2xl bg-yellow-500 flex items-center justify-center mb-3">
            <Icon name={icon as "Square"} size={24} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
          <p className="text-white/80 max-w-md text-sm md:text-base">{description}</p>
        </div>
      </section>

      {/* Преимущества */}
      <div className="bg-white border-b border-gray-100 py-4 px-4">
        <div className="container mx-auto max-w-5xl flex flex-wrap gap-4 justify-center">
          {features.map((f) => (
            <div key={f} className="flex items-center gap-1.5 text-sm text-gray-700">
              <Icon name="CheckCircle" size={15} className="text-yellow-500" />
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Товары */}
      <main className="container mx-auto px-4 max-w-5xl py-8">
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Icon name="Package" size={48} className="mx-auto mb-3 opacity-30" />
            <p>Товары в этой категории скоро появятся</p>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                <div className="h-48 overflow-hidden relative">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Icon name={icon as "Square"} size={40} className="text-gray-300" />
                    </div>
                  )}
                  {item.tags && item.tags.length > 0 && (
                    <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                      {item.tags.map((tag) => (
                        <span key={tag} className="bg-yellow-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-3">{item.description}</p>
                  {item.price && (
                    <p className="text-primary font-bold text-lg mb-3">{item.price}</p>
                  )}
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
        )}
      </main>

      {/* Нижняя плашка */}
      <section className="bg-primary text-white py-10 px-6 text-center mt-4">
        <h2 className="text-2xl font-bold mb-2">Нужна консультация?</h2>
        <p className="text-white/70 mb-5">Ответим на все вопросы и подберём нужный вариант</p>
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

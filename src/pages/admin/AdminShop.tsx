import { useState } from "react"
import Icon from "@/components/ui/icon"
import { ShopProduct, api } from "./types"

const SHOP_CATEGORY_LABELS: Record<string, string> = {
  windows: "Окна", doors: "Двери", fence: "3D Забор", mixtures: "Сыпучие смеси", concrete: "Бетон"
}

type ShopForm = { category: string; title: string; description: string; price: string; image_url: string; tags: string; sort_order: number }

interface Props {
  shopProducts: ShopProduct[]
  setShopProducts: React.Dispatch<React.SetStateAction<ShopProduct[]>>
  shopCategory: string
  setShopCategory: (c: string) => void
  shopSearch: string
  setShopSearch: (s: string) => void
  loadShop: () => void
}

export default function AdminShop({ shopProducts, setShopProducts, shopCategory, setShopCategory, shopSearch, setShopSearch, loadShop }: Props) {
  const [shopModal, setShopModal] = useState<ShopProduct | null | "new">(null)
  const [shopForm, setShopForm] = useState<ShopForm>({ category: "windows", title: "", description: "", price: "", image_url: "", tags: "", sort_order: 0 })
  const [shopSaving, setShopSaving] = useState(false)

  const openShopNew = () => {
    setShopForm({ category: "windows", title: "", description: "", price: "", image_url: "", tags: "", sort_order: 0 })
    setShopModal("new")
  }

  const openShopEdit = (p: ShopProduct) => {
    setShopForm({ category: p.category, title: p.title, description: p.description, price: p.price || "", image_url: p.image_url || "", tags: p.tags || "", sort_order: p.sort_order || 0 })
    setShopModal(p)
  }

  const saveShopProduct = async () => {
    setShopSaving(true)
    if (shopModal === "new") {
      await api("shop_add_product", shopForm)
    } else if (shopModal) {
      await api("shop_edit_product", { product_id: (shopModal as ShopProduct).id, ...shopForm })
    }
    setShopModal(null)
    setShopSaving(false)
    loadShop()
  }

  const toggleShopActive = async (p: ShopProduct) => {
    await api("shop_edit_product", { product_id: p.id, is_active: !p.is_active })
    setShopProducts(prev => prev.map(x => x.id === p.id ? { ...x, is_active: !p.is_active } : x))
  }

  const deleteShopProduct = async (id: number) => {
    if (!confirm("Удалить товар?")) return
    await api("shop_delete_product", { product_id: id })
    setShopProducts(prev => prev.filter(p => p.id !== id))
  }

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-4 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {["", "windows", "doors", "fence", "mixtures", "concrete"].map(cat => (
            <button key={cat}
              onClick={() => { setShopCategory(cat); api("shop_products", { category: cat, search: shopSearch }).then(d => setShopProducts(Array.isArray(d) ? d : [])) }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${shopCategory === cat ? "bg-primary text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}>
              {cat === "" ? "Все" : { windows: "Окна", doors: "Двери", fence: "3D Забор", mixtures: "Смеси", concrete: "Бетон" }[cat]}
            </button>
          ))}
        </div>
        <button onClick={openShopNew} className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
          <Icon name="Plus" size={16} />Добавить товар
        </button>
      </div>
      <div className="flex gap-2 mb-4">
        <input value={shopSearch} onChange={e => setShopSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && loadShop()}
          placeholder="Поиск по названию..." className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
        <button onClick={loadShop} className="bg-yellow-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-yellow-600 transition-colors">Найти</button>
      </div>
      <p className="text-sm text-gray-500 mb-3">{shopProducts.length} товаров</p>
      {shopProducts.length === 0 && <div className="bg-white rounded-2xl p-10 text-center text-gray-400">Нет товаров. Нажмите «Добавить товар»</div>}
      <div className="space-y-3">
        {shopProducts.map(p => (
          <div key={p.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${p.is_active ? "border-gray-100" : "border-red-100 opacity-60"}`}>
            <div className="flex gap-4 p-4">
              {p.image_url && <img src={p.image_url} alt={p.title} className="w-20 h-16 object-cover rounded-xl flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full font-medium">{SHOP_CATEGORY_LABELS[p.category] || p.category}</span>
                  {!p.is_active && <span className="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full">Скрыто</span>}
                  <p className="font-semibold text-gray-900">{p.title}</p>
                </div>
                <p className="text-xs text-gray-400 line-clamp-1">{p.description}</p>
                {p.price && <p className="text-sm font-semibold text-primary mt-0.5">{p.price}</p>}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => openShopEdit(p)} className="text-gray-300 hover:text-yellow-500 transition-colors" title="Редактировать">
                  <Icon name="Pencil" size={16} />
                </button>
                <button onClick={() => toggleShopActive(p)} className={`transition-colors ${p.is_active ? "text-gray-300 hover:text-orange-400" : "text-gray-300 hover:text-green-500"}`} title={p.is_active ? "Скрыть" : "Показать"}>
                  <Icon name={p.is_active ? "EyeOff" : "Eye"} size={16} />
                </button>
                <button onClick={() => deleteShopProduct(p.id)} className="text-gray-300 hover:text-red-500 transition-colors" title="Удалить">
                  <Icon name="Trash2" size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Модалка товара */}
      {shopModal !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg">{shopModal === "new" ? "Добавить товар" : "Редактировать товар"}</h2>
              <button onClick={() => setShopModal(null)} className="text-gray-400 hover:text-gray-600"><Icon name="X" size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Категория</label>
                <select value={shopForm.category} onChange={e => setShopForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400">
                  <option value="windows">Окна</option>
                  <option value="doors">Двери</option>
                  <option value="fence">3D Забор</option>
                  <option value="mixtures">Сыпучие смеси</option>
                  <option value="concrete">Бетон</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Название</label>
                <input value={shopForm.title} onChange={e => setShopForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Описание</label>
                <textarea value={shopForm.description} onChange={e => setShopForm(f => ({ ...f, description: e.target.value }))} rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Цена</label>
                  <input value={shopForm.price} onChange={e => setShopForm(f => ({ ...f, price: e.target.value }))} placeholder="от 8 500 ₽"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Порядок сортировки</label>
                  <input type="number" value={shopForm.sort_order} onChange={e => setShopForm(f => ({ ...f, sort_order: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">URL фото</label>
                <input value={shopForm.image_url} onChange={e => setShopForm(f => ({ ...f, image_url: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                {shopForm.image_url && <img src={shopForm.image_url} alt="" className="mt-2 h-24 w-full object-cover rounded-xl" />}
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Теги (через запятую)</label>
                <input value={shopForm.tags} onChange={e => setShopForm(f => ({ ...f, tags: e.target.value }))} placeholder="Хит, Под заказ"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t border-gray-100">
              <button onClick={() => setShopModal(null)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Отмена</button>
              <button onClick={saveShopProduct} disabled={shopSaving}
                className="flex-1 bg-yellow-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50">
                {shopSaving ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

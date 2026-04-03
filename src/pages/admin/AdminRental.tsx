import { useState, useRef } from "react"
import Icon from "@/components/ui/icon"
import { api, getToken } from "./types"
import func2url from "../../../backend/func2url.json"

const CATEGORY_LABELS: Record<string, string> = {
  excavation: "Земляные работы",
  transport: "Транспорт",
  lifting: "Подъёмная техника",
  road: "Дорожная техника",
}

interface RentalMachine {
  id: number; category: string; title: string; description: string
  specs: string; price: string; image_url: string; tags: string
  is_active: boolean; sort_order: number
}

type RentalForm = {
  category: string; title: string; description: string; specs: string
  price: string; image_url: string; tags: string; sort_order: number
}

interface Props {
  machines: RentalMachine[]
  setMachines: React.Dispatch<React.SetStateAction<RentalMachine[]>>
  rentalCategory: string
  setRentalCategory: (c: string) => void
  rentalSearch: string
  setRentalSearch: (s: string) => void
  loadRental: () => void
}

export default function AdminRental({ machines, setMachines, rentalCategory, setRentalCategory, rentalSearch, setRentalSearch, loadRental }: Props) {
  const [modal, setModal] = useState<RentalMachine | null | "new">(null)
  const [form, setForm] = useState<RentalForm>({ category: "excavation", title: "", description: "", specs: "", price: "", image_url: "", tags: "", sort_order: 0 })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadImage = async (file: File) => {
    setUploading(true)
    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64 = (e.target?.result as string) || ""
      const res = await fetch(func2url["upload-image"], {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": getToken() },
        body: JSON.stringify({ image: base64, mime_type: file.type }),
      })
      const data = await res.json()
      if (data.url) setForm(f => ({ ...f, image_url: data.url }))
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const openNew = () => {
    setForm({ category: "excavation", title: "", description: "", specs: "", price: "", image_url: "", tags: "", sort_order: 0 })
    setModal("new")
  }

  const openEdit = (m: RentalMachine) => {
    setForm({ category: m.category, title: m.title, description: m.description, specs: m.specs || "", price: m.price || "", image_url: m.image_url || "", tags: m.tags || "", sort_order: m.sort_order || 0 })
    setModal(m)
  }

  const save = async () => {
    setSaving(true)
    if (modal === "new") {
      await api("rental_add", form)
    } else if (modal) {
      await api("rental_edit", { machine_id: (modal as RentalMachine).id, ...form })
    }
    setModal(null)
    setSaving(false)
    loadRental()
  }

  const toggleActive = async (m: RentalMachine) => {
    await api("rental_edit", { machine_id: m.id, is_active: !m.is_active })
    setMachines(prev => prev.map(x => x.id === m.id ? { ...x, is_active: !m.is_active } : x))
  }

  const deleteMachine = async (id: number) => {
    if (!confirm("Удалить технику?")) return
    await api("rental_delete", { machine_id: id })
    setMachines(prev => prev.filter(m => m.id !== id))
  }

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-4 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {["", "excavation", "transport", "lifting", "road"].map(cat => (
            <button key={cat}
              onClick={() => { setRentalCategory(cat); api("rental_machines", { category: cat, search: rentalSearch }).then(d => setMachines(Array.isArray(d) ? d : [])) }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${rentalCategory === cat ? "bg-primary text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}>
              {cat === "" ? "Все" : { excavation: "Земля", transport: "Транспорт", lifting: "Подъём", road: "Дорога" }[cat]}
            </button>
          ))}
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
          <Icon name="Plus" size={16} />Добавить технику
        </button>
      </div>
      <div className="flex gap-2 mb-4">
        <input value={rentalSearch} onChange={e => setRentalSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && loadRental()}
          placeholder="Поиск по названию..." className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
        <button onClick={loadRental} className="bg-yellow-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-yellow-600 transition-colors">Найти</button>
      </div>
      <p className="text-sm text-gray-500 mb-3">{machines.length} позиций</p>
      {machines.length === 0 && <div className="bg-white rounded-2xl p-10 text-center text-gray-400">Нет техники. Нажмите «Добавить технику»</div>}
      <div className="space-y-3">
        {machines.map(m => (
          <div key={m.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${m.is_active ? "border-gray-100" : "border-red-100 opacity-60"}`}>
            <div className="flex gap-4 p-4">
              {m.image_url && <img src={m.image_url} alt={m.title} className="w-20 h-16 object-cover rounded-xl flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">{CATEGORY_LABELS[m.category] || m.category}</span>
                  {!m.is_active && <span className="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full">Скрыто</span>}
                  <p className="font-semibold text-gray-900">{m.title}</p>
                </div>
                <p className="text-xs text-gray-400 line-clamp-1">{m.description}</p>
                {m.price && <p className="text-sm font-semibold text-primary mt-0.5">{m.price}</p>}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => openEdit(m)} className="text-gray-300 hover:text-yellow-500 transition-colors" title="Редактировать">
                  <Icon name="Pencil" size={16} />
                </button>
                <button onClick={() => toggleActive(m)} className={`transition-colors ${m.is_active ? "text-gray-300 hover:text-orange-400" : "text-gray-300 hover:text-green-500"}`} title={m.is_active ? "Скрыть" : "Показать"}>
                  <Icon name={m.is_active ? "EyeOff" : "Eye"} size={16} />
                </button>
                <button onClick={() => deleteMachine(m.id)} className="text-gray-300 hover:text-red-500 transition-colors" title="Удалить">
                  <Icon name="Trash2" size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Модалка */}
      {modal !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg">{modal === "new" ? "Добавить технику" : "Редактировать технику"}</h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600"><Icon name="X" size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Категория</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400">
                  <option value="excavation">Земляные работы</option>
                  <option value="transport">Транспорт</option>
                  <option value="lifting">Подъёмная техника</option>
                  <option value="road">Дорожная техника</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Название</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Описание</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Характеристики (через запятую)</label>
                <input value={form.specs} onChange={e => setForm(f => ({ ...f, specs: e.target.value }))} placeholder="Глубина копания до 6 м, Ковш 0,5 м³"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Цена</label>
                  <input value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="от 2 500 ₽/час"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Порядок</label>
                  <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Фото</label>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                  onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])} />
                {form.image_url ? (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200">
                    <img src={form.image_url} alt="" className="w-full h-36 object-cover" />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center gap-2 group">
                      <button type="button" onClick={() => fileInputRef.current?.click()}
                        className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity flex items-center gap-1">
                        <Icon name="Upload" size={13} />Заменить
                      </button>
                      <button type="button" onClick={() => setForm(f => ({ ...f, image_url: "" }))}
                        className="opacity-0 group-hover:opacity-100 bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity flex items-center gap-1">
                        <Icon name="Trash2" size={13} />Удалить
                      </button>
                    </div>
                    {uploading && <div className="absolute inset-0 bg-white/70 flex items-center justify-center"><div className="text-sm text-gray-500">Загрузка...</div></div>}
                  </div>
                ) : (
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                    className="w-full border-2 border-dashed border-gray-200 hover:border-yellow-400 rounded-xl p-5 flex flex-col items-center gap-2 text-gray-400 hover:text-yellow-500 transition-colors disabled:opacity-50">
                    {uploading ? <><Icon name="Loader" size={22} className="animate-spin" /><span className="text-sm">Загрузка...</span></> : <><Icon name="Upload" size={22} /><span className="text-sm font-medium">Загрузить фото</span></>}
                  </button>
                )}
                <input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                  placeholder="или вставьте URL"
                  className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-2 text-xs text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Теги (через запятую)</label>
                <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="Популярное, Срочно"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t border-gray-100">
              <button onClick={() => setModal(null)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Отмена</button>
              <button onClick={save} disabled={saving}
                className="flex-1 bg-yellow-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50">
                {saving ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

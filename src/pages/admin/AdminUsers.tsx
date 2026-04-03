import { useState } from "react"
import Icon from "@/components/ui/icon"
import { User, EditState, api } from "./types"

interface Props {
  users: User[]
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
  search: string
  setSearch: (s: string) => void
  doSearch: () => void
}

export default function AdminUsers({ users, setUsers, search, setSearch, doSearch }: Props) {
  const [editUser, setEditUser] = useState<User | null>(null)
  const [editForm, setEditForm] = useState<EditState>({ name: "", email: "", phone: "", new_password: "", confirm_password: "" })
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState("")

  const openEdit = (u: User) => {
    setEditUser(u)
    setEditForm({ name: u.name, email: u.email, phone: u.phone || "", new_password: "", confirm_password: "" })
    setEditError("")
  }

  const saveEdit = async () => {
    if (!editUser) return
    if (editForm.new_password && editForm.new_password !== editForm.confirm_password) {
      setEditError("Пароли не совпадают"); return
    }
    if (editForm.new_password && editForm.new_password.length < 6) {
      setEditError("Пароль минимум 6 символов"); return
    }
    setEditLoading(true); setEditError("")
    const payload: Record<string, string | number> = { user_id: editUser.id, name: editForm.name, email: editForm.email, phone: editForm.phone }
    if (editForm.new_password) payload.new_password = editForm.new_password
    await api("edit_user", payload)
    setUsers(prev => prev.map(u => u.id === editUser.id ? { ...u, name: editForm.name, email: editForm.email, phone: editForm.phone } : u))
    setEditLoading(false)
    setEditUser(null)
  }

  const deleteUser = async (id: number) => {
    if (!confirm("Удалить пользователя и все его объявления?")) return
    await api("delete_user", { user_id: id })
    setUsers(prev => prev.filter(u => u.id !== id))
  }

  const toggleBlock = async (u: User) => {
    const block = !u.is_blocked
    await api("toggle_block_user", { user_id: u.id, block })
    setUsers(prev => prev.map(x => x.id === u.id ? { ...x, is_blocked: block } : x))
  }

  return (
    <>
      <div className="flex gap-2 mb-5">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === "Enter" && doSearch()}
          placeholder="Поиск по имени, email, специальности..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <button onClick={doSearch} className="bg-yellow-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-yellow-600 transition-colors">
          Найти
        </button>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-gray-500">{users.length} записей</p>
        {users.length === 0 && <div className="bg-white rounded-2xl p-10 text-center text-gray-400">Нет данных</div>}
        {users.map(u => (
          <div key={u.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${u.role === "employer" ? "bg-blue-100" : "bg-green-100"}`}>
                  <Icon name={u.role === "employer" ? "Building2" : "HardHat"} size={18} className={u.role === "employer" ? "text-blue-500" : "text-green-500"} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 truncate">{u.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${u.role === "employer" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}`}>
                      {u.role === "employer" ? "Работодатель" : "Соискатель"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{u.email}</p>
                  {u.specialty && <p className="text-xs text-gray-400 mt-0.5">{u.specialty}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {u.phone && (
                  <a href={`tel:${u.phone}`} className="text-gray-400 hover:text-yellow-500 transition-colors">
                    <Icon name="Phone" size={16} />
                  </a>
                )}
                <span className="text-xs text-gray-400 hidden sm:block">
                  {new Date(u.created_at).toLocaleDateString("ru")}
                </span>
                {u.is_blocked && <span className="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full hidden sm:block">Заблокирован</span>}
                <button onClick={() => openEdit(u)} className="text-gray-300 hover:text-yellow-500 transition-colors" title="Редактировать">
                  <Icon name="Pencil" size={16} />
                </button>
                <button onClick={() => toggleBlock(u)} className={`transition-colors ${u.is_blocked ? "text-red-400 hover:text-gray-400" : "text-gray-300 hover:text-red-500"}`} title={u.is_blocked ? "Разблокировать" : "Заблокировать"}>
                  <Icon name={u.is_blocked ? "LockOpen" : "Lock"} size={16} />
                </button>
                <button onClick={() => deleteUser(u.id)} className="text-gray-300 hover:text-red-500 transition-colors" title="Удалить">
                  <Icon name="Trash2" size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Модалка редактирования пользователя */}
      {editUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-gray-900 text-lg">Редактировать пользователя</h2>
                <p className="text-sm text-gray-400">{editUser.role === "employer" ? "Работодатель" : "Соискатель"}</p>
              </div>
              <button onClick={() => setEditUser(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <Icon name="X" size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Имя</label>
                <input
                  value={editForm.name}
                  onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Телефон</label>
                <input
                  value={editForm.phone}
                  onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="+7..."
                />
              </div>
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-medium text-gray-500 mb-3">Смена пароля (оставьте пустым, чтобы не менять)</p>
                <div className="space-y-3">
                  <input
                    type="password"
                    value={editForm.new_password}
                    onChange={e => setEditForm(f => ({ ...f, new_password: e.target.value }))}
                    placeholder="Новый пароль"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  <input
                    type="password"
                    value={editForm.confirm_password}
                    onChange={e => setEditForm(f => ({ ...f, confirm_password: e.target.value }))}
                    placeholder="Повторите пароль"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>
              {editError && <p className="text-sm text-red-500">{editError}</p>}
            </div>
            <div className="p-5 pt-0 flex gap-3">
              <button
                onClick={() => setEditUser(null)}
                className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={saveEdit}
                disabled={editLoading}
                className="flex-1 bg-yellow-400 text-primary rounded-xl py-2.5 text-sm font-medium hover:bg-yellow-300 transition-colors disabled:opacity-50"
              >
                {editLoading ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

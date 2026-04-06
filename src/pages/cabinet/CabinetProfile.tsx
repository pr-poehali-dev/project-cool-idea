import { useState } from "react"
import Icon from "@/components/ui/icon"
import { apiUsers } from "@/lib/auth"
import { User, SPECIALTIES, EXPERIENCES } from "./types"

interface Props {
  user: User
  setUser: (u: User) => void
  isEmployer: boolean
}

const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
const labelCls = "block text-sm font-medium text-gray-700 mb-1"

export default function CabinetProfile({ user, setUser, isEmployer }: Props) {
  const [profileForm, setProfileForm] = useState<Partial<User>>(user)
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [pwForm, setPwForm] = useState({ old_password: "", new_password: "", confirm: "" })
  const [pwSaving, setPwSaving] = useState(false)
  const [pwError, setPwError] = useState("")
  const [pwSaved, setPwSaved] = useState(false)

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileSaving(true)
    await apiUsers({ action: "update_profile", ...profileForm })
    setProfileSaving(false)
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 3000)
    const { data } = await apiUsers({ action: "me" })
    setUser(data)
  }

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwError("")
    if (pwForm.new_password !== pwForm.confirm) {
      setPwError("Новые пароли не совпадают"); return
    }
    setPwSaving(true)
    const { ok, data } = await apiUsers({ action: "change_password", old_password: pwForm.old_password, new_password: pwForm.new_password })
    setPwSaving(false)
    if (!ok) { setPwError(data.error || "Ошибка"); return }
    setPwSaved(true)
    setPwForm({ old_password: "", new_password: "", confirm: "" })
    setTimeout(() => setPwSaved(false), 3000)
  }

  return (
    <div className="space-y-4">
      {!isEmployer && (!user?.specialty || !user?.phone) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
            <Icon name="Lightbulb" size={18} className="text-yellow-500" />
          </div>
          <div>
            <p className="font-semibold text-yellow-800 text-sm">Заполните профиль</p>
            <p className="text-yellow-600 text-sm mt-0.5">Работодатели ищут специалистов по специальности и городу. Чем полнее профиль — тем больше шансов получить предложение.</p>
          </div>
        </div>
      )}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="font-bold text-gray-900 text-lg mb-6">Редактировать профиль</h2>
        <form onSubmit={saveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Имя *</label>
            <input required className={inputCls} value={profileForm.name||""} onChange={e=>setProfileForm({...profileForm,name:e.target.value})} />
          </div>
          <div>
            <label className={labelCls}>Телефон</label>
            <input className={inputCls} placeholder="+7 (999) 000-00-00" value={profileForm.phone||""} onChange={e=>setProfileForm({...profileForm,phone:e.target.value})} />
          </div>
          <div>
            <label className={labelCls}>Специальность</label>
            <select className={inputCls} value={profileForm.specialty||""} onChange={e=>setProfileForm({...profileForm,specialty:e.target.value})}>
              <option value="">Выберите</option>
              {SPECIALTIES.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Опыт работы</label>
            <select className={inputCls} value={profileForm.experience||""} onChange={e=>setProfileForm({...profileForm,experience:e.target.value})}>
              <option value="">Выберите</option>
              {EXPERIENCES.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Город</label>
            <input className={inputCls} placeholder="Ялта" value={profileForm.city||""} onChange={e=>setProfileForm({...profileForm,city:e.target.value})} />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input className={`${inputCls} bg-gray-50 text-gray-400`} disabled value={user?.email||""} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>О себе</label>
            <textarea rows={3} className={`${inputCls} resize-none`} placeholder="Расскажите о своём опыте, навыках..."
              value={profileForm.about||""} onChange={e=>setProfileForm({...profileForm,about:e.target.value})} />
          </div>
          <div className="sm:col-span-2 flex items-center gap-3">
            <button type="submit" disabled={profileSaving}
              className="bg-yellow-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50 text-sm">
              {profileSaving?"Сохраняю...":"Сохранить"}
            </button>
            {profileSaved && <span className="text-green-500 text-sm flex items-center gap-1"><Icon name="CheckCircle" size={16}/>Сохранено!</span>}
          </div>
        </form>

        {/* Смена пароля */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Icon name="Lock" size={16} className="text-gray-400"/>
            Сменить пароль
          </h3>
          <form onSubmit={changePassword} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelCls}>Текущий пароль</label>
              <input required type="password" placeholder="Введите текущий пароль" className={inputCls}
                value={pwForm.old_password} onChange={e=>setPwForm({...pwForm,old_password:e.target.value})}/>
            </div>
            <div>
              <label className={labelCls}>Новый пароль</label>
              <input required type="password" placeholder="Минимум 6 символов" className={inputCls}
                value={pwForm.new_password} onChange={e=>setPwForm({...pwForm,new_password:e.target.value})}/>
            </div>
            <div>
              <label className={labelCls}>Повторите новый пароль</label>
              <input required type="password" placeholder="Повторите пароль" className={inputCls}
                value={pwForm.confirm} onChange={e=>setPwForm({...pwForm,confirm:e.target.value})}/>
            </div>
            {pwError && (
              <div className="sm:col-span-2 flex items-center gap-2 text-red-500 text-sm bg-red-50 rounded-xl px-4 py-2.5">
                <Icon name="AlertCircle" size={15}/>{pwError}
              </div>
            )}
            <div className="sm:col-span-2 flex items-center gap-3">
              <button type="submit" disabled={pwSaving}
                className="bg-gray-800 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-900 transition-colors disabled:opacity-50 text-sm">
                {pwSaving?"Сохраняю...":"Изменить пароль"}
              </button>
              {pwSaved && <span className="text-green-500 text-sm flex items-center gap-1"><Icon name="CheckCircle" size={16}/>Пароль изменён!</span>}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
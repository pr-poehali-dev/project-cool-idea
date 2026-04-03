import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { apiUsers, clearToken } from "@/lib/auth"
import { apiVacancies } from "@/lib/api"
import Icon from "@/components/ui/icon"

interface User {
  id: number; name: string; email: string; role: string
  phone: string; specialty: string; experience: string; city: string; about: string
}

interface Vacancy {
  id: number; title: string; company: string; specialty: string
  salary_from: number | null; salary_to: number | null
  city: string; schedule: string; description: string
  contact_phone: string; contact_email: string; is_active: boolean
}

const SPECIALTIES = [
  "Сварщик","Каменщик","Штукатур","Плиточник","Маляр","Электрик","Сантехник",
  "Монтажник","Плотник","Кровельщик","Бетонщик","Арматурщик","Оператор спецтехники",
  "Прораб","Геодезист","Инженер-строитель","Дорожный рабочий","Асфальтировщик",
  "Изолировщик","Стекольщик","Облицовщик","Паркетчик","Лепщик","Трубопроводчик",
  "Такелажник","Разнорабочий","Водитель спецтехники","Экскаваторщик","Крановщик",
  "Бульдозерист","Сигналист","Охранник объекта","Другое"
]
const SCHEDULES = ["Полный день","Вахта","Гибкий","Подработка"]
const EXPERIENCES = ["Без опыта","1–3 года","3–5 лет","Более 5 лет"]

interface SavedContact {
  id: number; title: string; specialty: string; city: string
  salary_from: number | null; salary_to: number | null
  contact_phone: string; contact_email: string; description: string; paid: boolean
}

type Tab = "overview" | "profile" | "vacancies" | "new_vacancy" | "saved"

export default function Cabinet() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>("overview")
  const [vacancies, setVacancies] = useState<Vacancy[]>([])
  const [profileForm, setProfileForm] = useState<Partial<User>>({})
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [vacancyForm, setVacancyForm] = useState({
    company:"",specialty:"",salary_from:"",salary_to:"",
    city:"Ялта",schedule:"",experience_required:"",description:"",
    contact_phone:"",contact_email:""
  })
  const [vacancySaving, setVacancySaving] = useState(false)
  const [vacancyError, setVacancyError] = useState("")
  const [saved, setSaved] = useState<SavedContact[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const init = async () => {
      const { ok, data } = await apiUsers({ action: "me" })
      if (!ok) { navigate("/auth"); return }
      setUser(data)
      setProfileForm(data)
      setLoading(false)
    }
    init()
  }, [navigate])

  const loadVacancies = async () => {
    const { data } = await apiVacancies({ action: "my" })
    setVacancies(Array.isArray(data) ? data : [])
  }

  useEffect(() => {
    if (tab === "vacancies") loadVacancies()
    if (tab === "saved") {
      apiUsers({ action: "my_saved" }).then(({ data }) => setSaved(Array.isArray(data) ? data : []))
    }
  }, [tab])

  const logout = async () => {
    await apiUsers({ action: "logout" })
    clearToken()
    navigate("/")
  }

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

  const createVacancy = async (e: React.FormEvent) => {
    e.preventDefault()
    setVacancyError("")
    setVacancySaving(true)
    const { ok, data } = await apiVacancies({
      action: "create",
      title: vacancyForm.specialty,
      ...vacancyForm,
      salary_from: vacancyForm.salary_from ? parseInt(vacancyForm.salary_from) : null,
      salary_to: vacancyForm.salary_to ? parseInt(vacancyForm.salary_to) : null,
    })
    setVacancySaving(false)
    if (!ok) { setVacancyError(data.error || "Ошибка"); return }
    setVacancyForm({ company:"",specialty:"",salary_from:"",salary_to:"",city:"Ялта",schedule:"",experience_required:"",description:"",contact_phone:"",contact_email:"" })
    setTab("vacancies")
  }

  const deleteVacancy = async (id: number) => {
    await apiVacancies({ action: "delete", id })
    loadVacancies()
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-400 text-sm">Загрузка...</div>
    </div>
  )

  const isEmployer = user?.role === "employer"
  const roleLabel = isEmployer ? "Работодатель" : "Соискатель"
  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
  const labelCls = "block text-sm font-medium text-gray-700 mb-1"

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary py-4 px-6 flex items-center justify-between">
        <a href="/" className="text-white font-bold text-xl tracking-tight">
          Работа-<span className="text-orange-400">Ялта</span>
        </a>
        <div className="flex items-center gap-4">
          <span className="text-white/60 text-sm hidden sm:block">{user?.name}</span>
          <button onClick={logout} className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors">
            <Icon name="LogOut" size={16} />Выйти
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Навигация */}
        <div className="flex gap-1 bg-white rounded-2xl p-1 shadow-sm border border-gray-100 mb-6 overflow-x-auto">
          {([
            ["overview","Обзор","LayoutDashboard"],
            ["profile","Профиль","User"],
            ["vacancies", isEmployer ? "Мои вакансии" : "Мои объявления","Briefcase"],
            ["saved","Сохранённые","Bookmark"],
            ["new_vacancy", isEmployer ? "+ Вакансия" : "+ Объявление","Plus"],
          ] as [Tab,string,string][]).map(([t,label,icon]) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${tab===t ? "bg-primary text-white shadow" : "text-gray-500 hover:text-gray-800"}`}>
              <Icon name={icon as "User"} size={16} />{label}
            </button>
          ))}
        </div>

        {/* Обзор */}
        {tab === "overview" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Icon name={isEmployer ? "Building2" : "HardHat"} size={28} className="text-orange-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Привет, {user?.name}!</h1>
                <span className="inline-block mt-1 text-xs bg-orange-100 text-orange-600 px-2.5 py-1 rounded-full font-medium">{roleLabel}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={() => setTab("vacancies")} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-left hover:border-orange-200 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Icon name="Briefcase" size={20} className="text-blue-500" />
                  </div>
                  <h2 className="font-semibold text-gray-900">{isEmployer ? "Мои вакансии" : "Мои объявления"}</h2>
                </div>
                <p className="text-gray-400 text-sm">Управляйте своими объявлениями</p>
              </button>
              <button onClick={() => setTab("profile")} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-left hover:border-orange-200 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Icon name="User" size={20} className="text-purple-500" />
                  </div>
                  <h2 className="font-semibold text-gray-900">Мой профиль</h2>
                </div>
                <p className="text-gray-400 text-sm">Заполните профиль для лучших результатов</p>
              </button>
            </div>
          </div>
        )}

        {/* Профиль */}
        {tab === "profile" && (
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
                  {SPECIALTIES.map(s=><option key={s}>{s}</option>)}
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
                  className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 text-sm">
                  {profileSaving?"Сохраняю...":"Сохранить"}
                </button>
                {profileSaved && <span className="text-green-500 text-sm flex items-center gap-1"><Icon name="CheckCircle" size={16}/>Сохранено!</span>}
              </div>
            </form>
          </div>
        )}

        {/* Мои вакансии */}
        {tab === "vacancies" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900 text-lg">{isEmployer?"Мои вакансии":"Мои объявления"}</h2>
              <button onClick={()=>setTab("new_vacancy")} className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors">
                <Icon name="Plus" size={16}/>Добавить
              </button>
            </div>
            {vacancies.length===0 ? (
              <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
                <Icon name="Inbox" size={40} className="text-gray-200 mx-auto mb-3"/>
                <p className="text-gray-400 text-sm">Объявлений пока нет</p>
                <button onClick={()=>setTab("new_vacancy")} className="mt-4 text-orange-500 text-sm font-medium hover:text-orange-600">Создать первое →</button>
              </div>
            ) : vacancies.map(v=>(
              <div key={v.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{v.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{v.specialty} · {v.city}</p>
                    {(v.salary_from||v.salary_to)&&(
                      <p className="text-sm text-orange-500 font-medium mt-1">
                        {v.salary_from?`от ${v.salary_from.toLocaleString()} ₽`:""}{v.salary_to?` до ${v.salary_to.toLocaleString()} ₽`:""}
                      </p>
                    )}
                    {v.description&&<p className="text-sm text-gray-400 mt-2 line-clamp-2">{v.description}</p>}
                  </div>
                  <button onClick={()=>deleteVacancy(v.id)} className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
                    <Icon name="Trash2" size={18}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Новая вакансия */}
        {tab === "new_vacancy" && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="font-bold text-gray-900 text-lg mb-6">{isEmployer?"Разместить вакансию":"Разместить объявление о поиске работы"}</h2>
            <form onSubmit={createVacancy} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={isEmployer ? "" : "sm:col-span-2"}>
                <label className={labelCls}>Специальность *</label>
                <select required className={inputCls} value={vacancyForm.specialty} onChange={e=>setVacancyForm({...vacancyForm,specialty:e.target.value})}>
                  <option value="">Выберите специальность</option>
                  {SPECIALTIES.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              {isEmployer&&(
                <div>
                  <label className={labelCls}>Компания</label>
                  <input className={inputCls} placeholder="ООО Стройград"
                    value={vacancyForm.company} onChange={e=>setVacancyForm({...vacancyForm,company:e.target.value})}/>
                </div>
              )}
              <div>
                <label className={labelCls}>Зарплата от (₽)</label>
                <input type="number" className={inputCls} placeholder="40000"
                  value={vacancyForm.salary_from} onChange={e=>setVacancyForm({...vacancyForm,salary_from:e.target.value})}/>
              </div>
              <div>
                <label className={labelCls}>Зарплата до (₽)</label>
                <input type="number" className={inputCls} placeholder="80000"
                  value={vacancyForm.salary_to} onChange={e=>setVacancyForm({...vacancyForm,salary_to:e.target.value})}/>
              </div>
              <div>
                <label className={labelCls}>График</label>
                <select className={inputCls} value={vacancyForm.schedule} onChange={e=>setVacancyForm({...vacancyForm,schedule:e.target.value})}>
                  <option value="">Выберите</option>
                  {SCHEDULES.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Опыт</label>
                <select className={inputCls} value={vacancyForm.experience_required} onChange={e=>setVacancyForm({...vacancyForm,experience_required:e.target.value})}>
                  <option value="">Выберите</option>
                  {EXPERIENCES.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Контактный телефон</label>
                <input className={inputCls} placeholder="+7 (999) 000-00-00"
                  value={vacancyForm.contact_phone} onChange={e=>setVacancyForm({...vacancyForm,contact_phone:e.target.value})}/>
              </div>
              <div>
                <label className={labelCls}>Контактный email</label>
                <input type="email" className={inputCls} placeholder="email@mail.ru"
                  value={vacancyForm.contact_email} onChange={e=>setVacancyForm({...vacancyForm,contact_email:e.target.value})}/>
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Описание</label>
                <textarea rows={4} className={`${inputCls} resize-none`}
                  placeholder={isEmployer?"Опишите обязанности, условия, требования...":"Расскажите о своём опыте, навыках, пожеланиях..."}
                  value={vacancyForm.description} onChange={e=>setVacancyForm({...vacancyForm,description:e.target.value})}/>
              </div>
              {vacancyError&&(
                <div className="sm:col-span-2 text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3 flex items-center gap-2">
                  <Icon name="AlertCircle" size={16}/>{vacancyError}
                </div>
              )}
              <div className="sm:col-span-2">
                <button type="submit" disabled={vacancySaving}
                  className="bg-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 text-sm">
                  {vacancySaving?"Публикую...":"Опубликовать"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Сохранённые объявления */}
        {tab === "saved" && (
          <div className="space-y-4">
            <h2 className="font-bold text-gray-900 text-lg">Сохранённые объявления</h2>
            {saved.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
                <Icon name="Bookmark" size={40} className="text-gray-200 mx-auto mb-3"/>
                <p className="text-gray-400 text-sm">Нет сохранённых объявлений</p>
                <a href="/#vacancies" className="mt-4 inline-block text-orange-500 text-sm font-medium hover:text-orange-600">Смотреть объявления →</a>
              </div>
            ) : saved.map(s => (
              <div key={s.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{s.title}</h3>
                      {s.paid && <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Оплачено</span>}
                    </div>
                    <p className="text-sm text-gray-500">{s.specialty} · {s.city}</p>
                    {(s.salary_from||s.salary_to) && (
                      <p className="text-sm text-orange-500 font-medium mt-1">
                        {s.salary_from?`от ${s.salary_from.toLocaleString()} ₽`:""}{s.salary_to?` до ${s.salary_to.toLocaleString()} ₽`:""}
                      </p>
                    )}
                    {s.paid ? (
                      <div className="flex flex-col gap-1 mt-3 pt-3 border-t border-gray-100">
                        {s.contact_phone && (
                          <a href={`tel:${s.contact_phone}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-orange-500 transition-colors">
                            <Icon name="Phone" size={14}/>{s.contact_phone}
                          </a>
                        )}
                        {s.contact_email && (
                          <a href={`mailto:${s.contact_email}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-orange-500 transition-colors">
                            <Icon name="Mail" size={14}/>{s.contact_email}
                          </a>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-3">
                        <Icon name="Lock" size={14} className="text-gray-400"/>
                        <span className="text-sm text-gray-400">Контакты скрыты — </span>
                        <a href="/#vacancies" className="text-sm text-orange-500 hover:text-orange-600 font-medium">оплатить доступ</a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
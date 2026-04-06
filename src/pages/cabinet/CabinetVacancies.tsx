import { useState } from "react"
import Icon from "@/components/ui/icon"
import { apiVacancies } from "@/lib/api"
import { getSpecialtyPhoto } from "@/lib/specialtyPhotos"
import { Vacancy, Tab, SPECIALTIES, SCHEDULES, EXPERIENCES } from "./types"

interface Props {
  vacancies: Vacancy[]
  loadVacancies: () => Promise<void>
  isEmployer: boolean
  tab: Tab
  setTab: (t: Tab) => void
  vacancySuccess: boolean
  setVacancySuccess: (v: boolean) => void
}

export default function CabinetVacancies({ vacancies, loadVacancies, isEmployer, tab, setTab, vacancySuccess, setVacancySuccess }: Props) {
  const [vacancyForm, setVacancyForm] = useState({
    company:"",specialty:"",salary_from:"",salary_to:"",
    city:"",schedule:"",experience_required:"",description:"",
    contact_phone:"",contact_email:""
  })
  const [vacancySaving, setVacancySaving] = useState(false)
  const [vacancyError, setVacancyError] = useState("")

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
    setVacancyForm({ company:"",specialty:"",salary_from:"",salary_to:"",city:"",schedule:"",experience_required:"",description:"",contact_phone:"",contact_email:"" })
    setVacancySuccess(true)
    await loadVacancies()
    setTab("vacancies")
    setTimeout(() => setVacancySuccess(false), 4000)
  }

  const deleteVacancy = async (id: number) => {
    const { ok } = await apiVacancies({ action: "delete", id })
    if (ok) await loadVacancies()
  }

  if (tab === "new_vacancy") return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setTab("vacancies")} className="text-gray-400 hover:text-gray-600 transition-colors">
          <Icon name="ArrowLeft" size={20} />
        </button>
        <h2 className="font-bold text-gray-900 text-lg">{isEmployer ? "Новая вакансия" : "Новое объявление"}</h2>
      </div>
      <form onSubmit={createVacancy} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-gray-500 mb-1 block">Специальность *</label>
          <select required value={vacancyForm.specialty}
            onChange={e => setVacancyForm({...vacancyForm, specialty: e.target.value})}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white">
            <option value="">Выберите специальность</option>
            {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {isEmployer && (
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-gray-500 mb-1 block">Название компании</label>
            <input value={vacancyForm.company}
              onChange={e => setVacancyForm({...vacancyForm, company: e.target.value})}
              placeholder="ООО Строитель"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          </div>
        )}
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Зарплата от (₽)</label>
          <input type="number" value={vacancyForm.salary_from}
            onChange={e => setVacancyForm({...vacancyForm, salary_from: e.target.value})}
            placeholder="50000"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Зарплата до (₽)</label>
          <input type="number" value={vacancyForm.salary_to}
            onChange={e => setVacancyForm({...vacancyForm, salary_to: e.target.value})}
            placeholder="80000"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Город</label>
          <select value={vacancyForm.city}
            onChange={e => setVacancyForm({...vacancyForm, city: e.target.value})}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white">
            <option value="">Выберите город</option>
            {["Симферополь","Ялта","Севастополь","Керчь","Феодосия","Евпатория","Алушта","Судак","Саки","Бахчисарай","Джанкой","Белогорск"].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">График работы</label>
          <select value={vacancyForm.schedule}
            onChange={e => setVacancyForm({...vacancyForm, schedule: e.target.value})}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white">
            <option value="">Не указан</option>
            {SCHEDULES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-gray-500 mb-1 block">Требуемый опыт</label>
          <select value={vacancyForm.experience_required}
            onChange={e => setVacancyForm({...vacancyForm, experience_required: e.target.value})}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white">
            <option value="">Не важно</option>
            {EXPERIENCES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-gray-500 mb-1 block">Описание</label>
          <textarea value={vacancyForm.description} rows={4}
            onChange={e => setVacancyForm({...vacancyForm, description: e.target.value})}
            placeholder="Опишите условия работы, требования и обязанности..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Контактный телефон</label>
          <input value={vacancyForm.contact_phone}
            onChange={e => setVacancyForm({...vacancyForm, contact_phone: e.target.value})}
            placeholder="+7 999 000 00 00"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Контактный email</label>
          <input type="email" value={vacancyForm.contact_email}
            onChange={e => setVacancyForm({...vacancyForm, contact_email: e.target.value})}
            placeholder="email@example.com"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
        </div>
        {vacancyError && (
          <div className="sm:col-span-2 flex items-center gap-2 text-red-500 text-sm bg-red-50 rounded-xl px-4 py-2.5">
            <Icon name="AlertCircle" size={15} />{vacancyError}
          </div>
        )}
        <div className="sm:col-span-2 flex gap-3">
          <button type="button" onClick={() => setTab("vacancies")}
            className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors">
            Отмена
          </button>
          <button type="submit" disabled={vacancySaving}
            className="flex-1 bg-yellow-500 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50">
            {vacancySaving ? "Сохранение..." : "Опубликовать"}
          </button>
        </div>
      </form>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-gray-900 text-lg">{isEmployer?"Мои вакансии":"Мои объявления"}</h2>
        <button onClick={()=>setTab("new_vacancy")} className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-yellow-600 transition-colors">
          <Icon name="Plus" size={16}/>Добавить
        </button>
      </div>
      {vacancySuccess && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
          <Icon name="CheckCircle" size={16} className="text-green-500 flex-shrink-0" />
          <span>Объявление опубликовано! Оно появится в общем списке на главной странице.</span>
        </div>
      )}
      {vacancies.length===0 ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
          <Icon name="Inbox" size={40} className="text-gray-200 mx-auto mb-3"/>
          <p className="text-gray-400 text-sm">Объявлений пока нет</p>
          <button onClick={()=>setTab("new_vacancy")} className="mt-4 text-yellow-500 text-sm font-medium hover:text-yellow-600">Создать первое →</button>
        </div>
      ) : vacancies.map(v=>(
        <div key={v.id} className="bg-white rounded-2xl border-2 border-yellow-400 shadow-sm overflow-hidden flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-36 h-32 sm:h-auto flex-shrink-0">
            <img src={getSpecialtyPhoto(v.specialty)} alt={v.specialty} className="w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent sm:bg-gradient-to-r"/>
          </div>
          <div className="flex-1 p-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-gray-900">{v.title}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{v.specialty} · {v.city}</p>
              {(v.salary_from||v.salary_to)&&(
                <p className="text-sm text-yellow-500 font-medium mt-1">
                  {v.salary_from?`от ${v.salary_from.toLocaleString()} ₽`:""}{v.salary_to?` до ${v.salary_to.toLocaleString()} ₽`:""}
                </p>
              )}
              {v.description&&<p className="text-sm text-gray-400 mt-2 line-clamp-2">{v.description}</p>}
            </div>
            <button onClick={()=>deleteVacancy(v.id)} className="text-yellow-300 hover:text-red-400 transition-colors flex-shrink-0">
              <Icon name="Trash2" size={18}/>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
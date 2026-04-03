import Icon from "@/components/ui/icon"
import { Vacancy, api } from "./types"

interface Props {
  vacancies: Vacancy[]
  setVacancies: React.Dispatch<React.SetStateAction<Vacancy[]>>
  search: string
  setSearch: (s: string) => void
  showAll: boolean
  setShowAll: (v: boolean) => void
  doSearch: () => void
}

export default function AdminVacancies({ vacancies, setVacancies, search, setSearch, showAll, setShowAll, doSearch }: Props) {
  const deleteVacancy = async (id: number) => {
    await api("delete_vacancy", { vacancy_id: id })
    setVacancies(prev => prev.map(v => v.id === id ? { ...v, is_active: false } : v))
  }

  const restoreVacancy = async (id: number) => {
    await api("restore_vacancy", { vacancy_id: id })
    setVacancies(prev => prev.map(v => v.id === id ? { ...v, is_active: true } : v))
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
        <button
          onClick={() => setShowAll(!showAll)}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${showAll ? "bg-gray-800 text-white" : "bg-white border border-gray-200 text-gray-600"}`}
        >
          {showAll ? "Все" : "Активные"}
        </button>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-gray-500">{vacancies.length} записей</p>
        {vacancies.length === 0 && <div className="bg-white rounded-2xl p-10 text-center text-gray-400">Нет данных</div>}
        {vacancies.map(v => (
          <div key={v.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${v.is_active ? "border-gray-100" : "border-red-100 opacity-60"}`}>
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-semibold text-gray-900">{v.title}</p>
                    {!v.is_active && <span className="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full">Скрыто</span>}
                  </div>
                  <p className="text-sm text-gray-500">{v.specialty} · {v.city}</p>
                  {(v.salary_from || v.salary_to) && (
                    <p className="text-sm text-yellow-500 font-medium mt-0.5">
                      {v.salary_from ? `от ${v.salary_from.toLocaleString()} ₽` : ""}{v.salary_to ? ` до ${v.salary_to.toLocaleString()} ₽` : ""}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Icon name="User" size={11} />{v.user_name} · {v.user_email}
                    </span>
                    {v.contact_phone && (
                      <a href={`tel:${v.contact_phone}`} className="text-xs text-yellow-500 flex items-center gap-1 hover:underline">
                        <Icon name="Phone" size={11} />{v.contact_phone}
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-400 hidden sm:block">{new Date(v.created_at).toLocaleDateString("ru")}</span>
                  {v.is_active ? (
                    <button onClick={() => deleteVacancy(v.id)} className="text-gray-300 hover:text-red-500 transition-colors" title="Скрыть">
                      <Icon name="EyeOff" size={16} />
                    </button>
                  ) : (
                    <button onClick={() => restoreVacancy(v.id)} className="text-gray-300 hover:text-green-500 transition-colors" title="Восстановить">
                      <Icon name="Eye" size={16} />
                    </button>
                  )}
                </div>
              </div>
              {v.description && <p className="text-xs text-gray-400 mt-2 line-clamp-2">{v.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

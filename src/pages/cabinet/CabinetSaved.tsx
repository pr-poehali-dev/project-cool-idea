import Icon from "@/components/ui/icon"
import { apiUsers } from "@/lib/auth"
import { getSpecialtyPhoto } from "@/lib/specialtyPhotos"
import { SavedContact } from "./types"

interface Props {
  saved: SavedContact[]
  setSaved: React.Dispatch<React.SetStateAction<SavedContact[]>>
  setPayingVacancy: (s: SavedContact | null) => void
}

export default function CabinetSaved({ saved, setSaved, setPayingVacancy }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="font-bold text-gray-900 text-lg">Сохранённые объявления</h2>
      {saved.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
          <Icon name="Bookmark" size={40} className="text-gray-200 mx-auto mb-3"/>
          <p className="text-gray-400 text-sm">Нет сохранённых объявлений</p>
          <a href="/#vacancies" className="mt-4 inline-block text-yellow-500 text-sm font-medium hover:text-yellow-600">Смотреть объявления →</a>
        </div>
      ) : saved.map(s => (
        <div key={s.id} className="bg-white rounded-2xl border-2 border-yellow-400 shadow-sm overflow-hidden flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-36 h-32 sm:h-auto flex-shrink-0">
            <img src={getSpecialtyPhoto(s.specialty)} alt={s.specialty} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent sm:bg-gradient-to-r" />
          </div>
          <div className="flex-1 p-5 flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900">{s.title}</h3>
                {s.paid && <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Оплачено</span>}
              </div>
              <p className="text-sm text-gray-500">{s.specialty} · {s.city}</p>
              {(s.salary_from||s.salary_to) && (
                <p className="text-sm text-yellow-500 font-medium mt-1">
                  {s.salary_from?`от ${s.salary_from.toLocaleString()} ₽`:""}{s.salary_to?` до ${s.salary_to.toLocaleString()} ₽`:""}
                </p>
              )}
              {s.paid ? (
                <div className="flex flex-col gap-1 mt-3 pt-3 border-t border-gray-100">
                  {s.contact_phone && (
                    <a href={`tel:${s.contact_phone}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-yellow-500 transition-colors">
                      <Icon name="Phone" size={14}/>{s.contact_phone}
                    </a>
                  )}
                  {s.contact_email && (
                    <a href={`mailto:${s.contact_email}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-yellow-500 transition-colors">
                      <Icon name="Mail" size={14}/>{s.contact_email}
                    </a>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-3">
                  <Icon name="Lock" size={14} className="text-gray-400"/>
                  <span className="text-sm text-gray-400">Контакты скрыты — </span>
                  <button onClick={() => setPayingVacancy(s)} className="text-sm text-yellow-500 hover:text-yellow-600 font-medium transition-colors">оплатить доступ</button>
                </div>
              )}
            </div>
            <button
              onClick={async () => {
                await apiUsers({ action: "unsave_vacancy", vacancy_id: s.id })
                setSaved(prev => prev.filter(x => x.id !== s.id))
              }}
              className="text-yellow-300 hover:text-red-400 transition-colors flex-shrink-0"
              title="Удалить из избранного"
            >
              <Icon name="BookmarkX" size={18}/>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

import { useState } from "react"
import Icon from "@/components/ui/icon"
import { ContactModal } from "./ContactModal"
import { getSpecialtyPhoto } from "@/lib/specialtyPhotos"
import { VacancyCard as VacancyCardType } from "./vacanciesTypes"

function formatSalary(from: number | null, to: number | null) {
  if (!from && !to) return null
  if (from && to) return `${from.toLocaleString()} – ${to.toLocaleString()} ₽`
  if (from) return `от ${from.toLocaleString()} ₽`
  return `до ${to!.toLocaleString()} ₽`
}

interface VacancyCardProps {
  card: VacancyCardType
  saved: boolean
  saving: boolean
  onToggleSave: (c: VacancyCardType) => void
}

export function VacancyCard({ card: c, saved, saving, onToggleSave }: VacancyCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [contactVacancy, setContactVacancy] = useState<VacancyCardType | null>(null)
  const salary = formatSalary(c.salary_from, c.salary_to)

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-yellow-200 transition-all overflow-hidden">
        <div className="relative h-40 overflow-hidden">
          <img src={getSpecialtyPhoto(c.specialty)} alt={c.specialty}
            className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button
            onClick={() => onToggleSave(c)}
            disabled={saving}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center transition-all"
            title={saved ? "В избранном" : "Добавить в избранное"}
          >
            <Icon
              name="Bookmark"
              size={16}
              className={saved ? "text-yellow-400 fill-yellow-400" : "text-white"}
            />
          </button>
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${c.author_role === "employer" ? "bg-blue-500 text-white" : "bg-green-500 text-white"}`}>
              {c.author_role === "employer" ? "Вакансия" : "Соискатель"}
            </span>
            <span className="text-xs text-white/80">{c.city}</span>
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{c.title}</h3>
          {c.company && <p className="text-sm text-gray-500 mb-2">{c.company}</p>}

          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">{c.specialty}</span>
            {c.schedule && <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">{c.schedule}</span>}
            {c.experience_required && <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">{c.experience_required}</span>}
          </div>

          {salary && (
            <p className="text-yellow-500 font-bold text-sm mb-3">{salary}</p>
          )}

          {c.description && (
            <p className="text-gray-500 text-sm line-clamp-2 mb-3">{c.description}</p>
          )}

          <div className="flex items-center justify-between mt-3">
            <button onClick={() => setExpanded(!expanded)}
              className="text-gray-400 text-sm hover:text-gray-600 transition-colors">
              {expanded ? "Свернуть ↑" : "Подробнее ↓"}
            </button>
            <button onClick={() => setContactVacancy(c)}
              className="flex items-center gap-1.5 bg-yellow-500 text-white text-sm px-4 py-2 rounded-xl font-semibold hover:bg-yellow-600 transition-colors">
              <Icon name="Phone" size={14} />
              Связаться
            </button>
          </div>

          {expanded && c.description && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-gray-600 text-sm">{c.description}</p>
            </div>
          )}
        </div>
      </div>

      <ContactModal
        vacancy={contactVacancy}
        onClose={() => setContactVacancy(null)}
      />
    </>
  )
}

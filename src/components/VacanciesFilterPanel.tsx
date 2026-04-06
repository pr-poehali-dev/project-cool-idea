import Icon from "@/components/ui/icon"
import {
  SPECIALTY_GROUPS, CITIES, EMPLOYMENT_TYPES, QUALIFICATIONS, SALARY_RANGES
} from "./vacanciesTypes"

export interface FilterState {
  filter: string
  city: string
  employment: string
  qualification: string
  salaryRange: string
  openGroup: string | null
  openSections: Record<string, boolean>
}

export interface FilterActions {
  setFilter: (v: string) => void
  setCity: (v: string) => void
  setEmployment: (v: string) => void
  setQualification: (v: string) => void
  setSalaryRange: (v: string) => void
  setOpenGroup: (v: string | null) => void
  toggleSection: (key: string) => void
  resetFilters: () => void
}

interface FilterSectionProps {
  sectionKey: string
  label: string
  active: boolean
  open: boolean
  onToggle: () => void
  children: React.ReactNode
  last?: boolean
}

function FilterSection({ sectionKey: _key, label, active, open, onToggle, children, last }: FilterSectionProps) {
  return (
    <div className={last ? "mb-2" : "mb-2 border-b border-gray-100"}>
      <button onClick={onToggle} className="w-full flex items-center justify-between py-3 text-xs font-semibold text-gray-500 uppercase tracking-widest hover:text-gray-700 transition-colors">
        <span className={active ? "text-yellow-600" : ""}>{label} {active && "·"}</span>
        <Icon name={open ? "ChevronUp" : "ChevronDown"} size={14} className="text-gray-400" />
      </button>
      {open && children}
    </div>
  )
}

interface SpecialtyFilterProps {
  filter: string
  openGroup: string | null
  openSections: Record<string, boolean>
  setFilter: (v: string) => void
  setOpenGroup: (v: string | null) => void
  toggleSection: (key: string) => void
  headerHoverClass?: string
}

export function SpecialtyFilter({ filter, openGroup, openSections, setFilter, setOpenGroup, toggleSection, headerHoverClass = "hover:text-gray-700" }: SpecialtyFilterProps) {
  return (
    <div className="mb-2 border-b border-gray-100">
      <button onClick={() => { toggleSection("specialty"); setOpenGroup(null) }} className={`w-full flex items-center justify-between py-3 text-xs font-semibold text-gray-500 uppercase tracking-widest transition-colors ${headerHoverClass}`}>
        <span className={filter !== "Все" ? "text-yellow-600" : ""}>Профессия {filter !== "Все" && "·"}</span>
        <Icon name={openSections.specialty ? "ChevronUp" : "ChevronDown"} size={14} className="text-gray-400" />
      </button>
      {openSections.specialty && (
        <div className="pb-3 space-y-1">
          <button onClick={() => { setFilter("Все"); setOpenGroup(null) }}
            className={`w-full flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl text-left transition-all ${filter === "Все" ? "bg-yellow-50 text-yellow-700 font-semibold border border-yellow-200" : "text-gray-600 hover:bg-gray-50 border border-transparent"}`}>
            <span className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${filter === "Все" ? "border-yellow-500 bg-yellow-500" : "border-gray-300"}`} />
            Все профессии
          </button>
          {SPECIALTY_GROUPS.filter(g => g.label !== "Все").map(g => {
            const isGroupOpen = openGroup === g.label
            const isActive = g.subs.includes(filter)
            return (
              <div key={g.label}>
                <button onClick={() => setOpenGroup(isGroupOpen ? null : g.label)}
                  className={`w-full flex items-center justify-between text-sm px-3 py-1.5 rounded-xl text-left transition-all ${isActive ? "bg-yellow-50 text-yellow-700 font-semibold border border-yellow-200" : "text-gray-600 hover:bg-gray-50 border border-transparent"}`}>
                  <span className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${isActive ? "border-yellow-500 bg-yellow-500" : "border-gray-300"}`} />
                    {g.label}
                  </span>
                  <Icon name={isGroupOpen ? "ChevronUp" : "ChevronDown"} size={12} className="text-gray-400 flex-shrink-0" />
                </button>
                {isGroupOpen && (
                  <div className="pl-4 space-y-0.5 mt-0.5">
                    {g.subs.map(s => (
                      <button key={s} onClick={() => { setFilter(s); setOpenGroup(null) }}
                        className={`w-full text-xs px-3 py-1.5 rounded-lg text-left transition-all ${filter === s ? "bg-yellow-100 text-yellow-700 font-semibold" : "text-gray-500 hover:bg-gray-50"}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

interface FilterPanelContentProps extends FilterState, FilterActions {}

export function FilterPanelContent({
  filter, city, employment, qualification, salaryRange,
  openGroup, openSections,
  setFilter, setCity, setEmployment, setQualification, setSalaryRange,
  setOpenGroup, toggleSection
}: FilterPanelContentProps) {
  return (
    <>
      <SpecialtyFilter
        filter={filter} openGroup={openGroup} openSections={openSections}
        setFilter={setFilter} setOpenGroup={setOpenGroup} toggleSection={toggleSection}
      />

      <FilterSection sectionKey="city" label="Город" active={!!city} open={openSections.city} onToggle={() => toggleSection("city")}>
        <div className="flex flex-col gap-1 pb-3">
          {CITIES.map(c => (
            <button key={c} onClick={() => setCity(city === c ? "" : c)}
              className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl text-left transition-all ${city === c ? "bg-yellow-50 text-yellow-700 font-semibold border border-yellow-200" : "text-gray-600 hover:bg-gray-50 border border-transparent"}`}>
              <Icon name="MapPin" size={12} className={city === c ? "text-yellow-500" : "text-gray-300"} />
              {c}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection sectionKey="employment" label="Тип занятости" active={!!employment} open={openSections.employment} onToggle={() => toggleSection("employment")}>
        <div className="flex flex-col gap-1 pb-3">
          {EMPLOYMENT_TYPES.map(e => (
            <button key={e} onClick={() => setEmployment(employment === e ? "" : e)}
              className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl text-left transition-all ${employment === e ? "bg-yellow-50 text-yellow-700 font-semibold border border-yellow-200" : "text-gray-600 hover:bg-gray-50 border border-transparent"}`}>
              <span className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${employment === e ? "border-yellow-500 bg-yellow-500" : "border-gray-300"}`} />
              {e}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection sectionKey="qualification" label="Квалификация" active={!!qualification} open={openSections.qualification} onToggle={() => toggleSection("qualification")}>
        <div className="flex flex-col gap-1 pb-3">
          {QUALIFICATIONS.map(q => (
            <button key={q} onClick={() => setQualification(qualification === q ? "" : q)}
              className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl text-left transition-all ${qualification === q ? "bg-yellow-50 text-yellow-700 font-semibold border border-yellow-200" : "text-gray-600 hover:bg-gray-50 border border-transparent"}`}>
              <span className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${qualification === q ? "border-yellow-500 bg-yellow-500" : "border-gray-300"}`} />
              {q}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection sectionKey="salary" label="Зарплата" active={!!salaryRange} open={openSections.salary} onToggle={() => toggleSection("salary")} last>
        <div className="flex flex-col gap-1 pb-3">
          {SALARY_RANGES.map(r => (
            <button key={r} onClick={() => setSalaryRange(salaryRange === r ? "" : r)}
              className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl text-left transition-all ${salaryRange === r ? "bg-yellow-50 text-yellow-700 font-semibold border border-yellow-200" : "text-gray-600 hover:bg-gray-50 border border-transparent"}`}>
              <span className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${salaryRange === r ? "border-yellow-500 bg-yellow-500" : "border-gray-300"}`} />
              {r}
            </button>
          ))}
        </div>
      </FilterSection>
    </>
  )
}

interface VacanciesFilterPanelProps extends FilterState, FilterActions {
  activeFiltersCount: number
  mobileFiltersOpen: boolean
  setMobileFiltersOpen: (v: boolean) => void
}

export function VacanciesFilterPanel({
  activeFiltersCount, mobileFiltersOpen, setMobileFiltersOpen,
  resetFilters,
  ...filterProps
}: VacanciesFilterPanelProps) {
  return (
    <>
      {/* Desktop sidebar — участвует в flex-layout */}
      <aside className="hidden lg:flex lg:flex-col w-56 flex-shrink-0 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex items-center justify-between mb-5">
          <span className="font-semibold text-gray-800 flex items-center gap-2">
            <Icon name="SlidersHorizontal" size={16} className="text-yellow-500" />
            Фильтры
          </span>
          {activeFiltersCount > 0 && (
            <button onClick={resetFilters} className="text-xs text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1">
              <Icon name="X" size={12} />
              Сбросить
            </button>
          )}
        </div>
        <FilterPanelContent {...filterProps} resetFilters={resetFilters} />
      </aside>

      {/* Mobile drawer — fixed, не участвует в layout */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <span className="font-semibold text-gray-800 flex items-center gap-2">
                <Icon name="SlidersHorizontal" size={16} className="text-yellow-500" />
                Фильтры
              </span>
              <button onClick={() => setMobileFiltersOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all">
                <Icon name="X" size={16} className="text-gray-500" />
              </button>
            </div>
            <FilterPanelContent {...filterProps} resetFilters={resetFilters} />
            <button onClick={() => setMobileFiltersOpen(false)}
              className="w-full py-3 bg-yellow-500 text-white rounded-2xl font-semibold text-sm hover:bg-yellow-600 transition-all mt-4">
              Показать результаты
            </button>
          </div>
        </div>
      )}
    </>
  )
}
import { useEffect, useRef, useState } from "react"
import { HighlightedText } from "./HighlightedText"
import Icon from "@/components/ui/icon"

const categories = [
  {
    title: "Строительство",
    description: "Каменщики, штукатуры, сварщики, плиточники, кровельщики, прорабы и другие строительные специальности.",
    icon: "HardHat",
    count: "120+ вакансий",
  },
  {
    title: "Общепит и кухня",
    description: "Повара, шеф-повара, кондитеры, бармены, официанты. Рестораны, кафе, столовые, отели.",
    icon: "ChefHat",
    count: "45+ вакансий",
  },
  {
    title: "Торговля и склад",
    description: "Продавцы, кассиры, кладовщики, товароведы, комплектовщики. Розница и оптовая торговля.",
    icon: "ShoppingBag",
    count: "60+ вакансий",
  },
  {
    title: "Транспорт и логистика",
    description: "Водители всех категорий, курьеры, экспедиторы, диспетчеры, логисты.",
    icon: "Truck",
    count: "35+ вакансий",
  },
  {
    title: "Офис и администрация",
    description: "Бухгалтеры, секретари, HR-менеджеры, юристы, офис-менеджеры, экономисты.",
    icon: "Briefcase",
    count: "28+ вакансий",
  },
  {
    title: "Медицина и здоровье",
    description: "Врачи, медсёстры, фельдшеры, фармацевты, массажисты, санитары.",
    icon: "HeartPulse",
    count: "20+ вакансий",
  },
  {
    title: "Туризм и отели",
    description: "Администраторы отелей, горничные, гиды, аниматоры, менеджеры по туризму.",
    icon: "Hotel",
    count: "40+ вакансий",
  },
  {
    title: "Красота и уход",
    description: "Парикмахеры, мастера маникюра, косметологи, визажисты, мастера эпиляции.",
    icon: "Sparkles",
    count: "18+ вакансий",
  },
  {
    title: "Охрана и безопасность",
    description: "Охранники, сторожа, вахтёры, операторы видеонаблюдения.",
    icon: "Shield",
    count: "22+ вакансии",
  },
  {
    title: "Образование",
    description: "Учителя, воспитатели, тренеры, репетиторы, няни, логопеды, преподаватели.",
    icon: "GraduationCap",
    count: "15+ вакансий",
  },
  {
    title: "IT и технологии",
    description: "Программисты, системные администраторы, 1С-специалисты, операторы ПК.",
    icon: "Monitor",
    count: "12+ вакансий",
  },
  {
    title: "Уборка и клининг",
    description: "Уборщики, дворники, клинеры, горничные. Жилые и коммерческие объекты.",
    icon: "Waves",
    count: "25+ вакансий",
  },
]

export function Expertise() {
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const sectionRef = useRef<HTMLElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"))
          if (entry.isIntersecting) {
            setVisibleItems((prev) => [...new Set([...prev, index])])
          }
        })
      },
      { threshold: 0.15 },
    )
    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <section id="vacancies" ref={sectionRef} className="py-32 md:py-24">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-3xl mb-16">
          <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">Категории вакансий</p>
          <h2 className="text-5xl font-bold leading-[1.15] tracking-tight mb-6 text-balance lg:text-7xl">
            <HighlightedText>Специальности</HighlightedText> для
            <br />
            любой сферы
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Сотни актуальных вакансий по всем специальностям — от строителей до поваров и бухгалтеров. Обновляется ежедневно.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, index) => (
            <div
              key={cat.title}
              ref={(el) => {
                itemRefs.current[index] = el
              }}
              data-index={index}
              className={`relative p-6 border border-border rounded-2xl hover:border-yellow-400 hover:shadow-lg transition-all duration-500 cursor-pointer group bg-card ${
                visibleItems.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center mb-4 group-hover:bg-yellow-100 transition-colors">
                <Icon name={cat.icon} size={24} fallback="Briefcase" className="text-yellow-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{cat.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{cat.description}</p>
              <span className="text-yellow-500 text-sm font-medium">{cat.count}</span>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            <Icon name="Search" size={18} />
            Смотреть все вакансии
          </a>
        </div>
      </div>
    </section>
  )
}
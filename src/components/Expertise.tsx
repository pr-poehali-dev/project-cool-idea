import { useEffect, useRef, useState } from "react"
import { HighlightedText } from "./HighlightedText"
import Icon from "@/components/ui/icon"

const categories = [
  {
    title: "Сварщики",
    description: "Ручная и автоматическая сварка. Опыт работы с металлоконструкциями, трубопроводами, сварочными роботами.",
    icon: "Flame",
    count: "18 вакансий",
  },
  {
    title: "Плиточники",
    description: "Укладка керамогранита, мозаики, натурального камня. Работа в жилых и коммерческих объектах.",
    icon: "Grid3x3",
    count: "24 вакансии",
  },
  {
    title: "Каменщики",
    description: "Кладка из блоков, кирпича, камня. Работа с газоблоком, керамзитоблоком и натуральным камнем.",
    icon: "Layers",
    count: "15 вакансий",
  },
  {
    title: "Штукатуры",
    description: "Ручная и механическая штукатурка. Гипсовые смеси, цементные составы, финишная отделка.",
    icon: "PaintRoller",
    count: "21 вакансия",
  },
  {
    title: "Разнорабочие",
    description: "Подсобные работы на строительных объектах. Опыт не обязателен, обучение на месте.",
    icon: "HardHat",
    count: "32 вакансии",
  },
  {
    title: "Мастера / Прорабы",
    description: "Управление строительными бригадами, контроль качества, ведение объектов под ключ.",
    icon: "ClipboardList",
    count: "10 вакансий",
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
            строительной сферы
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Более 120 актуальных вакансий по строительным специальностям в Ялте и пригородах. Обновляется ежедневно.
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
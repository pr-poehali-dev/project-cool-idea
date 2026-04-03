import { useEffect, useRef, useState } from "react"
import { HighlightedText } from "./HighlightedText"
import Icon from "@/components/ui/icon"

const benefits = [
  {
    title: "Только проверенные специалисты",
    description: "Все резюме проходят модерацию. Работодатели видят только реальных мастеров с подтверждённым опытом.",
    icon: "ShieldCheck",
  },
  {
    title: "Быстрый подбор — от 1 дня",
    description: "Срочно нужен сварщик или бригада? Наше рекрутинговое агентство закрывает вакансии в течение 24 часов.",
    icon: "Zap",
  },
  {
    title: "Все районы Ялты",
    description: "Вакансии и специалисты со всей Ялты: центр, Массандра, Никита, Ливадия, Форос и пригороды.",
    icon: "MapPin",
  },
  {
    title: "Работа по договору",
    description: "Гарантия безопасной сделки. Все договорённости фиксируются официально с гарантией замены специалиста.",
    icon: "FileText",
  },
]

export function Philosophy() {
  const [visibleItems, setVisibleItems] = useState<number[]>([])
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
      { threshold: 0.3 },
    )
    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <section id="benefits" className="py-32 md:py-24 bg-secondary/40">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">Почему мы</p>
            <h2 className="text-5xl md:text-5xl font-bold leading-[1.15] tracking-tight mb-6 text-balance lg:text-7xl">
              Работа Ялта —
              <br />
              <HighlightedText>ваш надёжный</HighlightedText>
              <br />
              партнёр
            </h2>

            <div className="relative hidden lg:block mt-8">
              <img
                src="/images/exterior.png"
                alt="Строительство в Ялте"
                className="opacity-80 relative z-10 w-full rounded-2xl object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl z-20" />
            </div>
          </div>

          <div className="space-y-6 lg:pt-16">
            <p className="text-muted-foreground text-lg leading-relaxed max-w-md mb-10">
              Более 3 лет мы объединяем строительных специалистов и работодателей Ялты. Тысячи успешных трудоустройств — наш главный результат.
            </p>

            {benefits.map((item, index) => (
              <div
                key={item.title}
                ref={(el) => {
                  itemRefs.current[index] = el
                }}
                data-index={index}
                className={`transition-all duration-700 ${
                  visibleItems.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex gap-5 p-5 rounded-2xl bg-card border border-border hover:border-orange-300 hover:shadow-md transition-all duration-300">
                  <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <Icon name={item.icon} size={22} fallback="Star" className="text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

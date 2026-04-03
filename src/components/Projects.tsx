import { useState, useEffect, useRef } from "react"
import Icon from "@/components/ui/icon"
import { HighlightedText } from "./HighlightedText"

const services = [
  {
    id: 1,
    title: "Подбор рабочих",
    description: "Формируем бригады любого состава: сварщики, каменщики, штукатуры, плиточники, разнорабочие.",
    image: "/images/hously-1.png",
    tag: "Рекрутинг",
    time: "от 1 дня",
  },
  {
    id: 2,
    title: "Мастера и прорабы",
    description: "Подбираем опытных руководителей строительства, которые организуют и контролируют весь процесс.",
    image: "/images/hously-2.png",
    tag: "Управление",
    time: "от 2 дней",
  },
  {
    id: 3,
    title: "Комплектация бригад",
    description: "Собираем комплексные бригады под ключ для отделки, строительства, ремонта любой сложности.",
    image: "/images/hously-3.png",
    tag: "Бригады",
    time: "от 3 дней",
  },
]

export function Projects() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [revealedImages, setRevealedImages] = useState<Set<number>>(new Set())
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = imageRefs.current.indexOf(entry.target as HTMLDivElement)
            if (index !== -1) {
              setRevealedImages((prev) => new Set(prev).add(services[index].id))
            }
          }
        })
      },
      { threshold: 0.2 },
    )
    imageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <section id="agency" className="py-32 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">Рекрутинговое агентство</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
              <HighlightedText>Подберём</HighlightedText> специалистов
              <br />
              быстро и надёжно
            </h2>
          </div>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-sm text-yellow-500 hover:text-yellow-600 transition-colors group font-semibold"
          >
            Оставить заявку
            <Icon name="ArrowUpRight" size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <article
              key={service.id}
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredId(service.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div ref={(el) => (imageRefs.current[index] = el)} className="relative overflow-hidden aspect-[4/3] mb-5 rounded-2xl">
                <img
                  src={service.image || "/placeholder.svg"}
                  alt={service.title}
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    hoveredId === service.id ? "scale-105" : "scale-100"
                  }`}
                />
                <div
                  className="absolute inset-0 bg-primary origin-top"
                  style={{
                    transform: revealedImages.has(service.id) ? "scaleY(0)" : "scaleY(1)",
                    transition: "transform 1.5s cubic-bezier(0.76, 0, 0.24, 1)",
                  }}
                />
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-yellow-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    {service.tag}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-primary text-xs font-medium px-3 py-1.5 rounded-full">
                  <Icon name="Clock" size={12} />
                  {service.time}
                </div>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-yellow-500 transition-colors">{service.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
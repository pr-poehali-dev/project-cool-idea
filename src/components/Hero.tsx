import { useEffect, useRef, useState } from "react"
import Icon from "@/components/ui/icon"

export function Hero() {
  const contentRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [animationComplete, setAnimationComplete] = useState(false)
  const accumulatedScrollRef = useRef(0)
  const touchStartY = useRef<number>(0)
  const lastTouchY = useRef<number>(0)

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const atTopOfPage = window.scrollY === 0
      if (atTopOfPage && !animationComplete) {
        e.preventDefault()
        accumulatedScrollRef.current = Math.max(0, Math.min(700, accumulatedScrollRef.current + e.deltaY))
        const newProgress = Math.max(0, Math.min(1, accumulatedScrollRef.current / 700))
        setAnimationProgress(newProgress)
        if (newProgress >= 1) setAnimationComplete(true)
        if (contentRef.current) {
          const translateY = newProgress * 200
          const rotationX = newProgress * 45
          const scale = 1 - newProgress * 0.3
          contentRef.current.style.transform = `translateY(${translateY}px) rotateX(${rotationX}deg) scale(${scale})`
        }
      } else if (atTopOfPage && animationComplete && e.deltaY < 0) {
        e.preventDefault()
        accumulatedScrollRef.current = Math.max(0, Math.min(700, accumulatedScrollRef.current + e.deltaY))
        const newProgress = Math.max(0, Math.min(1, accumulatedScrollRef.current / 700))
        setAnimationProgress(newProgress)
        if (newProgress < 1) setAnimationComplete(false)
        if (contentRef.current) {
          const translateY = newProgress * 200
          const rotationX = newProgress * 45
          const scale = 1 - newProgress * 0.3
          contentRef.current.style.transform = `translateY(${translateY}px) rotateX(${rotationX}deg) scale(${scale})`
        }
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
      lastTouchY.current = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      const atTopOfPage = window.scrollY === 0
      const currentTouchY = e.touches[0].clientY
      const deltaY = lastTouchY.current - currentTouchY
      if (atTopOfPage && !animationComplete) {
        e.preventDefault()
        accumulatedScrollRef.current = Math.max(0, Math.min(700, accumulatedScrollRef.current + deltaY * 3))
        const newProgress = Math.max(0, Math.min(1, accumulatedScrollRef.current / 700))
        setAnimationProgress(newProgress)
        if (newProgress >= 1) setAnimationComplete(true)
        if (contentRef.current) {
          const translateY = newProgress * 200
          const rotationX = newProgress * 45
          const scale = 1 - newProgress * 0.3
          contentRef.current.style.transform = `translateY(${translateY}px) rotateX(${rotationX}deg) scale(${scale})`
        }
      } else if (atTopOfPage && animationComplete && deltaY < 0) {
        e.preventDefault()
        accumulatedScrollRef.current = Math.max(0, Math.min(700, accumulatedScrollRef.current + deltaY * 3))
        const newProgress = Math.max(0, Math.min(1, accumulatedScrollRef.current / 700))
        setAnimationProgress(newProgress)
        if (newProgress < 1) setAnimationComplete(false)
        if (contentRef.current) {
          const translateY = newProgress * 200
          const rotationX = newProgress * 45
          const scale = 1 - newProgress * 0.3
          contentRef.current.style.transform = `translateY(${translateY}px) rotateX(${rotationX}deg) scale(${scale})`
        }
      }
      lastTouchY.current = currentTouchY
    }

    window.addEventListener("wheel", handleWheel, { passive: false })
    window.addEventListener("touchstart", handleTouchStart, { passive: false })
    window.addEventListener("touchmove", handleTouchMove, { passive: false })
    return () => {
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
    }
  }, [animationComplete])

  return (
    <section id="hero" ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hously-background.png"
          alt="Строительство в Ялте"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-primary/70" />
      </div>

      <div
        ref={contentRef}
        className="container mx-auto px-6 md:px-12 lg:pt-0 relative z-10 pb-0 pl-4 pr-4 pt-8 md:pt-0"
        style={{
          willChange: "transform",
          transform: "translateY(0px)",
          perspective: "1000px",
          transformStyle: "preserve-3d",
        }}
      >
        <div className="mb-20 md:mb-32 text-center">
          <p className="text-sm tracking-[0.3em] uppercase text-center text-orange-300 mb-4">
            г. Ялта и пригороды · Строительные специальности
          </p>

          <h1 className="text-5xl font-bold text-white mb-6 tracking-tight leading-[1.1] lg:text-7xl">
            Найдите работу
            <br />
            <span className="text-orange-400">в строительстве</span>
          </h1>

          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Портал трудоустройства для строительных специалистов Ялты. Сварщики, каменщики, штукатуры, плиточники — находите вакансии и работодателей быстро.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href="#vacancies"
              className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white px-8 py-4 text-base font-semibold hover:bg-orange-600 transition-colors duration-300 rounded-xl"
            >
              <Icon name="Search" size={20} />
              Найти работу
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white px-8 py-4 text-base font-semibold hover:bg-white/10 transition-colors duration-300 rounded-xl"
            >
              <Icon name="Briefcase" size={20} />
              Разместить вакансию
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-white/70 text-sm">
            <span className="flex items-center gap-2">
              <Icon name="Users" size={16} />
              500+ специалистов
            </span>
            <span className="flex items-center gap-2">
              <Icon name="Building2" size={16} />
              120+ вакансий
            </span>
            <span className="flex items-center gap-2">
              <Icon name="MapPin" size={16} />
              Ялта и пригороды
            </span>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 z-20 pointer-events-none">
        <img
          src="/images/hously-foreground.png"
          alt=""
          className="w-full h-full object-cover object-center opacity-20"
        />
      </div>

      {animationComplete && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce z-30">
          <Icon name="ChevronDown" size={24} fallback="ArrowDown" />
        </div>
      )}
    </section>
  )
}

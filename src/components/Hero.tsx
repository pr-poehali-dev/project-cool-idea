import Icon from "@/components/ui/icon"

interface HeroProps {
  onOpenModal: () => void
}

export function Hero({ onOpenModal }: HeroProps) {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/062770a3-2064-425c-91c2-43c1e8b6add4.jpg"
          alt="Строители и спецтехника на объекте в Ялте"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-primary/65" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 text-center py-32">
        <p className="text-sm tracking-[0.3em] uppercase text-yellow-300 mb-4">
          г. Ялта и пригороды · Строительные специальности
        </p>

        <h1 className="text-5xl font-bold text-white mb-6 tracking-tight leading-[1.1] lg:text-7xl">
          Найдите работу
          <br />
          <span className="text-yellow-400">в строительстве</span>
        </h1>

        <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Портал трудоустройства для строительных специалистов Ялты. Сварщики, каменщики, штукатуры, плиточники — находите вакансии и работодателей быстро.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <a
            href="#vacancies"
            className="inline-flex items-center justify-center gap-2 bg-yellow-500 text-white px-8 py-4 text-base font-semibold hover:bg-yellow-600 transition-colors duration-300 rounded-xl"
          >
            <Icon name="Search" size={20} />
            Найти работу
          </a>
          <button
            onClick={onOpenModal}
            className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white px-8 py-4 text-base font-semibold hover:bg-white/10 transition-colors duration-300 rounded-xl"
          >
            <Icon name="Briefcase" size={20} />
            Разместить вакансию
          </button>
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
    </section>
  )
}
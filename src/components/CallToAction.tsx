import Icon from "@/components/ui/icon"
import { HighlightedText } from "./HighlightedText"

export function CallToAction() {
  return (
    <section id="contact" className="py-32 md:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-primary-foreground/60 text-sm tracking-[0.3em] uppercase mb-8">Начните прямо сейчас</p>

          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-8 text-balance">
            Найдите работу или
            <br />
            специалиста в <HighlightedText>Ялте</HighlightedText>
          </h2>

          <p className="text-primary-foreground/70 text-lg md:text-xl leading-relaxed mb-12 max-w-2xl mx-auto">
            Портал трудоустройства для строительной сферы. Более 500 специалистов и 120 вакансий в Ялте и пригородах.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a
              href="mailto:help@ug-transfer.com"
              className="inline-flex items-center justify-center gap-3 bg-orange-500 text-white px-8 py-4 text-sm font-semibold hover:bg-orange-600 transition-colors duration-300 rounded-xl group"
            >
              <Icon name="Search" size={18} />
              Найти работу бесплатно
            </a>
            <a
              href="tel:+79956141414"
              className="inline-flex items-center justify-center gap-2 border border-primary-foreground/30 px-8 py-4 text-sm font-semibold hover:bg-primary-foreground/10 transition-colors duration-300 rounded-xl"
            >
              <Icon name="Phone" size={18} />
              +7 (995) 614-14-14
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-primary-foreground/20 pt-12">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Icon name="Mail" size={22} className="text-orange-400" />
              </div>
              <p className="text-primary-foreground/60 text-xs uppercase tracking-widest">Email</p>
              <a href="mailto:help@ug-transfer.com" className="text-sm hover:text-orange-400 transition-colors">
                help@ug-transfer.com
              </a>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Icon name="MessageCircle" size={22} className="text-orange-400" />
              </div>
              <p className="text-primary-foreground/60 text-xs uppercase tracking-widest">Мессенджеры</p>
              <div className="flex gap-4 text-sm">
                <a href="#" className="hover:text-orange-400 transition-colors">WhatsApp</a>
                <a href="#" className="hover:text-orange-400 transition-colors">Telegram</a>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Icon name="MapPin" size={22} className="text-orange-400" />
              </div>
              <p className="text-primary-foreground/60 text-xs uppercase tracking-widest">География</p>
              <p className="text-sm text-center">г. Ялта и пригороды,<br />Республика Крым</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

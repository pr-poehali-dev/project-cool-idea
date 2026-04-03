export function Footer() {
  return (
    <footer className="py-16 md:py-20 border-t border-border">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <a href="/" className="inline-block mb-6">
              <span className="text-2xl font-bold tracking-tight">
                Работа<span className="text-yellow-500">Ялта</span>
              </span>
            </a>
            <p className="text-muted-foreground leading-relaxed max-w-sm text-sm">
              Портал трудоустройства для строительных специалистов. Соединяем рабочих и работодателей Ялты и пригородов.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Навигация</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="#vacancies" className="hover:text-foreground hover:text-yellow-500 transition-colors">
                  Вакансии
                </a>
              </li>
              <li>
                <a href="#agency" className="hover:text-foreground hover:text-yellow-500 transition-colors">
                  Агентство
                </a>
              </li>
              <li>
                <a href="#benefits" className="hover:text-foreground hover:text-yellow-500 transition-colors">
                  Преимущества
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-foreground hover:text-yellow-500 transition-colors">
                  Вопросы и ответы
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-foreground hover:text-yellow-500 transition-colors">
                  Контакты
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Контакты</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="mailto:help@ug-transfer.com" className="hover:text-yellow-500 transition-colors">
                  help@ug-transfer.com
                </a>
              </li>
              <li>
                <a href="tel:+79956141414" className="hover:text-yellow-500 transition-colors">
                  +7 (995) 614-14-14
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-500 transition-colors">
                  Telegram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-500 transition-colors">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2026 Работа Ялта. Все права защищены.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">
              Политика конфиденциальности
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Пользовательское соглашение
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
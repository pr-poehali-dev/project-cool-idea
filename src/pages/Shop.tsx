import Icon from "@/components/ui/icon"

const PHONE = "+7 995 614-14-14"
const PHONE_HREF = "tel:+79956141414"
const TG_HREF = "https://t.me/ug_transfer_online"

const categories = [
  {
    id: "windows",
    title: "Окна",
    description: "Металлопластиковые и алюминиевые окна любых размеров и конфигураций. Замер, изготовление, установка под ключ. Энергосберегающие стеклопакеты, защита от шума и холода.",
    image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/ccf4d456-a007-41bb-9bb9-da58fab29012.jpg",
    icon: "Square",
    features: ["Замер бесплатно", "Изготовление от 3 дней", "Гарантия 5 лет", "Установка под ключ"],
  },
  {
    id: "doors",
    title: "Двери",
    description: "Входные и межкомнатные двери — металлические, деревянные, МДФ. Широкий выбор дизайнов и отделок. Надёжная фурнитура, шумоизоляция, противовзломная защита.",
    image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/6886e9d2-f7b4-493d-9fa4-b2b47929eac1.jpg",
    icon: "DoorOpen",
    features: ["Входные и межкомнатные", "Замер и установка", "Противовзломная защита", "Большой выбор отделок"],
  },
  {
    id: "fence",
    title: "3D Забор",
    description: "Секционный 3D-забор из сварной сетки — надёжное и современное ограждение для дома, дачи, предприятия. Устойчив к коррозии, не требует обслуживания, монтаж за 1 день.",
    image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/77c596b3-fc18-4b75-998b-027c96d1a9f9.jpg",
    icon: "LayoutGrid",
    features: ["Оцинкованное покрытие", "Монтаж за 1 день", "Любая длина периметра", "Срок службы 25+ лет"],
  },
  {
    id: "mixtures",
    title: "Сыпучие смеси",
    description: "Цемент, песок, щебень, керамзит, перлит, гипс, штукатурные и кладочные смеси. Доставка по Ялте и пригородам. Опт и розница, любые объёмы.",
    image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/fa66f7fe-5ac7-4c9a-bdce-2d7c339ae98f.jpg",
    icon: "Package",
    features: ["Цемент, песок, щебень", "Доставка по Ялте", "Опт и розница", "Расчёт количества бесплатно"],
  },
  {
    id: "concrete",
    title: "Бетон",
    description: "Товарный бетон всех марок — М100, М200, М300, М350, М400. Доставка миксером по Ялте и Крыму. Выгрузка на объект, документы качества. Срочные заявки — в течение 2 часов.",
    image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/b72f141b-f667-4dcc-a78d-1766a6332139.jpg",
    icon: "Layers",
    features: ["Марки М100–М400", "Доставка миксером", "Документы качества", "Срочно — за 2 часа"],
  },
]

export default function Shop() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Шапка */}
      <header className="bg-primary py-4 px-6 flex items-center justify-between sticky top-0 z-50">
        <a href="/" className="text-white font-bold text-xl tracking-tight">
          Работа-<span className="text-yellow-400">Ялта</span>
        </a>
        <div className="flex items-center gap-3">
          <a
            href={PHONE_HREF}
            className="hidden sm:flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors"
          >
            <Icon name="Phone" size={15} />
            {PHONE}
          </a>
          <a
            href={TG_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <Icon name="Send" size={15} />
            Написать
          </a>
        </div>
      </header>

      {/* Герой */}
      <section className="bg-primary text-white py-16 px-6 text-center">
        <p className="text-yellow-400 text-sm tracking-[0.3em] uppercase mb-3">Строительные материалы · Ялта</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Наш магазин</h1>
        <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
          Окна, двери, заборы, сыпучие смеси и бетон с доставкой по Ялте и Крыму
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={PHONE_HREF}
            className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <Icon name="Phone" size={18} />
            Позвонить
          </a>
          <a
            href={TG_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <Icon name="Send" size={18} />
            Написать в Telegram
          </a>
        </div>
      </section>

      {/* Быстрая навигация по разделам */}
      <div className="bg-white border-b border-gray-100 sticky top-[64px] z-40">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-primary hover:bg-yellow-50 transition-colors"
              >
                <Icon name={cat.icon as "Square"} size={15} />
                {cat.title}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Разделы каталога */}
      <main className="container mx-auto px-4 max-w-5xl py-12 space-y-20">
        {categories.map((cat, i) => (
          <section key={cat.id} id={cat.id} className="scroll-mt-32">
            <div className={`flex flex-col ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-8 lg:gap-12 items-center`}>
              {/* Фото */}
              <div className="w-full lg:w-1/2 flex-shrink-0">
                <div className="rounded-2xl overflow-hidden shadow-lg aspect-[4/3]">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Контент */}
              <div className="w-full lg:w-1/2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                    <Icon name={cat.icon as "Square"} size={20} className="text-yellow-500" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">{cat.title}</h2>
                </div>

                <p className="text-gray-600 text-lg leading-relaxed mb-6">{cat.description}</p>

                <ul className="grid grid-cols-2 gap-2 mb-8">
                  {cat.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                      <Icon name="CheckCircle" size={16} className="text-yellow-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={PHONE_HREF}
                    className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-5 py-3 rounded-xl transition-colors text-sm"
                  >
                    <Icon name="Phone" size={16} />
                    Позвонить
                  </a>
                  <a
                    href={TG_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-5 py-3 rounded-xl transition-colors text-sm"
                  >
                    <Icon name="Send" size={16} />
                    Написать в Telegram
                  </a>
                </div>
              </div>
            </div>
          </section>
        ))}
      </main>

      {/* Нижняя плашка с контактами */}
      <section className="bg-primary text-white py-12 px-6 text-center mt-8">
        <h2 className="text-2xl font-bold mb-2">Остались вопросы?</h2>
        <p className="text-white/70 mb-6">Свяжитесь с нами любым удобным способом</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={PHONE_HREF}
            className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Icon name="Phone" size={18} />
            {PHONE}
          </a>
          <a
            href={TG_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            <Icon name="Send" size={18} />
            Telegram
          </a>
        </div>
      </section>
    </div>
  )
}

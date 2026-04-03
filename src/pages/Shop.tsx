import Icon from "@/components/ui/icon"

const PHONE = "+7 995 614-14-14"
const PHONE_HREF = "tel:+79956141414"
const TG_HREF = "https://t.me/ug_transfer_online"

const categories = [
  {
    id: "windows",
    slug: "windows",
    title: "Окна",
    description: "Металлопластиковые и алюминиевые окна любых размеров. Замер, изготовление, установка под ключ.",
    image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/ccf4d456-a007-41bb-9bb9-da58fab29012.jpg",
    icon: "Square",
    features: ["Замер бесплатно", "Изготовление от 3 дней", "Гарантия 5 лет", "Установка под ключ"],
    badge: "Популярное",
  },
  {
    id: "doors",
    slug: "doors",
    title: "Двери",
    description: "Входные и межкомнатные двери — металлические, деревянные, МДФ. Широкий выбор дизайнов.",
    image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/6886e9d2-f7b4-493d-9fa4-b2b47929eac1.jpg",
    icon: "DoorOpen",
    features: ["Входные и межкомнатные", "Замер и установка", "Противовзломная защита", "Большой выбор отделок"],
    badge: null,
  },
  {
    id: "fence",
    slug: "fence",
    title: "3D Забор",
    description: "Секционный 3D-забор из сварной сетки. Надёжное современное ограждение, монтаж за 1 день.",
    image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/77c596b3-fc18-4b75-998b-027c96d1a9f9.jpg",
    icon: "LayoutGrid",
    features: ["Оцинкованное покрытие", "Монтаж за 1 день", "Любая длина", "Срок службы 25+ лет"],
    badge: null,
  },
  {
    id: "mixtures",
    slug: "mixtures",
    title: "Сыпучие смеси",
    description: "Цемент, песок, щебень, керамзит, штукатурные и кладочные смеси. Доставка по Ялте.",
    image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/fa66f7fe-5ac7-4c9a-bdce-2d7c339ae98f.jpg",
    icon: "Package",
    features: ["Цемент, песок, щебень", "Доставка по Ялте", "Опт и розница", "Расчёт бесплатно"],
    badge: null,
  },
  {
    id: "concrete",
    slug: "concrete",
    title: "Бетон",
    description: "Товарный бетон всех марок М100–М400. Доставка миксером, документы качества.",
    image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/b72f141b-f667-4dcc-a78d-1766a6332139.jpg",
    icon: "Layers",
    features: ["Марки М100–М400", "Доставка миксером", "Документы качества", "Срочно — за 2 часа"],
    badge: "Срочная доставка",
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
          <a href={PHONE_HREF} className="hidden sm:flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors">
            <Icon name="Phone" size={15} />
            {PHONE}
          </a>
          <a href={TG_HREF} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            <Icon name="Send" size={15} />
            Написать
          </a>
        </div>
      </header>

      {/* Герой */}
      <section className="bg-primary text-white py-12 px-6 text-center">
        <p className="text-yellow-400 text-sm tracking-[0.3em] uppercase mb-2">Строительные материалы · Ялта</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">Наш магазин</h1>
        <p className="text-white/70 text-lg max-w-xl mx-auto">
          Окна, двери, заборы, сыпучие смеси и бетон с доставкой по Ялте и Крыму
        </p>
      </section>

      {/* Каталог — карточки */}
      <main className="container mx-auto px-4 max-w-5xl py-10">
        <div className="grid gap-5">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row">
                {/* Фото */}
                <div className="sm:w-64 md:w-72 flex-shrink-0 h-52 sm:h-auto relative overflow-hidden">
                  {cat.badge && (
                    <span className="absolute top-3 left-3 z-10 bg-yellow-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      {cat.badge}
                    </span>
                  )}
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Контент */}
                <div className="flex flex-col justify-between p-5 flex-1">
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                        <Icon name={cat.icon as "Square"} size={16} className="text-yellow-500" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">{cat.title}</h2>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{cat.description}</p>
                    <ul className="grid grid-cols-2 gap-1.5 mb-5">
                      {cat.features.map((f) => (
                        <li key={f} className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Icon name="CheckCircle" size={13} className="text-yellow-500 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <a href={`/shop/${cat.slug}`}
                      className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm">
                      <Icon name="ArrowRight" size={15} />
                      Подробнее
                    </a>
                    <a href={PHONE_HREF}
                      className="inline-flex items-center gap-1.5 border border-gray-200 hover:border-gray-300 text-gray-700 font-medium px-4 py-2.5 rounded-xl transition-colors text-sm">
                      <Icon name="Phone" size={15} />
                      Позвонить
                    </a>
                    <a href={TG_HREF} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm">
                      <Icon name="Send" size={15} />
                      Telegram
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Нижняя плашка */}
      <section className="bg-primary text-white py-10 px-6 text-center mt-4">
        <h2 className="text-2xl font-bold mb-2">Остались вопросы?</h2>
        <p className="text-white/70 mb-5">Свяжитесь с нами любым удобным способом</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href={PHONE_HREF}
            className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors">
            <Icon name="Phone" size={18} />
            {PHONE}
          </a>
          <a href={TG_HREF} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-6 py-3 rounded-xl transition-colors">
            <Icon name="Send" size={18} />
            Telegram
          </a>
        </div>
      </section>
    </div>
  )
}

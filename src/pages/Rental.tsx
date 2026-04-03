import Icon from "@/components/ui/icon"

const PHONE = "+7 995 614-14-14"
const PHONE_HREF = "tel:+79956141414"
const TG_HREF = "https://t.me/ug_transfer_online"

const categories = [
  { id: "excavation", label: "Земляные работы" },
  { id: "lifting", label: "Подъёмная техника" },
  { id: "transport", label: "Транспорт" },
  { id: "road", label: "Дорожная техника" },
]

const machines = [
  {
    category: "excavation",
    title: "Экскаватор",
    description: "Гусеничный и колёсный экскаватор для рытья котлованов, траншей, вывоза грунта. Ковш 0,5–1,2 м³.",
    price: "от 2 500 ₽/час",
    image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/123ac92d-0063-4d82-a5ab-731f4e1e31fd.jpg",
    tags: ["Популярное"],
    specs: ["Глубина копания до 6 м", "Ковш 0,5–1,2 м³", "С оператором"],
  },
  {
    category: "excavation",
    title: "Мини-экскаватор",
    description: "Компактный экскаватор для работ в ограниченном пространстве, подвалах, узких дворах, коммуникациях.",
    price: "от 1 800 ₽/час",
    image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/20353558-d4d1-4617-8819-b3e2b407ae92.jpg",
    tags: [],
    specs: ["Вес до 3 т", "Ширина 1,5 м", "Подходит для подвалов"],
  },
  {
    category: "excavation",
    title: "Бульдозер",
    description: "Бульдозер для планировки участков, срезки грунта, рекультивации, расчистки территорий.",
    price: "от 3 000 ₽/час",
    image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/92c04407-9b2b-4e5b-88f7-daa0302adf11.jpg",
    tags: [],
    specs: ["Отвал 3–4 м", "Мощность 130–200 л.с.", "Планировка и срезка"],
  },
  {
    category: "excavation",
    title: "Фронтальный погрузчик",
    description: "Погрузка и перемещение сыпучих материалов — грунт, песок, щебень, снег. Быстро и эффективно.",
    price: "от 2 200 ₽/час",
    image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/aaed7e9f-3786-4934-9202-5c3c286e2b00.jpg",
    tags: [],
    specs: ["Ковш 1,5–3 м³", "Высота разгрузки до 4 м", "Погрузка и перемещение"],
  },
  {
    category: "transport",
    title: "Самосвал",
    description: "Вывоз грунта, строительного мусора, доставка сыпучих материалов. Грузоподъёмность 10–25 тонн.",
    price: "от 1 500 ₽/час",
    image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/8a181d1a-d2d1-41b3-86c3-3bb3bbe27dce.jpg",
    tags: ["Популярное"],
    specs: ["Грузоподъёмность 10–25 т", "Кузов 8–15 м³", "Вывоз и доставка"],
  },
  {
    category: "transport",
    title: "Трал (тягач с платформой)",
    description: "Перевозка тяжёлой спецтехники — экскаваторов, бульдозеров, кранов. Негабаритные грузы.",
    price: "от 4 000 ₽/рейс",
    image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/a300238c-b809-4616-9674-f6c1f3e0be41.jpg",
    tags: [],
    specs: ["Нагрузка до 60 т", "Платформа 13 м", "Негабарит"],
  },
  {
    category: "lifting",
    title: "Автокран",
    description: "Подъём и монтаж конструкций, плит перекрытий, оборудования. Грузоподъёмность 25–100 тонн.",
    price: "от 3 500 ₽/час",
    image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/6ec75a37-bc29-4001-aae9-0d48ec61d82d.jpg",
    tags: [],
    specs: ["Грузоподъёмность 25–100 т", "Стрела до 40 м", "С оператором"],
  },
  {
    category: "lifting",
    title: "Автовышка",
    description: "Работы на высоте — монтаж, покраска, обрезка деревьев, ремонт фасадов. Высота до 28 м.",
    price: "от 2 000 ₽/час",
    image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/6a71938d-9550-4454-bfbf-b133d053a200.jpg",
    tags: [],
    specs: ["Высота подъёма до 28 м", "Люлька 2 чел.", "Аутригеры"],
  },
  {
    category: "lifting",
    title: "Бетононасос",
    description: "Подача бетона на высоту и расстояние до 50 м. Незаменим при заливке перекрытий и фундаментов.",
    price: "от 5 000 ₽/смена",
    image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/4c4e652b-960a-4c2c-81d7-9e7c045de880.jpg",
    tags: [],
    specs: ["Стрела до 36 м", "Производительность 80 м³/ч", "С оператором"],
  },
  {
    category: "road",
    title: "Грейдер",
    description: "Планировка и профилирование дорог, стройплощадок, территорий. Точное выравнивание поверхности.",
    price: "от 3 200 ₽/час",
    image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/91a0ecca-ef16-479f-a0b0-c56d327d4fd1.jpg",
    tags: [],
    specs: ["Отвал 3,7 м", "Точность ±5 см", "Профилирование"],
  },
  {
    category: "road",
    title: "Каток (виброплита)",
    description: "Уплотнение грунта, щебня, асфальта. Статический и вибрационный режим. Арендуем от 1 смены.",
    price: "от 1 800 ₽/час",
    image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/410e021d-4e90-4dc9-ba0c-94cced4636fc.jpg",
    tags: [],
    specs: ["Ширина 1–2 м", "Виброрежим", "Грунт и асфальт"],
  },
  {
    category: "road",
    title: "Асфальтоукладчик",
    description: "Укладка асфальтобетонного покрытия. Ширина укладки 2,5–6 м. Для дорог, парковок, площадок.",
    price: "от 6 000 ₽/смена",
    image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/d359f900-645d-4f5a-904e-e4cc5295de65.jpg",
    tags: [],
    specs: ["Ширина 2,5–6 м", "Толщина слоя до 30 см", "С оператором"],
  },
]

export default function Rental() {
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
        <p className="text-yellow-400 text-sm tracking-[0.3em] uppercase mb-2">Ялта и Крым · Работаем без выходных</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">Аренда спецтехники</h1>
        <p className="text-white/70 text-lg max-w-xl mx-auto mb-6">
          Экскаваторы, самосвалы, краны, бульдозеры и другая техника для строительства и вывоза грунта
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href={PHONE_HREF}
            className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            <Icon name="Phone" size={18} />
            Позвонить
          </a>
          <a href={TG_HREF} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            <Icon name="Send" size={18} />
            Написать в Telegram
          </a>
        </div>
      </section>

      {/* Преимущества */}
      <div className="bg-white border-b border-gray-100 py-4 px-4">
        <div className="container mx-auto max-w-5xl flex flex-wrap gap-5 justify-center">
          {[
            ["Truck", "Техника с оператором"],
            ["Clock", "Аренда от 1 часа"],
            ["MapPin", "По всей Ялте и Крыму"],
            ["Shield", "Страховка включена"],
            ["Zap", "Выезд за 2 часа"],
          ].map(([icon, text]) => (
            <div key={text} className="flex items-center gap-1.5 text-sm text-gray-700">
              <Icon name={icon as "Truck"} size={15} className="text-yellow-500" />
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Каталог по категориям */}
      <main className="container mx-auto px-4 max-w-5xl py-10 space-y-12">
        {categories.map((cat) => {
          const catMachines = machines.filter((m) => m.category === cat.id)
          return (
            <section key={cat.id} id={cat.id}>
              <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span className="w-1 h-7 bg-yellow-500 rounded-full inline-block" />
                {cat.label}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {catMachines.map((m) => (
                  <div key={m.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                    <div className="h-48 overflow-hidden relative">
                      <img src={m.image} alt={m.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                      {m.tags.map((tag) => (
                        <span key={tag} className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">{tag}</span>
                      ))}
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{m.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-3 flex-1">{m.description}</p>
                      <ul className="space-y-1 mb-4">
                        {m.specs.map((s) => (
                          <li key={s} className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Icon name="CheckCircle" size={12} className="text-yellow-500 flex-shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                      <p className="text-primary font-bold text-base mb-3">{m.price}</p>
                      <div className="flex gap-2">
                        <a href={PHONE_HREF}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 border border-gray-200 hover:border-primary text-gray-700 hover:text-primary font-medium py-2 rounded-xl transition-colors text-sm">
                          <Icon name="Phone" size={14} />
                          Позвонить
                        </a>
                        <a href={TG_HREF} target="_blank" rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-xl transition-colors text-sm">
                          <Icon name="Send" size={14} />
                          Telegram
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </main>

      {/* Нижняя плашка */}
      <section className="bg-primary text-white py-10 px-6 text-center mt-4">
        <h2 className="text-2xl font-bold mb-2">Нужна техника срочно?</h2>
        <p className="text-white/70 mb-5">Выезд в течение 2 часов по заявке. Работаем без выходных.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href={PHONE_HREF}
            className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors">
            <Icon name="Phone" size={18} />
            {PHONE}
          </a>
          <a href={TG_HREF} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-6 py-3 rounded-xl transition-colors">
            <Icon name="Send" size={18} />
            Написать в Telegram
          </a>
        </div>
      </section>
    </div>
  )
}

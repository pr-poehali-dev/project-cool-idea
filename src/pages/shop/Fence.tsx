import ShopCatalogPage from "@/components/ShopCatalogPage"

export default function Fence() {
  return (
    <ShopCatalogPage
      title="3D Забор"
      icon="LayoutGrid"
      description="Секционный 3D-забор из сварной сетки — надёжное и современное ограждение"
      heroImage="https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/77c596b3-fc18-4b75-998b-027c96d1a9f9.jpg"
      features={["Оцинкованное покрытие", "Монтаж за 1 день", "Любая длина периметра", "Срок службы 25+ лет", "Цвет по RAL"]}
      items={[
        {
          title: "3D панель 1530×2500 мм",
          description: "Стандартная панель высотой 1,53 м. Проволока 4 мм, оцинковка + полимерное покрытие. Самый популярный вариант.",
          price: "от 850 ₽/панель",
          image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/77c596b3-fc18-4b75-998b-027c96d1a9f9.jpg",
          tags: ["Хит"],
        },
        {
          title: "3D панель 2030×2500 мм",
          description: "Панель высотой 2,03 м — для повышенной приватности. Надёжное ограждение для частного дома.",
          price: "от 1 100 ₽/панель",
          image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/77c596b3-fc18-4b75-998b-027c96d1a9f9.jpg",
          tags: [],
        },
        {
          title: "3D панель 2530×2500 мм",
          description: "Высокая панель 2,53 м — максимальная защита и приватность. Для промышленных объектов и предприятий.",
          price: "от 1 400 ₽/панель",
          image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/77c596b3-fc18-4b75-998b-027c96d1a9f9.jpg",
          tags: [],
        },
        {
          title: "Столбы и комплектующие",
          description: "Столбы квадратные 60×60 мм и 60×40 мм, крепёжные скобы, заглушки. Всё для монтажа забора.",
          price: "от 350 ₽/шт",
          image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/77c596b3-fc18-4b75-998b-027c96d1a9f9.jpg",
          tags: [],
        },
        {
          title: "Монтаж забора под ключ",
          description: "Установка 3D-забора: разметка, бурение, бетонирование столбов, крепление панелей. Сдача за 1 день.",
          price: "от 900 ₽/м.п.",
          image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/77c596b3-fc18-4b75-998b-027c96d1a9f9.jpg",
          tags: ["Под ключ"],
        },
        {
          title: "Калитки и ворота",
          description: "Распашные и откатные ворота из 3D-сетки. Калитки в комплект. Цвет в тон забору.",
          price: "по запросу",
          image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/77c596b3-fc18-4b75-998b-027c96d1a9f9.jpg",
          tags: [],
        },
      ]}
    />
  )
}

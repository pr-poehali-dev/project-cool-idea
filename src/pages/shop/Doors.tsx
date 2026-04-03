import ShopCatalogPage from "@/components/ShopCatalogPage"

export default function Doors() {
  return (
    <ShopCatalogPage
      title="Двери"
      icon="DoorOpen"
      description="Входные и межкомнатные двери — металлические, деревянные, МДФ"
      heroImage="https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/6886e9d2-f7b4-493d-9fa4-b2b47929eac1.jpg"
      features={["Замер и установка", "Противовзломная защита", "Шумоизоляция", "Большой выбор отделок", "Гарантия 3 года"]}
      items={[
        {
          title: "Входная металлическая дверь",
          description: "Стальная дверь 2 мм, три контура уплотнения, замок 3 класса защиты. Тёплая, тихая, надёжная.",
          price: "от 18 000 ₽",
          image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/6886e9d2-f7b4-493d-9fa4-b2b47929eac1.jpg",
          tags: ["Популярное"],
        },
        {
          title: "Входная дверь с терморазрывом",
          description: "Дверь с терморазрывом — не промерзает, не покрывается инеем. Идеально для частного дома.",
          price: "от 28 000 ₽",
          image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/6886e9d2-f7b4-493d-9fa4-b2b47929eac1.jpg",
          tags: ["Для дома"],
        },
        {
          title: "Межкомнатная дверь МДФ",
          description: "Гладкое полотно МДФ с ПВХ-покрытием. Лёгкая, доступная, широкая палитра цветов.",
          price: "от 6 500 ₽",
          image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/6886e9d2-f7b4-493d-9fa4-b2b47929eac1.jpg",
          tags: [],
        },
        {
          title: "Межкомнатная дверь со стеклом",
          description: "Дверное полотно со вставкой из закалённого стекла. Современный дизайн, больше света в помещении.",
          price: "от 9 000 ₽",
          image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/6886e9d2-f7b4-493d-9fa4-b2b47929eac1.jpg",
          tags: [],
        },
        {
          title: "Раздвижная дверь-купе",
          description: "Экономия пространства — дверь уходит в стену или в сторону. Подходит для небольших квартир.",
          price: "от 12 000 ₽",
          image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/6886e9d2-f7b4-493d-9fa4-b2b47929eac1.jpg",
          tags: [],
        },
        {
          title: "Дверь под заказ",
          description: "Нестандартные размеры, материалы и отделка. Изготовление по вашему проекту и пожеланиям.",
          price: "по запросу",
          image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/6886e9d2-f7b4-493d-9fa4-b2b47929eac1.jpg",
          tags: ["Под заказ"],
        },
      ]}
    />
  )
}

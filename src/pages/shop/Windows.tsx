import ShopCatalogPage from "@/components/ShopCatalogPage"

export default function Windows() {
  return (
    <ShopCatalogPage
      title="Окна"
      icon="Square"
      description="Металлопластиковые и алюминиевые окна любых размеров и конфигураций"
      heroImage="https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/ccf4d456-a007-41bb-9bb9-da58fab29012.jpg"
      features={["Замер бесплатно", "Изготовление от 3 дней", "Гарантия 5 лет", "Установка под ключ", "Энергосберегающий стеклопакет"]}
      items={[
        {
          title: "Одностворчатое окно",
          description: "Классическое одностворчатое окно с поворотно-откидным механизмом. Профиль 70 мм, двухкамерный стеклопакет.",
          price: "от 8 500 ₽",
          image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/ccf4d456-a007-41bb-9bb9-da58fab29012.jpg",
          tags: ["Хит продаж"],
        },
        {
          title: "Двустворчатое окно",
          description: "Двустворчатое окно — одна створка глухая, вторая поворотно-откидная. Отличное соотношение цена/качество.",
          price: "от 13 500 ₽",
          image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/ccf4d456-a007-41bb-9bb9-da58fab29012.jpg",
          tags: [],
        },
        {
          title: "Трёхстворчатое окно",
          description: "Панорамное трёхстворчатое окно. Две активные створки, средняя — глухая. Максимум света в комнате.",
          price: "от 21 000 ₽",
          image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/ccf4d456-a007-41bb-9bb9-da58fab29012.jpg",
          tags: [],
        },
        {
          title: "Балконный блок",
          description: "Окно + дверь балконная. Полный комплект с монтажом, отливами и откосами.",
          price: "от 19 000 ₽",
          image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/ccf4d456-a007-41bb-9bb9-da58fab29012.jpg",
          tags: ["Комплект"],
        },
        {
          title: "Алюминиевое окно",
          description: "Алюминиевый профиль — для коммерческих помещений, витрин, фасадов. Повышенная прочность.",
          price: "от 16 000 ₽",
          image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/ccf4d456-a007-41bb-9bb9-da58fab29012.jpg",
          tags: [],
        },
        {
          title: "Нестандартный размер",
          description: "Окна любой формы и размера — трапеции, арки, круглые. Изготовление по индивидуальным чертежам.",
          price: "по запросу",
          image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/ccf4d456-a007-41bb-9bb9-da58fab29012.jpg",
          tags: ["Под заказ"],
        },
      ]}
    />
  )
}

import ShopCatalogPage from "@/components/ShopCatalogPage"

export default function Concrete() {
  return (
    <ShopCatalogPage
      title="Бетон"
      icon="Layers"
      description="Товарный бетон всех марок с доставкой миксером по Ялте и Крыму"
      heroImage="https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/b72f141b-f667-4dcc-a78d-1766a6332139.jpg"
      features={["Марки М100–М400", "Доставка миксером", "Документы качества", "Срочно — за 2 часа", "Объём от 1 м³"]}
      items={[
        {
          title: "Бетон М100 (B7.5)",
          description: "Подготовительный бетон для подбетонки, выравнивающих слоёв, оснований под фундамент.",
          price: "от 4 200 ₽/м³",
          image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/b72f141b-f667-4dcc-a78d-1766a6332139.jpg",
          tags: [],
        },
        {
          title: "Бетон М200 (B15)",
          description: "Универсальный бетон для стяжек, отмосток, дорожек, лёгких фундаментов и монолитных конструкций.",
          price: "от 5 100 ₽/м³",
          image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/b72f141b-f667-4dcc-a78d-1766a6332139.jpg",
          tags: ["Популярный"],
        },
        {
          title: "Бетон М300 (B22.5)",
          description: "Для ленточных и плитных фундаментов, перекрытий, колонн. Высокая прочность и долговечность.",
          price: "от 5 800 ₽/м³",
          image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/b72f141b-f667-4dcc-a78d-1766a6332139.jpg",
          tags: ["Хит"],
        },
        {
          title: "Бетон М350 (B25)",
          description: "Для ответственных конструкций — монолитные дома, бассейны, подземные сооружения.",
          price: "от 6 300 ₽/м³",
          image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/b72f141b-f667-4dcc-a78d-1766a6332139.jpg",
          tags: [],
        },
        {
          title: "Бетон М400 (B30)",
          description: "Высокопрочный бетон для гидротехнических сооружений, мостов, промышленных объектов.",
          price: "от 7 100 ₽/м³",
          image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/b72f141b-f667-4dcc-a78d-1766a6332139.jpg",
          tags: [],
        },
        {
          title: "Бетон с доставкой срочно",
          description: "Срочная доставка бетона в течение 2 часов после заявки. Доступно для всех марок. Работаем без выходных.",
          price: "по запросу",
          image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/b72f141b-f667-4dcc-a78d-1766a6332139.jpg",
          tags: ["Срочно"],
        },
      ]}
    />
  )
}

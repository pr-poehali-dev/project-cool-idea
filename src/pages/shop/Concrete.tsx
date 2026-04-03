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
          image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/5208bf0c-a3ce-4f0b-a670-d95f89df95f8.jpg",
          tags: [],
        },
        {
          title: "Бетон М200 (B15)",
          description: "Универсальный бетон для стяжек, отмосток, дорожек, лёгких фундаментов и монолитных конструкций.",
          price: "от 5 100 ₽/м³",
          image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/e58cb71d-d040-4c50-86e4-fca07d98424f.jpg",
          tags: ["Популярный"],
        },
        {
          title: "Бетон М300 (B22.5)",
          description: "Для ленточных и плитных фундаментов, перекрытий, колонн. Высокая прочность и долговечность.",
          price: "от 5 800 ₽/м³",
          image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/d1234c63-408d-4d91-a18c-7e6d6e358afd.jpg",
          tags: ["Хит"],
        },
        {
          title: "Бетон М350 (B25)",
          description: "Для ответственных конструкций — монолитные дома, бассейны, подземные сооружения.",
          price: "от 6 300 ₽/м³",
          image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/25610605-042c-4d2b-87c8-2e16a3b8878d.jpg",
          tags: [],
        },
        {
          title: "Бетон М400 (B30)",
          description: "Высокопрочный бетон для гидротехнических сооружений, мостов, промышленных объектов.",
          price: "от 7 100 ₽/м³",
          image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/c8349829-b049-49a7-8690-d54fd847a5a5.jpg",
          tags: [],
        },
        {
          title: "Срочная доставка бетона",
          description: "Доставка бетона любой марки в течение 2 часов после заявки. Без выходных, по всей Ялте.",
          price: "по запросу",
          image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/553e10d2-c993-479a-8efb-d42cf3cb6709.jpg",
          tags: ["Срочно"],
        },
      ]}
    />
  )
}

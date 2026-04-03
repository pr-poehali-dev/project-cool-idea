import ShopCatalogPage from "@/components/ShopCatalogPage"

export default function Mixtures() {
  return (
    <ShopCatalogPage
      title="Сыпучие смеси"
      icon="Package"
      description="Цемент, песок, щебень, керамзит и готовые строительные смеси с доставкой"
      heroImage="https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/fa66f7fe-5ac7-4c9a-bdce-2d7c339ae98f.jpg"
      features={["Доставка по Ялте", "Опт и розница", "Расчёт количества бесплатно", "Документы качества", "Разгрузка на объекте"]}
      items={[
        {
          title: "Цемент М500 (50 кг)",
          description: "Портландцемент М500 Д0 — универсальный, для фундаментов, стяжек, кладки. Высокая прочность.",
          price: "от 420 ₽/мешок",
          image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/fa66f7fe-5ac7-4c9a-bdce-2d7c339ae98f.jpg",
          tags: ["Хит"],
        },
        {
          title: "Речной песок (тонна)",
          description: "Чистый речной песок, промытый. Для кладки, штукатурки, бетона, засыпки. Доставка самосвалом.",
          price: "от 1 800 ₽/т",
          image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/fa66f7fe-5ac7-4c9a-bdce-2d7c339ae98f.jpg",
          tags: [],
        },
        {
          title: "Щебень фр. 20–40 (тонна)",
          description: "Гранитный щебень фракции 20–40 мм. Для фундаментов, дренажа, дорожных работ.",
          price: "от 2 200 ₽/т",
          image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/fa66f7fe-5ac7-4c9a-bdce-2d7c339ae98f.jpg",
          tags: [],
        },
        {
          title: "Штукатурная смесь (30 кг)",
          description: "Цементно-песчаная штукатурная смесь для внутренних и наружных работ. Без усадки и трещин.",
          price: "от 340 ₽/мешок",
          image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/fa66f7fe-5ac7-4c9a-bdce-2d7c339ae98f.jpg",
          tags: [],
        },
        {
          title: "Керамзит (мешок 50 л)",
          description: "Лёгкий керамзит фракции 10–20 мм. Для утепления полов, кровли, засыпки пустот.",
          price: "от 280 ₽/мешок",
          image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/fa66f7fe-5ac7-4c9a-bdce-2d7c339ae98f.jpg",
          tags: [],
        },
        {
          title: "Кладочная смесь (25 кг)",
          description: "Готовая смесь для кладки кирпича, блоков, камня. Морозостойкая, влагостойкая.",
          price: "от 290 ₽/мешок",
          image: "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/fa66f7fe-5ac7-4c9a-bdce-2d7c339ae98f.jpg",
          tags: [],
        },
      ]}
    />
  )
}

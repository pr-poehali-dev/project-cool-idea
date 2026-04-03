import ShopCatalogPage from "@/components/ShopCatalogPage"

export default function Mixtures() {
  return (
    <ShopCatalogPage
      title="Сыпучие смеси"
      icon="Package"
      description="Цемент, песок, щебень, керамзит и готовые строительные смеси с доставкой"
      heroImage="https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/fa66f7fe-5ac7-4c9a-bdce-2d7c339ae98f.jpg"
      features={["Доставка по Ялте", "Опт и розница", "Расчёт бесплатно", "Документы качества"]}
      category="mixtures"
    />
  )
}

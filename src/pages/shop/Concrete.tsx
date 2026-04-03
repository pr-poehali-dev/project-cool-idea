import ShopCatalogPage from "@/components/ShopCatalogPage"

export default function Concrete() {
  return (
    <ShopCatalogPage
      title="Бетон"
      icon="Layers"
      description="Товарный бетон всех марок с доставкой миксером по Ялте и Крыму"
      heroImage="https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/b72f141b-f667-4dcc-a78d-1766a6332139.jpg"
      features={["Марки М100–М400", "Доставка миксером", "Документы качества", "Срочно — за 2 часа"]}
      category="concrete"
    />
  )
}

import ShopCatalogPage from "@/components/ShopCatalogPage"

export default function Doors() {
  return (
    <ShopCatalogPage
      title="Двери"
      icon="DoorOpen"
      description="Входные и межкомнатные двери — металлические, деревянные, МДФ"
      heroImage="https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/6886e9d2-f7b4-493d-9fa4-b2b47929eac1.jpg"
      features={["Замер и установка", "Противовзломная защита", "Шумоизоляция", "Гарантия 3 года"]}
      category="doors"
    />
  )
}

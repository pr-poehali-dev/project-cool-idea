import ShopCatalogPage from "@/components/ShopCatalogPage"

export default function Windows() {
  return (
    <ShopCatalogPage
      title="Окна"
      icon="Square"
      description="Металлопластиковые и алюминиевые окна любых размеров и конфигураций"
      heroImage="https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/ccf4d456-a007-41bb-9bb9-da58fab29012.jpg"
      features={["Замер бесплатно", "Изготовление от 3 дней", "Гарантия 5 лет", "Установка под ключ"]}
      category="windows"
    />
  )
}

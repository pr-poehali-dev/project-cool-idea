const PHOTO_WELDER = "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/15901184-f525-4b9d-8d6d-07903e33a13c.jpg"
const PHOTO_MASON = "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/c81915c5-e7b8-4c37-8524-9a2df529b91e.jpg"
const PHOTO_PLASTER = "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/475954ea-b3f0-4df7-9e67-cbce4c88b9af.jpg"
const PHOTO_TILER = "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/17eeecf9-df5e-443d-8c09-a80f2b7d324b.jpg"
const PHOTO_PAINTER = "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/58c9f5e4-7f6a-45fc-93df-6d59a287d6c4.jpg"
const PHOTO_ELECTRIC = "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/e3140539-7337-4458-b01e-ee62e7e565db.jpg"
const PHOTO_PLUMBER = "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/a81b21cb-47fc-4b18-97e7-5262076e25f9.jpg"
const PHOTO_CARPENTER = "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/12723528-84bf-4fa1-a06a-a7b049467057.jpg"
const PHOTO_FOREMAN = "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/305b0272-9092-4de6-9d5d-22c7994d6506.jpg"
const PHOTO_MACHINE = "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/19d21c7c-c831-40b1-ae44-22e7cf5025cf.jpg"
const PHOTO_WORKER = "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/7dd210c1-91fb-4c35-b819-576e4b49209b.jpg"
const PHOTO_ROOFER = "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/32b77540-a189-4002-80a9-db92c8d8893e.jpg"

export const SPECIALTY_PHOTOS: Record<string, string> = {
  // Сварка
  "Сварщик (электросварка)": PHOTO_WELDER,
  "Сварщик (аргон)": PHOTO_WELDER,
  "Оператор сварочных роботов": PHOTO_WELDER,
  "Слесарь-сборщик металлоконструкций": PHOTO_WELDER,
  "Арматурщик": PHOTO_MASON,
  // Каменные работы
  "Каменщик": PHOTO_MASON,
  "Кладка блока / кирпича": PHOTO_MASON,
  "Кладка плитки / камня": PHOTO_MASON,
  "Печник": PHOTO_MASON,
  // Штукатурка и отделка
  "Штукатур (ручная)": PHOTO_PLASTER,
  "Штукатур (механическая)": PHOTO_PLASTER,
  "Маляр": PHOTO_PAINTER,
  "Отделочник": PHOTO_PLASTER,
  "Гипсокартонщик": PHOTO_PLASTER,
  // Плитка и полы
  "Плиточник": PHOTO_TILER,
  "Укладчик ламината / паркета": PHOTO_CARPENTER,
  "Мастер по наливным полам": PHOTO_TILER,
  // Бетон и монолит
  "Бетонщик": PHOTO_MASON,
  "Опалубщик": PHOTO_MASON,
  "Монолитчик": PHOTO_MASON,
  // Кровля и фасады
  "Кровельщик": PHOTO_ROOFER,
  "Фасадчик": PHOTO_ROOFER,
  "Монтажник вентилируемых фасадов": PHOTO_ROOFER,
  "Утеплительщик": PHOTO_ROOFER,
  // Коммуникации
  "Сантехник": PHOTO_PLUMBER,
  "Электрик": PHOTO_ELECTRIC,
  "Вентиляционщик": PHOTO_PLUMBER,
  "Монтажник слаботочных систем": PHOTO_ELECTRIC,
  // Плотницкие работы
  "Плотник": PHOTO_CARPENTER,
  "Столяр": PHOTO_CARPENTER,
  "Монтажник деревянных конструкций": PHOTO_CARPENTER,
  "Установщик окон / дверей": PHOTO_CARPENTER,
  // Мастера и руководители
  "Прораб": PHOTO_FOREMAN,
  "Мастер участка": PHOTO_FOREMAN,
  "Бригадир": PHOTO_FOREMAN,
  "Технадзор": PHOTO_FOREMAN,
  "Инженер ПТО": PHOTO_FOREMAN,
  // Спецтехника
  "Машинист экскаватора": PHOTO_MACHINE,
  "Машинист крана": PHOTO_MACHINE,
  "Водитель самосвала": PHOTO_MACHINE,
  "Оператор бетононасоса": PHOTO_MACHINE,
  // Земляные и вспомогательные
  "Разнорабочий": PHOTO_WORKER,
  "Землекоп": PHOTO_WORKER,
  "Подсобный рабочий": PHOTO_WORKER,
  "Грузчик": PHOTO_WORKER,
  "Сторож / охранник объекта": PHOTO_FOREMAN,
  "Уборщик территории": PHOTO_WORKER,
  "Водитель категории B/C": PHOTO_MACHINE,
  "Кладовщик стройматериалов": PHOTO_WORKER,
}

export const DEFAULT_PHOTO = "https://cdn.poehali.dev/projects/7f03272f-bca4-46b6-9dc3-4ea2338fe786/files/7dd210c1-91fb-4c35-b819-576e4b49209b.jpg"

export function getSpecialtyPhoto(specialty: string): string {
  return SPECIALTY_PHOTOS[specialty] || DEFAULT_PHOTO
}
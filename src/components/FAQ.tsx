import { useState } from "react"
import Icon from "@/components/ui/icon"

const faqs = [
  {
    question: "Как найти работу через «Работа Крым»?",
    answer:
      "Зарегистрируйтесь как соискатель, создайте резюме, укажите специальность и желаемую зарплату. После этого вы сможете откликаться на вакансии одним кликом или ждать предложений от работодателей. Всё бесплатно.",
  },
  {
    question: "Как разместить вакансию?",
    answer:
      "Зарегистрируйтесь как работодатель, выберите тарифный план и заполните форму вакансии. Первая вакансия бесплатна на 14 дней. Вакансия публикуется после прохождения модерации — обычно в течение нескольких часов.",
  },
  {
    question: "Чем отличается рекрутинговое агентство от обычного размещения вакансий?",
    answer:
      "При самостоятельном размещении вакансии вы сами просматриваете отклики и связываетесь с кандидатами. Агентство берёт всё на себя: ищет специалистов в своей базе, проверяет квалификацию, организует встречу и даёт гарантию замены в случае несоответствия.",
  },
  {
    question: "Какие специальности представлены на портале?",
    answer:
      "Все специальности: строители, повара, водители, бухгалтеры, охранники, продавцы, IT-специалисты, медики, педагоги и многие другие. Портал для всех сфер по всему Крыму.",
  },
  {
    question: "В каких городах Крыма работает сервис?",
    answer:
      "Мы работаем по всему Крыму: Симферополь, Ялта, Севастополь, Керчь, Феодосия, Евпатория, Алушта, Судак, Саки и другие города и посёлки. При публикации вакансии можно указать конкретный город или район.",
  },
  {
    question: "Как работает гарантия замены специалиста?",
    answer:
      "При обращении в наше рекрутинговое агентство мы заключаем договор с гарантийным периодом. Если подобранный специалист не приступил к работе или не соответствует заявленным требованиям — бесплатно подбираем замену в течение 5 рабочих дней.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-24 md:py-20">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-3xl mb-16">
          <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">Вопросы и ответы</p>
          <h2 className="text-5xl font-bold leading-[1.15] tracking-tight mb-4 text-balance lg:text-6xl">
            Частые вопросы
          </h2>
          <p className="text-muted-foreground text-lg">Отвечаем на самые популярные вопросы о работе портала</p>
        </div>

        <div className="max-w-4xl">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-border">
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full py-6 flex items-start justify-between gap-6 text-left group"
              >
                <span className="text-base md:text-lg font-semibold text-foreground transition-colors group-hover:text-yellow-500">
                  {faq.question}
                </span>
                <Icon
                  name="Plus"
                  size={22}
                  className={`text-foreground flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-45 text-yellow-500" : "rotate-0"
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-muted-foreground leading-relaxed pb-6 pr-12">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
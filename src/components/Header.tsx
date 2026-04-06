import { useState, MouseEvent, useEffect } from "react"
import { cn } from "../lib/utils"
import { getToken, clearToken, apiUsers } from "../lib/auth"

interface HeaderProps {
  onOpenModal: () => void
}

export function Header({ onOpenModal }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    if (getToken()) {
      apiUsers({ action: "me" }).then(({ ok, data }) => {
        if (ok) setUserName(data.name)
        else clearToken()
      })
    }
  }, [])

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const scrollToTop = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const navItems = [
    { label: "Аренда техники", mobile: "Спецтехника", href: "/rental" },
    { label: "Наш магазин", mobile: "Магазин", href: "/shop" },
    { label: "Вакансии", mobile: "Вакансии", href: "#vacancies" },
    { label: "Агентство", mobile: "Агентство", href: "#agency" },
    { label: "Вопросы", mobile: "Вопросы", href: "#faq" },
  ]

  return (
    <header className="fixed z-50 top-0 left-0 right-0 bg-primary backdrop-blur-md py-4">
      <nav className="container mx-auto px-6 flex items-center justify-between md:px-[24]">
        <a href="/" className="flex items-center gap-2 group flex-shrink-0">
          <span className="text-white font-bold text-xl tracking-tight">
            Работа-<span className="text-yellow-400">Крым</span>
          </span>
        </a>

        {/* Мобильные быстрые ссылки */}
        <div className="flex md:hidden items-center gap-1 flex-1 justify-center px-1 overflow-hidden">
          <a href="/rental" className="text-white/80 hover:text-yellow-400 text-xs font-medium px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors whitespace-nowrap">
            Спецтехника
          </a>
          <a href="/shop" className="text-white/80 hover:text-yellow-400 text-xs font-medium px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors whitespace-nowrap">
            Магазин
          </a>
        </div>

        <ul className="hidden md:flex items-center gap-10 text-sm tracking-wide">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="hover:text-yellow-400 transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 hover:after:w-full after:bg-yellow-400 after:transition-all after:duration-300 text-white"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={onOpenModal}
            className="inline-flex items-center gap-2 text-sm px-5 py-2.5 transition-all duration-300 bg-yellow-500 text-white hover:bg-yellow-600 rounded-lg font-medium"
          >
            Разместить вакансию
          </button>
          {userName ? (
            <a
              href="/cabinet"
              className="inline-flex items-center gap-2 text-sm px-4 py-2.5 rounded-lg text-white bg-white/10 hover:bg-white/20 transition-all duration-300 font-medium"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              {userName}
            </a>
          ) : (
            <a
              href="/auth"
              className="inline-flex items-center gap-2 text-sm px-4 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 font-medium"
            >
              Войти
            </a>
          )}
        </div>

        <button
          className="md:hidden z-50 transition-colors duration-300 text-white"
          aria-label={mobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="4" y1="8" x2="20" y2="8" />
              <line x1="4" y1="16" x2="20" y2="16" />
            </svg>
          )}
        </button>
      </nav>

      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
          mobileMenuOpen ? "max-h-[600px] opacity-100 mt-8" : "max-h-0 opacity-0",
        )}
      >
        <div className="container mx-auto px-6">
          <ul className="flex flex-col gap-6 mb-8">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="hover:text-yellow-400 transition-colors duration-300 text-white text-3xl font-light block"
                  onClick={closeMobileMenu}
                >
                  {item.mobile}
                </a>
              </li>
            ))}
          </ul>

          <button
            className="inline-flex items-center justify-center gap-2 text-sm px-5 py-2.5 bg-yellow-500 text-white hover:bg-yellow-600 transition-all duration-300 mb-3 rounded-lg font-medium"
            onClick={() => { closeMobileMenu(); onOpenModal() }}
          >
            Разместить вакансию
          </button>
          {userName ? (
            <a
              href="/cabinet"
              onClick={closeMobileMenu}
              className="inline-flex items-center gap-2 text-sm px-5 py-2.5 text-white bg-white/10 hover:bg-white/20 transition-all duration-300 mb-3 rounded-lg font-medium"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              Мой кабинет
            </a>
          ) : (
            <a
              href="/auth"
              onClick={closeMobileMenu}
              className="inline-flex items-center gap-2 text-sm px-5 py-2.5 text-white/70 hover:text-white border border-white/20 hover:border-white/40 transition-all duration-300 mb-3 rounded-lg font-medium"
            >
              Войти / Регистрация
            </a>
          )}
          <a
            href="/login"
            onClick={closeMobileMenu}
            className="hidden"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Вход для сотрудников
          </a>
        </div>
      </div>
    </header>
  )
}
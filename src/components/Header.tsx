import { useState, useEffect, MouseEvent } from "react"
import { cn } from "../lib/utils"

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const scrollToTop = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const navItems = [
    { label: "Главная", href: "#hero" },
    { label: "Вакансии", href: "#vacancies" },
    { label: "Агентство", href: "#agency" },
    { label: "Преимущества", href: "#benefits" },
    { label: "Вопросы", href: "#faq" },
  ]

  return (
    <header
      className={cn(
        "fixed z-50 transition-all duration-500 my-0 py-0 rounded-none",
        scrolled || mobileMenuOpen
          ? "bg-primary backdrop-blur-md py-4 top-4 left-4 right-4 rounded-2xl"
          : "bg-transparent py-4 top-0 left-0 right-0",
      )}
    >
      <nav className="container mx-auto px-6 flex items-center justify-between md:px-[24]">
        <a href="/" className="flex items-center gap-2 group" onClick={scrollToTop}>
          <span className="text-white font-bold text-xl tracking-tight">
            Работа<span className="text-orange-400">Ялта</span>
          </span>
        </a>

        <ul className="hidden md:flex items-center gap-10 text-sm tracking-wide">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="hover:text-orange-400 transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 hover:after:w-full after:bg-orange-400 after:transition-all after:duration-300 text-white"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="hidden md:inline-flex items-center gap-2 text-sm px-5 py-2.5 transition-all duration-300 bg-orange-500 text-white hover:bg-orange-600 rounded-lg font-medium"
        >
          Разместить вакансию
        </a>

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
                  className="hover:text-orange-400 transition-colors duration-300 text-white text-3xl font-light block"
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 text-sm px-5 py-2.5 bg-orange-500 text-white hover:bg-orange-600 transition-all duration-300 mb-4 rounded-lg font-medium"
            onClick={closeMobileMenu}
          >
            Разместить вакансию
          </a>
        </div>
      </div>
    </header>
  )
}

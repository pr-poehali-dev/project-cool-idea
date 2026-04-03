import Icon from "@/components/ui/icon"
import { getToken } from "@/lib/auth"

interface VacancyModalProps {
  open: boolean
  onClose: () => void
}

export function VacancyModal({ open, onClose }: VacancyModalProps) {
  if (!open) return null

  const isLoggedIn = !!getToken()

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
        <div className="bg-primary px-6 py-5 flex items-center justify-between">
          <h2 className="text-white font-bold text-xl">Разместить объявление</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <Icon name="X" size={22} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-3">
          <p className="text-gray-500 text-sm">
            Разместите вакансию или объявление о поиске работы в личном кабинете — это займёт 2 минуты.
          </p>

          {isLoggedIn ? (
            <a
              href="/cabinet"
              onClick={onClose}
              className="w-full bg-orange-500 text-white py-3.5 rounded-xl font-semibold hover:bg-orange-600 transition-colors text-sm text-center"
            >
              Перейти в кабинет →
            </a>
          ) : (
            <>
              <a
                href="/auth"
                onClick={onClose}
                className="w-full bg-orange-500 text-white py-3.5 rounded-xl font-semibold hover:bg-orange-600 transition-colors text-sm text-center"
              >
                Зарегистрироваться и разместить
              </a>
              <a
                href="/auth"
                onClick={onClose}
                className="w-full text-center text-gray-500 text-sm hover:text-gray-700 transition-colors py-1"
              >
                Уже есть аккаунт? Войти
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

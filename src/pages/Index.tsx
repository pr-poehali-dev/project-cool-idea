import { useState } from "react"
import { Header } from "../components/Header"
import { Hero } from "../components/Hero"
import { Philosophy } from "../components/Philosophy"
import { Projects } from "../components/Projects"
import { Expertise } from "../components/Expertise"
import { FAQ } from "../components/FAQ"
import { CallToAction } from "../components/CallToAction"
import { Footer } from "../components/Footer"
import { VacancyModal } from "../components/VacancyModal"

export default function Index() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <main className="min-h-screen">
      <Header onOpenModal={() => setModalOpen(true)} />
      <Hero onOpenModal={() => setModalOpen(true)} />
      <Philosophy />
      <Projects />
      <Expertise />
      <FAQ />
      <CallToAction onOpenModal={() => setModalOpen(true)} />
      <Footer />
      <VacancyModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  )
}

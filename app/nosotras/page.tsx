import type { Metadata } from 'next'
import Header from '@/components/Header'
import About from '@/components/About'
import Process from '@/components/Process'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export const metadata: Metadata = {
  title: 'Nosotras | Glitter Pop - Conocenos',
  description: 'Conocé al equipo detrás de Glitter Pop. Maquillaje artístico profesional para eventos, festivales y celebraciones.',
}

export default function NosotrasPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="pt-24">
        <About />
        <Process />
      </div>
      <Footer />
      <WhatsAppButton />
    </main>
  )
}

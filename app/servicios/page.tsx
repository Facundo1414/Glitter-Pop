import type { Metadata } from 'next'
import Header from '@/components/Header'
import Services from '@/components/Services'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export const metadata: Metadata = {
  title: 'Servicios | Glitter Pop - Maquillaje y Eventos',
  description: 'Descubrí todos nuestros servicios de maquillaje artístico, glitter, body paint, maquillaje para eventos, festivales y más.',
}

export default function ServiciosPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="pt-24">
        <Services />
      </div>
      <Footer />
      <WhatsAppButton />
    </main>
  )
}

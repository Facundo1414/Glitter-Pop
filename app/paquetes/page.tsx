import type { Metadata } from 'next'
import Packages from '@/components/Packages'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export const metadata: Metadata = {
  title: 'Paquetes | Glitter Pop - Precios y Planes',
  description: 'Conocé nuestros paquetes de maquillaje para eventos. Opciones para cumpleaños, casamientos, corporativos y más.',
}

export default function PaquetesPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="pt-24">
        <Packages />
        {/* <Testimonials /> */}
        <FAQ />
      </div>
      <Footer />
      <WhatsAppButton />
    </main>
  )
}

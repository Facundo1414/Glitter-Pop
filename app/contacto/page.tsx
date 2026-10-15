import type { Metadata } from 'next'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { loadPublicSettings } from '@/lib/public-content'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Contacto | Glitter Pop - Reservá tu Evento',
  description: 'Contactá a Glitter Pop para reservar maquillaje artístico para tu evento. Escribinos por WhatsApp o completá el formulario.',
}

export default async function ContactoPage() {
  const settings = await loadPublicSettings()
  return (
    <main className="min-h-screen bg-white">
      <div className="pt-24">
        <Contact settings={settings} />
      </div>
      <Footer settings={settings} />
      <WhatsAppButton settings={settings} />
    </main>
  )
}

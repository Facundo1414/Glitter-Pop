import type { Metadata } from 'next'
import About from '@/components/About'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { loadPublicSettings, loadPublicTeam } from '@/lib/public-content'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Nosotras | Glitter Pop - Conocenos',
  description: 'Conocé al equipo detrás de Glitter Pop. Maquillaje artístico profesional para eventos, festivales y celebraciones.',
}

export default async function NosotrasPage() {
  const [settings, teamMembers] = await Promise.all([loadPublicSettings(), loadPublicTeam()])
  return (
    <main className="min-h-screen bg-[var(--brand-cream)]">
      <div className="pt-24">
        <About settings={settings} teamMembers={teamMembers} />
      </div>
      <Footer settings={settings} />
      <WhatsAppButton settings={settings} />
    </main>
  )
}

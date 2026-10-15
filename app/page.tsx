import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Gallery from '@/components/Gallery'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { loadPublicServices, loadPublicSettings } from '@/lib/public-content'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const [settings, services] = await Promise.all([loadPublicSettings(), loadPublicServices()])
  return (
    <main className="min-h-screen">
      <Hero settings={settings} />
      <Services services={services} />
      <Gallery settings={settings} />
      <Footer settings={settings} />
      <WhatsAppButton settings={settings} />
    </main>
  )
}

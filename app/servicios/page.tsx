import Header from '@/components/Header'
import Services from '@/components/Services'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function ServiciosPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-24">
        <Services />
      </div>
      <Footer />
      <WhatsAppButton />
    </main>
  )
}

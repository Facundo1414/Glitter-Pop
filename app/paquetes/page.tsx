import Header from '@/components/Header'
import Packages from '@/components/Packages'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function PaquetesPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-24">
        <Packages />
        <Testimonials />
        <FAQ />
      </div>
      <Footer />
      <WhatsAppButton />
    </main>
  )
}

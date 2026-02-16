import Header from '@/components/Header'
import Portfolio from '@/components/Portfolio'
import Gallery from '@/components/Gallery'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function PortfolioPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-24">
        <Portfolio />
        <Gallery />
      </div>
      <Footer />
      <WhatsAppButton />
    </main>
  )
}

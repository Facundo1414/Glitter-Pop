import Header from '@/components/Header'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function ContactoPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-24">
        <Contact />
      </div>
      <Footer />
      <WhatsAppButton />
    </main>
  )
}

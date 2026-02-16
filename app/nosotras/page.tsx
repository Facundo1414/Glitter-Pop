import Header from '@/components/Header'
import About from '@/components/About'
import Process from '@/components/Process'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function NosotrasPage() {
  return (
    <main className="min-h-screen">
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

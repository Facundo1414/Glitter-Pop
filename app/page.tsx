import Header from '@/components/Header'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Services from '@/components/Services'
import Process from '@/components/Process'
import Testimonials from '@/components/Testimonials'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <About />
      <Process />
      <Testimonials />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}

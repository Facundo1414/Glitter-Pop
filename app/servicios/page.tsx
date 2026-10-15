import type { Metadata } from 'next'
import Link from 'next/link'
import Services from '@/components/Services'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { loadPublicFaqs, loadPublicServices, loadPublicSettings } from '@/lib/public-content'
import { getEventCards } from '@/lib/event-cards'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Glitter Bar Esencial y Premium | Glitter Pop',
  description: 'Glitter Bar Esencial y Premium para casamientos, fiestas de 15, eventos corporativos, cumpleaños y todo tipo de eventos.',
}

export default async function ServiciosPage() {
  const [settings, services, faqs] = await Promise.all([loadPublicSettings(), loadPublicServices(), loadPublicFaqs()])
  const eventTypes = getEventCards(settings)
  return (
    <main className="min-h-screen bg-white">
      <div className="pt-24">
        <Services services={services} />
      </div>
      <section aria-labelledby="tipos-de-eventos" className="bg-white px-5 pb-20 sm:px-8 md:pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="brand-eyebrow">Dónde nos encontrás</p>
            <h2 id="tipos-de-eventos" className="mt-3 font-display text-4xl font-bold leading-none text-[var(--brand-ink)] sm:text-5xl">
              Un glitter bar para cada celebración
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[var(--brand-ink)]/80 md:text-lg">
              Llevamos el glitter bar a distintos tipos de eventos. Encontrá el tuyo y contanos qué estás organizando.
            </p>
          </div>

          <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {eventTypes.map((event, index) => (
              <article key={event.key} className={`rounded-3xl p-7 sm:p-9 ${index === 0 ? 'bg-[var(--brand-mint)] lg:col-span-2' : 'bg-[var(--brand-cream)]'}`}>
                {index === 0 && <p className="brand-eyebrow">Momentos especiales</p>}
                <h3 className={`font-display font-bold leading-none text-[var(--brand-ink)] ${index === 0 ? 'mt-3 text-4xl sm:text-5xl' : 'text-3xl'}`}>{event.title}</h3>
                <p className={`leading-relaxed text-[var(--brand-ink)]/80 ${index === 0 ? 'mt-5 max-w-xl' : 'mt-4'}`}>{event.description}</p>
              </article>
            ))}
          </div>

          <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-lg font-semibold text-[var(--brand-ink)]">Contanos qué evento estás organizando.</p>
            <Link href="/contacto" className="brand-button">Hablemos de tu evento</Link>
          </div>
        </div>
      </section>
      <FAQ faqs={faqs} />
      <Footer settings={settings} />
      <WhatsAppButton settings={settings} />
    </main>
  )
}

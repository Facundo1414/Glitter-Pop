import Link from 'next/link'
import Image from 'next/image'
import type { loadPublicServices } from '@/lib/public-content'

type Service = Awaited<ReturnType<typeof loadPublicServices>>[number]

export default function Services({ services }: { services: Service[] }) {
  return (
    <section id="servicios" className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-10 max-w-2xl">
          <h2 className="font-display text-5xl font-bold leading-none text-[var(--brand-ink)] md:text-6xl">Nuestros servicios</h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--brand-ink)]/75 md:text-lg">Elegí la experiencia de glitter bar que mejor se adapte a tu evento.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 md:gap-7">
          {services.map((service, index) => (
            <article key={service.id} className={`flex h-full flex-col overflow-hidden rounded-2xl text-[var(--brand-ink)] ${index === 1 ? 'bg-[var(--brand-cream)]' : 'bg-[var(--brand-mint)]'}`}>
              {service.image && (
                <div className="relative h-48 w-full">
                  <Image src={service.image} alt="" fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" />
                </div>
              )}
              <div className="flex flex-1 flex-col p-7 sm:p-9">
                <p className="text-sm font-bold text-[var(--brand-pink-dark)]">{service.duration}</p>
                <h3 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">{service.title}</h3>
                <p className="mt-5 max-w-prose text-base leading-relaxed text-[var(--brand-ink)]/80">{service.description}</p>
                <Link href="/contacto" className="mt-8 inline-flex min-h-11 w-fit items-center rounded-full bg-[var(--brand-pink-dark)] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[var(--brand-ink)]">
                  Consultar este servicio
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

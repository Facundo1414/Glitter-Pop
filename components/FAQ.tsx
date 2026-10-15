'use client'

import Link from 'next/link'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import type { loadPublicFaqs } from '@/lib/public-content'

type Faq = Awaited<ReturnType<typeof loadPublicFaqs>>[number]

export default function FAQ({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null

  return (
    <section aria-labelledby="preguntas-frecuentes" className="bg-[var(--brand-cream)] px-5 py-16 sm:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl">
          <h2 id="preguntas-frecuentes" className="font-display text-4xl font-bold leading-none text-[var(--brand-ink)] sm:text-5xl">
            Preguntas frecuentes
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--brand-ink)]/80 md:text-lg">
            Respuestas a las consultas más habituales sobre nuestro glitter bar.
          </p>

          <Accordion type="single" collapsible className="mt-9 space-y-3">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="overflow-hidden rounded-2xl bg-white px-5 sm:px-6"
              >
                <AccordionTrigger className="min-h-16 py-4 text-base font-semibold leading-snug text-[var(--brand-ink)] hover:no-underline focus-visible:ring-[var(--brand-pink-dark)] sm:text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="max-w-prose pb-5 text-base leading-relaxed text-[var(--brand-ink)]/80">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
            <p className="text-[var(--brand-ink)]/80">¿Tenés otra consulta?</p>
            <Link href="/contacto" className="brand-button">Escribinos</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

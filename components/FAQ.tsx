'use client'

import Link from 'next/link'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import type { loadPublicFaqs } from '@/lib/public-content'

type Faq = Awaited<ReturnType<typeof loadPublicFaqs>>[number]

export default function FAQ({ faqs }: { faqs: Faq[] }) {
  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="section-title">
          Preguntas Frecuentes
        </h2>
        <p className="section-subtitle">
          Todo lo que necesitás saber sobre nuestros servicios
        </p>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-colors duration-300 hover:shadow-lg border-none"
              >
                <AccordionTrigger className="px-4 sm:px-6 py-4 sm:py-5 font-semibold text-gray-800 text-sm sm:text-base hover:no-underline hover:bg-gray-50 active:bg-gray-100 touch-manipulation">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 sm:px-6 text-gray-600 leading-relaxed text-sm sm:text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4 text-sm sm:text-base">¿No encontraste lo que buscabas?</p>
          <Button variant="link" asChild className="text-primary-600 font-semibold text-base sm:text-lg touch-manipulation">
            <Link href="/contacto">
              Contactanos directamente →
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import contentData from '@/data/content.json'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { useInView } from '@/hooks/useInView'

export default function FAQ() {
  const [faqs, setFaqs] = useState(contentData.faqs)
  const [sectionRef, isInView] = useInView<HTMLElement>()

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const response = await fetch('/api/faqs', { cache: 'no-store' })
        if (!response.ok) return
        const data = await response.json()
        if (Array.isArray(data.faqs) && data.faqs.length > 0) {
          setFaqs(data.faqs)
        }
      } catch {
        // Keep JSON fallback
      }
    }

    void loadFaqs()
  }, [])

  return (
    <section ref={sectionRef} className="py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className={`section-title ${isInView ? 'animate-in fade-in-0 slide-in-from-bottom-4 duration-700' : 'opacity-0'}`}>
          Preguntas Frecuentes
        </h2>
        <p
          className={`section-subtitle ${isInView ? 'animate-in fade-in-0 slide-in-from-bottom-4 duration-700' : 'opacity-0'}`}
          style={{ animationDelay: isInView ? '100ms' : undefined }}
        >
          Todo lo que necesitás saber sobre nuestros servicios
        </p>

        <div
          className={`max-w-3xl mx-auto ${isInView ? 'animate-in fade-in-0 slide-in-from-bottom-4 duration-700' : 'opacity-0'}`}
          style={{ animationDelay: isInView ? '200ms' : undefined }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border-none"
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

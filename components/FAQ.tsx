'use client'

import { useState } from 'react'
import Link from 'next/link'
import contentData from '@/data/content.json'

export default function FAQ() {
  const { faqs } = contentData
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="section-title">
          Preguntas <span className="glitter-text">Frecuentes</span>
        </h2>
        <p className="section-subtitle">
          Todo lo que necesitás saber sobre nuestros servicios
        </p>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-4 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-all touch-manipulation"
              >
                <span className="font-semibold text-gray-800 pr-4 text-sm sm:text-base">{faq.question}</span>
                <svg
                  className={`w-5 h-5 md:w-6 md:h-6 text-primary-500 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              <div
                className={`px-4 sm:px-6 overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 pb-5' : 'max-h-0'
                }`}
              >
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4 text-sm sm:text-base">¿No encontraste lo que buscabas?</p>
          <Link
            href="/contacto"
            className="text-primary-600 font-semibold hover:text-primary-700 active:text-primary-800 transition-colors text-base sm:text-lg inline-block touch-manipulation"
          >
            Contactanos directamente →
          </Link>
        </div>
      </div>
    </section>
  )
}

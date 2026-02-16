'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import contentData from '@/data/content.json'

export default function Packages() {
  const { packages } = contentData
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById('paquetes')
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [])

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(parseInt(price))
  }

  return (
    <section id="paquetes" className="py-16 md:py-20 bg-gradient-to-br from-pastel-lavender/20 via-white to-pastel-pink/20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-900 mb-3 md:mb-4 px-4">
            Nuestros Paquetes
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Elegí el paquete perfecto para tu evento ✨
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 lg:gap-8 max-w-7xl mx-auto">
          {packages.map((pkg, index) => (
            <div
              key={pkg.id}
              className={`relative group transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className={`relative h-full bg-white rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-500 ${
                pkg.popular 
                  ? 'shadow-2xl border-2 border-primary-200 scale-105 md:scale-110 z-10' 
                  : 'shadow-lg hover:shadow-xl border border-gray-100 active:scale-98'
              }`}>
                {pkg.popular && (
                  <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700"></div>
                )}

                <div className="p-8">
                  {/* Badge */}
                  {pkg.popular && (
                    <div className="flex justify-center mb-4">
                      <span className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md">
                        <span>⭐</span>
                        <span>Más Popular</span>
                      </span>
                    </div>
                  )}

                  {/* Header */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-3">
                      {pkg.name}
                    </h3>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-4xl font-bold text-gray-900">
                        {formatPrice(pkg.price)}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">
                      {pkg.duration}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6"></div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {pkg.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 sm:gap-3">
                        <div className="shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-primary-400 to-pastel-pink flex items-center justify-center mt-0.5">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                        <span className="text-gray-700 text-sm sm:text-base leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Ideal para */}
                  <div className="mb-5 md:mb-6">
                    <div className="bg-gradient-to-br from-pastel-lavender/30 to-pastel-pink/30 rounded-xl md:rounded-2xl p-4 border border-primary-100">
                      <div className="flex items-start gap-2">
                        <span className="text-base sm:text-lg shrink-0">💡</span>
                        <div>
                          <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide mb-1">
                            Ideal para
                          </p>
                          <p className="text-gray-900 text-sm sm:text-base font-medium leading-snug">
                            {pkg.ideal}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link
                    href="/contacto"
                    className={`block w-full text-center py-4 px-6 rounded-xl md:rounded-2xl font-bold text-base md:text-lg transition-all duration-300 transform active:scale-95 hover:scale-105 hover:shadow-lg touch-manipulation ${
                      pkg.popular
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                        : 'bg-white border-2 border-primary-300 text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    Reservar Ahora
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info adicional */}
        <div className={`mt-12 md:mt-16 text-center transition-all duration-1000 px-4 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        style={{ transitionDelay: '600ms' }}>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            💬 ¿Necesitás algo personalizado? Consultanos sin compromiso
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-400 rounded-full"></span>
              Precios en pesos argentinos
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-400 rounded-full"></span>
              Traslado incluido en Córdoba
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-400 rounded-full"></span>
              Productos profesionales
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import Link from 'next/link'
import contentData from '@/data/content.json'

export default function Services() {
  const { services } = contentData

  return (
    <section id="servicios" className="py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="section-title">
          Nuestros <span className="glitter-text">Servicios</span>
        </h2>
        <p className="section-subtitle">
          Dale brillo a tu evento con nuestros servicios profesionales de maquillaje artístico
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {services.map((service) => (
            <div key={service.id} className="card group hover:shadow-xl transition-shadow cursor-pointer active:scale-98">
              <div className="h-28 sm:h-32 bg-gradient-to-br from-pastel-lavender/30 to-pastel-pink/30 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl sm:text-6xl group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </span>
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <h3 className="text-lg sm:text-xl font-display font-bold mb-2 sm:mb-3 text-gray-800">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed">
                  {service.description}
                </p>
                <div className="flex items-center text-purple-600 text-xs sm:text-sm font-semibold">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {service.duration}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10 md:mt-12 px-4">
          <Link
            href="/contacto"
            className="btn-primary inline-block"
          >
            Consultá por tu Evento
          </Link>
        </div>
      </div>
    </section>
  )
}

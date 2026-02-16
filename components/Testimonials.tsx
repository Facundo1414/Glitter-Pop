'use client'

import contentData from '@/data/content.json'

export default function Testimonials() {
  const { testimonials } = contentData

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="section-title">
          Clientes <span className="glitter-text">Felices</span>
        </h2>
        <p className="section-subtitle">
          Lo que dicen nuestros clientes sobre nosotros
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="card p-5 sm:p-6 hover:scale-105 active:scale-100 transition-transform duration-300"
            >
              <div className="flex items-center mb-3 md:mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              
              <p className="text-gray-700 mb-3 md:mb-4 leading-relaxed text-sm md:text-base">
                "{testimonial.text}"
              </p>
              
              <div className="border-t pt-3 md:pt-4">
                <div className="font-semibold text-gray-800 text-sm md:text-base">{testimonial.name}</div>
                <div className="text-xs md:text-sm text-purple-600">{testimonial.event}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

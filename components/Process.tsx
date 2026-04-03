'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const steps = [
  {
    number: '1',
    title: 'Contacto Inicial',
    description: 'Contáctanos por WhatsApp o Instagram. Nos cuentas de tu evento, fecha y cantidad de personas.',
    icon: '💬'
  },
  {
    number: '2',
    title: 'Planificación',
    description: 'Definimos juntos el estilo, colores y diseños que mejor se adapten a tu evento.',
    icon: '✨'
  },
  {
    number: '3',
    title: 'Confirmación',
    description: 'Acordamos los detalles finales: horario, ubicación y el paquete que elegiste.',
    icon: '✅'
  },
  {
    number: '4',
    title: '¡A Brillar!',
    description: 'Llegamos a tu evento con todo el equipo necesario y creamos magia con cada diseño.',
    icon: '🎨'
  }
]

export default function Process() {
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

    const element = document.getElementById('proceso')
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [])

  return (
    <section id="proceso" className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            Cómo <span className="text-pastel-purple">Trabajamos</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Un proceso simple y sin complicaciones para que tu evento sea perfecto
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`relative transition-all duration-1000 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-pastel-pink via-pastel-lavender to-pastel-blue rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-4xl">{step.icon}</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8">
                      <Badge className="w-8 h-8 rounded-full flex items-center justify-center shadow-md border-2 border-pastel-purple bg-white text-pastel-purple text-sm font-bold p-0">
                        {step.number}
                      </Badge>
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-display font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    {step.description}
                  </p>
                </div>
                
                {/* Connector line (hidden on last item and mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-pastel-lavender to-transparent -z-10"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={`mt-12 md:mt-16 text-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        style={{ transitionDelay: '600ms' }}>
          <div className="inline-block bg-gradient-to-r from-pastel-pink/20 via-pastel-lavender/20 to-pastel-blue/20 rounded-xl md:rounded-2xl p-6 sm:p-8">
            <p className="text-base sm:text-lg text-gray-700 mb-4">
              <span className="font-bold text-gray-900">¿Tenés dudas?</span> ¡No hay problema!
            </p>
            <p className="text-gray-600 mb-6">
              Estamos para ayudarte en cada paso del proceso.
            </p>
            <Button asChild className="btn-primary">
              <Link href="/contacto">
                Consultanos sin compromiso
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

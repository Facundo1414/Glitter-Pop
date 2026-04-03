'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import contentData from '@/data/content.json'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useInView } from '@/hooks/useInView'

export default function Services() {
  const [services, setServices] = useState(contentData.services)
  const [sectionRef, isInView] = useInView<HTMLElement>()

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await fetch('/api/services', { cache: 'no-store' })
        if (!response.ok) return
        const data = await response.json()
        if (Array.isArray(data.services) && data.services.length > 0) {
          setServices(data.services)
        }
      } catch {
        // Keep JSON fallback
      }
    }

    void loadServices()
  }, [])

  return (
    <section ref={sectionRef} id="servicios" className="py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className={`section-title ${isInView ? 'animate-in fade-in-0 slide-in-from-bottom-4 duration-700' : 'opacity-0'}`}>
          Nuestros Servicios
        </h2>
        <p
          className={`section-subtitle ${isInView ? 'animate-in fade-in-0 slide-in-from-bottom-4 duration-700' : 'opacity-0'}`}
          style={{ animationDelay: isInView ? '100ms' : undefined }}
        >
          Dale brillo a tu evento con nuestros servicios profesionales de maquillaje artístico
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`group cursor-pointer active:scale-98 ${
                isInView ? 'animate-in fade-in-0 slide-in-from-bottom-4 duration-700' : 'opacity-0'
              }`}
              style={{ animationDelay: isInView ? `${index * 120}ms` : undefined }}
            >
              <Card className="h-full overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="h-28 sm:h-32 bg-linear-to-br from-pastel-lavender/30 to-pastel-pink/30 relative overflow-hidden">
                {typeof service.image === 'string' && service.image.trim() ? (
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl sm:text-6xl group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </span>
                  </div>
                )}
              </div>
              <CardContent className="p-5 sm:p-6">
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
              </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div
          className={`text-center mt-10 md:mt-12 px-4 ${isInView ? 'animate-in fade-in-0 slide-in-from-bottom-4 duration-700' : 'opacity-0'}`}
          style={{ animationDelay: isInView ? `${services.length * 120}ms` : undefined }}
        >
          <Button asChild className="btn-primary">
            <Link href="/contacto">
              Consultá por tu Evento
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

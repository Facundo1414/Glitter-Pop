'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import contentData from '@/data/content.json'

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState(contentData.portfolio)
  const [filter, setFilter] = useState('all')
  const [isVisible, setIsVisible] = useState(false)

  const categories = ['all', 'festival', 'kids', 'corporate', 'wedding', 'party', 'special']
  const categoryNames: { [key: string]: string } = {
    all: 'Todo',
    festival: 'Festivales',
    kids: 'Infantiles',
    corporate: 'Corporativos',
    wedding: 'Bodas',
    party: 'Fiestas',
    special: 'Especiales',
  }

  const filteredPortfolio = filter === 'all' 
    ? portfolio 
    : portfolio.filter(item => item.category === filter)

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const portfolioResponse = await fetch('/api/portfolio', { cache: 'no-store' })

        if (portfolioResponse.ok) {
          const portfolioData = await portfolioResponse.json()
          if (Array.isArray(portfolioData.portfolio)) {
            setPortfolio(portfolioData.portfolio)
          }
        }
      } catch {
        // Keep JSON fallback
      }
    }

    void loadPortfolio()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const section = document.getElementById('portfolio')
    if (section) {
      observer.observe(section)
    }

    return () => {
      if (section) {
        observer.unobserve(section)
      }
    }
  }, [])

  return (
    <section id="portfolio" className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className={`section-title transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          Nuestro Portfolio
        </h2>
        <p className={`section-subtitle transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          Algunos de nuestros trabajos más brillantes
        </p>

        {/* Filter buttons - Optimizados para móvil */}
        <div className={`flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 md:mb-12 px-2 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 active:scale-95 touch-manipulation ${
                filter === category
                  ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-xl scale-105 ring-2 ring-purple-600/50'
                  : 'bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 shadow-md border border-gray-200'
              }`}
            >
              {categoryNames[category]}
            </button>
          ))}
        </div>

        {/* Portfolio grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredPortfolio.map((item, index) => (
            <div
              key={item.id}
              className={`group relative aspect-square overflow-hidden rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl active:shadow-lg transition-all duration-700 cursor-pointer touch-manipulation ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 group-active:bg-black/70 transition-all duration-300 flex items-end">
                <div className="p-4 sm:p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-lg sm:text-xl font-bold mb-2">{item.title}</h3>
                  <span className="text-xs sm:text-sm bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    {categoryNames[item.category]}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPortfolio.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No hay proyectos en esta categoría aún.
          </div>
        )}
      </div>
    </section>
  )
}

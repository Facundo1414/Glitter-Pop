'use client'

import { useState } from 'react'
import Image from 'next/image'
import contentData from '@/data/content.json'
import { useEffect } from 'react'

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState(contentData.portfolio)
  const [portfolioMode, setPortfolioMode] = useState<'visible' | 'hidden' | 'comingsoon'>('visible')
  const [filter, setFilter] = useState('all')

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
        const [portfolioResponse, settingsResponse] = await Promise.all([
          fetch('/api/portfolio', { cache: 'no-store' }),
          fetch('/api/settings', { cache: 'no-store' }),
        ])

        if (portfolioResponse.ok) {
          const portfolioData = await portfolioResponse.json()
          if (Array.isArray(portfolioData.portfolio)) {
            setPortfolio(portfolioData.portfolio)
          }
        }

        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json()
          const mode = settingsData?.settings?.portfolio_mode
          if (mode === 'hidden' || mode === 'comingsoon' || mode === 'visible') {
            setPortfolioMode(mode)
          }
        }
      } catch {
        // Keep JSON fallback
      }
    }

    void loadPortfolio()
  }, [])

  if (portfolioMode === 'hidden') {
    return null
  }

  if (portfolioMode === 'comingsoon') {
    return (
      <section id="portfolio" className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="section-title">Nuestro Portfolio</h2>
          <p className="section-subtitle">Estamos preparando esta sección.</p>
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-pastel-lavender/20 to-pastel-pink/20 rounded-2xl p-10 border border-primary-100">
            <p className="text-2xl font-display font-bold text-gray-900">Próximamente ✨</p>
            <p className="text-gray-600 mt-3">Muy pronto vas a ver aquí nuestros mejores trabajos.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="portfolio" className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="section-title">
          Nuestro Portfolio
        </h2>
        <p className="section-subtitle">
          Algunos de nuestros trabajos más brillantes
        </p>

        {/* Filter buttons - Optimizados para móvil */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 md:mb-12 px-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 active:scale-95 touch-manipulation ${
                filter === category
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl scale-105 ring-2 ring-purple-600/50'
                  : 'bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 shadow-md border border-gray-200'
              }`}
            >
              {categoryNames[category]}
            </button>
          ))}
        </div>

        {/* Portfolio grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredPortfolio.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square overflow-hidden rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl active:shadow-lg transition-all duration-300 cursor-pointer touch-manipulation"
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

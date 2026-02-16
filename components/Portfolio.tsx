'use client'

import { useState } from 'react'
import Image from 'next/image'
import contentData from '@/data/content.json'

export default function Portfolio() {
  const { portfolio } = contentData
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

  return (
    <section id="portfolio" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="section-title">
          Nuestro <span className="glitter-text">Portfolio</span>
        </h2>
        <p className="section-subtitle">
          Algunos de nuestros trabajos más brillantes
        </p>

        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                filter === category
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl scale-105 ring-2 ring-purple-600/50'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md border border-gray-200'
              }`}
            >
              {categoryNames[category]}
            </button>
          ))}
        </div>

        {/* Portfolio grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPortfolio.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-300 flex items-end">
                <div className="p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <span className="text-sm bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
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

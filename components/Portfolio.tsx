'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import contentData from '@/data/content.json'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useInView } from '@/hooks/useInView'

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState(contentData.portfolio)
  const [filter, setFilter] = useState('all')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [sectionRef, isInView] = useInView<HTMLElement>()

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

  const lightboxItem = filteredPortfolio[lightboxIndex] ?? null

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

  // Close lightbox when filter changes
  useEffect(() => {
    setLightboxOpen(false)
  }, [filter])

  // Keyboard navigation in lightbox
  useEffect(() => {
    if (!lightboxOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        setLightboxIndex(i => Math.min(i + 1, filteredPortfolio.length - 1))
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setLightboxIndex(i => Math.max(i - 1, 0))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxOpen, filteredPortfolio.length])

  return (
    <section ref={sectionRef} id="portfolio" className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className={`section-title ${isInView ? 'animate-in fade-in-0 slide-in-from-bottom-4 duration-700' : 'opacity-0'}`}>
          Nuestro Portfolio
        </h2>
        <p
          className={`section-subtitle ${isInView ? 'animate-in fade-in-0 slide-in-from-bottom-4 duration-700' : 'opacity-0'}`}
          style={{ animationDelay: isInView ? '100ms' : undefined }}
        >
          Algunos de nuestros trabajos más brillantes
        </p>

        {/* Filter buttons */}
        <div
          className={`flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 md:mb-12 px-2 ${isInView ? 'animate-in fade-in-0 slide-in-from-bottom-4 duration-700' : 'opacity-0'}`}
          style={{ animationDelay: isInView ? '200ms' : undefined }}
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={filter === category ? 'default' : 'outline'}
              onClick={() => setFilter(category)}
              className={`rounded-full font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 active:scale-95 touch-manipulation px-4 sm:px-6 py-2 sm:py-3 h-auto ${
                filter === category
                  ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-xl scale-105 ring-2 ring-purple-600/50 border-none hover:opacity-90'
                  : 'bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 shadow-md border-gray-200'
              }`}
            >
              {categoryNames[category]}
            </Button>
          ))}
        </div>

        {/* Portfolio grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredPortfolio.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setLightboxIndex(index)
                setLightboxOpen(true)
              }}
              className={`group relative aspect-square overflow-hidden rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl active:shadow-lg transition-shadow duration-300 cursor-pointer touch-manipulation w-full ${
                isInView ? 'animate-in fade-in-0 slide-in-from-bottom-4 duration-700' : 'opacity-0'
              }`}
              style={{ animationDelay: isInView ? `${index * 100}ms` : undefined }}
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
                  <Badge variant="secondary" className="text-xs sm:text-sm bg-white/20 px-3 py-1 backdrop-blur-sm text-white border-none">
                    {categoryNames[item.category]}
                  </Badge>
                </div>
              </div>
            </button>
          ))}
        </div>

        {filteredPortfolio.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No hay proyectos en esta categoría aún.
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-w-4xl w-full p-0 border-none bg-black/95 overflow-hidden"
          aria-describedby={undefined}
        >
          <DialogTitle className="sr-only">
            {lightboxItem?.title ?? 'Imagen del portfolio'}
          </DialogTitle>
          {lightboxItem && (
            <div className="flex flex-col">
              {/* Image */}
              <div className="relative w-full aspect-4/3 sm:aspect-video">
                <Image
                  src={lightboxItem.image}
                  alt={lightboxItem.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 896px"
                  priority
                />
              </div>

              {/* Info + navigation bar */}
              <div className="flex items-center justify-between gap-4 px-4 py-3 bg-black/80">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-base sm:text-lg leading-tight truncate">
                    {lightboxItem.title}
                  </h3>
                  <Badge variant="secondary" className="mt-1 bg-white/20 text-white border-none text-xs">
                    {categoryNames[lightboxItem.category]}
                  </Badge>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(i => Math.max(i - 1, 0))}
                    disabled={lightboxIndex === 0}
                    className="p-2 rounded-full text-white hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Anterior"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <span className="text-white/60 text-sm w-12 text-center tabular-nums">
                    {lightboxIndex + 1}/{filteredPortfolio.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(i => Math.min(i + 1, filteredPortfolio.length - 1))}
                    disabled={lightboxIndex === filteredPortfolio.length - 1}
                    className="p-2 rounded-full text-white hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Siguiente"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </div>
              </div>

              {/* Close button */}
              <DialogClose className="absolute top-3 right-3 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50">
                <X className="size-5" />
                <span className="sr-only">Cerrar</span>
              </DialogClose>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}

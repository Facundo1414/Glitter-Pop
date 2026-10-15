'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { loadPublicPortfolio } from '@/lib/public-content'
import { portfolioCategoryNames } from '@/lib/portfolio-categories'

type PortfolioItem = Awaited<ReturnType<typeof loadPublicPortfolio>>[number]

export default function Portfolio({ portfolio }: { portfolio: PortfolioItem[] }) {
  const [filter, setFilter] = useState('all')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const categories = ['all', ...new Set(portfolio.map((item) => item.category))]

  const filteredPortfolio = filter === 'all' 
    ? portfolio 
    : portfolio.filter(item => item.category === filter)

  const lightboxItem = filteredPortfolio[lightboxIndex] ?? null

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
    <section id="portfolio" className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <h2 className="font-display text-5xl font-bold leading-none text-[var(--brand-ink)] md:text-6xl">
          Nuestro Portfolio
        </h2>
        <p className="mt-4 text-[var(--brand-ink)]/75">
          Mirá el Glitter Bar, los maquillajes y los detalles de nuestros eventos.
        </p>

        {/* Filter buttons */}
        <div className="mb-10 flex flex-wrap justify-center gap-2 px-2 sm:gap-3 md:mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={filter === category ? 'default' : 'outline'}
              onClick={() => setFilter(category)}
              className={`min-h-11 rounded-full px-4 py-2 text-sm font-semibold transition-colors touch-manipulation sm:px-6 ${
                filter === category
                  ? 'bg-[var(--brand-pink-dark)] text-white border-none'
                  : 'border-[var(--brand-ink)]/20 bg-white text-[var(--brand-ink)] hover:bg-[var(--brand-cream)]'
              }`}
            >
              {portfolioCategoryNames[category] || category}
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
              className="group relative aspect-[3/4] w-full cursor-pointer touch-manipulation overflow-hidden rounded-2xl bg-[var(--brand-cream)] text-left shadow-sm transition-shadow hover:shadow-lg focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[var(--brand-pink-dark)]"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-end bg-linear-to-t from-black/75 via-black/30 to-transparent pt-20">
                <div className="p-4 text-white sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-2">{item.title}</h3>
                  <Badge variant="secondary" className="text-xs sm:text-sm bg-white/20 px-3 py-1 backdrop-blur-sm text-white border-none">
                    {portfolioCategoryNames[item.category] || item.category}
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
                    {portfolioCategoryNames[lightboxItem.category] || lightboxItem.category}
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

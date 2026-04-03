"use client"

import { useEffect, useState } from 'react'
import Portfolio from '@/components/Portfolio'
import Gallery from '@/components/Gallery'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function PortfolioPage() {
  const [portfolioMode, setPortfolioMode] = useState<'visible' | 'hidden' | 'comingsoon' | null>(null)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings', { cache: 'no-store' })
        if (!response.ok) {
          setPortfolioMode('visible')
          return
        }
        const data = await response.json()
        const mode = data?.settings?.portfolio_mode
        if (mode === 'visible' || mode === 'hidden' || mode === 'comingsoon') {
          setPortfolioMode(mode)
        } else {
          setPortfolioMode('visible')
        }
      } catch {
        setPortfolioMode('visible')
      }
    }

    void loadSettings()
  }, [])

  return (
    <main className="min-h-screen bg-white">
      <div className="pt-24">
        {portfolioMode === null && (
          <section className="py-16 md:py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 text-center">
              <p className="text-gray-500">Cargando portfolio...</p>
            </div>
          </section>
        )}

        {portfolioMode === 'visible' && (
          <>
            <Portfolio />
            <Gallery />
          </>
        )}

        {portfolioMode === 'comingsoon' && (
          <section className="py-16 md:py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 text-center">
              <h2 className="section-title">Nuestro Portfolio</h2>
              <p className="section-subtitle">Estamos preparando esta sección.</p>
              <div className="max-w-3xl mx-auto bg-linear-to-r from-pastel-lavender/20 to-pastel-pink/20 rounded-2xl p-10 border border-primary-100">
                <p className="text-2xl font-display font-bold text-gray-900">Próximamente ✨</p>
                <p className="text-gray-600 mt-3">Muy pronto vas a ver aquí nuestros mejores trabajos.</p>
              </div>
            </div>
          </section>
        )}

        {portfolioMode === 'hidden' && (
          <section className="py-16 md:py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 text-center">
              <div className="max-w-2xl mx-auto bg-gray-50 rounded-2xl p-10 border border-gray-200">
                <p className="text-2xl font-display font-bold text-gray-900">Portfolio oculto temporalmente</p>
                <p className="text-gray-600 mt-3">Esta sección no está disponible por el momento.</p>
              </div>
            </div>
          </section>
        )}
      </div>
      <Footer />
      <WhatsAppButton />
    </main>
  )
}

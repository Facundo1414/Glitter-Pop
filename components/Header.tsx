'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (path: string) => pathname === path

  const getPageTitle = () => {
    switch (pathname) {
      case '/':
        return 'Inicio'
      case '/servicios':
        return 'Servicios'
      case '/nosotras':
        return 'Nosotras'
      case '/portfolio':
        return 'Portfolio'
      case '/contacto':
        return 'Contacto'
      default:
        return 'Glitter Pop'
    }
  }

  return (
    <>
      {/* Header superior - Desktop y Mobile */}
      <header
      className={`fixed top-0 left-0 right-0 z-[1000] pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 transition-colors duration-200 md:py-3 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : isHome
            ? 'bg-[var(--brand-mint)]/95'
            : 'bg-white/95 backdrop-blur-sm shadow-sm'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between gap-3">
          <Link href="/" aria-label="Glitter Pop, ir al inicio" className="shrink-0">
            <div className="relative h-11 w-[78px] overflow-hidden rounded-lg bg-[#2abbb8] md:h-14 md:w-[98px]">
              <Image
                src="/images/logo-glitter-pop.jpg"
                alt=""
                fill
                sizes="(max-width: 767px) 78px, 98px"
                className="scale-[1.2] object-cover"
                priority
              />
            </div>
          </Link>
            <p className="ml-auto text-right font-display text-lg font-bold text-[var(--brand-ink)] md:hidden">{getPageTitle()}</p>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2 lg:space-x-6">
              <Button asChild variant="ghost" className={`font-semibold transition-colors duration-300 px-4 py-2 rounded-lg ${
                  isActive('/') 
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-primary-50 hover:text-gray-900'
                }`}>
                <Link href="/">Inicio</Link>
              </Button>
              <Button asChild variant="ghost" className={`font-semibold transition-colors duration-300 px-4 py-2 rounded-lg ${
                  isActive('/servicios') 
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-primary-50 hover:text-gray-900'
                }`}>
                <Link href="/servicios">Servicios</Link>
              </Button>
              <Button asChild variant="ghost" className={`font-semibold transition-colors duration-300 px-4 py-2 rounded-lg ${
                  isActive('/nosotras') 
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-primary-50 hover:text-gray-900'
                }`}>
                <Link href="/nosotras">Nosotras</Link>
              </Button>
              <Button asChild variant="ghost" className={`font-semibold transition-colors duration-300 px-4 py-2 rounded-lg ${
                  isActive('/portfolio') 
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-primary-50 hover:text-gray-900'
                }`}>
                <Link href="/portfolio">Portfolio</Link>
              </Button>
              <Button asChild className="btn-primary ml-2 transform  hover:shadow-xl transition-colors duration-300">
                <Link href="/contacto">Contacto</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Bottom Tab Bar - Solo Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur-xl shadow-2xl border-t border-gray-200 pb-safe">
        <div className="grid grid-cols-5 gap-1 px-2 py-2">
          {/* Inicio */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-colors duration-200 touch-manipulation ${
              isActive('/') 
                ? 'text-primary-700'
                : 'text-gray-600 active:bg-gray-100'
            }`}
          >
            <svg className={`w-6 h-6 mb-1 transition-transform ${isActive('/') ? 'scale-110' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive('/') ? 2.5 : 2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className={`text-xs font-medium ${isActive('/') ? 'font-bold' : ''}`}>Inicio</span>
          </Link>

          {/* Servicios */}
          <Link
            href="/servicios"
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-colors duration-200 touch-manipulation ${
              isActive('/servicios') 
                ? 'text-primary-700'
                : 'text-gray-600 active:bg-gray-100'
            }`}
          >
            <svg className={`w-6 h-6 mb-1 transition-transform ${isActive('/servicios') ? 'scale-110' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive('/servicios') ? 2.5 : 2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className={`text-xs font-medium ${isActive('/servicios') ? 'font-bold' : ''}`}>Servicios</span>
          </Link>

          <Link
            href="/nosotras"
            className={`flex flex-col items-center justify-center rounded-xl px-1 py-2 text-center transition-colors duration-200 ${isActive('/nosotras') ? 'text-primary-700': 'text-gray-600 active:bg-gray-100'}`}
          >
            <svg className="mb-1 h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m16-10a4 4 0 1 0-2-7.5M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8 4a4 4 0 0 1 5 4v2" />
            </svg>
            <span className="text-[10px] font-semibold sm:text-xs">Nosotras</span>
          </Link>

          {/* Portfolio */}
          <Link
            href="/portfolio"
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-colors duration-200 touch-manipulation ${
              isActive('/portfolio')
                ? 'text-primary-700'
                : 'text-gray-600 active:bg-gray-100'
            }`}
          >
            <svg className={`w-6 h-6 mb-1 transition-transform ${isActive('/portfolio') ? 'scale-110' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive('/portfolio') ? 2.5 : 2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className={`text-xs font-medium ${isActive('/portfolio') ? 'font-bold' : ''}`}>Portfolio</span>
          </Link>

          {/* Contacto */}
          <Link
            href="/contacto"
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-colors duration-200 touch-manipulation ${
              isActive('/contacto') 
                ? 'text-primary-700'
                : 'text-gray-600 active:bg-gray-100'
            }`}
          >
            <svg className={`w-6 h-6 mb-1 transition-transform ${isActive('/contacto') ? 'scale-110' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive('/contacto') ? 2.5 : 2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className={`text-xs font-medium ${isActive('/contacto') ? 'font-bold' : ''}`}>Contacto</span>
          </Link>
        </div>
      </nav>
    </>
  )
}

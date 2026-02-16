'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

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
      case '/paquetes':
        return 'Paquetes'
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
      className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-xl py-3 md:py-3' 
          : 'bg-white/80 backdrop-blur-sm shadow-md py-4 md:py-6'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-center md:justify-between">
            {/* Título de página - Solo Mobile */}
            <h1 className="md:hidden text-lg font-display font-bold text-gray-900">
              {getPageTitle()}
            </h1>

            {/* Logo - Solo Desktop */}
          <Link 
            href="/"
            className="hidden md:flex group relative items-center transition-transform duration-300 hover:scale-105"
          >
            <div className={`relative overflow-hidden rounded-xl transition-all duration-300 ${
              isScrolled 
                ? 'ring-2 ring-pastel-lavender/30 shadow-lg shadow-pastel-lavender/20' 
                : 'ring-2 ring-pastel-lavender/40 shadow-lg shadow-pastel-lavender/30'
            } group-hover:ring-4 ${
              isScrolled 
                ? 'group-hover:ring-pastel-lavender/50 group-hover:shadow-xl group-hover:shadow-pastel-lavender/30' 
                : 'group-hover:ring-pastel-lavender/60 group-hover:shadow-xl group-hover:shadow-pastel-lavender/40'
            }`}>
              <Image
                src="/images/logoGlitterPop.webp"
                alt="Glitter Pop Logo"
                width={200}
                height={70}
                className={`h-14 w-auto object-cover transition-all duration-300 ${
                  isScrolled ? 'brightness-100' : 'brightness-110'
                } group-hover:brightness-110 group-hover:scale-105`}
                priority
              />
              {/* Brillo efecto */}
              <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/0 to-transparent group-hover:via-white/20 transition-all duration-500 opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full"></div>
            </div>
          </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2 lg:space-x-6">
              <Link
                href="/"
                className={`relative font-semibold transition-all duration-300 px-4 py-2 rounded-lg ${
                  isActive('/') 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                Inicio
              </Link>
              <Link
                href="/servicios"
                className={`relative font-semibold transition-all duration-300 px-4 py-2 rounded-lg ${
                  isActive('/servicios') 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                Servicios
              </Link>
              <Link
                href="/nosotras"
                className={`relative font-semibold transition-all duration-300 px-4 py-2 rounded-lg ${
                  isActive('/nosotras') 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                Nosotras
              </Link>
              <Link
                href="/portfolio"
                className={`relative font-semibold transition-all duration-300 px-4 py-2 rounded-lg ${
                  isActive('/portfolio') 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                Portfolio
              </Link>
              <Link
                href="/paquetes"
                className={`relative font-semibold transition-all duration-300 px-4 py-2 rounded-lg ${
                  isActive('/paquetes') 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                Paquetes
              </Link>
              <Link
                href="/contacto"
                className="btn-primary ml-2 transform hover:scale-105 hover:shadow-xl transition-all duration-300"
              >
                Contacto
              </Link>
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
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 touch-manipulation ${
              isActive('/') 
                ? 'text-purple-600' 
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
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 touch-manipulation ${
              isActive('/servicios') 
                ? 'text-purple-600' 
                : 'text-gray-600 active:bg-gray-100'
            }`}
          >
            <svg className={`w-6 h-6 mb-1 transition-transform ${isActive('/servicios') ? 'scale-110' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive('/servicios') ? 2.5 : 2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className={`text-xs font-medium ${isActive('/servicios') ? 'font-bold' : ''}`}>Servicios</span>
          </Link>

          {/* Portfolio - Centro */}
          <Link
            href="/portfolio"
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 touch-manipulation ${
              isActive('/portfolio') 
                ? 'text-purple-600' 
                : 'text-gray-600 active:bg-gray-100'
            }`}
          >
            <svg className={`w-6 h-6 mb-1 transition-transform ${isActive('/portfolio') ? 'scale-110' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive('/portfolio') ? 2.5 : 2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className={`text-xs font-medium ${isActive('/portfolio') ? 'font-bold' : ''}`}>Portfolio</span>
          </Link>

          {/* Paquetes */}
          <Link
            href="/paquetes"
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 touch-manipulation ${
              isActive('/paquetes') 
                ? 'text-purple-600' 
                : 'text-gray-600 active:bg-gray-100'
            }`}
          >
            <svg className={`w-6 h-6 mb-1 transition-transform ${isActive('/paquetes') ? 'scale-110' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive('/paquetes') ? 2.5 : 2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className={`text-xs font-medium ${isActive('/paquetes') ? 'font-bold' : ''}`}>Paquetes</span>
          </Link>

          {/* Contacto */}
          <Link
            href="/contacto"
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 touch-manipulation ${
              isActive('/contacto') 
                ? 'text-purple-600' 
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

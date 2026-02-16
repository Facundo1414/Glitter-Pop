'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (path: string) => pathname === path

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-xl py-3' 
          : 'bg-white/80 backdrop-blur-sm shadow-md py-6'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo mejorado */}
          <Link 
            href="/"
            className="group relative flex items-center transition-transform duration-300 hover:scale-105"
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
                src="/images/logoGlitterPop.jpg"
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

          {/* Desktop Navigation mejorado */}
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

          {/* Mobile menu button mejorado */}
          <button
            className={`md:hidden p-2 rounded-lg transition-all duration-300 ${
              isScrolled 
                ? 'bg-primary-50 hover:bg-primary-100 text-primary-600' 
                : 'bg-white/70 hover:bg-white text-gray-700 backdrop-blur-sm shadow-md'
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 transition-transform duration-300"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation mejorado */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-6 pb-4 space-y-2 animate-fade-in">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block w-full text-left py-3 px-4 rounded-lg ${
                isActive('/') 
                  ? 'bg-primary-100 text-primary-600' 
                  : 'bg-primary-50 text-gray-700 hover:bg-primary-100 hover:text-primary-600'
              } transition-all duration-300 font-semibold`}
            >
              ✨ Inicio
            </Link>
            <Link
              href="/servicios"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block w-full text-left py-3 px-4 rounded-lg ${
                isActive('/servicios') 
                  ? 'bg-primary-100 text-primary-600' 
                  : 'bg-primary-50 text-gray-700 hover:bg-primary-100 hover:text-primary-600'
              } transition-all duration-300 font-semibold`}
            >
              💼 Servicios
            </Link>
            <Link
              href="/nosotras"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block w-full text-left py-3 px-4 rounded-lg ${
                isActive('/nosotras') 
                  ? 'bg-primary-100 text-primary-600' 
                  : 'bg-primary-50 text-gray-700 hover:bg-primary-100 hover:text-primary-600'
              } transition-all duration-300 font-semibold`}
            >
              👥 Nosotras
            </Link>
            <Link
              href="/portfolio"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block w-full text-left py-3 px-4 rounded-lg ${
                isActive('/portfolio') 
                  ? 'bg-primary-100 text-primary-600' 
                  : 'bg-primary-50 text-gray-700 hover:bg-primary-100 hover:text-primary-600'
              } transition-all duration-300 font-semibold`}
            >
              🎨 Portfolio
            </Link>
            <Link
              href="/paquetes"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block w-full text-left py-3 px-4 rounded-lg ${
                isActive('/paquetes') 
                  ? 'bg-primary-100 text-primary-600' 
                  : 'bg-primary-50 text-gray-700 hover:bg-primary-100 hover:text-primary-600'
              } transition-all duration-300 font-semibold`}
            >
              📦 Paquetes
            </Link>
            <Link
              href="/contacto"
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn-primary w-full mt-4 text-center hover:scale-105 block"
            >
              💌 Contacto
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}

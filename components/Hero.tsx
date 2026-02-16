'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import contentData from '@/data/content.json'

export default function Hero() {
  const { business } = contentData
  const [sparkles, setSparkles] = useState<Array<{ left: number; top: number; delay: number; size: number }>>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Generar posiciones aleatorias solo en el cliente
    setSparkles(
      Array.from({ length: 30 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 3,
        size: Math.random() * 1.5 + 0.5,
      }))
    )
  }, [])

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-pastel-lavender via-pastel-pink to-pastel-peach"
    >
      {/* Animated background elements - Mejorados */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 -left-20 w-96 h-96 bg-pastel-yellow rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-float"></div>
        <div className="absolute top-20 right-10 w-80 h-80 bg-pastel-pink rounded-full mix-blend-multiply filter blur-2xl opacity-35 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-pastel-blue rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-10 right-1/4 w-80 h-80 bg-pastel-peach rounded-full mix-blend-multiply filter blur-2xl opacity-35 animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Geometric decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/4 right-10 w-32 h-32 border-4 border-white rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-1/3 left-16 w-24 h-24 border-4 border-white rotate-45" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/30 rounded-lg animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Enhanced Sparkle effects */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none">
          {sparkles.map((sparkle, i) => (
            <div
              key={i}
              className="absolute text-white/70 animate-sparkle"
              style={{
                left: `${sparkle.left}%`,
                top: `${sparkle.top}%`,
                animationDelay: `${sparkle.delay}s`,
                fontSize: `${sparkle.size}rem`,
              }}
            >
              ✨
            </div>
          ))}
        </div>
      )}

      {/* Main Content - Layout Grid Asimétrico */}
      <div className="relative z-10 container mx-auto px-4 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
          
          {/* Left Column - Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Logo with enhanced animation */}
            <div className="flex justify-center lg:justify-start animate-fade-in">
              <div className="relative group">
                <div className="absolute -inset-6 bg-gradient-to-r from-pastel-lavender via-pastel-pink to-pastel-peach rounded-full opacity-30 blur-3xl group-hover:opacity-60 transition-all duration-700 animate-pulse-slow"></div>
                <div className="relative">
                  <Image
                    src="/images/logoGlitterPop.webp"
                    alt="Glitter Pop Logo"
                    width={350}
                    height={120}
                    className="h-24 md:h-32 w-auto object-contain drop-shadow-2xl hover:scale-110 transition-transform duration-500"
                    priority
                  />
                </div>
              </div>
            </div>
            
            {/* Tagline con estilo mejorado */}
            <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-gray-800 font-bold font-display leading-tight">
                {business.tagline}
              </h1>
              <div className="flex justify-center lg:justify-start">
                <div className="h-1.5 w-32 bg-gradient-to-r from-pastel-lavender via-pastel-pink to-pastel-peach rounded-full"></div>
              </div>
            </div>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-xl mx-auto lg:mx-0 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {business.description}
            </p>
            
            {/* CTA Buttons con diseño mejorado */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <Link
                href="/contacto"
                className="group relative overflow-hidden px-8 py-4 rounded-full bg-gradient-to-r from-pastel-lavender to-pastel-pink text-white font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  ✨ Reservá tu Evento
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pastel-pink to-pastel-lavender opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                href="/servicios"
                className="group px-8 py-4 rounded-full bg-white/80 backdrop-blur-sm border-2 border-pastel-lavender text-pastel-lavender font-semibold text-lg shadow-lg hover:shadow-xl hover:bg-pastel-lavender hover:text-white transform hover:-translate-y-1 transition-all duration-300"
              >
                Ver Servicios →
              </Link>
            </div>

            {/* Stats rediseñadas con iconos */}
            <div className="grid grid-cols-3 gap-6 pt-8 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <div className="text-center lg:text-left group hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                  <span className="text-3xl">🎉</span>
                </div>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pastel-lavender to-pastel-pink bg-clip-text text-transparent">
                  500+
                </div>
                <div className="text-xs md:text-sm text-gray-700 font-medium">Eventos Realizados</div>
              </div>

              <div className="text-center lg:text-left group hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                  <span className="text-3xl">⭐</span>
                </div>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pastel-lavender to-pastel-pink bg-clip-text text-transparent">
                  5.0
                </div>
                <div className="text-xs md:text-sm text-gray-700 font-medium">Calificación</div>
              </div>

              <div className="text-center lg:text-left group hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                  <span className="text-3xl">💖</span>
                </div>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pastel-lavender to-pastel-pink bg-clip-text text-transparent">
                  100%
                </div>
                <div className="text-xs md:text-sm text-gray-700 font-medium">Clientes Felices</div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual Element */}
          <div className="relative animate-fade-in lg:block" style={{ animationDelay: '0.4s' }}>
            <div className="relative">
              {/* Decorative background card - solo en desktop */}
              <div className="hidden lg:block absolute inset-0 bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-sm rounded-3xl transform rotate-3 shadow-2xl"></div>
              <div className="hidden lg:block absolute inset-0 bg-gradient-to-tl from-pastel-pink/30 to-pastel-lavender/30 rounded-3xl transform -rotate-3 shadow-2xl"></div>
              
              {/* Main content card */}
              <div className="relative bg-white/50 backdrop-blur-md rounded-2xl lg:rounded-3xl p-4 md:p-6 lg:p-8 shadow-xl lg:shadow-2xl border border-white/60">
                {/* Galería de imágenes reales del portfolio */}
                <div className="space-y-3 md:space-y-4">
                  <div className="text-center mb-3 md:mb-4">
                    <div className="inline-block text-3xl md:text-4xl mb-2 animate-bounce">✨</div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 font-display">
                      Nuestro Trabajo
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 mt-1">
                      Maquillaje artístico que transforma
                    </p>
                  </div>
                  
                  {/* Grid de imágenes del portfolio */}
                  <div className="grid grid-cols-2 gap-2 md:gap-3">
                    <div className="relative aspect-square rounded-lg lg:rounded-xl overflow-hidden group">
                      <Image
                        src="/images/image 1.png"
                        alt="Festival de Verano"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-2 left-2 text-white text-xs md:text-sm font-semibold">
                          Festival
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative aspect-square rounded-lg lg:rounded-xl overflow-hidden group">
                      <Image
                        src="/images/image 4.png"
                        alt="Boda Mágica"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-2 left-2 text-white text-xs md:text-sm font-semibold">
                          Bodas
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative aspect-square rounded-lg lg:rounded-xl overflow-hidden group">
                      <Image
                        src="/images/image 5.png"
                        alt="Fiesta Neon"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-2 left-2 text-white text-xs md:text-sm font-semibold">
                          Fiestas
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative aspect-square rounded-lg lg:rounded-xl overflow-hidden group">
                      <Image
                        src="/images/image 2.png"
                        alt="Cumpleaños Ana"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-2 left-2 text-white text-xs md:text-sm font-semibold">
                          Infantiles
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Link a portfolio */}
                  <div className="text-center pt-2">
                    <Link 
                      href="/portfolio"
                      className="inline-flex items-center gap-2 text-sm md:text-base text-pastel-lavender hover:text-pastel-pink font-semibold transition-colors group"
                    >
                      Ver más trabajos
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </div>

                {/* Decorative elements - solo en desktop */}
                <div className="hidden lg:block absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-pastel-pink to-pastel-peach rounded-full opacity-60 blur-xl"></div>
                <div className="hidden lg:block absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-pastel-lavender to-pastel-blue rounded-full opacity-60 blur-xl"></div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Enhanced Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center gap-2 text-gray-700/80 hover:text-gray-800 transition-colors cursor-pointer group">
          <span className="text-xs font-medium uppercase tracking-wider">Descubre más</span>
          <svg
            className="w-6 h-6 group-hover:translate-y-1 transition-transform"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>
    </section>
  )
}

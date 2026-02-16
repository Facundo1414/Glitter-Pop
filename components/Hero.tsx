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
    // Generar posiciones aleatorias solo en desktop
    const sparkleCount = window.innerWidth < 640 ? 0 : 30
    setSparkles(
      Array.from({ length: sparkleCount }, () => ({
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
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-[#FFF0F5] md:bg-gradient-to-br md:from-pastel-lavender md:via-pastel-pink md:to-pastel-peach pt-16 md:pt-24"
    >
      {/* Animated background elements - Minimalistas en móvil */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="hidden sm:block absolute top-10 -left-20 w-96 h-96 bg-pastel-yellow rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-float"></div>
        <div className="hidden md:block absolute top-20 right-0 w-48 sm:w-80 h-48 sm:h-80 bg-pastel-pink rounded-full mix-blend-multiply filter blur-2xl opacity-20 sm:opacity-35 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="hidden sm:block absolute bottom-20 left-1/3 w-96 h-96 bg-pastel-blue rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="hidden md:block absolute bottom-0 left-0 w-48 sm:w-80 h-48 sm:h-80 bg-pastel-peach rounded-full mix-blend-multiply filter blur-2xl opacity-20 sm:opacity-35 animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Geometric decorative elements - simplificados en móvil */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="hidden sm:block absolute top-1/4 right-10 w-32 h-32 border-4 border-white rounded-full animate-spin-slow"></div>
        <div className="hidden sm:block absolute bottom-1/3 left-16 w-24 h-24 border-4 border-white rotate-45" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/30 rounded-lg animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Enhanced Sparkle effects - Oculto en móvil */}
      {mounted && (
        <div className="hidden sm:block absolute inset-0 pointer-events-none">
          {sparkles.map((sparkle, i) => (
            <div
              key={i}
              className="absolute text-purple-600/60 animate-sparkle"
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

      {/* Main Content - Layout optimizado para móvil */}
      <div className="relative z-10 container mx-auto px-6 py-8 md:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 items-center max-w-7xl mx-auto">
          
          {/* Left Column - Content - diseño vertical minimalista en móvil */}
          <div className="text-center lg:text-left space-y-6 sm:space-y-5 md:space-y-4">
            
            {/* Logo y Tagline optimizados para mobile */}
            <div className="animate-fade-in pt-4 sm:pt-0 space-y-4" style={{ animationDelay: '0.2s' }}>
              
              {/* Logo recortado - solo mobile */}
              <div className="sm:hidden w-full h-24 overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src="/images/logoGlitterPop.webp"
                  alt="Glitter Pop Logo"
                  width={800}
                  height={200}
                  className="w-full h-full object-cover object-center"
                  priority
                />
              </div>
            
              {/* Título */}
              <div className="space-y-2 md:space-y-2 px-4 sm:px-0">
                <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-4xl text-gray-900 font-bold font-display leading-tight">
                  {business.tagline}
                </h1>
                
                <div className="flex justify-center lg:justify-start pt-1">
                  <div className="h-1 w-24 md:w-28 bg-gradient-to-r from-pastel-lavender via-pastel-pink to-pastel-peach rounded-full"></div>
                </div>
                {/* Subtítulo breve solo en móvil */}
                <p className="sm:hidden text-sm text-gray-700 pt-2 font-medium leading-relaxed">
                  Maquillaje artístico para tu evento especial
                </p>
              </div>
            </div>
            
            {/* Description - Oculta en móvil */}
            <p className="hidden sm:block text-sm md:text-base lg:text-base text-gray-800 leading-relaxed max-w-xl mx-auto lg:mx-0 animate-fade-in px-4 md:px-0" style={{ animationDelay: '0.4s' }}>
              {business.description}
            </p>
            
            {/* CTA Buttons - un solo botón destacado en móvil */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-3 justify-center lg:justify-start animate-fade-in px-6 sm:px-4 md:px-0 pt-2" style={{ animationDelay: '0.4s' }}>
              <Link
                href="/contacto"
                className="group relative overflow-hidden px-8 md:px-8 py-3.5 md:py-3 rounded-full bg-gradient-to-r from-pastel-lavender to-pastel-pink text-purple-900 font-bold text-base md:text-sm shadow-2xl hover:shadow-2xl active:scale-95 transform hover:-translate-y-1 transition-all duration-300 touch-manipulation"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  ✨ Reservá tu Evento
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pastel-pink to-pastel-lavender opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                href="/servicios"
                className="group px-6 md:px-6 py-2.5 md:py-2.5 rounded-full bg-transparent border-2 border-purple-400 text-purple-700 font-semibold text-sm md:text-sm hover:bg-white/50 active:scale-95 transform transition-all duration-300 touch-manipulation"
              >
                Ver Servicios →
              </Link>
            </div>

            {/* Stats rediseñadas con iconos */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 pt-3 md:pt-4 animate-fade-in px-2 sm:px-0" style={{ animationDelay: '0.8s' }}>
              <div className="text-center lg:text-left group hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-center lg:justify-start gap-1 mb-0.5">
                  <span className="text-lg sm:text-xl md:text-xl">🎉</span>
                </div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-purple-700">
                  500+
                </div>
                <div className="text-[9px] sm:text-[10px] md:text-xs text-gray-800 font-semibold leading-tight">Eventos Realizados</div>
              </div>

              <div className="text-center lg:text-left group hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-center lg:justify-start gap-1 mb-0.5">
                  <span className="text-lg sm:text-xl md:text-xl">⭐</span>
                </div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-purple-700">
                  5.0
                </div>
                <div className="text-[9px] sm:text-[10px] md:text-xs text-gray-800 font-semibold leading-tight">Calificación</div>
              </div>

              <div className="text-center lg:text-left group hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-center lg:justify-start gap-1 mb-0.5">
                  <span className="text-lg sm:text-xl md:text-xl">💖</span>
                </div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-purple-700">
                  100%
                </div>
                <div className="text-[9px] sm:text-[10px] md:text-xs text-gray-800 font-semibold leading-tight">Clientes Felices</div>
              </div>
            </div>

            {/* Galería compacta para móvil */}
            <div className="lg:hidden mt-6 animate-fade-in" style={{ animationDelay: '1s' }}>
              <div className="text-center mb-3">
                <span className="text-2xl animate-bounce inline-block">✨</span>
              </div>
              <div className="grid grid-cols-2 gap-3 px-4">
                <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg ring-2 ring-white/50">
                  <Image
                    src="/images/image 1.png"
                    alt="Festival"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-transparent flex items-end">
                    <span className="text-white text-xs font-semibold p-2">Festivales</span>
                  </div>
                </div>
                <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg ring-2 ring-white/50">
                  <Image
                    src="/images/image 4.png"
                    alt="Bodas"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-transparent flex items-end">
                    <span className="text-white text-xs font-semibold p-2">Bodas</span>
                  </div>
                </div>
              </div>
              <div className="text-center mt-3">
                <Link 
                  href="/portfolio"
                  className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-pink-600 font-semibold transition-colors"
                >
                  Ver más trabajos
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Visual Element - Oculto en móvil */}
          <div className="hidden lg:block relative animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="relative">
              {/* Decorative background card - solo en desktop */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-sm rounded-3xl transform rotate-3 shadow-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-pastel-pink/30 to-pastel-lavender/30 rounded-3xl transform -rotate-3 shadow-2xl"></div>
              
              {/* Main content card */}
              <div className="relative bg-white/50 backdrop-blur-md rounded-2xl lg:rounded-3xl p-2.5 md:p-3 lg:p-5 shadow-xl lg:shadow-2xl border border-white/60">
                {/* Galería de imágenes reales del portfolio */}
                <div className="space-y-1.5 md:space-y-2">
                  <div className="text-center mb-1.5 md:mb-2">
                    <div className="inline-block text-xl md:text-2xl mb-0.5 animate-bounce">✨</div>
                    <h3 className="text-base md:text-lg font-bold text-gray-800 font-display">
                      Nuestro Trabajo
                    </h3>
                    <p className="text-[10px] md:text-xs text-gray-600 mt-0.5">
                      Maquillaje artístico que transforma
                    </p>
                  </div>
                  
                  {/* Grid de imágenes del portfolio - simplificado en móvil */}
                  <div className="grid grid-cols-2 gap-2 md:gap-2.5">
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
                    
                    {/* Mostrar solo en tablet y desktop */}
                    <div className="hidden sm:block relative aspect-square rounded-lg lg:rounded-xl overflow-hidden group">
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
                    
                    <div className="hidden sm:block relative aspect-square rounded-lg lg:rounded-xl overflow-hidden group">
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
                  <div className="text-center pt-1 md:pt-1.5">
                    <Link 
                      href="/portfolio"
                      className="inline-flex items-center gap-1 text-[10px] md:text-xs text-purple-600 hover:text-pink-600 font-semibold transition-colors group"
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

      {/* Scroll indicator - animado */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-purple-600 font-semibold hidden sm:block">Deslizá para ver más</span>
          <div className="w-6 h-10 border-2 border-purple-400 rounded-full flex justify-center">
            <div className="w-1.5 h-2 bg-purple-500 rounded-full mt-2 animate-scroll"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

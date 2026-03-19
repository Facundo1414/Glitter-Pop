'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import contentData from '@/data/content.json'

type HeroDesktopVariant = 'desktop_v1' | 'desktop_v2' | 'desktop_v3'
type HeroMobileVariant = 'mobile_v1' | 'mobile_v2'
type HeroPortfolioItem = {
  id: string
  title: string
  image: string
}

export default function Hero() {
  const { business } = contentData
  const [heroTitle, setHeroTitle] = useState('')
  const [heroSubtitle, setHeroSubtitle] = useState('')
  const [desktopVariant, setDesktopVariant] = useState<HeroDesktopVariant>('desktop_v1')
  const [mobileVariant, setMobileVariant] = useState<HeroMobileVariant>('mobile_v1')
  const [heroImageDesktopV1, setHeroImageDesktopV1] = useState('')
  const [heroImageDesktopV2, setHeroImageDesktopV2] = useState('')
  const [heroImageDesktopV3, setHeroImageDesktopV3] = useState('')
  const [heroImageMobileV1, setHeroImageMobileV1] = useState('')
  const [heroImageMobileV2, setHeroImageMobileV2] = useState('')
  const [heroPortfolio, setHeroPortfolio] = useState<HeroPortfolioItem[]>([])
  const [activeSlide, setActiveSlide] = useState(0)
  const [sparkles, setSparkles] = useState<
    Array<{ left: number; top: number; delay: number; size: number }>
  >([])
  const [mounted, setMounted] = useState(false)
  const [isSettingsReady, setIsSettingsReady] = useState(false)
  const carouselImages = useMemo(
    () =>
      [heroImageDesktopV1, heroImageDesktopV2, heroImageDesktopV3, heroImageMobileV1, heroImageMobileV2]
        .map((item) => item.trim())
        .filter(Boolean),
    [heroImageDesktopV1, heroImageDesktopV2, heroImageDesktopV3, heroImageMobileV1, heroImageMobileV2],
  )

  useEffect(() => {
    setMounted(true)
    const sparkleCount = window.innerWidth < 1024 ? 0 : 14
    setSparkles(
      Array.from({ length: sparkleCount }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 3,
        size: Math.random() * 1.2 + 0.6,
      })),
    )
  }, [])

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const response = await fetch('/api/portfolio', { cache: 'no-store' })
        if (!response.ok) return

        const data = await response.json()
        if (Array.isArray(data?.portfolio) && data.portfolio.length > 0) {
          const items = data.portfolio
            .slice(0, 6)
            .map((item: { id: string; title: string; image: string }) => ({
              id: item.id,
              title: item.title,
              image: item.image,
            }))
          setHeroPortfolio(items)
        }
      } catch {
        // Keep no carousel fallback
      }
    }

    void loadPortfolio()
  }, [])

  useEffect(() => {
    const totalSlides = carouselImages.length > 0 ? carouselImages.length : heroPortfolio.length

    const shouldRotate = desktopVariant === 'desktop_v1' || mobileVariant === 'mobile_v1'

    if (!shouldRotate || totalSlides <= 1) {
      return
    }

    const interval = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides)
    }, 3500)

    return () => window.clearInterval(interval)
  }, [desktopVariant, mobileVariant, heroPortfolio, carouselImages])

  useEffect(() => {
    const loadSettings = async () => {
      let nextTitle = business.tagline
      let nextSubtitle = business.description
      let nextDesktopVariant: HeroDesktopVariant = 'desktop_v1'
      let nextMobileVariant: HeroMobileVariant = 'mobile_v1'
      let nextHeroImageDesktopV1 = ''
      let nextHeroImageDesktopV2 = ''
      let nextHeroImageDesktopV3 = ''
      let nextHeroImageMobileV1 = ''
      let nextHeroImageMobileV2 = ''

      try {
        const response = await fetch('/api/settings', { cache: 'no-store' })
        if (response.ok) {
          const data = await response.json()
          const settings = data?.settings || {}

          if (typeof settings.hero_title === 'string' && settings.hero_title.trim()) {
            nextTitle = settings.hero_title
          }

          if (typeof settings.hero_subtitle === 'string' && settings.hero_subtitle.trim()) {
            nextSubtitle = settings.hero_subtitle
          }

          if (
            settings.hero_desktop_variant === 'desktop_v1' ||
            settings.hero_desktop_variant === 'desktop_v2' ||
            settings.hero_desktop_variant === 'desktop_v3'
          ) {
            nextDesktopVariant = settings.hero_desktop_variant
          }

          if (settings.hero_mobile_variant === 'mobile_v1' || settings.hero_mobile_variant === 'mobile_v2') {
            nextMobileVariant = settings.hero_mobile_variant
          }

          if (typeof settings.hero_image_desktop_v1 === 'string') {
            nextHeroImageDesktopV1 = settings.hero_image_desktop_v1
          }

          if (typeof settings.hero_image_desktop_v2 === 'string') {
            nextHeroImageDesktopV2 = settings.hero_image_desktop_v2
          }

          if (typeof settings.hero_image_desktop_v3 === 'string') {
            nextHeroImageDesktopV3 = settings.hero_image_desktop_v3
          }

          if (typeof settings.hero_image_mobile_v1 === 'string') {
            nextHeroImageMobileV1 = settings.hero_image_mobile_v1
          }

          if (typeof settings.hero_image_mobile_v2 === 'string') {
            nextHeroImageMobileV2 = settings.hero_image_mobile_v2
          }
        }
      } catch {
        // Keep fallback values
      } finally {
        setHeroTitle(nextTitle)
        setHeroSubtitle(nextSubtitle)
        setDesktopVariant(nextDesktopVariant)
        setMobileVariant(nextMobileVariant)
        setHeroImageDesktopV1(nextHeroImageDesktopV1)
        setHeroImageDesktopV2(nextHeroImageDesktopV2)
        setHeroImageDesktopV3(nextHeroImageDesktopV3)
        setHeroImageMobileV1(nextHeroImageMobileV1)
        setHeroImageMobileV2(nextHeroImageMobileV2)
        setIsSettingsReady(true)
      }
    }

    void loadSettings()
  }, [])

  const currentMobileImage = mobileVariant === 'mobile_v1' ? heroImageMobileV1 : heroImageMobileV2

  if (!isSettingsReady) {
    return (
      <section id="inicio" className="relative min-h-svh bg-[#FFF0F5] pt-16 md:pt-24">
        <div className="container mx-auto px-6 py-10 md:py-14">
          <div className="h-8 w-48 bg-white/70 rounded-lg mb-4 animate-pulse" />
          <div className="h-16 w-full max-w-3xl bg-white/60 rounded-xl mb-3 animate-pulse" />
          <div className="h-5 w-full max-w-2xl bg-white/50 rounded-lg mb-6 animate-pulse" />
          <div className="h-12 w-44 bg-white/70 rounded-full animate-pulse" />
        </div>
      </section>
    )
  }

  return (
    <section
      id="inicio"
      className="relative min-h-svh flex items-center justify-center overflow-hidden bg-[#FFF0F5] pt-16 md:pt-24"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-purple-50/80 via-pink-50/70 to-orange-50/70" />
        <div className="hidden md:block absolute top-10 -left-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-float" />
        <div
          className="hidden md:block absolute top-20 right-0 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="hidden md:block absolute bottom-20 left-1/3 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"
          style={{ animationDelay: '2s' }}
        />
      </div>

      {mounted && (
        <div className="hidden lg:block absolute inset-0 pointer-events-none">
          {sparkles.map((sparkle, index) => (
            <div
              key={index}
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

      <div className="relative z-10 container mx-auto px-6 py-10 md:py-14">
        <div className="sm:hidden">
          {mobileVariant === 'mobile_v1' && (
            <div className="max-w-xl mx-auto text-center space-y-8">
              <h1 className="text-3xl font-display font-bold text-gray-900 leading-tight">{heroTitle}</h1>

              {carouselImages.length > 0 ? (
                <div className="w-full h-56 overflow-hidden rounded-2xl shadow-md">
                  <Image
                    src={carouselImages[activeSlide % carouselImages.length]}
                    alt={`Carrusel Hero ${activeSlide + 1}`}
                    width={900}
                    height={420}
                    className="w-full h-full object-cover object-center"
                    priority
                  />
                </div>
              ) : currentMobileImage ? (
                <div className="w-full h-56 overflow-hidden rounded-2xl shadow-md">
                  <Image
                    src={currentMobileImage}
                    alt="Imagen hero mobile"
                    width={800}
                    height={200}
                    className="w-full h-full object-cover object-center"
                    priority
                  />
                </div>
              ) : (
                <div className="w-full h-36 overflow-hidden rounded-2xl shadow-md">
                  <Image
                    src="/images/logoGlitterPop.webp"
                    alt="Glitter Pop Logo"
                    width={800}
                    height={200}
                    className="w-full h-full object-cover object-center"
                    priority
                  />
                </div>
              )}
              <p className="text-sm text-gray-700 leading-relaxed">{heroSubtitle}</p>

              {carouselImages.length > 1 && (
                <div className="flex items-center justify-center gap-1.5">
                  {carouselImages.map((_, index) => (
                    <button
                      key={`mobile-slide-${index}`}
                      type="button"
                      aria-label={`Slide ${index + 1}`}
                      onClick={() => setActiveSlide(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        index === (activeSlide % carouselImages.length) ? 'bg-purple-700' : 'bg-purple-300'
                      }`}
                    />
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-3 pt-1">
                <Link
                  href="/contacto"
                  className="px-6 py-3 rounded-full bg-linear-to-r from-pastel-lavender to-pastel-pink text-purple-900 font-bold text-base shadow-lg active:scale-95 transition-all"
                >
                  ✨ Reservá tu Evento
                </Link>
                <Link
                  href="/servicios"
                  className="px-6 py-2.5 rounded-full border-2 border-purple-400 text-purple-700 font-semibold text-sm"
                >
                  Ver Servicios →
                </Link>
              </div>
            </div>
          )}

          {mobileVariant === 'mobile_v2' && (
            <div className="max-w-xl mx-auto text-center space-y-8">
              <div className="w-full h-78 overflow-hidden rounded-2xl shadow-md">
                <Image
                  src="/images/logoGlitterPop.webp"
                  alt="Glitter Pop Logo"
                  width={800}
                  height={160}
                  className="w-full h-full object-cover object-center"
                  priority
                />
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{heroSubtitle}</p>



              <Link
                href="/contacto"
                className="inline-block px-8 py-3 rounded-full bg-linear-to-r from-pastel-lavender to-pastel-pink text-purple-900 font-bold text-base shadow-lg"
              >
                Consultar disponibilidad
              </Link>
            </div>
          )}
        </div>

        <div className="hidden sm:block max-w-6xl mx-auto">
          {desktopVariant === 'desktop_v1' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="text-center lg:text-left space-y-7">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 leading-tight max-w-4xl">
                  {heroTitle}
                </h1>
                <p className="text-lg md:text-xl text-black-800   smax-w-3xl leading-relaxed">{heroSubtitle}</p>

                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  <span className="px-4 py-2 rounded-full bg-white/80 text-gray-800 text-sm font-semibold">🎉 Eventos</span>
                  <span className="px-4 py-2 rounded-full bg-white/80 text-gray-800 text-sm font-semibold">💍 Bodas</span>
                  <span className="px-4 py-2 rounded-full bg-white/80 text-gray-800 text-sm font-semibold">🏢 Corporativos</span>
                </div>

                <div className="flex flex-col md:flex-row gap-3 justify-center lg:justify-start">
                  <Link
                    href="/contacto"
                    className="px-8 py-3 rounded-full bg-linear-to-r from-pastel-lavender to-pastel-pink text-purple-900 font-bold text-base shadow-xl hover:-translate-y-0.5 transition-transform"
                  >
                    ✨ Reservá tu Evento
                  </Link>
                  <Link
                    href="/portfolio"
                    className="px-7 py-3 rounded-full border-2 border-purple-400 text-purple-700 font-semibold text-base"
                  >
                    Ver Portfolio →
                  </Link>
                </div>
              </div>

              <div className="bg-white/70 rounded-3xl p-4 border border-white/80 shadow-xl">
                {(carouselImages.length > 0 || heroPortfolio.length > 0) ? (
                  <>
                    <div className="relative aspect-square rounded-2xl overflow-hidden">
                      <Image
                        src={
                          (carouselImages.length > 0
                            ? carouselImages[activeSlide % carouselImages.length]
                            : heroPortfolio[activeSlide]?.image) ||
                          heroPortfolio[0].image
                        }
                        alt={
                          carouselImages.length > 0
                            ? `Hero slide ${activeSlide + 1}`
                            : (heroPortfolio[activeSlide]?.title || 'Portfolio')
                        }
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 36vw, 90vw"
                      />
                    </div>
                    <div className="pt-3 px-1 flex items-center justify-between gap-3">
                      <p className="text-gray-800 font-semibold text-sm truncate">
                        {carouselImages.length > 0
                          ? 'Slide Hero'
                          : (heroPortfolio[activeSlide]?.title || 'Trabajo destacado')}
                      </p>
                      <div className="flex items-center gap-1.5">
                        {(carouselImages.length > 0 ? carouselImages : heroPortfolio).map((item, index) => (
                          <button
                            key={typeof item === 'string' ? `hero-${index}` : item.id}
                            type="button"
                            aria-label={`Slide ${index + 1}`}
                            onClick={() => setActiveSlide(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${
                              index === activeSlide ? 'bg-purple-700' : 'bg-purple-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="aspect-square rounded-2xl bg-white/60 flex items-center justify-center text-gray-500">
                    Cargando portfolio...
                  </div>
                )}
              </div>
            </div>
          )}

          {desktopVariant === 'desktop_v2' && (
            <div className="text-center space-y-7 max-w-5xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 leading-tight">
                {heroTitle}
              </h1>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">{heroSubtitle}</p>

              <div className="flex justify-center gap-3 flex-wrap">
                <Link
                  href="/contacto"
                  className="px-9 py-3 rounded-full bg-linear-to-r from-pastel-lavender to-pastel-pink text-purple-900 font-bold text-base shadow-xl"
                >
                  Pedir cotización
                </Link>
                <Link
                  href="/servicios"
                  className="px-8 py-3 rounded-full border-2 border-purple-400 text-purple-700 font-semibold text-base"
                >
                  Ver servicios
                </Link>
              </div>
            </div>
          )}

          {desktopVariant === 'desktop_v3' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-6 text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 leading-tight">{heroTitle}</h1>
                <p className="text-lg text-gray-700 leading-relaxed">{heroSubtitle}</p>

                <div className="flex flex-col md:flex-row gap-3 justify-center lg:justify-start">
                  <Link
                    href="/contacto"
                    className="px-8 py-3 rounded-full bg-linear-to-r from-pastel-lavender to-pastel-pink text-purple-900 font-bold text-base shadow-xl"
                  >
                    ✨ Reservá tu fecha
                  </Link>
                  <Link
                    href="/paquetes"
                    className="px-7 py-3 rounded-full border-2 border-purple-400 text-purple-700 font-semibold text-base"
                  >
                    Ver Paquetes
                  </Link>
                </div>
              </div>

              <div className="bg-white/60 rounded-3xl p-6 border border-white/80">
                <h3 className="text-xl font-display font-bold text-gray-900 mb-4">Cómo trabajamos</h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start gap-3">
                    <span className="text-purple-700 font-bold">1.</span>
                    <p>Nos contás tu evento y lo que imaginás.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-purple-700 font-bold">2.</span>
                    <p>Te proponemos estilo, timing y opciones.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-purple-700 font-bold">3.</span>
                    <p>Vamos al evento y hacemos que todo brille.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

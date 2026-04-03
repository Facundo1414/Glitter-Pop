'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import contentData from '@/data/content.json'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

export default function Hero() {
  const { business } = contentData
  const [heroTitle, setHeroTitle] = useState('')
  const [heroSubtitle, setHeroSubtitle] = useState('')
  const [heroImage, setHeroImage] = useState('')
  const [heroImageMobile, setHeroImageMobile] = useState('')
  const [sparkles, setSparkles] = useState<
    Array<{ left: number; top: number; delay: number; size: number }>
  >([])
  const [mounted, setMounted] = useState(false)
  const [isSettingsReady, setIsSettingsReady] = useState(false)

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
    const loadSettings = async () => {
      let nextTitle = business.tagline
      let nextSubtitle = business.description
      let nextHeroImage = ''
      let nextHeroImageMobile = ''

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

          if (typeof settings.hero_image === 'string' && settings.hero_image.trim()) {
            nextHeroImage = settings.hero_image
          } else if (typeof settings.hero_image_desktop_v2 === 'string' && settings.hero_image_desktop_v2.trim()) {
            nextHeroImage = settings.hero_image_desktop_v2
          }

          if (typeof settings.hero_image_mobile === 'string' && settings.hero_image_mobile.trim()) {
            nextHeroImageMobile = settings.hero_image_mobile
          }
        }
      } catch {
        // Keep fallback values
      } finally {
        setHeroTitle(nextTitle)
        setHeroSubtitle(nextSubtitle)
        setHeroImage(nextHeroImage)
        setHeroImageMobile(nextHeroImageMobile)
        setIsSettingsReady(true)
      }
    }

    void loadSettings()
  }, [])

  if (!isSettingsReady) {
    return (
      <section id="inicio" className="relative overflow-hidden bg-[#FFF0F5]">
        {/* Mobile skeleton */}
        <div className="sm:hidden relative min-h-svh flex flex-col">
          <Skeleton className="w-full min-h-60 h-[55svh] rounded-none bg-white/50 shrink-0" />
          <div className="flex-1 bg-[#FFF0F5] px-6 pt-6 pb-10 space-y-4">
            <Skeleton className="h-6 w-36 bg-white/70 rounded-full mx-auto" />
            <Skeleton className="h-12 w-5/6 bg-white/60 rounded-xl mx-auto" />
            <Skeleton className="h-4 w-full bg-white/50" />
            <Skeleton className="h-4 w-4/5 bg-white/50 mx-auto" />
            <div className="pt-4 space-y-3">
              <Skeleton className="h-14 w-full bg-white/70 rounded-full" />
              <Skeleton className="h-12 w-full bg-white/50 rounded-full" />
            </div>
          </div>
        </div>
        {/* Desktop skeleton */}
        <div className="hidden sm:grid sm:grid-cols-2 h-screen">
          <div className="flex flex-col justify-center pl-10 md:pl-16 lg:pl-20 xl:pl-28 pr-6 pt-16 space-y-6">
            <Skeleton className="h-5 w-44 bg-white/70" />
            <Skeleton className="h-16 w-full bg-white/60 rounded-xl" />
            <Skeleton className="h-14 w-4/5 bg-white/60 rounded-xl" />
            <Skeleton className="h-5 w-full bg-white/50" />
            <Skeleton className="h-5 w-3/4 bg-white/50" />
            <Skeleton className="h-12 w-44 bg-white/70 rounded-full" />
          </div>
          <Skeleton className="h-full bg-white/40 rounded-none" />
        </div>
      </section>
    )
  }

  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-[#FFF0F5]"
    >
      {/* Sparkles (desktop only) */}
      {mounted && (
        <div className="hidden lg:block absolute inset-0 pointer-events-none z-10">
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

      {/* Mobile layout — image on top, content below */}
      <div className="sm:hidden relative min-h-svh flex flex-col">
        {/* Image zone */}
        <div className="relative w-full min-h-60 h-[55svh] overflow-hidden shrink-0">
          <Image
            src={heroImageMobile || heroImage || '/images/logoGlitterPop.webp'}
            alt="Glitter Pop Hero"
            fill
            className="object-cover object-top"
            priority
          />
          {/* Top fade so header blends in */}
          <div className="absolute top-0 inset-x-0 h-24 bg-linear-to-b from-[#FFF0F5]/70 to-transparent pointer-events-none" />
          {/* Bottom fade blending into content zone */}
          <div className="absolute bottom-0 inset-x-0 h-32 bg-linear-to-t from-[#FFF0F5] to-transparent pointer-events-none" />
          {/* Decorative sparkles on the image */}
          <span className="absolute top-24 right-6 text-xl animate-sparkle pointer-events-none select-none">✨</span>
          <span className="absolute top-36 left-6 text-base animate-sparkle pointer-events-none select-none" style={{ animationDelay: '1.1s' }}>✨</span>
        </div>

        {/* Content zone */}
        <div className=" bg-[#FFF0F5] px-6 pb-10 pt-1 flex flex-col">

          <p
            className="text-black-600 text-center leading-relaxed mb-6 mt-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: '300ms' }}
          >
            {heroSubtitle}
          </p>

          <div
            className="flex flex-col gap-3 mt-auto animate-in fade-in-0 slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: '400ms' }}
          >
            <Button asChild className="px-6 py-3.5 h-auto rounded-full bg-white font-bold text-base shadow-lg active:scale-95 transition-all hover:opacity-90">
              <Link href="/contacto">✨ Reservá tu Evento</Link>
            </Button>
            <Button asChild className="px-6 py-3.5 h-auto rounded-full bg-white font-bold text-base shadow-lg active:scale-95 transition-all hover:opacity-90">
              <Link href="/servicios">Ver Servicios →</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop layout — full-bleed two-column */}
      <div className="hidden sm:grid sm:grid-cols-2 h-screen relative">
        {/* Left: content */}
        <div className="flex flex-col justify-center pl-10 md:pl-16 lg:pl-20 xl:pl-28 pr-8 pt-16 space-y-7 z-20">
          <span
            className="inline-block text-xs font-semibold text-purple-700 uppercase tracking-widest animate-in fade-in-0 slide-in-from-bottom-4 duration-700"
          >
            Stand de Glitter
          </span>
          <h1
            className="text-5xl md:text-6xl xl:text-7xl font-display font-bold text-gray-900 leading-tight animate-in fade-in-0 slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: '150ms' }}
          >
            {heroTitle}
          </h1>
          <p
            className="text-base md:text-lg text-gray-600 leading-relaxed max-w-md animate-in fade-in-0 slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: '300ms' }}
          >
            {heroSubtitle}
          </p>
          <div
            className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: '450ms' }}
          >
            <Button asChild className="px-9 py-4 h-auto rounded-full bg-linear-to-r from-primary-600 to-pink-500 text-white font-bold text-base shadow-xl hover:-translate-y-0.5 hover:shadow-2xl transition-all">
              <Link href="/contacto">Pedir cotización</Link>
            </Button>
          </div>
        </div>

        {/* Right: full-bleed image */}
        <div
          className="relative h-full overflow-hidden animate-in fade-in-0 zoom-in-95 duration-1000"
          style={{ animationDelay: '300ms' }}
        >
          <Image
            src={heroImage || '/images/1.jpg'}
            alt="Glitter Pop Hero"
            fill
            className="object-cover object-center"
            sizes="50vw"
            priority
          />
        </div>

        {/* Vertical dots */}
        <div className="absolute right-6 xl:right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-20">
          <div className="w-2 h-6 bg-primary-500 rounded-full" />
          <div className="w-2 h-2 bg-primary-200 rounded-full" />
          <div className="w-2 h-2 bg-primary-200 rounded-full" />
          <div className="w-2 h-2 bg-primary-200 rounded-full" />
        </div>
      </div>
    </section>
  )
}

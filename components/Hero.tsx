import Link from 'next/link'
import contentData from '@/data/content.json'
import { featuredInstagramVideoUrl, parseInstagramPostUrl } from '@/lib/instagram'
import type { PublicSettings } from '@/lib/public-content'
import { InstagramEmbed, InstagramEmbedScript } from '@/components/InstagramEmbed'

export default function Hero({ settings }: { settings: PublicSettings }) {
  const { business } = contentData
  const title = settings.hero_title?.trim() || business.tagline
  const subtitle = settings.hero_subtitle?.trim() || business.description
  const video = parseInstagramPostUrl(settings.hero_video_url || featuredInstagramVideoUrl)
    ?? parseInstagramPostUrl(featuredInstagramVideoUrl)!

  return (
    <section id="inicio" className="overflow-hidden bg-[var(--brand-mint)] pt-16 md:pt-0">
      <div className="mx-auto grid max-w-[1500px] md:min-h-[min(790px,100svh)] md:grid-cols-2">
        <div className="order-1 flex flex-col justify-center px-6 py-12 text-center sm:px-10 md:px-12 md:py-24 md:text-left lg:px-20">
          <h1 className="max-w-xl font-display text-6xl font-bold leading-[0.9] tracking-tight text-[var(--brand-ink)] sm:text-7xl xl:text-8xl">{title}</h1>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-[var(--brand-ink)]/80 md:mx-0 md:text-lg">{subtitle}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
            <Link href="/contacto" className="brand-button">Reservá tu evento</Link>
            <Link href="/servicios" className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-[var(--brand-ink)] px-6 font-bold text-[var(--brand-ink)] transition-colors hover:bg-white">Ver servicios</Link>
          </div>
        </div>

        <div className="order-2 flex flex-col items-center justify-center bg-[var(--brand-yellow)] px-5 py-8 md:px-8 md:pt-24 md:pb-12">
          <div className="w-full max-w-[350px] overflow-hidden rounded-2xl bg-white p-2 shadow-[0_18px_45px_rgba(24,51,46,0.18)]">
            <InstagramEmbed url={video.url} label="Video de Glitter Pop en Instagram" className="min-h-[470px] w-full sm:min-h-[540px]" />
          </div>
          <a href={video.url} target="_blank" rel="noopener noreferrer" className="mt-3 text-sm font-semibold text-[var(--brand-ink)] underline underline-offset-4 hover:no-underline">Ver video en Instagram ↗</a>
          <InstagramEmbedScript />
        </div>
      </div>
    </section>
  )
}

'use client'

import initialPosts from '@/data/instagram-posts.json'
import type { PublicSettings } from '@/lib/public-content'
import { parseInstagramPostUrl } from '@/lib/instagram'
import { InstagramEmbed, InstagramEmbedScript } from '@/components/InstagramEmbed'

const instagramProfile = 'https://www.instagram.com/glitterr_pop/'

export default function Gallery({ settings }: { settings: PublicSettings }) {
  const links = settings.instagram_posts?.trim()
    ? settings.instagram_posts.split(/\r?\n/)
    : initialPosts
  const posts = links.map(parseInstagramPostUrl).filter((post): post is NonNullable<ReturnType<typeof parseInstagramPostUrl>> => post !== null)

  return (
    <section id="galeria" className="bg-[var(--brand-cream)] py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-5 text-center md:flex-row md:items-end md:justify-between md:text-left">
          <div>
            <p className="brand-eyebrow">En acción</p>
            <h2 className="mt-2 font-display text-5xl font-bold leading-none text-[var(--brand-ink)] md:text-6xl">Fotos y reels</h2>
            <p className="mt-4 max-w-xl text-[var(--brand-ink)]/75">Mirá nuestros trabajos más recientes directamente en Instagram.</p>
          </div>
          <a href={instagramProfile} target="_blank" rel="noopener noreferrer" className="brand-button mx-auto md:mx-0">Ver @glitterr_pop ↗</a>
        </div>

        {posts.length > 0 && (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post.url} className="overflow-hidden rounded-[1.5rem] border border-[var(--brand-ink)]/10 bg-white p-3 shadow-sm">
                <InstagramEmbed url={post.url} label={`${post.kind} de Glitter Pop en Instagram`} className="min-h-[500px] w-full" />
                <a href={post.url} target="_blank" rel="noopener noreferrer" className="block px-2 py-3 text-sm font-semibold text-[var(--brand-pink-dark)] underline-offset-4 hover:underline">Abrir en Instagram ↗</a>
              </article>
            ))}
          </div>
        )}
        <InstagramEmbedScript />
      </div>
    </section>
  )
}

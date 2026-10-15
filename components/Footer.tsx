import Link from 'next/link'
import contentData from '@/data/content.json'
import type { PublicSettings } from '@/lib/public-content'

export default function Footer({ settings }: { settings: PublicSettings }) {
  const { business } = contentData
  const phone = settings.footer_phone || business.phone
  const location = settings.footer_location || business.location
  const instagram = settings.footer_instagram === '@GlitterPop_eventos'
    ? business.instagram
    : settings.footer_instagram || business.instagram
  const facebook = settings.footer_facebook || business.facebook

  return (
    <footer className="bg-[var(--brand-mint)] px-5 pt-6 pb-[calc(1.5rem+4rem+env(safe-area-inset-bottom,0px))] text-[var(--brand-ink)] sm:px-8 md:py-7">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8">
          <div>
            <p className="font-display text-xl font-bold">{business.name}</p>
            <p className="mt-1 text-sm text-[var(--brand-ink)]/75">{location}</p>
          </div>

          <nav aria-label="Contacto y administración" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <a href={`tel:${phone}`} className="underline-offset-4 hover:text-[var(--brand-pink-dark)] hover:underline">{phone}</a>
            <a href={`https://instagram.com/${instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-[var(--brand-pink-dark)] hover:underline">Instagram</a>
            {facebook && (
              <a href={`https://facebook.com/${facebook}`} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-[var(--brand-pink-dark)] hover:underline">Facebook</a>
            )}
            <Link href="/admin/login" className="underline-offset-4 hover:text-[var(--brand-pink-dark)] hover:underline">Admin</Link>
          </nav>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-5 gap-y-1 border-t border-[var(--brand-ink)]/15 pt-3 text-xs text-[var(--brand-ink)]/70">
          <p>© {new Date().getFullYear()} {business.name}</p>
          <p>
            Hecho por{' '}
            <a href="https://pantheon-dev.vercel.app" target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-[var(--brand-pink-dark)] hover:underline">Pantheon Dev</a>
          </p>
        </div>
      </div>
    </footer>
  )
}

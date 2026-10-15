import Image from 'next/image'
import content from '@/data/content.json'
import type { PublicSettings } from '@/lib/public-content'

type TeamMember = {
  id: string
  name: string
  role: string
  description: string
  image: string
}

export default function About({ settings, teamMembers }: { settings: PublicSettings; teamMembers: TeamMember[] }) {
  const aboutText = settings.about_text?.trim() || content.business.about

  return (
    <section id="nosotras" className="bg-[var(--brand-cream)] py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="brand-eyebrow">El equipo detrás del brillo</p>
          <h1 className="mt-3 font-display text-5xl font-bold leading-none text-[var(--brand-ink)] md:text-7xl">Conocé a las creadoras</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--brand-ink)]/80 md:text-lg">{aboutText}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-[var(--brand-ink)]/75">
            <span>📍 {content.business.location}</span>
            <span>⏰ {content.business.workingHours}</span>
            <span>📅 {content.business.advanceBooking}</span>
          </div>
        </div>

        <div className={`mx-auto mt-12 grid gap-6 ${teamMembers.length === 1 ? 'max-w-3xl' : 'max-w-5xl md:grid-cols-2'}`}>
          {teamMembers.map((member) => (
            <article key={member.id} className="overflow-hidden rounded-[2rem] border border-[var(--brand-ink)]/10 bg-white shadow-[0_18px_50px_rgba(20,70,62,0.10)]">
              <div className="grid items-center gap-7 p-7 sm:p-9 md:grid-cols-[220px_1fr] md:p-10">
                <div className="relative mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-[1.5rem] bg-[var(--brand-yellow)]">
                  {member.image ? <Image src={member.image} alt={member.name} fill sizes="220px" className="object-cover" /> : <span className="flex h-full items-center justify-center text-6xl" aria-hidden="true">✨</span>}
                </div>
                <div className="text-center md:text-left">
                  <p className="brand-eyebrow">Nosotras</p>
                  <h2 className="mt-2 font-display text-4xl font-bold leading-tight text-[var(--brand-ink)]">{member.name}</h2>
                  <p className="mt-2 font-semibold text-[var(--brand-pink-dark)]">{member.role}</p>
                  <p className="mt-5 leading-relaxed text-[var(--brand-ink)]/80">{member.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

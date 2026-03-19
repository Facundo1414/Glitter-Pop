'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import content from '@/data/content.json'

type TeamMember = {
  id: string
  name: string
  role: string
  description: string
  image: string
}

export default function About() {
  const [isVisible, setIsVisible] = useState(false)
  const [aboutText, setAboutText] = useState(content.business.about || '')
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(
    (content.business.team || []).map((member, index) => ({
      id: String(index + 1),
      name: member.name,
      role: member.role,
      description: member.description,
      image: '',
    })),
  )

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById('nosotras')
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [])

  useEffect(() => {
    const loadAboutData = async () => {
      try {
        const [teamResponse, settingsResponse] = await Promise.all([
          fetch('/api/team', { cache: 'no-store' }),
          fetch('/api/settings', { cache: 'no-store' }),
        ])

        if (teamResponse.ok) {
          const data = await teamResponse.json()
          if (Array.isArray(data.team) && data.team.length > 0) {
            setTeamMembers(data.team)
          }
        }

        if (settingsResponse.ok) {
          const data = await settingsResponse.json()
          if (typeof data?.settings?.about_text === 'string' && data.settings.about_text.trim()) {
            setAboutText(data.settings.about_text)
          }
        }
      } catch {
        // Keep JSON fallback
      }
    }

    void loadAboutData()
  }, [])

  return (
    <section id="nosotras" className="py-16 md:py-20 bg-gradient-to-b from-white to-pastel-pink/10">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            Conocé a las Creadoras
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            {aboutText}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm md:text-base text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl">📍</span>
              <span>{content.business.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl">⏰</span>
              <span>{content.business.workingHours}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl">📅</span>
              <span>{content.business.advanceBooking}</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className={`bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden transform transition-all duration-1000 hover:scale-105 active:scale-100 touch-manipulation ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="bg-gradient-to-br from-pastel-pink via-pastel-lavender to-pastel-blue p-8">
                <div className="w-32 h-32 mx-auto bg-white rounded-full overflow-hidden shadow-lg">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">✨</div>
                  )}
                </div>
              </div>
              <div className="p-5 sm:p-6 text-center">
                <h3 className="text-xl sm:text-2xl font-display font-bold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-pastel-purple font-semibold mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600">
                  {member.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

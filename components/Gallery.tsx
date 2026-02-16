'use client'

import { useEffect, useState } from 'react'

const videoExamples = [
  {
    id: 1,
    title: 'Proceso de Maquillaje',
    description: 'Mirá cómo creamos un look completo',
    youtubeId: 'XnmFJNl9Luc'
  },
  {
    id: 2,
    title: 'Antes y Después',
    description: 'Transformaciones increíbles',
    youtubeId: 'XjffHvRtk8g'
  },
  {
    id: 3,
    title: 'En Acción',
    description: 'Glitter Pop en eventos reales',
    youtubeId: 'elxe6FYTdA8'
  }
]

export default function Gallery() {
  const [isVisible, setIsVisible] = useState(false)

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

    const element = document.getElementById('galeria')
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [])

  return (
    <section id="galeria" className="py-16 md:py-20 bg-gradient-to-b from-pastel-blue/10 to-white">
      <div className="container mx-auto px-4">
        {/* Videos / Reels */}
        <div>
          <div className={`text-center mb-10 md:mb-12 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              Videos & <span className="text-pink-600">Reels</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Mirá nuestro trabajo en acción 🎬
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 md:gap-8 max-w-6xl mx-auto">
            {videoExamples.map((video, index) => (
              <div
                key={video.id}
                className={`group transition-all duration-1000 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="bg-white rounded-xl md:rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl active:scale-98 transition-all duration-300 touch-manipulation">
                  <div className="relative aspect-[9/16] bg-black overflow-hidden">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${video.youtubeId}`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-4 sm:p-5 text-center bg-gradient-to-b from-white to-gray-50">
                    <h3 className="font-display font-bold text-gray-900 mb-2 text-base sm:text-lg">{video.title}</h3>
                    <p className="text-sm md:text-base text-gray-600">{video.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={`mt-12 text-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '600ms' }}>
            <p className="text-gray-600 mb-4">
              Seguinos en Instagram para ver más contenido exclusivo
            </p>
            <a
              href="https://instagram.com/GlitterPop_eventos"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-pastel-purple font-semibold hover:text-primary-600 transition-colors active:scale-95 touch-manipulation"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              @GlitterPop_eventos
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
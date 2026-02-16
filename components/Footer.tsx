'use client'

import Link from 'next/link'
import contentData from '@/data/content.json'

export default function Footer() {
  const { business } = contentData
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white py-10 md:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-3 md:mb-4">
              <span className="text-2xl md:text-3xl">✨</span>
              <span className="text-xl md:text-2xl font-display font-bold">{business.name}</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md text-sm md:text-base leading-relaxed">
              {business.description}
            </p>
            <div className="flex space-x-3 md:space-x-4">
              <a
                href={`https://instagram.com/${business.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 rounded-full p-2.5 md:p-3 hover:bg-pastel-lavender active:bg-pastel-lavender/80 transition-all touch-manipulation hover:scale-110 active:scale-95"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href={`https://facebook.com/${business.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 rounded-full p-2.5 md:p-3 hover:bg-pastel-lavender active:bg-pastel-lavender/80 transition-all touch-manipulation hover:scale-110 active:scale-95"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-bold text-base md:text-lg mb-3 md:mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm md:text-base">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                >
                  Servicios
                </Link>
              </li>
              <li>
                <Link
                  href="/portfolio"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  href="/paquetes"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                >
                  Paquetes
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display font-bold text-base md:text-lg mb-3 md:mb-4">Contacto</h3>
            <ul className="space-y-2 text-gray-400 text-sm md:text-base">
              <li>
                <a href={`mailto:${business.email}`} className="hover:text-primary-400 transition-colors">
                  {business.email}
                </a>
              </li>
              <li>
                <a href={`tel:${business.phone}`} className="hover:text-primary-400 transition-colors">
                  {business.phone}
                </a>
              </li>
              <li>{business.location}</li>
              <li className="pt-2">
                <a href={`https://instagram.com/${business.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">
                  {business.instagram}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} {business.name}. Todos los derechos reservados.
            </p>
            <p className="text-gray-400 text-sm">
              Hecho con ✨ y mucho glitter
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

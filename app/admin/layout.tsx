'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-600 font-display">
                Glitter Pop
              </div>
              <span className="text-xs font-semibold text-gray-500 px-2 py-1 bg-gray-100 rounded">
                Admin
              </span>
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <nav className="hidden md:flex gap-6">
              <Link href="/admin/configuracion" className="text-sm text-gray-700 hover:text-purple-600">
                ⚙️ Configuración
              </Link>
              <Link href="/admin/servicios" className="text-sm text-gray-700 hover:text-purple-600">
                ✨ Servicios
              </Link>
              <Link href="/admin/paquetes" className="text-sm text-gray-700 hover:text-purple-600">
                📦 Paquetes
              </Link>
              <Link href="/admin/faqs" className="text-sm text-gray-700 hover:text-purple-600">
                ❓ FAQs
              </Link>
              <Link href="/admin/nosotras" className="text-sm text-gray-700 hover:text-purple-600">
                👭 Nosotras
              </Link>
              <Link href="/admin/portfolio" className="text-sm text-gray-700 hover:text-purple-600">
                🖼️ Portfolio
              </Link>
              <Link href="/" className="text-sm text-gray-700 hover:text-purple-600">
                🏠 Ver Sitio
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Logout
              </button>
            </nav>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <nav className="md:hidden flex flex-col gap-2 pb-4">
              <Link href="/admin/configuracion" className="text-sm text-gray-700 hover:text-purple-600 py-2">
                ⚙️ Configuración
              </Link>
              <Link href="/admin/servicios" className="text-sm text-gray-700 hover:text-purple-600 py-2">
                ✨ Servicios
              </Link>
              <Link href="/admin/paquetes" className="text-sm text-gray-700 hover:text-purple-600 py-2">
                📦 Paquetes
              </Link>
              <Link href="/admin/faqs" className="text-sm text-gray-700 hover:text-purple-600 py-2">
                ❓ FAQs
              </Link>
              <Link href="/admin/nosotras" className="text-sm text-gray-700 hover:text-purple-600 py-2">
                👭 Nosotras
              </Link>
              <Link href="/admin/portfolio" className="text-sm text-gray-700 hover:text-purple-600 py-2">
                🖼️ Portfolio
              </Link>
              <Link href="/" className="text-sm text-gray-700 hover:text-purple-600 py-2">
                🏠 Ver Sitio
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 text-left"
              >
                Logout
              </button>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

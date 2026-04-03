'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/admin', label: 'Dashboard', shortLabel: 'Inicio' },
  { href: '/admin/configuracion', label: 'Configuracion', shortLabel: 'Config' },
  { href: '/admin/servicios', label: 'Servicios', shortLabel: 'Servicios' },
  { href: '/admin/paquetes', label: 'Paquetes', shortLabel: 'Paquetes' },
  { href: '/admin/faqs', label: 'FAQs', shortLabel: 'FAQs' },
  { href: '/admin/nosotras', label: 'Nosotras', shortLabel: 'Nosotras' },
  { href: '/admin/portfolio', label: 'Portfolio', shortLabel: 'Portfolio' },
]

const segmentLabels: Record<string, string> = {
  admin: 'Admin',
  configuracion: 'Configuracion',
  servicios: 'Servicios',
  paquetes: 'Paquetes',
  faqs: 'FAQs',
  nosotras: 'Nosotras',
  portfolio: 'Portfolio',
  login: 'Login',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const breadcrumb = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean)
    const entries: { label: string; href: string }[] = []

    segments.reduce((currentPath, segment) => {
      const nextPath = `${currentPath}/${segment}`
      entries.push({
        label: segmentLabels[segment] ?? segment,
        href: nextPath,
      })
      return nextPath
    }, '')

    return entries
  }, [pathname])

  useEffect(() => {
    if (pathname === '/admin/login') {
      setIsCheckingAuth(false)
      setIsAuthenticated(false)
      return
    }

    let isMounted = true

    const validateSession = async () => {
      setIsCheckingAuth(true)

      try {
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'same-origin',
          cache: 'no-store',
        })

        const raw = await response.text()
        const data = raw ? JSON.parse(raw) : null

        if (!isMounted) {
          return
        }

        if (response.ok && data?.isAuthenticated) {
          setIsAuthenticated(true)
          return
        }

        setIsAuthenticated(false)
        router.replace('/admin/login')
      } catch {
        if (!isMounted) {
          return
        }

        setIsAuthenticated(false)
        router.replace('/admin/login')
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false)
        }
      }
    }

    validateSession()

    return () => {
      isMounted = false
    }
  }, [pathname, router])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' })
    setIsAuthenticated(false)
    router.replace('/admin/login')
    router.refresh()
  }

  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage) {
    return <>{children}</>
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-600">Verificando sesion...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const getNavClassName = (href: string) => {
    const isActive = href === '/admin' ? pathname === href : pathname.startsWith(href)
    return isActive
      ? 'bg-pink-100 text-pink-700 border border-pink-200'
      : 'text-slate-700 hover:bg-slate-100 border border-transparent'
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileSidebarOpen((previous) => !previous)}
              className="md:hidden"
              aria-label="Abrir menu"
            >
              <svg
                className="w-5 h-5"
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
            </Button>

            <Link href="/admin" className="flex items-center gap-2">
              <div className="text-xl font-bold text-transparent bg-clip-text bg-linear-to-r from-pink-600 to-orange-500 font-display">
                Glitter Pop
              </div>
              <span className="text-xs font-semibold text-slate-500 px-2 py-1 bg-slate-100 rounded">
                Admin
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-sm px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              Ver sitio
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-rose-700 hover:bg-rose-100 hover:text-rose-700"
            >
              Salir
            </Button>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        <aside
          className={`fixed md:static top-16 left-0 h-[calc(100vh-4rem)] w-72 bg-white border-r border-slate-200 z-30 transform transition-transform ${
            isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="h-full overflow-y-auto px-4 py-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 px-3 mb-3">
              Gestion de contenido
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${getNavClassName(item.href)}`}
                >
                  {item.shortLabel}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {isMobileSidebarOpen && (
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="md:hidden fixed inset-0 top-16 bg-black/30 z-20"
            aria-label="Cerrar menu"
          />
        )}

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 md:ml-0">
          <nav className="mb-6 text-sm text-slate-500 flex flex-wrap items-center gap-2">
            {breadcrumb.map((entry, index) => {
              const isLast = index === breadcrumb.length - 1

              if (isLast) {
                return (
                  <span key={entry.href} className="text-slate-700 font-medium">
                    {entry.label}
                  </span>
                )
              }

              return (
                <div key={entry.href} className="flex items-center gap-2">
                  <Link href={entry.href} className="hover:text-slate-700">
                    {entry.label}
                  </Link>
                  <span>/</span>
                </div>
              )
            })}
          </nav>

          {children}
        </main>
      </div>
    </div>
  )
}

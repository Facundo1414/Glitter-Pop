'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    let isMounted = true

    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'same-origin',
          cache: 'no-store',
        })

        const raw = await response.text()
        const data = raw ? JSON.parse(raw) : null

        if (!isMounted) {
          return
        }

        if (response.ok && data?.isAuthenticated) {
          router.replace('/admin')
          router.refresh()
        }
      } catch {
        // Ignore check failures and keep login form available.
      }
    }

    checkSession()

    return () => {
      isMounted = false
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const raw = await response.text()
      const data = raw ? JSON.parse(raw) : null

      if (!response.ok || !data?.success) {
        setError(data?.message || 'Credenciales invalidas')
        setLoading(false)
        return
      }

      router.replace('/admin')
      router.refresh()
    } catch (err) {
      setError('No fue posible iniciar sesion')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-pastel-lavender via-pastel-pink to-pastel-peach">
      <div className="w-full max-w-md">
        <Card className="rounded-2xl shadow-2xl border-none">
          <CardContent className="p-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-900 font-display">
            Glitter Pop
          </h1>
          <p className="text-center text-gray-600 mb-8">Panel de Administración</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="username" className="text-sm font-semibold text-gray-700 mb-2">
                Usuario
              </Label>
              <Input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 px-4 text-base"
                placeholder="admin"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700 mb-2">
                Contraseña
              </Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 px-4 text-base"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold hover:shadow-lg active:scale-95 transition-all"
            >
              {loading ? 'Iniciando sesion...' : 'Iniciar sesion'}
            </Button>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}

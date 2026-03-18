'use client'

import { useEffect, useState } from 'react'

type SettingsState = {
  hero_title: string
  hero_subtitle: string
  whatsapp_martina: string
  whatsapp_luz: string
  portfolio_mode: 'visible' | 'hidden' | 'comingsoon'
  about_text: string
}

export default function AdminConfigPage() {
  const [settings, setSettings] = useState<SettingsState>({
    hero_title: '',
    hero_subtitle: '',
    whatsapp_martina: '',
    whatsapp_luz: '',
    portfolio_mode: 'visible',
    about_text: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await fetch('/api/settings', { cache: 'no-store' })
        if (!response.ok) {
          throw new Error('No se pudo cargar configuración')
        }

        const data = await response.json()
        const current = data.settings || {}

        setSettings({
          hero_title: current.hero_title || '',
          hero_subtitle: current.hero_subtitle || '',
          whatsapp_martina: current.whatsapp_martina || '',
          whatsapp_luz: current.whatsapp_luz || '',
          portfolio_mode: (current.portfolio_mode || 'visible') as SettingsState['portfolio_mode'],
          about_text: current.about_text || '',
        })
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Error al cargar configuración')
      } finally {
        setLoading(false)
      }
    }

    void loadSettings()
  }, [])

  const handleChange = (field: keyof SettingsState, value: string) => {
    setSettings({ ...settings, [field]: value })
    setSaved(false)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError('')
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: settings }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'No se pudo guardar')
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error guardando configuración')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-gray-900 font-display">Configuración</h1>
        <div className="bg-white rounded-lg shadow-md p-6 text-gray-600">Cargando configuración...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 font-display mb-2">
          Configuración
        </h1>
        <p className="text-gray-600">
          Edita los textos principales y configuraciones del sitio.
        </p>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          ✓ Cambios guardados exitosamente
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">📌 Sección Hero</h2>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Título Principal
            </label>
            <input
              type="text"
              value={settings.hero_title}
              onChange={(e) => handleChange('hero_title', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Máximo 100 caracteres recomendado
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Subtítulo / Descripción
            </label>
            <textarea
              value={settings.hero_subtitle}
              onChange={(e) => handleChange('hero_subtitle', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Descripción breve de qué es Glitter Pop
            </p>
          </div>
        </div>

        {/* Contacto WhatsApp */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">💬 Contacto - WhatsApp</h2>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              WhatsApp - Martina
            </label>
            <input
              type="text"
              placeholder="5491234567890"
              value={settings.whatsapp_martina}
              onChange={(e) => handleChange('whatsapp_martina', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none font-mono"
            />
            <p className="text-xs text-gray-500 mt-1">
              Formato: código de país + número (ej: 549 + 11 + 12345678)
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              WhatsApp - Luz
            </label>
            <input
              type="text"
              placeholder="5491234567890"
              value={settings.whatsapp_luz}
              onChange={(e) => handleChange('whatsapp_luz', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none font-mono"
            />
            <p className="text-xs text-gray-500 mt-1">
              Formato: código de país + número (ej: 549 + 11 + 12345678)
            </p>
          </div>
        </div>

        {/* Portfolio Settings */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6 lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900">🖼️ Portfolio</h2>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Estado de la página de Portfolio
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="portfolio_mode"
                  value="visible"
                  checked={settings.portfolio_mode === 'visible'}
                  onChange={(e) => handleChange('portfolio_mode', e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-gray-700">Visible - Mostrar portfolio con fotos</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="portfolio_mode"
                  value="comingsoon"
                  checked={settings.portfolio_mode === 'comingsoon'}
                  onChange={(e) => handleChange('portfolio_mode', e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-gray-700">Próximamente - Mostrar mensaje "Próximamente"</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="portfolio_mode"
                  value="hidden"
                  checked={settings.portfolio_mode === 'hidden'}
                  onChange={(e) => handleChange('portfolio_mode', e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-gray-700">Oculto - No mostrar el portfolio</span>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-4 lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900">👭 Sección Nosotras</h2>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Texto descriptivo
            </label>
            <textarea
              value={settings.about_text}
              onChange={(e) => handleChange('about_text', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg active:scale-95 transition-all"
        >
          {saving ? 'Guardando...' : '💾 Guardar Cambios'}
        </button>
      </div>
    </div>
  )
}

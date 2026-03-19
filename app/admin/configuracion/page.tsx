'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

type SettingsState = {
  hero_title: string
  hero_subtitle: string
  hero_desktop_variant: 'desktop_v1' | 'desktop_v2' | 'desktop_v3'
  hero_mobile_variant: 'mobile_v1' | 'mobile_v2'
  hero_image_desktop_v1: string
  hero_image_desktop_v2: string
  hero_image_desktop_v3: string
  hero_image_mobile_v1: string
  hero_image_mobile_v2: string
  whatsapp_martina: string
  whatsapp_luz: string
  portfolio_mode: 'visible' | 'hidden' | 'comingsoon'
  about_text: string
  footer_description: string
  footer_email: string
  footer_phone: string
  footer_location: string
  footer_instagram: string
  footer_facebook: string
  contact_phone: string
  contact_instagram: string
  contact_location: string
  contact_delivery: string
  contact_working_hours: string
  contact_advance_booking: string
}

export default function AdminConfigPage() {
  const [settings, setSettings] = useState<SettingsState>({
    hero_title: '',
    hero_subtitle: '',
    hero_desktop_variant: 'desktop_v1',
    hero_mobile_variant: 'mobile_v1',
    hero_image_desktop_v1: '',
    hero_image_desktop_v2: '',
    hero_image_desktop_v3: '',
    hero_image_mobile_v1: '',
    hero_image_mobile_v2: '',
    whatsapp_martina: '',
    whatsapp_luz: '',
    portfolio_mode: 'visible',
    about_text: '',
    footer_description: '',
    footer_email: '',
    footer_phone: '',
    footer_location: '',
    footer_instagram: '',
    footer_facebook: '',
    contact_phone: '',
    contact_instagram: '',
    contact_location: '',
    contact_delivery: '',
    contact_working_hours: '',
    contact_advance_booking: '',
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
          hero_desktop_variant: (current.hero_desktop_variant || 'desktop_v1') as SettingsState['hero_desktop_variant'],
          hero_mobile_variant: (current.hero_mobile_variant || 'mobile_v1') as SettingsState['hero_mobile_variant'],
          hero_image_desktop_v1: current.hero_image_desktop_v1 || '',
          hero_image_desktop_v2: current.hero_image_desktop_v2 || '',
          hero_image_desktop_v3: current.hero_image_desktop_v3 || '',
          hero_image_mobile_v1: current.hero_image_mobile_v1 || '',
          hero_image_mobile_v2: current.hero_image_mobile_v2 || '',
          whatsapp_martina: current.whatsapp_martina || '',
          whatsapp_luz: current.whatsapp_luz || '',
          portfolio_mode: (current.portfolio_mode || 'visible') as SettingsState['portfolio_mode'],
          about_text: current.about_text || '',
          footer_description: current.footer_description || '',
          footer_email: current.footer_email || '',
          footer_phone: current.footer_phone || '',
          footer_location: current.footer_location || '',
          footer_instagram: current.footer_instagram || '',
          footer_facebook: current.footer_facebook || '',
          contact_phone: current.contact_phone || '',
          contact_instagram: current.contact_instagram || '',
          contact_location: current.contact_location || '',
          contact_delivery: current.contact_delivery || '',
          contact_working_hours: current.contact_working_hours || '',
          contact_advance_booking: current.contact_advance_booking || '',
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

  const handleHeroImageUpload = async (field: keyof Pick<SettingsState,
    'hero_image_desktop_v1' |
    'hero_image_desktop_v2' |
    'hero_image_desktop_v3' |
    'hero_image_mobile_v1' |
    'hero_image_mobile_v2'
  >, file: File | null) => {
    if (!file) return

    try {
      setSaving(true)
      setError('')
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'No se pudo subir imagen')
      }

      const data = await response.json()
      handleChange(field, data.url)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Error subiendo imagen')
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

          <div className="space-y-4">
            <p className="text-sm font-semibold text-gray-700">Imágenes Hero (subida desde admin)</p>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-600">Desktop V1</label>
              <input
                type="text"
                value={settings.hero_image_desktop_v1}
                onChange={(e) => handleChange('hero_image_desktop_v1', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="URL de imagen"
              />
              <input
                type="file"
                accept="image/*"
                className="w-full border border-gray-300 rounded-lg bg-gray-50 p-2 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-purple-100 file:px-3 file:py-1.5 file:font-semibold file:text-purple-700 hover:file:bg-purple-200"
                onChange={(e) => void handleHeroImageUpload('hero_image_desktop_v1', e.target.files?.[0] || null)}
              />
              {settings.hero_image_desktop_v1 && (
                <div className="relative h-24 rounded-lg overflow-hidden border border-gray-200">
                  <Image src={settings.hero_image_desktop_v1} alt="Preview desktop v1" fill className="object-cover" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-600">Desktop V2</label>
              <input
                type="text"
                value={settings.hero_image_desktop_v2}
                onChange={(e) => handleChange('hero_image_desktop_v2', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="URL de imagen"
              />
              <input
                type="file"
                accept="image/*"
                className="w-full border border-gray-300 rounded-lg bg-gray-50 p-2 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-purple-100 file:px-3 file:py-1.5 file:font-semibold file:text-purple-700 hover:file:bg-purple-200"
                onChange={(e) => void handleHeroImageUpload('hero_image_desktop_v2', e.target.files?.[0] || null)}
              />
              {settings.hero_image_desktop_v2 && (
                <div className="relative h-24 rounded-lg overflow-hidden border border-gray-200">
                  <Image src={settings.hero_image_desktop_v2} alt="Preview desktop v2" fill className="object-cover" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-600">Desktop V3</label>
              <input
                type="text"
                value={settings.hero_image_desktop_v3}
                onChange={(e) => handleChange('hero_image_desktop_v3', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="URL de imagen"
              />
              <input
                type="file"
                accept="image/*"
                className="w-full border border-gray-300 rounded-lg bg-gray-50 p-2 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-purple-100 file:px-3 file:py-1.5 file:font-semibold file:text-purple-700 hover:file:bg-purple-200"
                onChange={(e) => void handleHeroImageUpload('hero_image_desktop_v3', e.target.files?.[0] || null)}
              />
              {settings.hero_image_desktop_v3 && (
                <div className="relative h-24 rounded-lg overflow-hidden border border-gray-200">
                  <Image src={settings.hero_image_desktop_v3} alt="Preview desktop v3" fill className="object-cover" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-600">Mobile V1</label>
              <input
                type="text"
                value={settings.hero_image_mobile_v1}
                onChange={(e) => handleChange('hero_image_mobile_v1', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="URL de imagen"
              />
              <input
                type="file"
                accept="image/*"
                className="w-full border border-gray-300 rounded-lg bg-gray-50 p-2 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-purple-100 file:px-3 file:py-1.5 file:font-semibold file:text-purple-700 hover:file:bg-purple-200"
                onChange={(e) => void handleHeroImageUpload('hero_image_mobile_v1', e.target.files?.[0] || null)}
              />
              {settings.hero_image_mobile_v1 && (
                <div className="relative h-24 rounded-lg overflow-hidden border border-gray-200">
                  <Image src={settings.hero_image_mobile_v1} alt="Preview mobile v1" fill className="object-cover" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-600">Mobile V2</label>
              <input
                type="text"
                value={settings.hero_image_mobile_v2}
                onChange={(e) => handleChange('hero_image_mobile_v2', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="URL de imagen"
              />
              <input
                type="file"
                accept="image/*"
                className="w-full border border-gray-300 rounded-lg bg-gray-50 p-2 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-purple-100 file:px-3 file:py-1.5 file:font-semibold file:text-purple-700 hover:file:bg-purple-200"
                onChange={(e) => void handleHeroImageUpload('hero_image_mobile_v2', e.target.files?.[0] || null)}
              />
              {settings.hero_image_mobile_v2 && (
                <div className="relative h-24 rounded-lg overflow-hidden border border-gray-200">
                  <Image src={settings.hero_image_mobile_v2} alt="Preview mobile v2" fill className="object-cover" />
                </div>
              )}
            </div>
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

        {/* Hero Variants */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6 lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900">🧩 Versiones de Hero</h2>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Hero Desktop (3 versiones)
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="hero_desktop_variant"
                  value="desktop_v1"
                  checked={settings.hero_desktop_variant === 'desktop_v1'}
                  onChange={(e) => handleChange('hero_desktop_variant', e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-gray-700">Desktop V1 - Carrusel Portfolio</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="hero_desktop_variant"
                  value="desktop_v2"
                  checked={settings.hero_desktop_variant === 'desktop_v2'}
                  onChange={(e) => handleChange('hero_desktop_variant', e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-gray-700">Desktop V2 - Simple</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="hero_desktop_variant"
                  value="desktop_v3"
                  checked={settings.hero_desktop_variant === 'desktop_v3'}
                  onChange={(e) => handleChange('hero_desktop_variant', e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-gray-700">Desktop V3 - Profesional</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Hero Mobile (2 versiones)
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="hero_mobile_variant"
                  value="mobile_v1"
                  checked={settings.hero_mobile_variant === 'mobile_v1'}
                  onChange={(e) => handleChange('hero_mobile_variant', e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-gray-700">Mobile V1 - Simple</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="hero_mobile_variant"
                  value="mobile_v2"
                  checked={settings.hero_mobile_variant === 'mobile_v2'}
                  onChange={(e) => handleChange('hero_mobile_variant', e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-gray-700">Mobile V2 - Destacada</span>
              </label>
            </div>
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

        <div className="bg-white rounded-lg shadow-md p-6 space-y-6 lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900">🔗 Footer</h2>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={settings.footer_description}
              onChange={(e) => handleChange('footer_description', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={settings.footer_email}
                onChange={(e) => handleChange('footer_email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
              <input
                type="text"
                value={settings.footer_phone}
                onChange={(e) => handleChange('footer_phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ubicación</label>
              <input
                type="text"
                value={settings.footer_location}
                onChange={(e) => handleChange('footer_location', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Instagram</label>
              <input
                type="text"
                value={settings.footer_instagram}
                onChange={(e) => handleChange('footer_instagram', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Facebook</label>
              <input
                type="text"
                value={settings.footer_facebook}
                onChange={(e) => handleChange('footer_facebook', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-6 lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900">📞 Información de Contacto</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono de contacto</label>
              <input
                type="text"
                value={settings.contact_phone}
                onChange={(e) => handleChange('contact_phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Instagram de contacto</label>
              <input
                type="text"
                value={settings.contact_instagram}
                onChange={(e) => handleChange('contact_instagram', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="@glitterpop"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ubicación</label>
              <input
                type="text"
                value={settings.contact_location}
                onChange={(e) => handleChange('contact_location', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Texto de traslado</label>
              <input
                type="text"
                value={settings.contact_delivery}
                onChange={(e) => handleChange('contact_delivery', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Horario de atención</label>
              <input
                type="text"
                value={settings.contact_working_hours}
                onChange={(e) => handleChange('contact_working_hours', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Anticipación de reserva</label>
              <input
                type="text"
                value={settings.contact_advance_booking}
                onChange={(e) => handleChange('contact_advance_booking', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg active:scale-95 transition-all"
        >
          {saving ? 'Guardando...' : '💾 Guardar Cambios'}
        </button>
      </div>
    </div>
  )
}

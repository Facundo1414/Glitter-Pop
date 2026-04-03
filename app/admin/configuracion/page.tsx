'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'

import AdminTabs from '@/components/admin/AdminTabs'
import { SettingsPreviewPanel } from '@/components/admin/PreviewPanels'
import UnsavedChangesBanner from '@/components/admin/UnsavedChangesBanner'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

type SettingsState = {
  hero_title: string
  hero_subtitle: string
  hero_image: string
  hero_image_mobile: string
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

const defaultSettings: SettingsState = {
  hero_title: '',
  hero_subtitle: '',
  hero_image: '',
  hero_image_mobile: '',
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
}

const tabs = [
  { id: 'hero', label: 'Hero', description: 'Titulos e imagen de portada' },
  { id: 'contacto', label: 'Contacto', description: 'WhatsApp y datos de contacto' },
  { id: 'portfolio', label: 'Portfolio', description: 'Estado de la seccion visual' },
  { id: 'nosotras', label: 'Nosotras', description: 'Texto institucional' },
  { id: 'footer', label: 'Footer', description: 'Datos finales y redes' },
] as const

type TabId = (typeof tabs)[number]['id']

export default function AdminConfigPage() {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings)
  const [initialSettings, setInitialSettings] = useState<SettingsState>(defaultSettings)
  const [activeTab, setActiveTab] = useState<TabId>('hero')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const isDirty = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(initialSettings),
    [initialSettings, settings],
  )

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await fetch('/api/settings', { cache: 'no-store' })
        if (!response.ok) {
          throw new Error('No se pudo cargar configuracion')
        }

        const data = await response.json()
        const current = data.settings || {}

        const nextSettings: SettingsState = {
          hero_title: current.hero_title || '',
          hero_subtitle: current.hero_subtitle || '',
          hero_image: current.hero_image || current.hero_image_desktop_v2 || '',
          hero_image_mobile: current.hero_image_mobile || '',
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
        }

        setSettings(nextSettings)
        setInitialSettings(nextSettings)
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Error al cargar configuracion')
      } finally {
        setLoading(false)
      }
    }

    void loadSettings()
  }, [])

  const handleChange = (field: keyof SettingsState, value: string) => {
    setSettings((current) => ({ ...current, [field]: value }))
    setSaved(false)
  }

  const handleReset = () => {
    setSettings(initialSettings)
    setSaved(false)
    setError('')
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

      setInitialSettings(settings)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Error guardando configuracion')
    } finally {
      setSaving(false)
    }
  }

  const handleHeroImageUpload = async (file: File | null, inputRef?: HTMLInputElement | null) => {
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

      const uploadData = await response.json()

      // Reset file input so the same file can be re-selected later
      if (inputRef) inputRef.value = ''

      // Auto-save hero_image immediately after upload
      const saveResponse = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'hero_image', value: uploadData.url }),
      })

      if (!saveResponse.ok) {
        const data = await saveResponse.json().catch(() => ({}))
        throw new Error(data.message || 'No se pudo guardar imagen')
      }

      handleChange('hero_image', uploadData.url)
      setInitialSettings((prev) => ({ ...prev, hero_image: uploadData.url }))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Error subiendo imagen')
    } finally {
      setSaving(false)
    }
  }

  const handleHeroImageMobileUpload = async (file: File | null, inputRef?: HTMLInputElement | null) => {
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

      const uploadData = await response.json()

      if (inputRef) inputRef.value = ''

      const saveResponse = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'hero_image_mobile', value: uploadData.url }),
      })

      if (!saveResponse.ok) {
        const data = await saveResponse.json().catch(() => ({}))
        throw new Error(data.message || 'No se pudo guardar imagen')
      }

      handleChange('hero_image_mobile', uploadData.url)
      setInitialSettings((prev) => ({ ...prev, hero_image_mobile: uploadData.url }))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Error subiendo imagen')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-gray-900 font-display">Configuracion</h1>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-gray-600 shadow-sm">
          Cargando configuracion...
        </div>
      </div>
    )
  }

  const renderHeroTab = () => (
    <div className="grid grid-cols-1 gap-6">
      <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Hero principal</h2>
          <p className="mt-1 text-sm text-slate-500">Define el mensaje inicial y las imagenes que usa la portada.</p>
        </div>

        <div>
          <Label htmlFor="hero_title" className="mb-2 block font-semibold">Titulo principal</Label>
          <Input
            id="hero_title"
            type="text"
            value={settings.hero_title}
            onChange={(event) => handleChange('hero_title', event.target.value)}
            className="h-12"
          />
        </div>

        <div>
          <Label htmlFor="hero_subtitle" className="mb-2 block font-semibold">Subtitulo</Label>
          <Textarea
            id="hero_subtitle"
            value={settings.hero_subtitle}
            onChange={(event) => handleChange('hero_subtitle', event.target.value)}
            rows={4}
            className="resize-none"
          />
        </div>

        <div className="space-y-4 border-t border-slate-200 pt-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Imagenes de portada</h2>
            <p className="mt-1 text-sm text-slate-500">Podés usar una imagen diferente para desktop y mobile, o la misma para ambos.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Desktop image */}
            <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-700">Desktop <span className="font-normal text-slate-400">(lado derecho)</span></p>
              <Input
                type="text"
                value={settings.hero_image}
                onChange={(event) => handleChange('hero_image', event.target.value)}
                className="h-12"
                placeholder="URL de imagen desktop"
              />
              <input
                type="file"
                accept="image/*"
                className="w-full rounded-xl border border-slate-300 bg-white p-2 text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-pink-100 file:px-3 file:py-1.5 file:font-semibold file:text-pink-700 hover:file:bg-pink-200"
                onChange={(event) => void handleHeroImageUpload(event.target.files?.[0] || null, event.target)}
              />
              {settings.hero_image && (
                <div className="relative h-40 overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <Image src={settings.hero_image} alt="Hero desktop preview" fill className="object-cover" />
                </div>
              )}
            </div>

            {/* Mobile image */}
            <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-700">Mobile <span className="font-normal text-slate-400">(portada superior)</span></p>
              <Input
                type="text"
                value={settings.hero_image_mobile}
                onChange={(event) => handleChange('hero_image_mobile', event.target.value)}
                className="h-12"
                placeholder="URL de imagen mobile (si está vacío usa la de desktop)"
              />
              <input
                type="file"
                accept="image/*"
                className="w-full rounded-xl border border-slate-300 bg-white p-2 text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-pink-100 file:px-3 file:py-1.5 file:font-semibold file:text-pink-700 hover:file:bg-pink-200"
                onChange={(event) => void handleHeroImageMobileUpload(event.target.files?.[0] || null, event.target)}
              />
              {settings.hero_image_mobile ? (
                <div className="relative h-40 overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <Image src={settings.hero_image_mobile} alt="Hero mobile preview" fill className="object-cover object-top" />
                </div>
              ) : (
                <p className="text-xs text-slate-400 pt-1">Sin imagen mobile — se usará la de desktop como respaldo.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )

  const renderContactTab = () => (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">WhatsApp del equipo</h2>
          <p className="mt-1 text-sm text-slate-500">Numeros directos para los botones de contacto rapido.</p>
        </div>
        <div>
          <Label htmlFor="whatsapp_martina" className="mb-2 block font-semibold">WhatsApp Martina</Label>
          <Input
            id="whatsapp_martina"
            type="text"
            placeholder="5491234567890"
            value={settings.whatsapp_martina}
            onChange={(event) => handleChange('whatsapp_martina', event.target.value)}
            className="h-12 font-mono"
          />
        </div>
        <div>
          <Label htmlFor="whatsapp_luz" className="mb-2 block font-semibold">WhatsApp Luz</Label>
          <Input
            id="whatsapp_luz"
            type="text"
            placeholder="5491234567890"
            value={settings.whatsapp_luz}
            onChange={(event) => handleChange('whatsapp_luz', event.target.value)}
            className="h-12 font-mono"
          />
        </div>
      </section>

      <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Informacion de contacto</h2>
          <p className="mt-1 text-sm text-slate-500">Datos que aparecen en la pagina de contacto.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            type="text"
            value={settings.contact_phone}
            onChange={(event) => handleChange('contact_phone', event.target.value)}
            className="h-12"
            placeholder="Telefono de contacto"
          />
          <Input
            type="text"
            value={settings.contact_instagram}
            onChange={(event) => handleChange('contact_instagram', event.target.value)}
            className="h-12"
            placeholder="Instagram de contacto"
          />
          <Input
            type="text"
            value={settings.contact_location}
            onChange={(event) => handleChange('contact_location', event.target.value)}
            className="h-12"
            placeholder="Ubicacion"
          />
          <Input
            type="text"
            value={settings.contact_delivery}
            onChange={(event) => handleChange('contact_delivery', event.target.value)}
            className="h-12"
            placeholder="Texto de traslado"
          />
          <Input
            type="text"
            value={settings.contact_working_hours}
            onChange={(event) => handleChange('contact_working_hours', event.target.value)}
            className="h-12"
            placeholder="Horario de atencion"
          />
          <Input
            type="text"
            value={settings.contact_advance_booking}
            onChange={(event) => handleChange('contact_advance_booking', event.target.value)}
            className="h-12"
            placeholder="Anticipacion de reserva"
          />
        </div>
      </section>
    </div>
  )

  const renderPortfolioTab = () => (
    <section className="max-w-3xl space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Estado del portfolio</h2>
        <p className="mt-1 text-sm text-slate-500">Controla si la seccion se muestra, se oculta o queda en modo proximamente.</p>
      </div>
      <div className="space-y-3">
        <RadioGroup
          value={settings.portfolio_mode}
          onValueChange={(value) => handleChange('portfolio_mode', value)}
          className="space-y-3"
        >
          {[
            { value: 'visible', label: 'Visible - Mostrar fotos y categorias' },
            { value: 'comingsoon', label: 'Proximamente - Mostrar mensaje temporal' },
            { value: 'hidden', label: 'Oculto - No mostrar la seccion' },
          ].map((option) => (
            <Label key={option.value} className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-4 text-sm text-slate-700 cursor-pointer">
              <RadioGroupItem value={option.value} />
              <span>{option.label}</span>
            </Label>
          ))}
        </RadioGroup>
      </div>
    </section>
  )

  const renderNosotrasTab = () => (
    <section className="max-w-4xl space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Texto institucional</h2>
        <p className="mt-1 text-sm text-slate-500">Describe a Glitter Pop y el enfoque del equipo en la seccion Nosotras.</p>
      </div>
      <Textarea
        value={settings.about_text}
        onChange={(event) => handleChange('about_text', event.target.value)}
        rows={7}
        className="resize-none"
      />
    </section>
  )

  const renderFooterTab = () => (
    <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Footer y redes</h2>
        <p className="mt-1 text-sm text-slate-500">Informacion final visible en todo el sitio.</p>
      </div>

      <div>
        <Label htmlFor="footer_description" className="mb-2 block font-semibold">Descripcion</Label>
        <Textarea
          id="footer_description"
          value={settings.footer_description}
          onChange={(event) => handleChange('footer_description', event.target.value)}
          rows={3}
          className="resize-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          type="email"
          value={settings.footer_email}
          onChange={(event) => handleChange('footer_email', event.target.value)}
          className="h-12"
          placeholder="Email"
        />
        <Input
          type="text"
          value={settings.footer_phone}
          onChange={(event) => handleChange('footer_phone', event.target.value)}
          className="h-12"
          placeholder="Telefono"
        />
        <Input
          type="text"
          value={settings.footer_location}
          onChange={(event) => handleChange('footer_location', event.target.value)}
          className="h-12"
          placeholder="Ubicacion"
        />
        <Input
          type="text"
          value={settings.footer_instagram}
          onChange={(event) => handleChange('footer_instagram', event.target.value)}
          className="h-12"
          placeholder="Instagram"
        />
        <div className="md:col-span-2">
          <Input
            type="text"
            value={settings.footer_facebook}
            onChange={(event) => handleChange('footer_facebook', event.target.value)}
            className="h-12"
            placeholder="Facebook"
          />
        </div>
      </div>
    </section>
  )

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold text-gray-900 font-display">Configuracion</h1>
          <p className="text-gray-600">Organiza los ajustes del sitio por bloques para editar sin perder contexto.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
          {activeTab === 'hero' && 'Editando portada y variantes del hero'}
          {activeTab === 'contacto' && 'Editando vias de contacto y atencion'}
          {activeTab === 'portfolio' && 'Editando visibilidad del portfolio'}
          {activeTab === 'nosotras' && 'Editando texto institucional'}
          {activeTab === 'footer' && 'Editando cierre del sitio y redes'}
        </div>
      </div>

      <AdminTabs tabs={tabs.map((tab) => ({ ...tab }))} activeTab={activeTab} onChange={(tabId) => setActiveTab(tabId as TabId)} />

      <UnsavedChangesBanner
        visible={isDirty}
        onReset={handleReset}
        message="Hay cambios pendientes en Configuracion. Puedes descartarlos o guardar cuando termines."
      />

      {saved && (
        <Alert className="border-emerald-200 bg-emerald-50 text-emerald-700">
          <AlertDescription>Cambios guardados exitosamente.</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-start">
        <div>
          {activeTab === 'hero' && renderHeroTab()}
          {activeTab === 'contacto' && renderContactTab()}
          {activeTab === 'portfolio' && renderPortfolioTab()}
          {activeTab === 'nosotras' && renderNosotrasTab()}
          {activeTab === 'footer' && renderFooterTab()}
        </div>
        <SettingsPreviewPanel settings={settings} activeTab={activeTab} />
      </div>

      <div className="sticky bottom-4 z-10">
        <div className="ml-auto flex w-full max-w-xl flex-col gap-3 rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur md:flex-row md:items-center md:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={!isDirty || saving}
          >
            Descartar cambios
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="bg-linear-to-r from-purple-600 to-pink-600 text-white"
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </div>
    </div>
  )
}
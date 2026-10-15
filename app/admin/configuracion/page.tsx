'use client'

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
import initialInstagramPosts from '@/data/instagram-posts.json'
import { featuredInstagramVideoUrl } from '@/lib/instagram'

type SettingsState = {
  hero_title: string
  hero_subtitle: string
  hero_video_url: string
  whatsapp_martina: string
  whatsapp_luz: string
  portfolio_mode: 'visible' | 'hidden' | 'comingsoon'
  instagram_posts: string
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
}

const defaultSettings: SettingsState = {
  hero_title: '',
  hero_subtitle: '',
  hero_video_url: featuredInstagramVideoUrl,
  whatsapp_martina: '',
  whatsapp_luz: '',
  portfolio_mode: 'visible',
  instagram_posts: initialInstagramPosts.join('\n'),
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
}

const tabs = [
  { id: 'hero', label: 'Portada', description: 'Texto y video de Instagram' },
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
          hero_video_url: current.hero_video_url || featuredInstagramVideoUrl,
          whatsapp_martina: current.whatsapp_martina || '',
          whatsapp_luz: current.whatsapp_luz || '',
          portfolio_mode: (current.portfolio_mode || 'visible') as SettingsState['portfolio_mode'],
          instagram_posts: current.instagram_posts || initialInstagramPosts.join('\n'),
          about_text: current.about_text || '',
          footer_description: current.footer_description || '',
          footer_email: current.footer_email || '',
          footer_phone: current.footer_phone || '',
          footer_location: current.footer_location || '',
          footer_instagram: current.footer_instagram === '@GlitterPop_eventos' ? '@glitterr_pop' : current.footer_instagram || '',
          footer_facebook: current.footer_facebook || '',
          contact_phone: current.contact_phone || '',
          contact_instagram: current.contact_instagram === '@GlitterPop_eventos' ? '@glitterr_pop' : current.contact_instagram || '',
          contact_location: current.contact_location || '',
          contact_delivery: current.contact_delivery || '',
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
          <p className="mt-1 text-sm text-slate-500">Definí el mensaje inicial y el video de la portada.</p>
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

        <div className="space-y-2 border-t border-slate-200 pt-5">
          <Label htmlFor="hero_video_url" className="block font-semibold">Video de portada en Instagram</Label>
          <Input
            id="hero_video_url"
            type="url"
            value={settings.hero_video_url}
            onChange={(event) => handleChange('hero_video_url', event.target.value)}
            className="h-12"
            placeholder={featuredInstagramVideoUrl}
          />
          <p className="text-sm text-slate-500">Pegá el enlace público de una publicación o reel. Se mostrará en la portada de desktop y mobile.</p>
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
      <div className="border-t border-slate-200 pt-5">
        <Label htmlFor="instagram_posts" className="mb-2 block font-semibold">Publicaciones y reels de Instagram</Label>
        <p className="mb-3 text-sm text-slate-500">Pegá un enlace público por línea desde @glitterr_pop. Se muestran en la página sin volver a subir archivos.</p>
        <Textarea
          id="instagram_posts"
          value={settings.instagram_posts}
          onChange={(event) => handleChange('instagram_posts', event.target.value)}
          rows={6}
          placeholder={'https://www.instagram.com/p/.../\nhttps://www.instagram.com/reel/.../'}
        />
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
            className="bg-[var(--brand-pink-dark)] text-white hover:bg-[var(--brand-ink)]"
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </div>
    </div>
  )
}

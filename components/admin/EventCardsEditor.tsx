'use client'

import { useEffect, useState } from 'react'
import { eventCards, getEventCards } from '@/lib/event-cards'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

type EventSettings = Record<string, string>

function eventSettings(values: EventSettings): EventSettings {
  return Object.fromEntries(eventCards.flatMap((card) => [
    [`event_${card.key}_title`, values[`event_${card.key}_title`] || card.title],
    [`event_${card.key}_description`, values[`event_${card.key}_description`] || card.description],
  ]))
}

export default function EventCardsEditor() {
  const [form, setForm] = useState<EventSettings>(() => eventSettings({}))
  const [savedForm, setSavedForm] = useState<EventSettings>(() => eventSettings({}))
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const response = await fetch('/api/settings', { cache: 'no-store' })
        if (!response.ok) throw new Error('No se pudieron cargar las tarjetas de eventos')
        const data = await response.json()
        if (!active) return
        const next = eventSettings(data.settings || {})
        setForm(next)
        setSavedForm(next)
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : 'No se pudieron cargar las tarjetas')
      } finally {
        if (active) setLoading(false)
      }
    }
    void load()
    return () => { active = false }
  }, [])

  const isDirty = JSON.stringify(form) !== JSON.stringify(savedForm)
  const preview = getEventCards(form)

  async function save() {
    try {
      setSaving(true)
      setError('')
      setMessage('')
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: form }),
      })
      if (!response.ok) throw new Error('No se pudieron guardar las tarjetas de eventos')
      setSavedForm({ ...form })
      setMessage('Tarjetas de eventos guardadas.')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudieron guardar las tarjetas')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section aria-labelledby="event-cards-heading" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-6">
        <h2 id="event-cards-heading" className="font-display text-3xl font-bold text-[var(--brand-ink)]">Tipos de eventos</h2>
        <p className="mt-2 text-sm text-slate-600">Estas cinco tarjetas aparecen debajo de Glitter Bar Esencial y Premium en la página de Servicios.</p>
      </div>

      {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {message && <p role="status" className="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-800">{message}</p>}

      <div className="grid gap-4 lg:grid-cols-2">
        {eventCards.map((card, index) => {
          const titleKey = `event_${card.key}_title`
          const descriptionKey = `event_${card.key}_description`
          return (
            <div key={card.key} className="space-y-3 rounded-2xl border border-slate-200 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--brand-pink-dark)]">Tarjeta {index + 1}{index === 0 ? ' · destacada' : ''}</p>
              <div>
                <Label htmlFor={titleKey}>Título</Label>
                <Input id={titleKey} value={form[titleKey]} disabled={loading || saving} maxLength={80} onChange={(event) => setForm((current) => ({ ...current, [titleKey]: event.target.value }))} />
              </div>
              <div>
                <Label htmlFor={descriptionKey}>Descripción</Label>
                <Textarea id={descriptionKey} value={form[descriptionKey]} disabled={loading || saving} maxLength={400} rows={3} onChange={(event) => setForm((current) => ({ ...current, [descriptionKey]: event.target.value }))} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button type="button" onClick={() => void save()} disabled={loading || saving || !isDirty || Object.values(form).some((value) => !value.trim())} className="bg-[var(--brand-pink-dark)] text-white hover:bg-[var(--brand-ink)]">{saving ? 'Guardando...' : 'Guardar tarjetas'}</Button>
        {isDirty && <span className="text-sm text-slate-600">Tenés cambios sin guardar.</span>}
      </div>

      <div className="mt-8 border-t border-slate-200 pt-6">
        <h3 className="text-sm font-semibold text-slate-700">Vista previa</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((card, index) => (
            <div key={card.key} className={`rounded-2xl p-5 ${index === 0 ? 'bg-[var(--brand-mint)] lg:col-span-2' : 'bg-[var(--brand-cream)]'}`}>
              <p className="font-display text-2xl font-bold text-[var(--brand-ink)]">{card.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--brand-ink)]/80">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

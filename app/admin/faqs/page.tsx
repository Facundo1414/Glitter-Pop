"use client"

import { useEffect, useMemo, useState } from 'react'

type Faq = {
  id: string
  question: string
  answer: string
  displayOrder: number
}

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ question: '', answer: '' })

  const isEditing = useMemo(() => Boolean(editingId), [editingId])

  const loadFaqs = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await fetch('/api/faqs', { cache: 'no-store' })
      if (!response.ok) throw new Error('No se pudieron cargar preguntas')
      const data = await response.json()
      setFaqs(data.faqs || [])
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Error cargando FAQs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadFaqs()
  }, [])

  const resetForm = () => {
    setEditingId(null)
    setForm({ question: '', answer: '' })
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      setSaving(true)
      setError('')

      const payload = {
        ...form,
        displayOrder: editingId
          ? faqs.find((item) => item.id === editingId)?.displayOrder ?? 0
          : faqs.length,
      }

      const endpoint = editingId ? `/api/faqs/${editingId}` : '/api/faqs'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'No se pudo guardar FAQ')
      }

      await loadFaqs()
      resetForm()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Error guardando FAQ')
    } finally {
      setSaving(false)
    }
  }

  const onEdit = (faq: Faq) => {
    setEditingId(faq.id)
    setForm({ question: faq.question, answer: faq.answer })
  }

  const onDelete = async (id: string) => {
    try {
      setError('')
      const response = await fetch(`/api/faqs/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'No se pudo eliminar FAQ')
      }

      await loadFaqs()
      if (editingId === id) resetForm()
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Error eliminando FAQ')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 font-display mb-2">Gestión de FAQs</h1>
        <p className="text-gray-600">Crea, edita y elimina preguntas frecuentes.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      )}

      <form onSubmit={onSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'Editar pregunta' : 'Nueva pregunta'}</h2>
        <input
          value={form.question}
          onChange={(e) => setForm((prev) => ({ ...prev, question: e.target.value }))}
          placeholder="Pregunta"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          required
        />
        <textarea
          value={form.answer}
          onChange={(e) => setForm((prev) => ({ ...prev, answer: e.target.value }))}
          placeholder="Respuesta"
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          required
        />
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold"
          >
            {saving ? 'Guardando...' : isEditing ? 'Actualizar FAQ' : 'Crear FAQ'}
          </button>
          {isEditing && (
            <button type="button" onClick={resetForm} className="px-5 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {loading && <div className="text-gray-600">Cargando preguntas...</div>}
        {!loading && faqs.map((faq) => (
          <div key={faq.id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
            <p className="text-gray-600 text-sm mb-4">{faq.answer}</p>
            <div className="flex gap-2">
              <button onClick={() => onEdit(faq)} className="px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm font-semibold">Editar</button>
              <button onClick={() => onDelete(faq.id)} className="px-3 py-2 bg-red-100 text-red-700 rounded text-sm font-semibold">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

"use client"

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'

type PortfolioItem = {
  id: string
  title: string
  image: string
  category: string
  displayOrder: number
}

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    image: '',
    category: 'special',
  })

  const isEditing = useMemo(() => Boolean(editingId), [editingId])

  const loadItems = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await fetch('/api/portfolio', { cache: 'no-store' })
      if (!response.ok) throw new Error('No se pudo cargar portfolio')
      const data = await response.json()
      setItems(data.portfolio || [])
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Error cargando portfolio')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadItems()
  }, [])

  const resetForm = () => {
    setEditingId(null)
    setForm({ title: '', image: '', category: 'special' })
  }

  const onUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
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
      setForm((prev) => ({ ...prev, image: data.url }))
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Error subiendo archivo')
    } finally {
      setSaving(false)
    }
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      setSaving(true)
      setError('')

      const payload = {
        ...form,
        displayOrder: editingId
          ? items.find((item) => item.id === editingId)?.displayOrder ?? 0
          : items.length,
      }

      const endpoint = editingId ? `/api/portfolio/${editingId}` : '/api/portfolio'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'No se pudo guardar item')
      }

      await loadItems()
      resetForm()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Error guardando item')
    } finally {
      setSaving(false)
    }
  }

  const onEdit = (item: PortfolioItem) => {
    setEditingId(item.id)
    setForm({
      title: item.title,
      image: item.image,
      category: item.category,
    })
  }

  const onDelete = async (id: string) => {
    try {
      setError('')
      const response = await fetch(`/api/portfolio/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'No se pudo eliminar item')
      }

      await loadItems()
      if (editingId === id) resetForm()
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Error eliminando item')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 font-display mb-2">
          Gestión de Portfolio
        </h1>
        <p className="text-gray-600">
          Sube y gestiona las fotos de tus trabajos.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      )}

      <form onSubmit={onSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'Editar item' : 'Nuevo item de portfolio'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Título"
            className="px-4 py-3 border border-gray-300 rounded-lg"
            required
          />
          <select
            value={form.category}
            onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
            className="px-4 py-3 border border-gray-300 rounded-lg"
          >
            <option value="festival">Festival</option>
            <option value="kids">Infantil</option>
            <option value="corporate">Corporativo</option>
            <option value="wedding">Boda</option>
            <option value="party">Fiesta</option>
            <option value="special">Especial</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div className="space-y-2">
            <input
              value={form.image}
              onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
              placeholder="URL de imagen"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              required
            />
            <input type="file" accept="image/*" onChange={onUpload} className="text-sm" />
          </div>
          {form.image && (
            <div className="relative h-40 rounded-lg overflow-hidden border border-gray-200">
              <Image src={form.image} alt="Preview" fill className="object-cover" />
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold"
          >
            {saving ? 'Guardando...' : isEditing ? 'Actualizar item' : 'Crear item'}
          </button>
          {isEditing && (
            <button type="button" onClick={resetForm} className="px-5 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && <div className="text-gray-600">Cargando portfolio...</div>}
        {!loading && items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
            <div className="relative aspect-square bg-gray-100">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => onEdit(item)}
                  className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-semibold"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-semibold"
                >
                  Eliminar
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                {item.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

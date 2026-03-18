"use client"

import { useEffect, useMemo, useState } from 'react'

type SitePackage = {
  id: string
  name: string
  price: string
  duration: string
  features: string[]
  ideal: string
  popular: boolean
  displayOrder: number
}

export default function AdminPaquetesPage() {
  const [packages, setPackages] = useState<SitePackage[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    price: '100000',
    duration: '',
    featuresText: '',
    ideal: '',
    popular: false,
  })

  const isEditing = useMemo(() => Boolean(editingId), [editingId])

  const loadPackages = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await fetch('/api/packages', { cache: 'no-store' })
      if (!response.ok) throw new Error('No se pudieron cargar paquetes')
      const data = await response.json()
      setPackages(data.packages || [])
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Error cargando paquetes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadPackages()
  }, [])

  const resetForm = () => {
    setEditingId(null)
    setForm({
      name: '',
      price: '100000',
      duration: '',
      featuresText: '',
      ideal: '',
      popular: false,
    })
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      setSaving(true)
      setError('')

      const features = form.featuresText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)

      const payload = {
        name: form.name,
        price: Number(form.price),
        duration: form.duration,
        features,
        ideal: form.ideal,
        popular: form.popular,
        displayOrder: editingId
          ? packages.find((item) => item.id === editingId)?.displayOrder ?? 0
          : packages.length,
      }

      const endpoint = editingId ? `/api/packages/${editingId}` : '/api/packages'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'No se pudo guardar paquete')
      }

      await loadPackages()
      resetForm()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Error guardando paquete')
    } finally {
      setSaving(false)
    }
  }

  const onEdit = (pkg: SitePackage) => {
    setEditingId(pkg.id)
    setForm({
      name: pkg.name,
      price: pkg.price,
      duration: pkg.duration,
      featuresText: pkg.features.join('\n'),
      ideal: pkg.ideal,
      popular: pkg.popular,
    })
  }

  const onDelete = async (id: string) => {
    try {
      setError('')
      const response = await fetch(`/api/packages/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'No se pudo eliminar paquete')
      }
      await loadPackages()
      if (editingId === id) resetForm()
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Error eliminando paquete')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 font-display mb-2">
          Gestión de Paquetes
        </h1>
        <p className="text-gray-600">
          Administra los paquetes de precios y planes.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      )}

      <form onSubmit={onSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'Editar paquete' : 'Nuevo paquete'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Nombre"
            className="px-4 py-3 border border-gray-300 rounded-lg"
            required
          />
          <input
            value={form.price}
            onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
            placeholder="Precio"
            type="number"
            className="px-4 py-3 border border-gray-300 rounded-lg"
            required
          />
          <input
            value={form.duration}
            onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))}
            placeholder="Duración"
            className="px-4 py-3 border border-gray-300 rounded-lg"
            required
          />
          <input
            value={form.ideal}
            onChange={(e) => setForm((prev) => ({ ...prev, ideal: e.target.value }))}
            placeholder="Ideal para"
            className="px-4 py-3 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <textarea
          value={form.featuresText}
          onChange={(e) => setForm((prev) => ({ ...prev, featuresText: e.target.value }))}
          placeholder="Features, una por línea"
          rows={5}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          required
        />
        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.popular}
            onChange={(e) => setForm((prev) => ({ ...prev, popular: e.target.checked }))}
          />
          Marcar como más popular
        </label>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold"
          >
            {saving ? 'Guardando...' : isEditing ? 'Actualizar paquete' : 'Crear paquete'}
          </button>
          {isEditing && (
            <button type="button" onClick={resetForm} className="px-5 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading && <div className="text-gray-600">Cargando paquetes...</div>}
        {!loading && packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
              pkg.popular ? 'ring-2 ring-purple-600' : ''
            }`}
          >
            {pkg.popular && (
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 text-center text-sm font-bold">
                ⭐ Más Popular
              </div>
            )}
            <div className="p-6">
              <h3 className="font-bold text-2xl text-gray-900 mb-2">{pkg.name}</h3>
              <p className="text-3xl font-bold text-purple-600 mb-4">
                ${parseInt(pkg.price).toLocaleString('es-AR')}
              </p>
              <p className="text-sm text-gray-600 mb-4">Duración: {pkg.duration}</p>

              <div className="space-y-2 mb-6">
                {pkg.features.slice(0, 3).map((feature, i) => (
                  <p key={i} className="text-sm text-gray-700">✓ {feature}</p>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(pkg)}
                  className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-semibold"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(pkg.id)}
                  className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-semibold"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

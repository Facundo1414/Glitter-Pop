"use client"

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'

type Member = {
  id: string
  name: string
  role: string
  description: string
  image: string
  displayOrder: number
}

export default function AdminNosotrasPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    role: '',
    description: '',
    image: '/images/Marti.webp',
  })

  const isEditing = useMemo(() => Boolean(editingId), [editingId])

  const loadMembers = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await fetch('/api/team', { cache: 'no-store' })
      if (!response.ok) throw new Error('No se pudo cargar el equipo')
      const data = await response.json()
      setMembers(data.team || [])
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Error cargando equipo')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadMembers()
  }, [])

  const resetForm = () => {
    setEditingId(null)
    setForm({
      name: '',
      role: '',
      description: '',
      image: '/images/Marti.webp',
    })
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      setSaving(true)
      setError('')

      const payload = {
        ...form,
        displayOrder: editingId
          ? members.find((item) => item.id === editingId)?.displayOrder ?? 0
          : members.length,
      }

      const endpoint = editingId ? `/api/team/${editingId}` : '/api/team'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'No se pudo guardar integrante')
      }

      await loadMembers()
      resetForm()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Error guardando integrante')
    } finally {
      setSaving(false)
    }
  }

  const onEdit = (member: Member) => {
    setEditingId(member.id)
    setForm({
      name: member.name,
      role: member.role,
      description: member.description,
      image: member.image,
    })
  }

  const onDelete = async (id: string) => {
    try {
      setError('')
      const response = await fetch(`/api/team/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'No se pudo eliminar integrante')
      }
      await loadMembers()
      if (editingId === id) resetForm()
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Error eliminando integrante')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 font-display mb-2">Gestión de Nosotras</h1>
        <p className="text-gray-600">Administra las integrantes y su información.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      )}

      <form onSubmit={onSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'Editar integrante' : 'Nueva integrante'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Nombre"
            className="px-4 py-3 border border-gray-300 rounded-lg"
            required
          />
          <input
            value={form.role}
            onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
            placeholder="Rol"
            className="px-4 py-3 border border-gray-300 rounded-lg"
            required
          />
          <input
            value={form.image}
            onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
            placeholder="URL de imagen"
            className="md:col-span-2 px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>
        <textarea
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Descripción"
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
            {saving ? 'Guardando...' : isEditing ? 'Actualizar integrante' : 'Crear integrante'}
          </button>
          {isEditing && (
            <button type="button" onClick={resetForm} className="px-5 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading && <div className="text-gray-600">Cargando integrantes...</div>}
        {!loading && members.map((member) => (
          <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48 bg-gray-100">
              <Image src={member.image} alt={member.name} fill className="object-cover" />
            </div>
            <div className="p-4 space-y-2">
              <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
              <p className="text-sm text-purple-700 font-semibold">{member.role}</p>
              <p className="text-sm text-gray-600">{member.description}</p>
              <div className="flex gap-2 pt-2">
                <button onClick={() => onEdit(member)} className="px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm font-semibold">Editar</button>
                <button onClick={() => onDelete(member.id)} className="px-3 py-2 bg-red-100 text-red-700 rounded text-sm font-semibold">Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

"use client"

import { useState } from 'react'
import Image from 'next/image'

import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { PortfolioPreviewPanel } from '@/components/admin/PreviewPanels'
import UnsavedChangesBanner from '@/components/admin/UnsavedChangesBanner'
import { useAdminCrud } from '@/hooks/useAdminCrud'

type PortfolioItem = {
  id: string
  title: string
  image: string
  category: string
  displayOrder: number
}

const defaultForm = {
  title: '',
  image: '',
  category: 'special',
}

export default function AdminPortfolioPage() {
  const [pendingDelete, setPendingDelete] = useState<PortfolioItem | null>(null)
  const {
    items,
    loading,
    saving,
    setSaving,
    error,
    setError,
    isEditing,
    isDirty,
    form,
    setForm,
    resetForm,
    startEdit,
    submitForm,
    deleteItem,
  } = useAdminCrud<PortfolioItem, typeof defaultForm>({
    endpoint: '/api/portfolio',
    defaultForm,
    getItems: (data) => ((data as { portfolio?: PortfolioItem[] })?.portfolio ?? []),
    getItemId: (item) => item.id,
    mapItemToForm: (item) => ({
      title: item.title,
      image: item.image,
      category: item.category,
    }),
    buildPayload: ({ form: currentForm, items, editingId }) => ({
      ...currentForm,
      displayOrder: editingId
        ? items.find((item) => item.id === editingId)?.displayOrder ?? 0
        : items.length,
    }),
    messages: {
      load: 'No se pudo cargar portfolio',
      save: 'Error guardando item',
      delete: 'Error eliminando item',
    },
  })

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

  const onDelete = async (id: string) => {
    try {
      await deleteItem(id)
    } finally {
      setPendingDelete(null)
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

      <UnsavedChangesBanner
        visible={isDirty}
        onReset={resetForm}
        message={isEditing ? 'Tienes cambios sin guardar en este item del portfolio.' : 'Estas preparando un item nuevo y aun no fue guardado.'}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <form onSubmit={submitForm} className="bg-white rounded-lg shadow-md p-6 space-y-4">
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
              <input
                type="file"
                accept="image/*"
                onChange={onUpload}
                className="w-full border border-gray-300 rounded-lg bg-gray-50 p-2 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-purple-100 file:px-3 file:py-1.5 file:font-semibold file:text-purple-700 hover:file:bg-purple-200"
              />
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
              className="px-5 py-3 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold"
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
        <PortfolioPreviewPanel data={form} />
      </div>

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
                  onClick={() => startEdit(item)}
                  className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-semibold"
                >
                  Editar
                </button>
                <button
                  onClick={() => setPendingDelete(item)}
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

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Eliminar item del portfolio"
        description={pendingDelete ? `Se eliminara "${pendingDelete.title}" de la galeria publicada.` : ''}
        confirmLabel="Eliminar item"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && void onDelete(pendingDelete.id)}
        busy={saving}
      />
    </div>
  )
}

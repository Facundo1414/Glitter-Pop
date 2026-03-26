"use client"

import { useState } from 'react'
import Image from 'next/image'

import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { SkeletonCard } from '@/components/admin/Skeleton'
import { ServicePreviewPanel } from '@/components/admin/PreviewPanels'
import UnsavedChangesBanner from '@/components/admin/UnsavedChangesBanner'
import { useAdminCrud } from '@/hooks/useAdminCrud'

type Service = {
  id: string
  title: string
  description: string
  image: string
  duration: string
  icon: string
  displayOrder: number
}

const defaultForm = {
  title: '',
  description: '',
  image: '',
  duration: '',
  icon: '✨',
}

export default function AdminServiciosPage() {
  const [pendingDelete, setPendingDelete] = useState<Service | null>(null)
  const {
    items: services,
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
  } = useAdminCrud<Service, typeof defaultForm>({
    endpoint: '/api/services',
    defaultForm,
    getItems: (data) => ((data as { services?: Service[] })?.services ?? []),
    getItemId: (item) => item.id,
    mapItemToForm: (item) => ({
      title: item.title,
      description: item.description,
      image: item.image,
      duration: item.duration,
      icon: item.icon,
    }),
    buildPayload: ({ form: currentForm, items, editingId }) => ({
      ...currentForm,
      displayOrder: editingId
        ? items.find((item) => item.id === editingId)?.displayOrder ?? 0
        : items.length,
    }),
    messages: {
      load: 'No se pudieron cargar servicios',
      save: 'Error guardando servicio',
      delete: 'Error eliminando servicio',
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
          Gestión de Servicios
        </h1>
        <p className="text-gray-600">
          Crea, edita y elimina los servicios que ofrece Glitter Pop.
        </p>
      </div>

      <UnsavedChangesBanner
        visible={isDirty}
        onReset={resetForm}
        message={isEditing ? 'Tienes cambios sin guardar en este servicio.' : 'Estas creando un servicio nuevo y aun no fue guardado.'}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <form onSubmit={submitForm} className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'Editar servicio' : 'Nuevo servicio'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Título"
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
                disabled={saving}
              />
            </div>
            <input
              value={form.icon}
              onChange={(e) => setForm((prev) => ({ ...prev, icon: e.target.value }))}
              placeholder="Icono (emoji)"
              className="px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>

          {form.image && (
            <div className="relative h-40 rounded-lg overflow-hidden border border-gray-200">
              <Image src={form.image} alt="Preview servicio" fill className="object-cover" />
            </div>
          )}
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
              className="px-5 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold"
            >
              {saving ? 'Guardando...' : isEditing ? 'Actualizar servicio' : 'Crear servicio'}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
        <ServicePreviewPanel data={form} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && (
          <>{[1,2,3].map(i => <SkeletonCard key={i} />)}</>
        )}
        {!loading && services.map((service) => (
          <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-32 bg-linear-to-br from-pastel-lavender to-pastel-pink relative overflow-hidden">
              {service.image ? (
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl">{service.icon}</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-900 mb-2">{service.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{service.description}</p>
              <p className="text-xs text-purple-600 font-semibold mb-4">⏱️ {service.duration}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(service)}
                  className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-semibold"
                >
                  Editar
                </button>
                <button
                  onClick={() => setPendingDelete(service)}
                  className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-semibold"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Eliminar servicio"
        description={pendingDelete ? `Se eliminara "${pendingDelete.title}" y no se podra recuperar desde el panel.` : ''}
        confirmLabel="Eliminar servicio"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && void onDelete(pendingDelete.id)}
        busy={saving}
      />
    </div>
  )
}

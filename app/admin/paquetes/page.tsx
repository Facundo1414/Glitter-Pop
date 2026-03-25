"use client"

import { useState } from 'react'

import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { PackagePreviewPanel } from '@/components/admin/PreviewPanels'
import UnsavedChangesBanner from '@/components/admin/UnsavedChangesBanner'
import { useAdminCrud } from '@/hooks/useAdminCrud'

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

type PackagePayload = {
  name: string
  price: number
  duration: string
  features: string[]
  ideal: string
  popular: boolean
  displayOrder: number
}

const defaultForm = {
  name: '',
  price: '100000',
  duration: '',
  featuresText: '',
  ideal: '',
  popular: false,
}

export default function AdminPaquetesPage() {
  const [pendingDelete, setPendingDelete] = useState<SitePackage | null>(null)
  const {
    items: packages,
    loading,
    saving,
    error,
    isEditing,
    isDirty,
    form,
    setForm,
    resetForm,
    startEdit,
    submitForm,
    deleteItem,
  } = useAdminCrud<SitePackage, typeof defaultForm, PackagePayload>({
    endpoint: '/api/packages',
    defaultForm,
    getItems: (data) => ((data as { packages?: SitePackage[] })?.packages ?? []),
    getItemId: (item) => item.id,
    mapItemToForm: (item) => ({
      name: item.name,
      price: item.price,
      duration: item.duration,
      featuresText: item.features.join('\n'),
      ideal: item.ideal,
      popular: item.popular,
    }),
    buildPayload: ({ form: currentForm, items, editingId }) => {
      const features = currentForm.featuresText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)

      return {
        name: currentForm.name,
        price: Number(currentForm.price),
        duration: currentForm.duration,
        features,
        ideal: currentForm.ideal,
        popular: currentForm.popular,
        displayOrder: editingId
          ? items.find((item) => item.id === editingId)?.displayOrder ?? 0
          : items.length,
      }
    },
    messages: {
      load: 'No se pudieron cargar paquetes',
      save: 'Error guardando paquete',
      delete: 'Error eliminando paquete',
    },
  })

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
          Gestión de Paquetes
        </h1>
        <p className="text-gray-600">
          Administra los paquetes de precios y planes.
        </p>
      </div>

      <UnsavedChangesBanner
        visible={isDirty}
        onReset={resetForm}
        message={isEditing ? 'Tienes cambios sin guardar en este paquete.' : 'Estas preparando un paquete nuevo y aun no fue guardado.'}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <form onSubmit={submitForm} className="bg-white rounded-lg shadow-md p-6 space-y-4">
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
              className="px-5 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold"
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
        <PackagePreviewPanel data={form} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading && <div className="text-gray-600">Cargando paquetes...</div>}
        {!loading && packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative h-full bg-white rounded-2xl overflow-hidden transition-all duration-500 ${
              pkg.popular
                ? 'shadow-2xl border-2 border-primary-200 scale-[1.02] ring-1 ring-purple-400'
                : 'shadow-lg hover:shadow-xl border border-gray-100'
            }`}
          >
            {pkg.popular && (
              <div className="absolute top-0 inset-x-0 h-2 bg-linear-to-r from-purple-600 via-pink-600 to-purple-700" />
            )}

            <div className="p-6 pt-7">
              {pkg.popular && (
                <div className="flex justify-center mb-3">
                  <span className="inline-flex items-center gap-2 bg-linear-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                    <span>⭐</span>
                    <span>Más Popular</span>
                  </span>
                </div>
              )}

              <h3 className="font-bold text-2xl text-gray-900 mb-2 text-center">{pkg.name}</h3>
              <p className="text-3xl font-bold text-purple-600 mb-2 text-center">
                ${parseInt(pkg.price).toLocaleString('es-AR')}
              </p>
              <p className="text-sm text-gray-600 mb-4 text-center">{pkg.duration}</p>

              <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent mb-4" />

              <div className="space-y-2 mb-4">
                {pkg.features.slice(0, 4).map((feature, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-purple-600 font-bold">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <div className="bg-linear-to-br from-pastel-lavender/30 to-pastel-pink/30 rounded-xl p-3 border border-primary-100">
                  <p className="text-[10px] font-semibold text-primary-600 uppercase tracking-wide mb-1">Ideal para</p>
                  <p className="text-gray-900 text-sm">{pkg.ideal}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(pkg)}
                  className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-semibold"
                >
                  Editar
                </button>
                <button
                  onClick={() => setPendingDelete(pkg)}
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
        title="Eliminar paquete"
        description={pendingDelete ? `Se eliminara "${pendingDelete.name}" y dejara de estar disponible en el sitio.` : ''}
        confirmLabel="Eliminar paquete"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && void onDelete(pendingDelete.id)}
        busy={saving}
      />
    </div>
  )
}

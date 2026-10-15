"use client"

import { useState } from 'react'
import Image from 'next/image'

import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { SkeletonCard } from '@/components/admin/Skeleton'
import { ServicePreviewPanel } from '@/components/admin/PreviewPanels'
import EventCardsEditor from '@/components/admin/EventCardsEditor'
import { selectPublicServiceRows } from '@/lib/service-selection'
import UnsavedChangesBanner from '@/components/admin/UnsavedChangesBanner'
import { useAdminCrud } from '@/hooks/useAdminCrud'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

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
  const publishedServices = selectPublicServiceRows(services)
  const publishedIds = new Set(publishedServices.map((service) => service.id))

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
          Editá los dos Glitter Bar y las tarjetas de tipos de eventos que se muestran en la web.
        </p>
      </div>

      {!loading && publishedServices.length === 0 && (
        <Alert className="border-amber-200 bg-amber-50 text-amber-900">
          <AlertDescription>La web está mostrando las dos descripciones predeterminadas. Para publicar cambios desde este panel, necesitás dos servicios actuales; los servicios del catálogo anterior no se muestran.</AlertDescription>
        </Alert>
      )}

      <UnsavedChangesBanner
        visible={isDirty}
        onReset={resetForm}
        message={isEditing ? 'Tienes cambios sin guardar en este servicio.' : 'Estas creando un servicio nuevo y aun no fue guardado.'}
      />

      {error && (
        <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <form onSubmit={submitForm}>
          <Card>
            <CardContent className="space-y-4 pt-6">
              <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'Editar Glitter Bar' : 'Nuevo Glitter Bar'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Título"
                  className="h-12"
                  required
                />
                <Input
                  value={form.duration}
                  onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))}
                  placeholder="Duración"
                  className="h-12"
                  required
                />
                <div className="space-y-2">
                  <Input
                    value={form.image}
                    onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
                    placeholder="URL de imagen"
                    className="h-12"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onUpload}
                    className="w-full border border-input rounded-lg bg-gray-50 p-2 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-purple-100 file:px-3 file:py-1.5 file:font-semibold file:text-purple-700 hover:file:bg-purple-200"
                    disabled={saving}
                  />
                </div>
              </div>
              <p className="text-sm text-slate-500">La imagen es opcional. Si no cargás una, la tarjeta pública muestra sólo el contenido del servicio.</p>

              {form.image && (
                <div className="relative h-40 rounded-lg overflow-hidden border border-gray-200">
                  <Image src={form.image} alt="Preview servicio" fill className="object-cover" />
                </div>
              )}
              <Textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Descripción"
                rows={4}
                required
              />
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={saving || (!isEditing && publishedServices.length === 2)}
                  className="bg-[var(--brand-pink-dark)] text-white hover:bg-[var(--brand-ink)]"
                >
                  {saving ? 'Guardando...' : isEditing ? 'Actualizar servicio' : 'Crear servicio'}
                </Button>
                {isEditing && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
        <ServicePreviewPanel data={form} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && (
          <>{[1,2,3].map(i => <SkeletonCard key={i} />)}</>
        )}
        {!loading && services.map((service) => (
          <div key={service.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {service.image && (
              <div className="relative h-32 overflow-hidden">
                <Image src={service.image} alt={service.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
            )}
            <div className="p-4">
              <p className={`mb-2 text-xs font-bold ${publishedIds.has(service.id) ? 'text-emerald-700' : 'text-slate-500'}`}>
                {publishedIds.has(service.id) ? 'Visible en la web' : 'No visible en la web'}
              </p>
              <h3 className="font-bold text-lg text-gray-900 mb-2">{service.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{service.description}</p>
              <p className="text-xs text-[var(--brand-pink-dark)] font-semibold mb-4">{service.duration}</p>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => startEdit(service)}>
                  Editar
                </Button>
                <Button variant="secondary" size="sm" className="flex-1 bg-red-100 text-red-700 hover:bg-red-200" onClick={() => setPendingDelete(service)}>
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <EventCardsEditor />

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

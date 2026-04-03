"use client"

import { useState } from 'react'

import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { SkeletonFaqItem } from '@/components/admin/Skeleton'
import { FaqPreviewPanel } from '@/components/admin/PreviewPanels'
import UnsavedChangesBanner from '@/components/admin/UnsavedChangesBanner'
import { useAdminCrud } from '@/hooks/useAdminCrud'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'

type Faq = {
  id: string
  question: string
  answer: string
  displayOrder: number
}

const defaultForm = { question: '', answer: '' }

export default function AdminFaqsPage() {
  const [pendingDelete, setPendingDelete] = useState<Faq | null>(null)
  const {
    items: faqs,
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
  } = useAdminCrud<Faq, typeof defaultForm>({
    endpoint: '/api/faqs',
    defaultForm,
    getItems: (data) => ((data as { faqs?: Faq[] })?.faqs ?? []),
    getItemId: (item) => item.id,
    mapItemToForm: (item) => ({ question: item.question, answer: item.answer }),
    buildPayload: ({ form: currentForm, items, editingId }) => ({
      ...currentForm,
      displayOrder: editingId
        ? items.find((item) => item.id === editingId)?.displayOrder ?? 0
        : items.length,
    }),
    messages: {
      load: 'No se pudieron cargar preguntas',
      save: 'Error guardando FAQ',
      delete: 'Error eliminando FAQ',
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
        <h1 className="text-4xl font-bold text-gray-900 font-display mb-2">Gestión de FAQs</h1>
        <p className="text-gray-600">Crea, edita y elimina preguntas frecuentes.</p>
      </div>

      <UnsavedChangesBanner
        visible={isDirty}
        onReset={resetForm}
        message={isEditing ? 'Tienes cambios sin guardar en esta FAQ.' : 'Estas creando una nueva FAQ y aun no fue guardada.'}
      />

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <form onSubmit={submitForm}>
        <Card className="border-none shadow-md">
          <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'Editar pregunta' : 'Nueva pregunta'}</h2>
          <Input
            value={form.question}
            onChange={(e) => setForm((prev) => ({ ...prev, question: e.target.value }))}
            placeholder="Pregunta"
            className="h-12 px-4"
            required
          />
          <Textarea
            value={form.answer}
            onChange={(e) => setForm((prev) => ({ ...prev, answer: e.target.value }))}
            placeholder="Respuesta"
            rows={4}
            className="px-4 py-3"
            required
          />
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={saving}
              className="bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold px-5 py-3 h-auto"
            >
              {saving ? 'Guardando...' : isEditing ? 'Actualizar FAQ' : 'Crear FAQ'}
            </Button>
            {isEditing && (
              <Button type="button" variant="secondary" onClick={resetForm} className="px-5 py-3 h-auto font-semibold">
                Cancelar
              </Button>
            )}
          </div>
          </CardContent>
        </Card>
        </form>
        <FaqPreviewPanel data={form} />
      </div>

      <div className="space-y-3">
        {loading && <>{[1,2,3].map(i => <SkeletonFaqItem key={i} />)}</>}
        {!loading && faqs.map((faq) => (
          <div key={faq.id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
            <p className="text-gray-600 text-sm mb-4">{faq.answer}</p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => startEdit(faq)} className="bg-blue-100 text-blue-700 hover:bg-blue-200">Editar</Button>
              <Button variant="secondary" size="sm" onClick={() => setPendingDelete(faq)} className="bg-red-100 text-red-700 hover:bg-red-200">Eliminar</Button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Eliminar pregunta frecuente"
        description={pendingDelete ? `Se eliminara la pregunta "${pendingDelete.question}".` : ''}
        confirmLabel="Eliminar FAQ"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && void onDelete(pendingDelete.id)}
        busy={saving}
      />
    </div>
  )
}

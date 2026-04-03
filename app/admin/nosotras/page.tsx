"use client"

import { useState } from 'react'
import Image from 'next/image'

import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { SkeletonTeamCard } from '@/components/admin/Skeleton'
import { TeamPreviewPanel } from '@/components/admin/PreviewPanels'
import UnsavedChangesBanner from '@/components/admin/UnsavedChangesBanner'
import { useAdminCrud } from '@/hooks/useAdminCrud'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

type Member = {
  id: string
  name: string
  role: string
  description: string
  image: string
  displayOrder: number
}

const defaultForm = {
  name: '',
  role: '',
  description: '',
  image: '',
}

export default function AdminNosotrasPage() {
  const [pendingDelete, setPendingDelete] = useState<Member | null>(null)
  const {
    items: members,
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
  } = useAdminCrud<Member, typeof defaultForm>({
    endpoint: '/api/team',
    defaultForm,
    getItems: (data) => ((data as { team?: Member[] })?.team ?? []),
    getItemId: (item) => item.id,
    mapItemToForm: (item) => ({
      name: item.name,
      role: item.role,
      description: item.description,
      image: item.image,
    }),
    buildPayload: ({ form: currentForm, items, editingId }) => ({
      ...currentForm,
      displayOrder: editingId
        ? items.find((item) => item.id === editingId)?.displayOrder ?? 0
        : items.length,
    }),
    messages: {
      load: 'No se pudo cargar el equipo',
      save: 'Error guardando integrante',
      delete: 'Error eliminando integrante',
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
        <h1 className="text-4xl font-bold text-gray-900 font-display mb-2">Gestión de Nosotras</h1>
        <p className="text-gray-600">Administra las integrantes y su información.</p>
      </div>

      <UnsavedChangesBanner
        visible={isDirty}
        onReset={resetForm}
        message={isEditing ? 'Tienes cambios sin guardar en esta integrante.' : 'Estas creando una integrante nueva y aun no fue guardada.'}
      />

      {error && (
        <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <form onSubmit={submitForm}>
          <Card>
            <CardContent className="space-y-4 pt-6">
              <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'Editar integrante' : 'Nueva integrante'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Nombre"
                  className="h-12"
                  required
                />
                <Input
                  value={form.role}
                  onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                  placeholder="Rol"
                  className="h-12"
                  required
                />
                <div className="md:col-span-2 space-y-2">
                  <Input
                    value={form.image}
                    onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
                    placeholder="URL de imagen"
                    className="h-12"
                    required
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

              {form.image && (
                <div className="relative h-40 rounded-lg overflow-hidden border border-gray-200">
                  <Image src={form.image} alt="Preview integrante" fill className="object-cover" />
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
                  disabled={saving}
                  className="bg-linear-to-r from-purple-600 to-pink-600 text-white"
                >
                  {saving ? 'Guardando...' : isEditing ? 'Actualizar integrante' : 'Crear integrante'}
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
        <TeamPreviewPanel data={form} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading && <>{[1,2].map(i => <SkeletonTeamCard key={i} />)}</>}
        {!loading && members.map((member) => (
          <div key={member.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-linear-to-br from-pastel-pink via-pastel-lavender to-pastel-blue p-8">
              <div className="w-32 h-32 mx-auto bg-white rounded-full overflow-hidden shadow-lg relative">
                {member.image ? (
                  <Image src={member.image} alt={member.name} fill className="object-cover" sizes="128px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">✨</div>
                )}
              </div>
            </div>
            <div className="p-5 sm:p-6 text-center space-y-2">
              <h3 className="text-xl sm:text-2xl font-display font-bold text-gray-900">{member.name}</h3>
              <p className="text-sm text-purple-700 font-semibold">{member.role}</p>
              <p className="text-sm text-gray-600">{member.description}</p>
              <div className="flex gap-2 pt-2">
                <Button variant="secondary" size="sm" onClick={() => startEdit(member)}>Editar</Button>
                <Button variant="secondary" size="sm" className="bg-red-100 text-red-700 hover:bg-red-200" onClick={() => setPendingDelete(member)}>Eliminar</Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Eliminar integrante"
        description={pendingDelete ? `Se eliminara a "${pendingDelete.name}" del equipo publicado.` : ''}
        confirmLabel="Eliminar integrante"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && void onDelete(pendingDelete.id)}
        busy={saving}
      />
    </div>
  )
}

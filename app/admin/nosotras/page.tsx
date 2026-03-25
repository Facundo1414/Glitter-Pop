"use client"

import { useState } from 'react'
import Image from 'next/image'

import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { TeamPreviewPanel } from '@/components/admin/PreviewPanels'
import UnsavedChangesBanner from '@/components/admin/UnsavedChangesBanner'
import { useAdminCrud } from '@/hooks/useAdminCrud'

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
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <form onSubmit={submitForm} className="bg-white rounded-lg shadow-md p-6 space-y-4">
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
            <div className="md:col-span-2 space-y-2">
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
          </div>

          {form.image && (
            <div className="relative h-40 rounded-lg overflow-hidden border border-gray-200">
              <Image src={form.image} alt="Preview integrante" fill className="object-cover" />
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
              {saving ? 'Guardando...' : isEditing ? 'Actualizar integrante' : 'Crear integrante'}
            </button>
            {isEditing && (
              <button type="button" onClick={resetForm} className="px-5 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold">
                Cancelar
              </button>
            )}
          </div>
        </form>
        <TeamPreviewPanel data={form} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading && <div className="text-gray-600">Cargando integrantes...</div>}
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
                <button onClick={() => startEdit(member)} className="px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm font-semibold">Editar</button>
                <button onClick={() => setPendingDelete(member)} className="px-3 py-2 bg-red-100 text-red-700 rounded text-sm font-semibold">Eliminar</button>
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

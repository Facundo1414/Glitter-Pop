'use client'

type UnsavedChangesBannerProps = {
  visible: boolean
  message?: string
  onReset?: () => void
  resetLabel?: string
}

export default function UnsavedChangesBanner({
  visible,
  message = 'Tienes cambios sin guardar en esta seccion.',
  onReset,
  resetLabel = 'Descartar cambios',
}: UnsavedChangesBannerProps) {
  if (!visible) {
    return null
  }

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold">Cambios pendientes</p>
          <p className="text-sm text-amber-800">{message}</p>
        </div>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="rounded-xl border border-amber-300 px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100"
          >
            {resetLabel}
          </button>
        )}
      </div>
    </div>
  )
}
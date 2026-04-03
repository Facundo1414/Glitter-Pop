'use client'

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

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
    <Alert className="rounded-2xl border-amber-200 bg-amber-50 text-amber-900">
      <AlertTriangle className="size-4 text-amber-600" />
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between w-full">
        <div>
          <AlertTitle className="font-semibold">Cambios pendientes</AlertTitle>
          <AlertDescription className="text-amber-800">{message}</AlertDescription>
        </div>
        {onReset && (
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="border-amber-300 text-amber-900 hover:bg-amber-100"
          >
            {resetLabel}
          </Button>
        )}
      </div>
    </Alert>
  )
}
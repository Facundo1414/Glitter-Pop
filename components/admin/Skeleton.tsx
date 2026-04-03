'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Skeleton className="h-32 rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  )
}

export function SkeletonPackageCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-4">
      <Skeleton className="h-5 w-1/2 mx-auto" />
      <Skeleton className="h-8 w-2/3 mx-auto" />
      <Skeleton className="h-3 w-1/3 mx-auto" />
      <div className="space-y-2 pt-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <Skeleton className="h-10 w-full rounded-full" />
    </div>
  )
}

export function SkeletonFaqItem() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-16 rounded" />
        <Skeleton className="h-8 w-20 rounded" />
      </div>
    </div>
  )
}

export function SkeletonTeamCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-linear-to-br from-pastel-pink/30 via-pastel-lavender/30 to-pastel-blue/30 p-8 flex justify-center">
        <Skeleton className="w-32 h-32 rounded-full" />
      </div>
      <div className="p-5 space-y-2 text-center">
        <Skeleton className="h-6 w-1/2 mx-auto" />
        <Skeleton className="h-4 w-1/3 mx-auto" />
        <Skeleton className="h-3 w-full" />
      </div>
    </div>
  )
}

export function SkeletonPortfolioCard() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Skeleton className="aspect-square rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-5 w-20 rounded" />
      </div>
    </div>
  )
}

export { Skeleton }
export default Skeleton

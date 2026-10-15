const legacyTitles = new Set([
  'Maquillaje con Glitter', 'Face & Body Painting', 'Eventos Corporativos',
  'Fiestas Infantiles', 'Bodas y Eventos Especiales', 'Festivales y Recitales',
])

export function selectPublicServiceRows<T extends { title: string }>(rows: T[]): T[] {
  const current = rows.filter((item) => !legacyTitles.has(item.title)).slice(0, 2)
  return current.length === 2 ? current : []
}

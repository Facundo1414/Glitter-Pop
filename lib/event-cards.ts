export const eventCards = [
  {
    key: 'wedding',
    title: 'Casamientos',
    description: 'Un rincón de glitter para que tus invitados elijan un look con brillo y disfruten de una experiencia más durante la fiesta.',
  },
  {
    key: 'fifteen',
    title: 'Fiestas de 15',
    description: 'Glitter, gemas y strass para sumar color a la fiesta.',
  },
  {
    key: 'corporate',
    title: 'Eventos corporativos',
    description: 'Una propuesta creativa para celebraciones y encuentros de equipo.',
  },
  {
    key: 'birthday',
    title: 'Cumpleaños',
    description: 'Un toque de brillo para compartir con amigas, familia e invitados.',
  },
  {
    key: 'other',
    title: 'Y mucho más',
    description: '¿Organizás otro tipo de evento? Contanos tu idea.',
  },
] as const

export function getEventCards(settings: Record<string, string>) {
  return eventCards.map((card) => ({
    key: card.key,
    title: settings[`event_${card.key}_title`]?.trim() || card.title,
    description: settings[`event_${card.key}_description`]?.trim() || card.description,
  }))
}

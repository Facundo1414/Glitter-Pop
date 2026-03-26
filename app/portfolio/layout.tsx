import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio | Glitter Pop - Nuestros Trabajos',
  description: 'Explorá nuestro portfolio de maquillaje artístico. Fotos y videos de eventos, festivales, bodas, cumpleaños y más.',
}

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return children
}

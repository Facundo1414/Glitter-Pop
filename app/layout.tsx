import './globals.css'
import type { Metadata } from 'next'
import { Lora } from 'next/font/google'
import PageWrapper from '@/components/PageWrapper'

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Glitter Pop - Maquillaje Artístico con Glitter',
  description: 'Servicios profesionales de maquillaje artístico con glitter para eventos, fiestas y celebraciones. Transformamos tu evento en una experiencia brillante.',
  keywords: ['maquillaje', 'glitter', 'eventos', 'fiestas', 'face painting', 'body art'],
  authors: [{ name: 'Glitter Pop' }],
  openGraph: {
    title: 'Glitter Pop - Maquillaje Artístico con Glitter',
    description: 'Brillo y Magia para tus Eventos',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={lora.variable}>
      <body className="font-sans"><PageWrapper>{children}</PageWrapper></body>
    </html>
  )
}

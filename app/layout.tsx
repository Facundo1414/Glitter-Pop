import './globals.css'
import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-playfair',
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
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}

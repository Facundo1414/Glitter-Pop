import './globals.css'
import type { Metadata } from 'next'
import { DM_Sans, Barlow_Condensed } from 'next/font/google'
import PageWrapper from '@/components/PageWrapper'
import PublicHeader from '@/components/PublicHeader'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})
const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-barlow-condensed',
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
    <html lang="es" className={`${dmSans.variable} ${barlowCondensed.variable}`}>
      <body className="font-sans"><PublicHeader /><PageWrapper>{children}</PageWrapper></body>
    </html>
  )
}

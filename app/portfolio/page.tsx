import Portfolio from '@/components/Portfolio'
import Gallery from '@/components/Gallery'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { loadPublicPortfolio, loadPublicSettings } from '@/lib/public-content'

export const dynamic = 'force-dynamic'

export default async function PortfolioPage() {
  const [settings, portfolio] = await Promise.all([loadPublicSettings(), loadPublicPortfolio()])
  const mode = settings.portfolio_mode
  const portfolioMode = mode === 'hidden' || mode === 'comingsoon' ? mode : 'visible'
  return (
    <main className="min-h-screen bg-white">
      <div className="pt-24">
        {portfolioMode === 'visible' && (
          <>
            <Portfolio portfolio={portfolio} />
            <Gallery settings={settings} />
          </>
        )}

        {portfolioMode === 'comingsoon' && (
          <section className="py-16 md:py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 text-center">
              <h2 className="section-title">Nuestro Portfolio</h2>
              <p className="section-subtitle">Estamos preparando esta sección.</p>
              <div className="mx-auto max-w-3xl rounded-2xl border border-primary-100 bg-[var(--brand-mint)] p-10">
                <p className="text-2xl font-display font-bold text-gray-900">Próximamente ✨</p>
                <p className="text-gray-600 mt-3">Muy pronto vas a ver aquí nuestros mejores trabajos.</p>
              </div>
            </div>
          </section>
        )}

        {portfolioMode === 'hidden' && (
          <section className="py-16 md:py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 text-center">
              <div className="max-w-2xl mx-auto bg-gray-50 rounded-2xl p-10 border border-gray-200">
                <p className="text-2xl font-display font-bold text-gray-900">Portfolio oculto temporalmente</p>
                <p className="text-gray-600 mt-3">Esta sección no está disponible por el momento.</p>
              </div>
            </div>
          </section>
        )}
      </div>
      <Footer settings={settings} />
      <WhatsAppButton settings={settings} />
    </main>
  )
}

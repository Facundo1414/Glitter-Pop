'use client'

import Image from 'next/image'

type ServicePreviewData = {
  title: string
  description: string
  image: string
  duration: string
  icon: string
}

type PackagePreviewData = {
  name: string
  price: string
  duration: string
  ideal: string
  popular: boolean
  featuresText: string
}

type FaqPreviewData = {
  question: string
  answer: string
}

type TeamPreviewData = {
  name: string
  role: string
  description: string
  image: string
}

type PortfolioPreviewData = {
  title: string
  image: string
  category: string
}

type SettingsPreviewData = {
  hero_title: string
  hero_subtitle: string
  hero_desktop_variant: 'desktop_v1' | 'desktop_v2' | 'desktop_v3'
  hero_mobile_variant: 'mobile_v1' | 'mobile_v2'
  hero_image_desktop_v1: string
  hero_image_desktop_v2: string
  hero_image_desktop_v3: string
  hero_image_mobile_v1: string
  hero_image_mobile_v2: string
  whatsapp_martina: string
  whatsapp_luz: string
  portfolio_mode: 'visible' | 'hidden' | 'comingsoon'
  about_text: string
  footer_description: string
  footer_email: string
  footer_phone: string
  footer_location: string
  footer_instagram: string
  footer_facebook: string
  contact_phone: string
  contact_instagram: string
  contact_location: string
  contact_delivery: string
  contact_working_hours: string
  contact_advance_booking: string
}

function PreviewShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-24">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Vista previa</p>
        <h3 className="mt-2 text-xl font-bold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-500">{subtitle}</p>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">{children}</div>
    </aside>
  )
}

export function ServicePreviewPanel({ data }: { data: ServicePreviewData }) {
  return (
    <PreviewShell
      title="Servicio en vivo"
      subtitle="Asi se vera la tarjeta principal del servicio cuando guardes los cambios."
    >
      <article className="overflow-hidden rounded-3xl bg-white shadow-lg">
        <div className="relative h-44 bg-linear-to-br from-pink-100 via-rose-50 to-orange-100">
          {data.image ? (
            <Image src={data.image} alt={data.title || 'Servicio'} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl">{data.icon || '✨'}</div>
          )}
        </div>
        <div className="space-y-3 p-5">
          <h4 className="text-xl font-bold text-slate-900">{data.title || 'Nombre del servicio'}</h4>
          <p className="text-sm leading-6 text-slate-600">
            {data.description || 'La descripcion aparecera aqui para anticipar como se vera en el sitio.'}
          </p>
          <div className="inline-flex rounded-full bg-pink-50 px-3 py-1 text-sm font-semibold text-pink-700">
            {data.duration || 'Duracion del servicio'}
          </div>
        </div>
      </article>
    </PreviewShell>
  )
}

export function PackagePreviewPanel({ data }: { data: PackagePreviewData }) {
  const features = data.featuresText
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)

  return (
    <PreviewShell
      title="Paquete en vivo"
      subtitle="Simula la tarjeta comercial del paquete con precio, propuesta y diferenciales."
    >
      <article className={`overflow-hidden rounded-3xl bg-white shadow-lg ${data.popular ? 'ring-2 ring-pink-300' : ''}`}>
        {data.popular && <div className="h-2 bg-linear-to-r from-purple-600 via-pink-600 to-orange-500" />}
        <div className="p-5">
          {data.popular && (
            <span className="inline-flex rounded-full bg-pink-100 px-3 py-1 text-xs font-bold text-pink-700">
              Mas popular
            </span>
          )}
          <h4 className="mt-4 text-2xl font-bold text-slate-900">{data.name || 'Nombre del paquete'}</h4>
          <p className="mt-2 text-3xl font-bold text-purple-700">${Number(data.price || '0').toLocaleString('es-AR')}</p>
          <p className="mt-1 text-sm text-slate-500">{data.duration || 'Duracion'}</p>
          <div className="my-4 h-px bg-slate-200" />
          <div className="space-y-2">
            {(features.length > 0 ? features : ['Tus beneficios se listaran aqui']).slice(0, 5).map((feature) => (
              <div key={feature} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="mt-0.5 text-pink-600">•</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl bg-slate-50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Ideal para</p>
            <p className="mt-1 text-sm text-slate-700">{data.ideal || 'Describe para que tipo de cliente es este paquete.'}</p>
          </div>
        </div>
      </article>
    </PreviewShell>
  )
}

export function FaqPreviewPanel({ data }: { data: FaqPreviewData }) {
  return (
    <PreviewShell
      title="FAQ en vivo"
      subtitle="Representa la entrada expandida de preguntas frecuentes con la respuesta visible."
    >
      <article className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
          <h4 className="pr-4 text-sm font-semibold text-slate-900">{data.question || 'Pregunta frecuente'}</h4>
          <span className="text-pink-600">⌄</span>
        </div>
        <div className="px-4 py-4 text-sm leading-6 text-slate-600">
          {data.answer || 'La respuesta se mostrara aqui para revisar tono, extension y claridad.'}
        </div>
      </article>
    </PreviewShell>
  )
}

export function TeamPreviewPanel({ data }: { data: TeamPreviewData }) {
  return (
    <PreviewShell
      title="Integrante en vivo"
      subtitle="Muestra la tarjeta de Nosotras tal como se vera en la pagina publica."
    >
      <article className="overflow-hidden rounded-3xl bg-white shadow-lg">
        <div className="bg-linear-to-br from-pink-100 via-purple-100 to-blue-100 p-8">
          <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-white shadow-lg">
            {data.image ? (
              <Image src={data.image} alt={data.name || 'Integrante'} fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-4xl">✨</div>
            )}
          </div>
        </div>
        <div className="space-y-2 p-5 text-center">
          <h4 className="text-2xl font-bold text-slate-900">{data.name || 'Nombre de la integrante'}</h4>
          <p className="text-sm font-semibold text-purple-700">{data.role || 'Rol dentro del equipo'}</p>
          <p className="text-sm leading-6 text-slate-600">
            {data.description || 'La descripcion de presentacion aparecera en esta zona.'}
          </p>
        </div>
      </article>
    </PreviewShell>
  )
}

export function PortfolioPreviewPanel({ data }: { data: PortfolioPreviewData }) {
  return (
    <PreviewShell
      title="Portfolio en vivo"
      subtitle="Previsualiza como lucira la pieza destacada dentro de la galeria publica."
    >
      <article className="group overflow-hidden rounded-3xl bg-white shadow-lg">
        <div className="relative aspect-square bg-slate-200">
          {data.image ? (
            <Image src={data.image} alt={data.title || 'Portfolio'} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-500">Sin imagen</div>
          )}
          <div className="absolute inset-0 flex items-end bg-black/45">
            <div className="p-5 text-white">
              <h4 className="text-lg font-bold">{data.title || 'Titulo del trabajo'}</h4>
              <span className="mt-2 inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                {data.category || 'Categoria'}
              </span>
            </div>
          </div>
        </div>
      </article>
    </PreviewShell>
  )
}

export function SettingsPreviewPanel({
  settings,
  activeTab,
}: {
  settings: SettingsPreviewData
  activeTab: 'hero' | 'contacto' | 'portfolio' | 'nosotras' | 'footer'
}) {
  const desktopPreviewImage =
    settings.hero_desktop_variant === 'desktop_v1'
      ? settings.hero_image_desktop_v1
      : settings.hero_desktop_variant === 'desktop_v2'
        ? settings.hero_image_desktop_v2
        : settings.hero_image_desktop_v3

  const mobilePreviewImage =
    settings.hero_mobile_variant === 'mobile_v1'
      ? settings.hero_image_mobile_v1
      : settings.hero_image_mobile_v2

  return (
    <PreviewShell
      title="Configuracion en vivo"
      subtitle="Resumen visual del bloque que estas editando para evitar cambios a ciegas."
    >
      {activeTab === 'hero' && (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
            <div className="relative h-52 bg-linear-to-br from-pink-100 via-purple-50 to-orange-100">
              {desktopPreviewImage ? (
                <Image src={desktopPreviewImage} alt="Hero desktop" fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-500">Hero desktop</div>
              )}
            </div>
            <div className="space-y-3 p-5">
              <span className="inline-flex rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-700">
                Desktop: {settings.hero_desktop_variant}
              </span>
              <h4 className="text-2xl font-bold text-slate-900">{settings.hero_title || 'Titulo principal del hero'}</h4>
              <p className="text-sm leading-6 text-slate-600">{settings.hero_subtitle || 'Subtitulo del hero para la portada.'}</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl bg-white shadow-md">
            <div className="relative mx-auto h-64 w-40 bg-slate-100">
              {mobilePreviewImage ? (
                <Image src={mobilePreviewImage} alt="Hero mobile" fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-500">Hero mobile</div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'contacto' && (
        <div className="space-y-4">
          <div className="rounded-3xl bg-white p-5 shadow-md">
            <p className="text-sm font-semibold text-slate-900">Botones de WhatsApp</p>
            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                Martina: {settings.whatsapp_martina || 'Sin numero configurado'}
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                Luz: {settings.whatsapp_luz || 'Sin numero configurado'}
              </div>
            </div>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-md">
            <p className="text-sm font-semibold text-slate-900">Ficha de contacto</p>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p>Telefono: {settings.contact_phone || 'Pendiente'}</p>
              <p>Instagram: {settings.contact_instagram || 'Pendiente'}</p>
              <p>Ubicacion: {settings.contact_location || 'Pendiente'}</p>
              <p>Traslado: {settings.contact_delivery || 'Pendiente'}</p>
              <p>Horario: {settings.contact_working_hours || 'Pendiente'}</p>
              <p>Reserva: {settings.contact_advance_booking || 'Pendiente'}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'portfolio' && (
        <div className="rounded-3xl bg-white p-5 shadow-md">
          <p className="text-sm font-semibold text-slate-900">Estado publico del portfolio</p>
          <div className="mt-4 inline-flex rounded-full px-4 py-2 text-sm font-semibold text-white bg-linear-to-r from-purple-600 to-pink-600">
            {settings.portfolio_mode}
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            {settings.portfolio_mode === 'visible'
              ? 'El portfolio se mostrara con filtros y galeria activa.'
              : settings.portfolio_mode === 'comingsoon'
                ? 'El usuario vera un mensaje temporal mientras la galeria se prepara.'
                : 'La seccion quedara oculta en el sitio publico.'}
          </p>
        </div>
      )}

      {activeTab === 'nosotras' && (
        <div className="rounded-3xl bg-white p-5 shadow-md">
          <p className="text-sm font-semibold text-slate-900">Introduccion de Nosotras</p>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            {settings.about_text || 'El texto de presentacion institucional aparecera aqui.'}
          </p>
        </div>
      )}

      {activeTab === 'footer' && (
        <div className="space-y-4 rounded-3xl bg-white p-5 shadow-md text-sm text-slate-600">
          <div>
            <p className="font-semibold text-slate-900">Descripcion</p>
            <p className="mt-2 leading-6">{settings.footer_description || 'Descripcion del footer.'}</p>
          </div>
          <div className="grid gap-2 rounded-2xl bg-slate-50 p-4">
            <p>Email: {settings.footer_email || 'Pendiente'}</p>
            <p>Telefono: {settings.footer_phone || 'Pendiente'}</p>
            <p>Ubicacion: {settings.footer_location || 'Pendiente'}</p>
            <p>Instagram: {settings.footer_instagram || 'Pendiente'}</p>
            <p>Facebook: {settings.footer_facebook || 'Pendiente'}</p>
          </div>
        </div>
      )}
    </PreviewShell>
  )
}
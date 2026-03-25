import Link from 'next/link'

export default function AdminDashboard() {
  const quickLinks = [
    {
      href: '/admin/configuracion',
      label: 'Configuracion',
      description: 'Hero, contacto, portfolio, footer y datos globales.',
      accent: 'from-purple-600 to-pink-600',
      badge: 'Base del sitio',
    },
    {
      href: '/admin/servicios',
      label: 'Servicios',
      description: 'Edita el catalogo principal y revisa la preview de cada tarjeta.',
      accent: 'from-pink-600 to-orange-500',
      badge: 'Oferta',
    },
    {
      href: '/admin/paquetes',
      label: 'Paquetes',
      description: 'Organiza precios, beneficios y la propuesta destacada.',
      accent: 'from-blue-600 to-cyan-500',
      badge: 'Ventas',
    },
    {
      href: '/admin/portfolio',
      label: 'Portfolio',
      description: 'Carga piezas visuales y comprueba su presentacion final.',
      accent: 'from-amber-500 to-orange-500',
      badge: 'Visual',
    },
    {
      href: '/admin/faqs',
      label: 'FAQs',
      description: 'Aclara dudas frecuentes y revisa el acordeon antes de publicar.',
      accent: 'from-indigo-600 to-violet-500',
      badge: 'Ayuda',
    },
    {
      href: '/admin/nosotras',
      label: 'Nosotras',
      description: 'Gestiona el equipo y la forma en que se presenta la marca.',
      accent: 'from-teal-600 to-emerald-500',
      badge: 'Marca',
    },
  ]

  return (
    <div className="space-y-8 pb-10">
      <section className="overflow-hidden rounded-4xl border border-slate-200 bg-linear-to-br from-white via-rose-50 to-orange-50 shadow-sm">
        <div className="grid grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8 lg:py-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Centro de control</p>
            <h1 className="mt-3 text-4xl font-bold text-gray-900 font-display">Panel de Administracion</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Edita cada bloque del sitio con una ruta mas clara: primero eliges el modulo, luego cambias el contenido y ahora ves una preview antes de publicar.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/admin/configuracion" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
                Empezar por configuracion
              </Link>
              <Link href="/admin/servicios" className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-white">
                Editar servicios
              </Link>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/70 bg-white/80 p-5 shadow-lg backdrop-blur">
            <p className="text-sm font-semibold text-slate-900">Flujo recomendado</p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">1. Configura la base</p>
                <p className="mt-1">Define hero, contacto y visibilidad general del sitio.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">2. Actualiza contenido</p>
                <p className="mt-1">Servicios, paquetes y portfolio ya muestran previews en vivo.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">3. Revisa antes de publicar</p>
                <p className="mt-1">Usa los avisos de cambios pendientes y las confirmaciones de borrado.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {quickLinks.map((item) => (
          <Link key={item.href} href={item.href} className="group block">
            <article className="h-full rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className={`inline-flex rounded-full bg-linear-to-r px-3 py-1 text-xs font-bold text-white ${item.accent}`}>
                {item.badge}
              </div>
              <h3 className="mt-4 text-2xl font-bold text-slate-900">{item.label}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                Abrir modulo
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </article>
          </Link>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Novedades del panel</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-emerald-900">Login protegido y redireccion consistente.</div>
            <div className="rounded-2xl bg-amber-50 px-4 py-3 text-amber-900">Aviso de cambios sin guardar en cada modulo principal.</div>
            <div className="rounded-2xl bg-sky-50 px-4 py-3 text-sky-900">Preview en vivo para revisar como se vera el contenido.</div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Buenas practicas</h2>
          <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <p>Guarda configuracion global antes de modificar contenido puntual.</p>
            <p>Usa la preview para validar longitud de textos e impacto visual.</p>
            <p>Si necesitas limpiar un formulario, utiliza "Cancelar" o "Descartar cambios" antes de navegar.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

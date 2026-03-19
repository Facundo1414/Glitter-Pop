import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 font-display mb-2">
          Panel de Administración
        </h1>
        <p className="text-gray-600">
          Bienvenido al panel de control de Glitter Pop. Desde aquí puedes gestionar todo el contenido del sitio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Configuración */}
        <Link href="/admin/configuracion">
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer border-l-4 border-purple-600">
            <div className="text-4xl mb-3">⚙️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Configuración</h3>
            <p className="text-gray-600 text-sm">
              Edita textos principales, números de WhatsApp, visibilidad del portfolio y más.
            </p>
          </div>
        </Link>

        {/* Servicios */}
        <Link href="/admin/servicios">
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer border-l-4 border-pink-600">
            <div className="text-4xl mb-3">✨</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Servicios</h3>
            <p className="text-gray-600 text-sm">
              Crea, edita o elimina los servicios que ofreces. Incluye imágenes, descripciones y duración.
            </p>
          </div>
        </Link>

        {/* Paquetes */}
        <Link href="/admin/paquetes">
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer border-l-4 border-blue-600">
            <div className="text-4xl mb-3">📦</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Paquetes</h3>
            <p className="text-gray-600 text-sm">
              Gestiona los paquetes de precios. Especifica features, precios y planes ideales.
            </p>
          </div>
        </Link>

        {/* Portfolio */}
        <Link href="/admin/portfolio">
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer border-l-4 border-yellow-600">
            <div className="text-4xl mb-3">🖼️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Portfolio</h3>
            <p className="text-gray-600 text-sm">
              Sube fotos de tus trabajos, categorízalas y controla su visibilidad.
            </p>
          </div>
        </Link>

        {/* FAQs */}
        <Link href="/admin/faqs">
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer border-l-4 border-indigo-600">
            <div className="text-4xl mb-3">❓</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">FAQs</h3>
            <p className="text-gray-600 text-sm">
              Gestiona preguntas frecuentes, respuestas y orden de visualización.
            </p>
          </div>
        </Link>

        {/* Equipo */}
        <Link href="/admin/nosotras">
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer border-l-4 border-teal-600">
            <div className="text-4xl mb-3">👭</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Nosotras</h3>
            <p className="text-gray-600 text-sm">
              Edita integrantes, roles, fotos y descripciones del equipo.
            </p>
          </div>
        </Link>

      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
        <h3 className="font-bold text-blue-900 mb-2">💡 Tip:</h3>
        <p className="text-blue-800 text-sm">
          Todos los cambios se guardarán en la base de datos y se reflejarán inmediatamente en el sitio público.
        </p>
      </div>
    </div>
  )
}

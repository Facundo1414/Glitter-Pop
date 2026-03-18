# Glitter Pop 🎨✨

Página web profesional para servicios de maquillaje artístico con glitter para eventos y fiestas.

## 🚀 Características

- **Next.js 16** con App Router
- **TypeScript** para type safety
- **Tailwind CSS** para estilos modernos y responsive
- **Postgres (Neon/Vercel)** para persistencia de contenido
- **Panel de administración** para edición de contenido en vivo
- **API Routes** para CRUD de servicios, paquetes, FAQs, portfolio y equipo
- **Optimizado para Vercel** - Deploy con un click
- **100% Responsive** - Se ve perfecto en todos los dispositivos
- **Animaciones fluidas** - Experiencia de usuario premium
- **SEO optimizado** - Metadatos configurados para mejor posicionamiento

## 📦 Estructura del Proyecto

```
glitter-pop/
├── app/
│   ├── layout.tsx          # Layout principal con fuentes
│   ├── page.tsx            # Página de inicio
│   └── globals.css         # Estilos globales y clases utilitarias
├── components/
│   ├── Header.tsx          # Navegación principal
│   ├── Hero.tsx            # Sección hero con CTA
│   ├── Services.tsx        # Servicios ofrecidos
│   ├── Portfolio.tsx       # Galería de trabajos
│   ├── Packages.tsx        # Paquetes y precios
│   ├── Testimonials.tsx    # Reseñas de clientes
│   ├── FAQ.tsx             # Preguntas frecuentes
│   ├── Contact.tsx         # Formulario de contacto
│   └── Footer.tsx          # Footer con links
├── data/
│   └── content.json        # Todos los datos del sitio
├── public/
│   └── images/             # Imágenes y assets
└── README.md
```

## 🛠️ Instalación

1. Clona el repositorio:

```bash
git clone <tu-repo>
cd "Glitter Pop"
```

2. Instala las dependencias:

```bash
npm install
```

3. Ejecuta el servidor de desarrollo:

```bash
npm run dev
```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📝 Personalización

### Modificar Contenido

La forma recomendada es usar el panel admin en `/admin/login`, que persiste en base de datos.

Tambien existe un fallback inicial en `data/content.json`, utilizado para seed cuando la base esta vacia.

Desde admin puedes actualizar:

- Configuración del hero
- WhatsApps de contacto
- Servicios ofrecidos
- Portfolio de trabajos
- Preguntas frecuentes
- Paquetes y precios
- Información de "Nosotras"

### Agregar Imágenes

1. Coloca tus imágenes en la carpeta `public/images/`
2. Actualiza las rutas en `data/content.json`

Formatos recomendados:

- Servicios: 800x600px
- Portfolio: 1000x1000px (cuadradas)
- Optimiza las imágenes antes de subirlas

### Colores y Estilos

Los colores principales están definidos en `tailwind.config.js`:

```javascript
colors: {
  primary: { ... },  // Morado/fucsia principal
  glitter: {
    gold: '#FFD700',
    pink: '#FF69B4',
    purple: '#9D4EDD',
    blue: '#4CC9F0',
  },
}
```

## 🚀 Deploy en Vercel

1. Crea una cuenta en [Vercel](https://vercel.com)
2. Importa tu repositorio
3. Vercel detectará automáticamente Next.js
4. Click en "Deploy"

¡Listo! Tu sitio estará en línea en minutos.

### Variables de Entorno (Opcional)

Si integras servicios externos (email, analytics), crea un archivo `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
# Agrega otras variables según necesites
```

### Variables de Entorno (Recomendadas)

```env
ADMIN_USERNAME=tu_usuario_admin
ADMIN_PASSWORD=tu_password_admin
DATABASE_URL=postgresql://...
# Opcional para uploads
BLOB_READ_WRITE_TOKEN=...
```

## 📱 Funcionalidades

### Secciones Principales

1. **Hero** - Presentación impactante con animaciones
2. **Servicios** - Grid con todos los servicios ofrecidos
3. **Portfolio** - Galería filtrable de trabajos
4. **Paquetes** - Planes y precios destacando el más popular
5. **Testimonios** - Seccion disponible para mostrar/ocultar segun estrategia
6. **FAQ** - Preguntas frecuentes con acordeón
7. **Contacto** - Formulario completo de cotización
8. **Footer** - Links y redes sociales

### Características Técnicas

- ✅ Navegación smooth scroll
- ✅ Menu mobile responsive
- ✅ Efectos parallax y animaciones
- ✅ Formulario de contacto validado
- ✅ Filtros en portfolio
- ✅ FAQ con acordeón
- ✅ Optimización de imágenes
- ✅ API de contenido con Postgres
- ✅ Panel de administración protegido
- ✅ SEO friendly
- ✅ Accesibilidad

## 🎨 Integrar Servicios Externos

### Email (Recomendado: Resend o SendGrid)

En `components/Contact.tsx`, reemplaza el `setTimeout` simulado por tu servicio de email preferido:

```typescript
// Ejemplo con fetch a tu API
const response = await fetch("/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData),
});
```

### Analytics (Google Analytics, Vercel Analytics)

Agrega el script en `app/layout.tsx` o usa el paquete oficial de Next.js.

## 📄 Scripts Disponibles

```bash
npm run dev      # Desarrollo local
npm run build    # Build para producción
npm run start    # Servidor de producción
npm run lint     # Linter
```

## 🤝 Soporte

Para dudas o consultas sobre el proyecto, contacta al desarrollador.

## 📜 Licencia

Este proyecto fue creado para Glitter Pop. Todos los derechos reservados.

---

Hecho con ✨ y mucho glitter

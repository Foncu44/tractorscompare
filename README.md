# TractorsCompare

Una plataforma web moderna para comparar especificaciones de tractores agrícolas, de jardín e industriales. Competencia directa de TractorData.com con mejor SEO y experiencia de usuario.

## 🚀 Características

- **Base de datos completa**: Más de 18,000 modelos de tractores con especificaciones detalladas
- **Comparador avanzado**: Compara hasta 4 tractores lado a lado
- **Búsqueda inteligente**: Encuentra tractores por marca, modelo, potencia y características
- **SEO optimizado**: Meta tags, structured data (JSON-LD), sitemap y robots.txt
- **Diseño moderno**: UI responsive con Tailwind CSS
- **Rendimiento**: Construido con Next.js 14 (App Router) para máximo rendimiento
- **API flexible**: Sistema modular que permite conectar a APIs externas o usar datos estáticos

## 🛠️ Tecnologías

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos modernos y responsive
- **Lucide React** - Iconos
- **Next/Image** - Optimización de imágenes

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
├── app/                    # App Router de Next.js
│   ├── api/               # API Routes
│   │   ├── tractors/      # Endpoints de tractores
│   │   └── brands/        # Endpoints de marcas
│   ├── page.tsx           # Página principal
│   ├── layout.tsx         # Layout principal con SEO
│   ├── tractores/         # Páginas de tractores
│   ├── comparar/          # Página de comparación
│   ├── marcas/            # Páginas de marcas
│   ├── buscar/            # Página de búsqueda
│   ├── sitemap.ts         # Sitemap dinámico
│   └── robots.ts          # Robots.txt
├── components/            # Componentes React
│   ├── Header.tsx         # Header con navegación
│   └── Footer.tsx         # Footer
├── data/                  # Datos de tractores
│   └── tractors.ts        # Base de datos de tractores
├── lib/                   # Utilidades y servicios
│   └── tractorService.ts  # Servicio unificado de datos
├── types/                 # Tipos TypeScript
│   └── tractor.ts         # Tipos de datos de tractores
└── public/                # Archivos estáticos
```

## 🔌 Configuración de Fuente de Datos

El proyecto soporta múltiples fuentes de datos a través de variables de entorno:

### Opción 1: Datos Estáticos (Por defecto)
```env
NEXT_PUBLIC_TRACTOR_DATA_SOURCE=static
```
Usa los datos definidos en `data/tractors.ts`

### Opción 2: API Externa
```env
NEXT_PUBLIC_TRACTOR_DATA_SOURCE=api
NEXT_PUBLIC_TRACTOR_API_URL=https://api.ejemplo.com
```
Obtiene todos los datos desde una API externa

### Opción 3: Modo Híbrido (Recomendado)
```env
NEXT_PUBLIC_TRACTOR_DATA_SOURCE=hybrid
NEXT_PUBLIC_TRACTOR_API_URL=https://api.ejemplo.com
```
Intenta usar la API primero, y si falla, usa datos estáticos como fallback

## 📊 API Endpoints

El proyecto incluye endpoints API que puedes usar o extender:

- `GET /api/tractors` - Obtiene todos los tractores (con filtros opcionales: `?brand=X&type=Y&q=Z`)
- `GET /api/tractors/[id]` - Obtiene un tractor por ID
- `GET /api/tractors/slug/[slug]` - Obtiene un tractor por slug
- `GET /api/tractors/brand/[brand]` - Obtiene tractores por marca
- `GET /api/brands` - Obtiene todas las marcas
- `GET /api/listings?q=...` - Listados de ocasión por marketplace (caché 24h). Requiere despliegue con servidor (no export estático).

## 🔍 Fuentes de Datos para Tractores

Aunque no existe una API pública universal, puedes obtener datos de:

1. **Bases de datos gubernamentales**: 
   - Ministerio de Agricultura de España: https://www.mapa.gob.es/es/agricultura/temas/medios-de-produccion/maquinaria-agricola/base-de-datos

2. **Web scraping** (con permisos apropiados):
   - TractorData.com
   - Sitios de fabricantes individuales

3. **APIs de fabricantes** (requieren acuerdos):
   - John Deere API
   - CLAAS API
   - Case IH APIs

4. **Crear tu propia base de datos**: 
   - Usa el formato de `types/tractor.ts`
   - Agrega los datos directamente en `data/tractors.ts`

## 🎯 Características SEO

- Meta tags optimizados en cada página
- Structured Data (JSON-LD) para Product, WebSite, ItemList
- Sitemap XML dinámico
- Robots.txt configurado
- URLs semánticas y limpias
- Open Graph y Twitter Cards

## 🔍 Mejoras sobre TractorData.com

1. **UI/UX moderna**: Diseño responsive y atractivo
2. **Mejor SEO**: Structured data, sitemap dinámico, meta tags optimizados
3. **Búsqueda mejorada**: Búsqueda en tiempo real más intuitiva
4. **Comparación visual**: Tabla de comparación más clara
5. **Rendimiento**: Next.js SSR/SSG para mejor velocidad
6. **Experiencia móvil**: Diseño totalmente responsive
7. **API flexible**: Fácil integración con fuentes de datos externas

## 🚜 Listados de Ocasión (Used Listings)

La sección "Find Used Listings (International)" en cada ficha de tractor muestra tarjetas por marketplace (Agriaffaires, Mascus, MachineryTrader, TractorHouse, Facebook Marketplace). Cada tarjeta puede mostrar el **primer resultado real** (título, imagen, precio, ubicación) o un **enlace de búsqueda** si no hay API disponible.

- **API**: `GET /api/listings?q=...` — devuelve `{ query, items: Listing[] }`. Resultados cacheados 24h (en `/tmp` en Vercel o en `.next/cache/listings` en local).
- **Despliegue**:
  - Por defecto el proyecto **no** usa `output: 'export'` para que `/api/listings` funcione en Vercel (u otro host Node). Así la API corre en servidor y se usa la caché de 24h.
  - Si quieres **export estático**: activa `output: 'export'` en `next.config.js` y **elimina** la carpeta `app/api/listings` (o el build fallará). La UI seguirá mostrando tarjetas de “buscar en {marketplace}” (fallback) al no existir la API.

### Cómo añadir proveedores reales (APIs / feeds)

Los proveedores están en `lib/listings/providers/`. Ahora son stubs que devuelven `null`; el orquestador usa entonces el fallback (enlace de búsqueda) por marketplace.

1. **Implementar la API/feed oficial** en el provider correspondiente:
   - `AgriaffairesProvider.ts`, `MascusProvider.ts`, `MachineryTraderProvider.ts`, `TractorHouseProvider.ts`, `FacebookMarketplaceProvider.ts`
2. En cada uno, hacer que `search(query: string)` devuelva un `Listing | null` con al menos: `marketplaceId`, `marketplaceName`, `title`, `listingUrl`, y opcionalmente `imageUrl`, `priceText`, `locationText`.
3. **No hacer scraping** de HTML salvo que esté explícitamente permitido por feature flag y políticas del sitio.
4. El orquestador (`lib/listings/index.ts`) ya llama a cada provider y, si devuelve `null` o lanza, usa el fallback para ese marketplace. No hace falta tocar la API route ni el componente para añadir un provider ya registrado en `PROVIDERS`.

## 🚀 Despliegue

El proyecto está listo para desplegar en:
- Vercel (recomendado para Next.js)
- Netlify
- Cualquier plataforma que soporte Next.js

No olvides configurar las variables de entorno según tu fuente de datos.

## 📄 Licencia

MIT

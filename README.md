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

La sección "Find Used Listings (International)" en cada ficha de tractor muestra el **primer listado real** encontrado por marketplace (Mascus, TractorHouse, etc.). Si no hay listados reales, se muestran enlaces de búsqueda como fallback.

### Habilitar scraping (LISTINGS_SCRAPE_ENABLED)

Por defecto el scraping está **desactivado** (`LISTINGS_SCRAPE_ENABLED=false`). Los providers Mascus y TractorHouse devuelven `null` y solo se muestran enlaces de búsqueda.

Para activar el scraping (revisa los ToS de cada marketplace antes):

```env
LISTINGS_SCRAPE_ENABLED=true
```

Con esto, MascusProvider y TractorHouseProvider intentan obtener el primer resultado mediante fetch HTML. El scraping puede violar ToS; úsalo bajo tu responsabilidad.

### Fallback a enlaces de búsqueda

Cuando no hay listados reales:

- `LISTINGS_FALLBACK_SEARCH_LINKS=true` (por defecto si scrape está desactivado): se muestran enlaces de búsqueda por marketplace.
- `LISTINGS_FALLBACK_SEARCH_LINKS=false`: no se muestra nada si no hay listados reales.

### Caché

- **Clave**: `listings:v1:{queryNormalizada}`
- **TTL**: 24 horas
- **Almacenamiento**: Archivo JSON en `/tmp` (Vercel) o `.next/cache/listings` (local). Para usar Vercel KV: instala `@vercel/kv`, configura `KV_REST_API_URL` y añade la lógica en `lib/listings/cache.ts`.

### Rate limiting

Límite en memoria: 10 peticiones por IP en una ventana de 15 segundos. Si se supera, la API responde 429.

### API

- `GET /api/listings?q=...` — Parámetros: `q` (3–60 caracteres), opcionales `brand`, `model`. Devuelve `{ query, items: Listing[] }`.

### Cómo añadir APIs oficiales

Los providers están en `lib/listings/providers/`. Para integrar una API o feed oficial:

1. Implementa `searchFirst(query: string): Promise<Listing | null>` en el provider correspondiente.
2. Devuelve un `Listing` con `isRealListing: true` y los campos: `marketplaceId`, `marketplaceName`, `title`, `listingUrl`, y opcionalmente `imageUrl`, `priceText`, `locationText`.
3. El orquestador (`lib/listings/index.ts`) ya llama a cada provider con concurrencia 2; no hace falta modificar la API route.

## 🚀 Despliegue

El proyecto está listo para desplegar en:
- Vercel (recomendado para Next.js)
- Netlify
- Cualquier plataforma que soporte Next.js

No olvides configurar las variables de entorno según tu fuente de datos.

## 📄 Licencia

MIT

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

## 🧹 Eliminar tractores antiguos (discontinuados)

Para limpiar modelos antiguos del dataset usa:

```bash
npm run prune-old-tractors -- --before-year 1995
```

- Por defecto corre en simulación.
- Para guardar cambios reales añade `--apply`.
- Guía completa: `docs/gestion-tractores-antiguos.md`.


## 💰 Configuración de AdSense

Para que los anuncios in-page se rendericen correctamente debes configurar slots reales:

```env
NEXT_PUBLIC_ADSENSE_SLOT_HEADER=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR=2345678901
NEXT_PUBLIC_ADSENSE_SLOT_INCONTENT=3456789012
NEXT_PUBLIC_ADSENSE_SLOT_LIST=4567890123
```

Además, el archivo `public/ads.txt` ya incluye el publisher ID `ca-pub-1428727998918616`.

## 🚀 Despliegue

El proyecto está listo para desplegar en:
- Vercel (recomendado para Next.js)
- Netlify
- Cualquier plataforma que soporte Next.js

No olvides configurar las variables de entorno según tu fuente de datos.

### Variables de entorno para AdSense y depuración

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NEXT_PUBLIC_ADSENSE_CLIENT` | ID de cliente de Google AdSense (obligatorio en producción para mostrar anuncios). | `ca-pub-1428727998918616` |
| `NEXT_PUBLIC_DEBUG_ERRORS` | Si es `true`, registra en consola errores de cliente con prefijo `[TC CLIENT ERROR]` (incluye href, stack, userAgent). Útil para depurar excepciones en preview/producción (p. ej. AdSense preview iframe). | `true` o `false` |

### Depuración del preview de AdSense (“Something went wrong” / “Application error: a client-side exception has occurred”)

Cuando el sitio se embebe en el iframe del preview de AdSense, el error boundary puede mostrarse sin que la consola muestre el error real (solo avisos de googleusercontent). Para exponer la excepción:

1. **Despliega con el logger activado**: en Vercel (Preview o Production) configura `NEXT_PUBLIC_DEBUG_ERRORS=true`.
2. **Reproduce**: abre el preview de AdSense (el sitio se carga dentro de un iframe).
3. **Abre DevTools**: abre la consola del navegador (contexto del iframe donde se carga tu sitio o la ventana del preview).
4. **Busca los logs**:
   - **`[TC ERROR BOUNDARY]`** — error que disparó `app/error.tsx`: incluye `message`, `stack`, `digest`, `href`, `referrer`, `ua`. Es la excepción real que provocó el fallo.
   - **`[TC CLIENT ERROR]`** — errores capturados por `window.onerror` o `unhandledrejection` (solo si `NEXT_PUBLIC_DEBUG_ERRORS=true`), con `href`, `referrer` y `stack`.
5. **Corrige la causa**: usa el `message` y `stack` del log para localizar el código que falla (p. ej. acceso a `window.top`, `localStorage`/`sessionStorage` en iframe). En este proyecto, GTM/GA y Vercel Analytics se desactivan en modo AdSense preview (`src/lib/runtimeEnv.ts`: `isAdSensePreview()`); para nuevo código que use storage o `window.top`, usa `src/lib/safeStorage.ts` y `src/lib/runtimeEnv.ts`.

### Verificación del preview de AdSense (checklist)

1. **Despliegue para pruebas**
   - En Vercel (Preview o Production) configura `NEXT_PUBLIC_DEBUG_ERRORS=true`.
   - Despliega y espera a que el build termine.

2. **Validar carga normal**
   - Abre la URL del sitio en una pestaña normal (no en el preview de AdSense).
   - Comprueba que la página carga sin errores y que los anuncios (si aplica) y la navegación funcionan.

3. **Validar preview de AdSense**
   - En la consola de AdSense, abre el “site preview” de tu sitio.
   - El preview debe cargar sin mensaje “Application error: a client-side exception has occurred” ni pantalla “Something went wrong”.
   - En DevTools (consola del iframe donde se carga tu sitio) no debe aparecer bloqueo de `fundingchoicesmessages.google.com` ni de `www.gstatic.com` (translate). Si la CSP está bien configurada, no deberían verse esos bloqueos.

4. **Troubleshooting**
   - Si el preview sigue fallando: revisa los logs `[TC ERROR BOUNDARY]` y `[TC CLIENT ERROR]` en la consola del iframe.
   - Si ves React error #418: suele ser hidratación (contenido distinto en servidor y cliente). Revisa uso de `Date.now()`, `Math.random()`, `new Date()` o acceso a `window`/`document` durante el render.
   - Si ves bloqueos CSP: revisa `next.config.js` → `headers` → `Content-Security-Policy` e incluye los dominios que indica la consola (p. ej. `fundingchoicesmessages.google.com`, `www.gstatic.com`, `*.googleusercontent.com`).
   - Si el sitio normal deja de cargar: revierte los cambios recientes o desactiva temporalmente el “AdSense preview safe mode” (los scripts que dependen de `isAdSensePreview()` en `AnalyticsScripts` y `VercelAnalyticsSafe`).

5. **React #418 y reporte a servidor**
   - Con `NEXT_PUBLIC_DEBUG_ERRORS=true` se monta `ClientErrorReporter`, que envía `window.onerror` y `unhandledrejection` a `POST /api/client-error`. El error boundary también envía el error a esa ruta.
   - En Vercel: **Logs** (pestaña del proyecto) → filtrar por “TC CLIENT ERROR” o “TC ERROR BOUNDARY” para ver el payload (message, stack, href, referrer, userAgent) y localizar el componente que provoca el #418.
   - Para componentes que lean APIs del navegador en el primer render, usa el hook `hooks/useHasMounted` y devuelve `null` (o un placeholder estable) hasta que `useHasMounted()` sea `true`.

6. **Verificación tras cambios CSP / AdSense / client-error**
   - Abre la página en producción y revisa la consola: no deberían aparecer bloqueos CSP de scripts o estilos de dominios Google (googlesyndication, doubleclick, gstatic, fundingchoicesmessages, etc.).
   - Abre el preview de Auto Ads en AdSense: la vista previa debería cargar sin “Something went wrong”. Si sigue apareciendo, abre DevTools → pestaña **Network**, recarga el preview y comprueba si algún recurso (script/stylesheet) devuelve (blocked:csp) o 404; añade ese origen a la CSP en `next.config.js` si hace falta.
   - `GET /api/client-error` y `OPTIONS /api/client-error` devuelven 204 (nunca 405), para que iframes y preview no fallen por ese endpoint.

## 📄 Licencia

MIT

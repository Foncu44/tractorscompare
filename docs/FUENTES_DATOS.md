# Guía de Fuentes de Datos para Tractores

## Resumen

Actualmente **no existe una API pública universal** que proporcione datos de especificaciones de tractores. Sin embargo, hemos creado una estructura flexible que te permite:

1. Usar datos estáticos (por defecto)
2. Conectar a una API externa cuando esté disponible
3. Importar datos desde JSON o CSV
4. Usar modo híbrido (API con fallback a datos estáticos)

## Opciones Disponibles

### 1. Datos Estáticos (Por Defecto)

Los datos están en `data/tractors.ts`. Puedes añadir más tractores directamente:

```typescript
export const tractors: Tractor[] = [
  // ... tus tractores aquí
];
```

**Ventajas:**
- Funciona inmediatamente
- Sin dependencias externas
- Rápido y confiable

### 2. API Externa

Si tienes o encuentras una API externa, configura:

```env
NEXT_PUBLIC_TRACTOR_DATA_SOURCE=api
NEXT_PUBLIC_TRACTOR_API_URL=https://tu-api.com
```

La API debe proveer estos endpoints:
- `GET /api/tractors` - Lista de tractores
- `GET /api/tractors/:id` - Tractor por ID
- `GET /api/tractors/slug/:slug` - Tractor por slug
- `GET /api/tractors/brand/:brand` - Tractores por marca
- `GET /api/brands` - Lista de marcas

### 3. Modo Híbrido (Recomendado)

Intenta usar API primero, si falla usa datos estáticos:

```env
NEXT_PUBLIC_TRACTOR_DATA_SOURCE=hybrid
NEXT_PUBLIC_TRACTOR_API_URL=https://tu-api.com
```

### 4. Importación de Datos

Puedes importar datos desde JSON o CSV:

```typescript
import { importTractorsFromJSON, importTractorsFromCSV } from '@/lib/dataImporter';

// Desde JSON
const json = `[
  {
    "id": "tractor-1",
    "brand": "John Deere",
    "model": "8245R",
    "type": "farm",
    "engine": { "powerHP": 245, "cylinders": 6 }
    // ...
  }
]`;
const tractors = await importTractorsFromJSON(json);
```

## Fuentes de Datos Potenciales

### 1. Bases de Datos Gubernamentales

**España - Ministerio de Agricultura:**
- URL: https://www.mapa.gob.es/es/agricultura/temas/medios-de-produccion/maquinaria-agricola/base-de-datos
- Requiere: Extracción manual o scraping (con permisos)
- Formato: Web HTML, posible exportación a CSV/JSON

### 2. APIs de Fabricantes

Estas APIs existen pero están orientadas a gestión agrícola, no especificaciones:

- **John Deere API**: https://developer.deere.com/
- **CLAAS API**: https://www.claas.com/es-es/soluciones-digitales/gestion-de-datos/claas-api
- **Case IH**: APIs para gestión de datos operativos

**Nota:** Estas APIs requieren registro y aprobación, y pueden no tener especificaciones técnicas.

### 3. Web Scraping

Puedes extraer datos de sitios públicos como TractorData.com:

```typescript
// Ejemplo conceptual (requiere configuración apropiada)
async function scrapeTractorData() {
  // Implementar scraping ético
  // Respetar robots.txt y términos de servicio
  // Guardar en formato JSON compatible
}
```

**Importante:** 
- Verifica términos de servicio
- Respeta robots.txt
- Considera límites de rate
- Usa herramientas como Puppeteer o Cheerio

### 4. Crear Tu Propia Base de Datos

La mejor opción a largo plazo es crear tu propia base de datos:

**Opción A: Base de Datos SQL**
```sql
CREATE TABLE tractors (
  id VARCHAR PRIMARY KEY,
  brand VARCHAR NOT NULL,
  model VARCHAR NOT NULL,
  slug VARCHAR UNIQUE,
  year INTEGER,
  type VARCHAR,
  -- ... más campos
);
```

**Opción B: Base de Datos NoSQL (MongoDB)**
```javascript
{
  id: "john-deere-8245r",
  brand: "John Deere",
  model: "8245R",
  engine: {
    powerHP: 245,
    cylinders: 6
  }
  // ...
}
```

Luego crea una API REST que implemente los endpoints esperados.

## Implementación de API Propia

Si decides crear tu propia API, aquí hay un ejemplo con Next.js API Routes:

```typescript
// app/api/tractors/route.ts
import { NextResponse } from 'next/server';
import db from '@/lib/database'; // Tu conexión a BD

export async function GET() {
  const tractors = await db.tractors.findMany();
  return NextResponse.json(tractors);
}
```

## Recomendaciones

1. **Corto plazo**: Usa datos estáticos en `data/tractors.ts`
2. **Mediano plazo**: Construye una base de datos propia
3. **Largo plazo**: Crea una API REST completa con autenticación si es necesario

## Formato de Datos

Los datos deben seguir el esquema definido en `types/tractor.ts`:

```typescript
interface Tractor {
  id: string;
  brand: string;
  model: string;
  slug: string;
  type: 'farm' | 'lawn' | 'industrial';
  engine: Engine;
  transmission: Transmission;
  // ... ver types/tractor.ts para estructura completa
}
```

## Próximos Pasos

1. Comienza con datos estáticos
2. Añade más tractores manualmente o mediante importación
3. Cuando tengas suficiente volumen, migra a base de datos
4. Crea tu API REST
5. Configura el modo híbrido para transición suave


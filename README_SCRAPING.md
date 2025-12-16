# Extracción de Datos de TractorData.com

He creado un sistema completo para extraer todos los tractores de TractorData.com e incluirlos en tu aplicación.

## 📋 Archivos Creados

1. **`scripts/scrapeTractorData.js`** - Script principal de scraping
2. **`scripts/processScrapedData.js`** - Script para procesar y validar datos
3. **`scripts/INSTRUCCIONES_SCRAPING.md`** - Guía detallada

## 🚀 Inicio Rápido

### 1. Instalar Dependencias Adicionales

```bash
npm install cheerio
```

### 2. Ejecutar Scraping (Prueba con 10 tractores)

```bash
npm run scrape-tractors
```

Esto extraerá los primeros 10 tractores de cada marca como prueba.

### 3. Procesar Datos

```bash
npm run process-scraped
```

### 4. Para Extraer TODOS los Tractores

Edita `scripts/scrapeTractorData.js` línea ~89:

```javascript
// Cambia esto:
const linksToProcess = links.slice(0, 10); // Solo primeros 10 para prueba

// Por esto:
const linksToProcess = links; // Todos los tractores
```

Luego ejecuta de nuevo:
```bash
npm run scrape-tractors
```

⚠️ **Nota**: Esto puede tardar HORAS debido a las pausas necesarias entre requests.

## 📊 Qué Extrae el Script

El script extrae:
- ✅ Marca y modelo
- ✅ Año (si está disponible)
- ✅ Tipo (farm/lawn/industrial)
- ✅ Especificaciones del motor (HP, cilindros, combustible)
- ✅ Transmisión
- ✅ Peso
- ✅ URLs de imágenes (si están disponibles)

## ⚠️ Consideraciones Importantes

1. **Términos de Servicio**: Respeta los términos de TractorData.com
2. **Rate Limiting**: El script incluye pausas de 3 segundos entre requests
3. **Tiempo**: Extraer todos los 18,000+ tractores puede tardar muchas horas
4. **Validación**: Revisa los datos antes de usarlos en producción

## 🔄 Flujo Completo

```bash
# 1. Scraping (extrae datos)
npm run scrape-tractors
# → Guarda en: data/scraped-tractors.json

# 2. Procesamiento (valida y formatea)
npm run process-scraped
# → Guarda en: data/processed-tractors.ts

# 3. Integración manual
# Edita data/tractors.ts para incluir los nuevos datos
```

## 📝 Integración con Datos Existentes

Una vez procesados, puedes integrarlos en `data/tractors.ts`:

```typescript
import { scrapedTractors } from './processed-tractors';
import { tractors as existingTractors } from './tractors';

// Opción 1: Combinar todos
export const tractors: Tractor[] = [
  ...existingTractors,
  ...scrapedTractors.filter(t => t.engine.powerHP > 0), // Filtrar válidos
];

// Opción 2: Solo los scraped
export const tractors: Tractor[] = scrapedTractors;
```

## 🎯 Recomendación

Para empezar, prueba con un subconjunto pequeño:

1. Ejecuta el script de prueba (10 tractores por marca)
2. Revisa la calidad de los datos extraídos
3. Si están bien, ejecuta el scraping completo
4. Procesa y valida los datos
5. Integra en tu aplicación

Para más detalles, consulta `scripts/INSTRUCCIONES_SCRAPING.md`


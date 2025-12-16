# Instrucciones para Extraer Datos de TractorData.com

## ⚠️ ADVERTENCIAS IMPORTANTES

1. **Términos de Servicio**: Asegúrate de revisar y respetar los términos de servicio de TractorData.com antes de hacer scraping.

2. **Rate Limiting**: El script incluye pausas para no sobrecargar el servidor. No las elimines.

3. **Uso Ético**: Este script es para desarrollo y aprendizaje. No uses los datos para competir de forma desleal.

4. **Tiempo**: Extraer todos los tractores puede tardar HORAS debido a las pausas necesarias.

## Instalación de Dependencias

```bash
npm install puppeteer cheerio axios fs-extra
```

## Uso

### Paso 1: Scraping de Datos

Ejecuta el script para extraer datos:

```bash
npm run scrape-tractors
```

**Nota**: El script por defecto solo extrae los primeros 10 tractores de cada marca para pruebas. Para obtener todos, edita `scripts/scrapeTractorData.js` y cambia:

```javascript
const linksToProcess = links.slice(0, 10); // Prueba
// a:
const linksToProcess = links; // Todos
```

### Paso 2: Procesar Datos

Una vez completado el scraping, procesa los datos:

```bash
npm run process-scraped
```

Esto generará `data/processed-tractors.ts` con los datos en el formato correcto.

### Paso 3: Integrar Datos

Revisa `data/processed-tractors.ts` y decide cómo integrarlo:

**Opción A: Reemplazar completamente**
```typescript
// En data/tractors.ts
import { scrapedTractors } from './processed-tractors';
export const tractors: Tractor[] = scrapedTractors;
```

**Opción B: Combinar con datos existentes**
```typescript
import { tractors as existingTractors } from './tractors';
import { scrapedTractors } from './processed-tractors';

export const tractors: Tractor[] = [
  ...existingTractors,
  ...scrapedTractors,
];
```

**Opción C: Filtrar y seleccionar**
```typescript
// Selecciona solo los mejores datos scraped
const selectedScraped = scrapedTractors.filter(t => 
  t.engine.powerHP > 100 && 
  t.engine.cylinders > 0
);
```

## Personalización

### Añadir Más Marcas

Edita `scripts/scrapeTractorData.js` y añade más URLs en el array `brandPages`:

```javascript
const brandPages = [
  'https://www.tractordata.com/farm-tractors/j/john-deere-tractors.html',
  'https://www.tractordata.com/farm-tractors/k/kubota-tractors.html',
  // Añade más aquí
];
```

### Ajustar Tiempos de Espera

Si el scraping es muy lento o muy rápido, ajusta las pausas:

```javascript
await page.waitForTimeout(3000); // Milisegundos entre requests
```

### Filtrar por Tipo

Para obtener solo tractores agrícolas o de jardín, modifica las URLs o filtra después:

```javascript
const farmOnly = scrapedTractors.filter(t => t.type === 'farm');
```

## Limitaciones Conocidas

1. **Estructura del HTML**: Si TractorData.com cambia su estructura HTML, el script puede fallar.

2. **Datos Incompletos**: No todos los campos pueden ser extraídos automáticamente. Algunos pueden requerir revisión manual.

3. **Imágenes**: Las imágenes pueden no estar disponibles o requerir descarga adicional.

4. **Validación**: Los datos deben ser revisados y validados antes de usar en producción.

## Mejoras Futuras

- [ ] Guardar progreso para poder reanudar si falla
- [ ] Detección automática de más campos
- [ ] Descarga automática de imágenes
- [ ] Validación automática de datos
- [ ] Interfaz web para iniciar/detener scraping
- [ ] Base de datos en lugar de archivos JSON

## Solución de Problemas

**Error: "Timeout"**
- Aumenta el timeout en `page.goto()` o `page.waitForTimeout()`
- Verifica tu conexión a internet

**Datos faltantes**
- Revisa la estructura HTML de la página
- Ajusta los selectores CSS en el script

**Script muy lento**
- Es normal debido a las pausas necesarias
- Considera procesar por lotes más pequeños
- Ejecuta en servidor con mejor conexión

## Alternativa: API Manual

Si el scraping automático no funciona bien, puedes:

1. Navegar manualmente por TractorData.com
2. Copiar los datos relevantes
3. Añadirlos manualmente a `data/tractors.ts`

Esto es más lento pero más confiable para datos específicos.


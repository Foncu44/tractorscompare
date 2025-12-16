# Problema y Solución del Scraping

## Problema Actual

1. **Solo guardó 10 tractores**: Hay un límite en el código (`slice(0, 10)`)
2. **Datos inválidos**: Está capturando páginas de navegación en lugar de tractores individuales
3. **No aparecen en la web**: Los datos no están integrados en `data/tractors.ts`

## Solución

El código ya está mejorado para filtrar mejor. Para obtener TODOS los tractores válidos:

### Paso 1: Ejecutar scraping mejorado

```bash
npm run scrape-tractors
```

Esto ahora filtrará mejor los enlaces y solo capturará tractores individuales válidos.

### Paso 2: Para obtener TODOS (no solo 50)

Edita `scripts/scrapeTractorData.js` línea ~271:

```javascript
// Cambia esto:
const linksToProcess = validTractorLinks.slice(0, 50); // Solo primeros 50

// Por esto:
const linksToProcess = validTractorLinks; // TODOS los tractores
```

⚠️ **ADVERTENCIA**: Esto puede tardar MUCHAS HORAS debido a las pausas necesarias.

### Paso 3: Procesar datos

```bash
npm run process-scraped
```

### Paso 4: Integrar en la web

Edita `data/tractors.ts` y añade los datos procesados:

```typescript
import { scrapedTractors } from './processed-tractors';

// Combinar con datos existentes
export const tractors: Tractor[] = [
  // Tus tractores actuales
  ...tractorsActuales,
  // Tractores scraped (filtrar los válidos)
  ...scrapedTractors.filter(t => 
    t.engine.powerHP > 0 && 
    t.brand !== 'Unknown' && 
    t.brand !== 'Farm' &&
    !t.id.includes('tractors') // Excluir páginas de navegación
  ),
];
```

## Verificación

Después de integrar, ejecuta:
```bash
npm run dev
```

Y visita `http://localhost:3000/tractores` para ver los tractores.


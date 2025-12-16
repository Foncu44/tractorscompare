# Instrucciones para Scraping Completo de TractorData.com

## Descripción

Este script extrae **TODOS** los tractores de TractorData.com, incluyendo:
- 277+ marcas de tractores
- Miles de modelos con especificaciones completas
- Todas las especificaciones técnicas: motor, transmisión, dimensiones, hidráulica, etc.

## ⚠️ Importante

- **Este proceso puede tardar varias horas** debido a la cantidad de datos (miles de tractores)
- El script guarda el progreso automáticamente, puedes detenerlo y continuar más tarde
- Se hacen pausas entre requests para no sobrecargar el servidor
- Los datos se guardan incrementalmente cada 10 tractores

## Uso

### Opción 1: Ejecutar el scraping completo (recomendado)

```bash
npm run scrape-all
```

Este comando:
1. Obtiene todas las marcas de la página principal de TractorData.com
2. Para cada marca, obtiene todos los tractores
3. Para cada tractor, extrae especificaciones completas
4. Guarda el progreso automáticamente
5. Si se interrumpe, puedes volver a ejecutarlo y continuará desde donde se quedó

### Opción 2: Continuar desde progreso guardado

Si detuviste el script, simplemente vuelve a ejecutar:

```bash
npm run scrape-all
```

El script detectará automáticamente el progreso guardado y continuará desde donde se quedó.

## Procesamiento de Datos

Una vez completado el scraping (o si quieres procesar los datos parciales), ejecuta:

```bash
npm run process-scraped
```

Este comando:
1. Lee los datos de `data/scraped-tractors.json`
2. Los procesa y valida
3. Los convierte al formato TypeScript en `data/processed-tractors.ts`
4. Los datos se combinan automáticamente con `data/tractors.ts`

## Archivos Generados

- `data/scraped-tractors.json` - Datos raw del scraping (se actualiza incrementalmente)
- `data/scraped-brands.json` - Lista de todas las marcas encontradas
- `data/scraping-progress.json` - Progreso del scraping (marca actual, tractores procesados)
- `data/processed-tractors.ts` - Datos procesados en formato TypeScript (después de `process-scraped`)

## Características del Script

### Extracción de Especificaciones

El script extrae automáticamente:

**Motor:**
- Potencia (HP y kW)
- Cilindros
- Cilindrada
- Tipo de combustible
- Refrigeración
- Turbo

**Transmisión:**
- Tipo (manual, powershift, CVT, hydrostatic)
- Número de marchas
- Descripción

**Dimensiones:**
- Longitud, ancho, altura
- Distancia entre ejes (wheelbase)
- Todo en milímetros

**Peso:**
- Peso operativo (convertido a kg)

**Sistema Hidráulico:**
- Flujo de bomba (L/min)
- Flujo de dirección (L/min)
- Capacidad de elevación (kg)
- Número de válvulas

**PTO (Power Take-Off):**
- Potencia PTO (HP)
- RPM PTO

**Otros:**
- Año del modelo
- Tipo (farm, lawn, industrial)
- Categoría

## Recomendaciones

1. **Ejecuta en horas de menor tráfico** para ser más respetuoso con el servidor
2. **Deja el script corriendo** durante varias horas (puede procesar miles de tractores)
3. **Verifica el progreso** periódicamente en `data/scraping-progress.json`
4. **No interrumpas el proceso** a menos que sea necesario (se guarda automáticamente)

## Solución de Problemas

### El script se detiene o da error

Simplemente vuelve a ejecutarlo. El script continuará desde el último punto guardado.

### Quieres empezar de nuevo

Elimina los archivos:
- `data/scraped-tractors.json`
- `data/scraped-brands.json`
- `data/scraping-progress.json`

Y vuelve a ejecutar el script.

### El proceso es muy lento

Es normal. El script procesa miles de tractores con pausas entre requests. Puede tardar:
- 277 marcas
- ~100-500 tractores por marca (promedio)
- 2.5 segundos por tractor
- **Estimado: 15-30 horas** para completar todo

Pero recuerda que guarda el progreso, así que puedes dejarlo corriendo.

## Resultado Esperado

Después de completar el scraping y procesamiento, tendrás:
- **Miles de tractores** con especificaciones completas
- Datos listos para usar en la aplicación web
- Todos los tractores de TractorData.com en tu base de datos


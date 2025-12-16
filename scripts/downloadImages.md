# Guía para Descargar Imágenes de Tractores

## Opción 1: Usar Google Images Manualmente (Recomendado)

Esta es la forma más confiable de obtener imágenes específicas de cada modelo de tractor.

### Pasos:

1. Para cada tractor en `data/tractors.ts`:
   - Busca en Google Images: `"[Marca] [Modelo] tractor"`
   - Ejemplo: "John Deere 8245R tractor"
   - Selecciona una imagen de buena calidad (mínimo 800x600px)
   - Guarda la imagen en `public/images/tractors/` con el nombre: `[id].jpg`
   - Ejemplo: `john-deere-8245r.jpg`

2. Los IDs de los tractores actuales son:
   - `john-deere-8245r` → `john-deere-8245r.jpg`
   - `kubota-m7-171` → `kubota-m7-171.jpg`
   - `new-holland-t8-435` → `new-holland-t8-435.jpg`
   - `case-ih-magnum-240` → `case-ih-magnum-240.jpg`
   - `massey-ferguson-8660` → `massey-ferguson-8660.jpg`

## Opción 2: Usar Google Images Download (Python)

1. Instala Python y pip
2. Instala la herramienta:
   ```bash
   pip install google-images-download
   ```

3. Ejecuta para cada tractor:
   ```bash
   googleimagesdownload -k "John Deere 8245R tractor" -l 1 -f jpg -o public/images/tractors --usage-rights labeled-for-reuse
   ```

## Opción 3: Usar Script de Node.js (Básico)

1. Instala dependencias:
   ```bash
   npm install axios fs-extra
   ```

2. El script `downloadTractorImages.js` intentará descargar imágenes desde Unsplash (menos específico pero más fácil).

3. Ejecuta:
   ```bash
   node scripts/downloadTractorImages.js
   ```

## Opción 4: Usar API de Unsplash (Automático pero menos específico)

El script básico usa Unsplash Source API que no requiere API key, pero las imágenes pueden no ser exactamente del modelo específico.

Para mejores resultados con Unsplash:

1. Regístrate en Unsplash Developers: https://unsplash.com/developers
2. Crea una aplicación y obtén tu Access Key
3. Modifica el script para usar la API oficial de Unsplash

## Notas Importantes:

- **Derechos de autor**: Asegúrate de usar imágenes con licencias apropiadas (Creative Commons, dominio público, o con permiso)
- **Calidad**: Usa imágenes de al menos 800x600px para buena calidad
- **Formato**: Guarda como JPG o WebP para mejor compresión
- **Nombres**: Los nombres de archivo deben coincidir con el `id` del tractor en `data/tractors.ts`

## Verificación

Después de descargar las imágenes, actualiza `data/tractors.ts` para usar rutas locales:

```typescript
imageUrl: '/images/tractors/john-deere-8245r.jpg'
```


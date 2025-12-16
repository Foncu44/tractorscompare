# Instrucciones para Descargar Imágenes de Tractores

## Método 1: Script Automatizado (Recomendado)

### Requisitos previos:
```bash
npm install puppeteer axios fs-extra
```

### Ejecutar:
```bash
npm run download-images
```

Este script:
- Buscará automáticamente imágenes en Google Images para cada tractor
- Descargará la primera imagen válida encontrada
- Guardará las imágenes en `public/images/tractors/` con el formato `[id].jpg`

**Nota:** El script puede tardar varios minutos y requiere conexión a internet.

## Método 2: Descarga Manual (Más Confiable)

Si el script automatizado no funciona o quieres imágenes más específicas:

### Para cada tractor en `data/tractors.ts`:

1. **Busca en Google Images:**
   - Abre: https://www.google.com/imghp
   - Busca: `"[Marca] [Modelo] tractor"`
   - Ejemplo: `"John Deere 8245R tractor"`

2. **Selecciona una buena imagen:**
   - Debe ser del modelo específico
   - Calidad: mínimo 800x600px
   - Formato: JPG o PNG

3. **Descarga la imagen:**
   - Click derecho → "Guardar imagen como..."
   - Guarda en: `public/images/tractors/`
   - Nombre: `[id-del-tractor].jpg`

### IDs y nombres de archivo esperados:

| ID | Marca | Modelo | Nombre archivo |
|---|---|---|---|
| `john-deere-8245r` | John Deere | 8245R | `john-deere-8245r.jpg` |
| `kubota-m7-171` | Kubota | M7-171 | `kubota-m7-171.jpg` |
| `new-holland-t8-435` | New Holland | T8.435 | `new-holland-t8-435.jpg` |
| `case-ih-magnum-240` | Case IH | Magnum 240 | `case-ih-magnum-240.jpg` |
| `massey-ferguson-8660` | Massey Ferguson | 8660 | `massey-ferguson-8660.jpg` |

## Método 3: Usar Google Images Download (Python)

Si tienes Python instalado:

1. **Instala la herramienta:**
   ```bash
   pip install google-images-download
   ```

2. **Para cada tractor, ejecuta:**
   ```bash
   googleimagesdownload -k "John Deere 8245R tractor" -l 1 -f jpg -o public/images/tractors --usage-rights labeled-for-reuse
   ```

3. **Renombra el archivo descargado** al formato correcto (`[id].jpg`)

## Verificación

Después de descargar las imágenes, verifica que:

1. ✅ Todas las imágenes están en `public/images/tractors/`
2. ✅ Los nombres coinciden con los IDs en `data/tractors.ts`
3. ✅ Las imágenes se ven correctamente en la aplicación

Las rutas en `data/tractors.ts` ya están configuradas como:
```typescript
imageUrl: '/images/tractors/[id].jpg'
```

## Notas Importantes

⚠️ **Derechos de Autor:**
- Usa solo imágenes con licencias apropiadas
- Considera usar imágenes con Creative Commons
- O imágenes del sitio oficial del fabricante
- Respeta los términos de servicio de Google Images

📝 **Cuando uses imágenes:**
- Asegúrate de tener derechos de uso
- Para producción, considera usar un servicio de imágenes con licencia
- O crear tus propias imágenes si es posible

## Solución de Problemas

**El script no descarga imágenes:**
- Verifica tu conexión a internet
- Puede que Google haya cambiado su estructura
- Usa el Método 2 (manual) en su lugar

**Las imágenes no se muestran:**
- Verifica que los nombres de archivo coincidan exactamente con los IDs
- Verifica que las imágenes estén en `public/images/tractors/`
- Reinicia el servidor de desarrollo: `npm run dev`

**Error de permisos:**
- Asegúrate de tener permisos de escritura en la carpeta `public/images/tractors/`


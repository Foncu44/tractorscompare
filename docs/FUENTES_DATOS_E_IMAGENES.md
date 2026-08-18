# Fuentes de Datos e Imágenes de Tractores

## 📸 Fuentes de Imágenes

Basándome en el análisis de tu código y sitios como TractorJunction, aquí están las principales fuentes de imágenes de tractores:

### 1. **Wikimedia Commons** (Principal - Recomendado)
- **URL**: `https://commons.wikimedia.org`
- **Ventajas**:
  - Licencias libres (Creative Commons, dominio público)
  - API oficial disponible
  - Alta calidad
  - Sin problemas de copyright
- **Cómo obtener**: Usar la API de Wikimedia Commons
- **Tu código actual**: Ya estás usando esto en `scripts/findTractorImages.js`

### 2. **Google Images con Filtro Creative Commons**
- **Ventajas**: Gran cantidad de imágenes
- **Desventajas**: Requiere verificar licencias manualmente
- **Tu código actual**: Ya tienes implementación en `scripts/findTractorImages.js`

### 3. **Sitios Oficiales de Fabricantes** (Con precaución)
- **Ejemplos**:
  - John Deere: https://www.deere.com
  - Kubota: https://www.kubota.com
  - New Holland: https://www.newholland.com
  - Case IH: https://www.caseih.com
- **Precaución**: Verificar términos de uso, generalmente permitido para uso informacional/educativo

### 4. **Otras Fuentes Posibles**
- **Flickr Creative Commons**: https://www.flickr.com/creativecommons
- **Unsplash/Pexels**: Para imágenes genéricas de tractores
- **Scraping de sitios de venta**: Con precaución legal

## 📊 Fuentes de Datos de Especificaciones

### 1. **Sitios Oficiales de Fabricantes**
- **Ejemplo**: Cada marca tiene secciones de especificaciones técnicas
- **Ventajas**: Datos oficiales y actualizados
- **Desventajas**: Diferentes formatos, requiere scraping estructurado

### 2. **Bases de Datos de Tractores Existentes**
- **TractorData.com**: Base de datos histórica (similar a tu proyecto)
- **TractorJunction.com**: Para tractores indios principalmente
- **TractorHouse.com**: Para tractores usados (incluye specs)
- **MachineFinder (John Deere)**: Para modelos John Deere

### 3. **Manuales Técnicos y PDFs**
- Los fabricantes publican manuales técnicos en PDF
- Pueden extraerse datos con OCR o parsing de PDFs
- Requiere más procesamiento

### 4. **APIs de Fabricantes** (Limitado)
- Algunos fabricantes tienen APIs, pero generalmente son privadas
- Principalmente para dealers autorizados

### 5. **APIs Oficiales de Marketplaces**
- **eBay Finding API**: Listados de tractores usados (oficial, requiere App ID)
- **Wallapop API pública**: Listados en España/Europa

## 🔍 Cómo TractorJunction Obtiene Sus Datos

Basándome en el análisis de TractorJunction, probablemente:

1. **Web Scraping**: Extraen datos de sitios oficiales de fabricantes
2. **Manuales Técnicos**: Procesan PDFs de especificaciones
3. **Base de Datos Propia**: Tienen una base de datos acumulada durante años
4. **Colaboraciones**: Posibles acuerdos con fabricantes (especialmente para tractores indios)
5. **Community Input**: Posiblemente reciben actualizaciones de usuarios

## ✅ Recomendaciones para Tu Proyecto

### Para Imágenes:
1. **Priorizar Wikimedia Commons** (ya lo haces) ✅
2. **Mantener sistema de placeholders** (ya lo tienes) ✅
3. **Considerar CDN**: Para caché de imágenes
4. **Optimización**: Ya usas formatos WebP, mantenerlo

### Para Datos:
1. **APIs Oficiales**: Usar solo APIs con términos de uso que lo permitan (eBay, Wallapop)
2. **Validación de Datos**: Verificar que los datos sean consistentes
3. **Múltiples Fuentes**: Combinar datos de varias fuentes para verificación
4. **Licencias**: Los datos de especificaciones técnicas son hechos públicos no sujetos a copyright

## 📝 Nota Legal Importante

Tu web es **informativa**, lo cual es favorable:
- ✅ Uso informacional generalmente está permitido
- ✅ Datos de especificaciones técnicas son hechos públicos
- ⚠️ Imágenes: Asegurar licencias apropiadas (Wikimedia Commons es seguro)
- ⚠️ No copiar texto descriptivo directamente (reescribir)
- ✅ Enlaces a sitios oficiales siempre recomendable

## 🚀 Mejoras Futuras

1. **API de Wikimedia Commons**: Implementar búsqueda más robusta
2. **Sistema de Caché**: Guardar imágenes localmente después de validación
3. **Validación de Datos**: Sistema para verificar consistencia
4. **Actualización Automática**: Cron jobs para mantener datos actualizados
5. **Contribución Comunitaria**: Sistema para que usuarios reporten datos incorrectos

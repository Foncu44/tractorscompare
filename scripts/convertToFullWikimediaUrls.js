/**
 * Script para convertir URLs de thumbnails de Wikimedia Commons
 * al formato completo con estructura de carpetas
 * 
 * Convierte: https://upload.wikimedia.org/wikipedia/commons/250px-NombreArchivo.jpg
 * A: https://upload.wikimedia.org/wikipedia/commons/X/XX/NombreArchivo.jpg
 */

const crypto = require('crypto');
const fs = require('fs-extra');
const path = require('path');

const TRACTORS_FILE = path.join(__dirname, '..', 'data', 'processed-tractors.ts');

/**
 * Calcula el hash MD5 de una cadena y devuelve la estructura de carpetas
 * que usa Wikimedia Commons (primera letra / dos primeras letras)
 */
function getWikimediaPath(filename) {
  // Decodificar el nombre del archivo si está codificado
  let decodedFilename = filename;
  try {
    decodedFilename = decodeURIComponent(filename);
  } catch {
    // Si falla, usar el original
  }
  
  // Calcular MD5 del nombre del archivo
  const hash = crypto.createHash('md5').update(decodedFilename).digest('hex');
  
  // Primera letra y dos primeras letras del hash
  const firstChar = hash[0];
  const firstTwoChars = hash.substring(0, 2);
  
  return `${firstChar}/${firstTwoChars}`;
}

/**
 * Convierte una URL de thumbnail de Wikimedia Commons a formato completo
 */
function convertThumbnailToFullUrl(thumbnailUrl) {
  if (!thumbnailUrl || !thumbnailUrl.includes('upload.wikimedia.org')) {
    return thumbnailUrl; // No es una URL de Wikimedia Commons, devolver original
  }
  
  // Si ya tiene el formato completo (tiene /X/XX/), no convertir
  if (/\/([a-f0-9])\/([a-f0-9]{2})\//.test(thumbnailUrl)) {
    return thumbnailUrl;
  }
  
  // Extraer el nombre del archivo de la URL thumbnail
  // Formato: .../commons/250px-NombreArchivo.jpg o .../commons/330px-NombreArchivo.jpg
  const match = thumbnailUrl.match(/\/commons\/(\d+px-)?(.+)$/);
  if (!match) {
    return thumbnailUrl; // No se pudo parsear, devolver original
  }
  
  const filename = match[2]; // Nombre del archivo con posible codificación
  const pathStructure = getWikimediaPath(filename);
  
  // Construir la URL completa
  const baseUrl = thumbnailUrl.split('/commons/')[0];
  const fullUrl = `${baseUrl}/commons/${pathStructure}/${filename}`;
  
  return fullUrl;
}

async function convertAllUrls() {
  try {
    console.log('📖 Leyendo tractores...');
    const content = await fs.readFile(TRACTORS_FILE, 'utf-8');
    
    // Extraer el array de tractores
    const match = content.match(/export const scrapedTractors: Tractor\[\] = (\[[\s\S]*?\]);/);
    if (!match) {
      console.error('❌ No se pudo extraer el array de tractores');
      return;
    }
    
    let tractors = JSON.parse(match[1]);
    console.log(`📊 ${tractors.length} tractores cargados`);
    
    let convertedCount = 0;
    let skippedCount = 0;
    
    // Convertir URLs de thumbnails a formato completo
    tractors = tractors.map(tractor => {
      if (tractor.imageUrl && tractor.imageUrl.includes('upload.wikimedia.org')) {
        const originalUrl = tractor.imageUrl;
        const convertedUrl = convertThumbnailToFullUrl(originalUrl);
        
        if (originalUrl !== convertedUrl) {
          tractor.imageUrl = convertedUrl;
          convertedCount++;
          console.log(`  ✅ Convertido: ${tractor.brand} ${tractor.model}`);
          console.log(`     De: ${originalUrl.substring(0, 80)}...`);
          console.log(`     A: ${convertedUrl.substring(0, 80)}...`);
        } else {
          skippedCount++;
        }
      }
      
      return tractor;
    });
    
    console.log(`\n✅ ${convertedCount} URLs convertidas`);
    console.log(`⏭️  ${skippedCount} URLs ya en formato correcto o no son de Wikimedia Commons`);
    
    // Generar nuevo contenido del archivo
    const dateMatch = content.match(/\/\/ Fecha: (.*)/);
    const date = dateMatch ? dateMatch[1] : new Date().toISOString();
    const imageUpdateMatch = content.match(/\/\/ URLs de imágenes actualizadas: (.*)/);
    const imageUpdateDate = imageUpdateMatch ? imageUpdateMatch[1] : new Date().toISOString();
    
    const newContent = `import { Tractor } from '@/types/tractor';

// Tractores extraídos desde TractorData.com
// Generado automáticamente - NO editar manualmente
// Fecha: ${date}
// URLs de imágenes actualizadas: ${imageUpdateDate}
// URLs convertidas a formato completo de Wikimedia Commons: ${new Date().toISOString()}

// @ts-ignore - Array muy grande que causa error de complejidad de tipo en TypeScript
export const scrapedTractors: Tractor[] = ${JSON.stringify(tractors, null, 2)};
`;
    
    // Escribir archivo actualizado
    await fs.writeFile(TRACTORS_FILE, newContent, 'utf-8');
    console.log(`💾 Tractores actualizados guardados en: ${TRACTORS_FILE}`);
    
  } catch (error) {
    console.error('❌ Error convirtiendo URLs:', error);
    throw error;
  }
}

if (require.main === module) {
  convertAllUrls().catch(console.error);
}

module.exports = { convertAllUrls, convertThumbnailToFullUrl };


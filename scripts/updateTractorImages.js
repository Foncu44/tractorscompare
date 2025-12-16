/**
 * Script para actualizar los datos de tractores con las URLs de imágenes encontradas
 */

const fs = require('fs-extra');
const path = require('path');

const IMAGES_FILE = path.join(__dirname, '..', 'data', 'tractor-images.json');
const TRACTORS_FILE = path.join(__dirname, '..', 'data', 'processed-tractors.ts');
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'processed-tractors.ts');

async function updateTractorImages() {
  try {
    console.log('📖 Leyendo URLs de imágenes...');
    let imageUrls = {};
    try {
      imageUrls = await fs.readJson(IMAGES_FILE);
      console.log(`✅ ${Object.keys(imageUrls).length} URLs de imágenes cargadas`);
    } catch (error) {
      console.log('⚠️  No se encontró archivo de imágenes, continuando sin actualizar...');
      return;
    }
    
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
    
    // Actualizar URLs de imágenes
    let updatedCount = 0;
    let notFoundCount = 0;
    
    tractors = tractors.map(tractor => {
      const tractorKey = `${tractor.brand}-${tractor.model}`;
      const imageUrl = imageUrls[tractorKey];
      
      // Si encontramos una URL válida, actualizarla
      if (imageUrl && imageUrl !== null && imageUrl.trim() !== '') {
        if (!tractor.imageUrl || tractor.imageUrl !== imageUrl) {
          tractor.imageUrl = imageUrl;
          updatedCount++;
        }
      } else {
        // Si no hay imagen o es null, mantener vacío para usar placeholder
        if (tractor.imageUrl) {
          // Mantener la imagen existente si ya tenía una
        } else {
          notFoundCount++;
        }
      }
      
      return tractor;
    });
    
    console.log(`✅ ${updatedCount} tractores actualizados con nuevas URLs`);
    if (notFoundCount > 0) {
      console.log(`⚠️  ${notFoundCount} tractores sin imagen (usarán placeholder)`);
    }
    
    console.log(`✅ ${updatedCount} tractores actualizados con nuevas URLs de imágenes`);
    
    // Generar nuevo contenido del archivo
    const dateMatch = content.match(/\/\/ Fecha: (.*)/);
    const date = dateMatch ? dateMatch[1] : new Date().toISOString();
    
    const newContent = `import { Tractor } from '@/types/tractor';

// Tractores extraídos desde TractorData.com
// Generado automáticamente - NO editar manualmente
// Fecha: ${date}
// URLs de imágenes actualizadas: ${new Date().toISOString()}

export const scrapedTractors: Tractor[] = ${JSON.stringify(tractors, null, 2)};
`;
    
    // Escribir archivo actualizado
    await fs.writeFile(OUTPUT_FILE, newContent, 'utf-8');
    console.log(`💾 Tractores actualizados guardados en: ${OUTPUT_FILE}`);
    
  } catch (error) {
    console.error('❌ Error actualizando imágenes:', error);
    throw error;
  }
}

if (require.main === module) {
  updateTractorImages().catch(console.error);
}

module.exports = { updateTractorImages };


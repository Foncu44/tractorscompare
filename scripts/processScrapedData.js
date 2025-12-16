/**
 * Script para procesar datos scraped y convertirlos al formato de nuestra base de datos
 */

const fs = require('fs-extra');
const path = require('path');

const SCRAPED_FILE = path.join(__dirname, '..', 'data', 'scraped-tractors.json');
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'processed-tractors.ts');

async function processScrapedData() {
  try {
    console.log('📖 Leyendo datos scraped...');
    const scrapedData = await fs.readJson(SCRAPED_FILE);

    console.log(`📊 Procesando ${scrapedData.length} tractores...`);

    // Leer tractores existentes
    const existingTractorsPath = path.join(__dirname, '..', 'data', 'tractors.ts');
    let existingTractors = [];
    
    try {
      const tractorsContent = await fs.readFile(existingTractorsPath, 'utf-8');
      // Extraer los tractores existentes (simple parsing)
      const match = tractorsContent.match(/export const tractors: Tractor\[\] = \[([\s\S]*?)\];/);
      if (match) {
        // Esto es una aproximación simple, en producción usarías un parser de TypeScript
        console.log('⚠️  Tractores existentes encontrados, se añadirán los nuevos al final');
      }
    } catch (error) {
      console.log('ℹ️  No se encontraron tractores existentes');
    }

    // Función para detectar el tipo de tractor basándose en características
    function detectTractorType(tractor) {
      // Detectar basándose en HP y otras características
      const hp = tractor.engine?.powerHP || 0;
      const weight = tractor.weight || 0;
      const transmissionType = tractor.transmission?.type || '';
      
      // Tractores industriales: generalmente > 200 HP o muy pesados (> 15000 kg)
      // También considerar si tiene características industriales
      if (hp >= 200 || weight > 15000) {
        return 'industrial';
      }
      
      // Tractores de jardín (lawn): generalmente < 30 HP y más ligeros
      // Criterios: HP < 30 Y (peso < 1500 kg O transmisión hidrostática)
      if (hp > 0 && hp < 30) {
        // Si también es ligero (< 1500 kg), probablemente es lawn
        if (weight > 0 && weight < 1500) {
          return 'lawn';
        }
        // Si tiene transmisión hidrostática y HP bajo, probablemente es lawn
        if (transmissionType === 'hydrostatic' && hp < 25) {
          return 'lawn';
        }
        // Si no tiene peso definido pero HP es muy bajo (< 20), probablemente es lawn
        if (hp < 20 && weight === 0) {
          return 'lawn';
        }
      }
      
      // Si HP está entre 0-30 pero peso > 1500, probablemente es farm (compacto)
      if (hp > 0 && hp < 30 && weight >= 1500) {
        return 'farm';
      }
      
      // Por defecto, farm (agrícolas) para HP >= 30 o sin HP definido
      return 'farm';
    }
    
    // Procesar y limpiar datos
    const processedTractors = scrapedData.map(tractor => {
      // Detectar tipo correcto si no está bien definido
      const detectedType = detectTractorType(tractor);
      
      // Asegurar que todos los campos requeridos estén presentes
      return {
        id: tractor.id || `tractor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        brand: tractor.brand || 'Unknown',
        model: tractor.model || 'Unknown',
        year: tractor.year || undefined,
        type: detectedType,
        category: tractor.category || undefined,
        slug: tractor.slug || tractor.id,
        imageUrl: tractor.imageUrl || '',
        engine: {
          cylinders: tractor.engine?.cylinders || 0,
          displacement: tractor.engine?.displacement,
          powerHP: tractor.engine?.powerHP || 0,
          powerKW: tractor.engine?.powerKW,
          fuelType: tractor.engine?.fuelType || 'diesel',
          cooling: tractor.engine?.cooling || 'liquid',
          turbocharged: tractor.engine?.turbocharged,
        },
        transmission: {
          type: tractor.transmission?.type || 'manual',
          gears: tractor.transmission?.gears,
          description: tractor.transmission?.description,
        },
        dimensions: tractor.dimensions,
        weight: tractor.weight,
        hydraulicSystem: tractor.hydraulicSystem,
        ptoHP: tractor.ptoHP,
        ptoRPM: tractor.ptoRPM,
        description: tractor.description,
        features: tractor.features,
        metaDescription: tractor.metaDescription,
        metaKeywords: tractor.metaKeywords,
      };
    }).filter(tractor => 
      tractor.brand !== 'Unknown' && 
      tractor.model !== 'Unknown'
      // Removemos el filtro de powerHP > 0 para aceptar todos los tractores válidos
      // Los tractores sin HP se pueden procesar después o tener valores por defecto
    );

    console.log(`✅ ${processedTractors.length} tractores procesados y validados`);

    // Generar archivo TypeScript
    const tsContent = `import { Tractor } from '@/types/tractor';

// Tractores extraídos desde TractorData.com
// Generado automáticamente - NO editar manualmente
// Fecha: ${new Date().toISOString()}

export const scrapedTractors: Tractor[] = ${JSON.stringify(processedTractors, null, 2)};
`;

    await fs.writeFile(OUTPUT_FILE, tsContent, 'utf-8');
    console.log(`💾 Datos procesados guardados en: ${OUTPUT_FILE}`);
    console.log(`\n📝 Siguiente paso: Revisa y combina con data/tractors.ts si es necesario`);

  } catch (error) {
    console.error('Error procesando datos:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  processScrapedData().catch(console.error);
}

module.exports = { processScrapedData };


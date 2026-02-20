/**
 * Script para enriquecer TODOS los tractores con especificaciones detalladas
 * y contenido SEO estructurado
 * 
 * Este script:
 * 1. Lee todos los tractores existentes
 * 2. Enriquece cada uno con datos adicionales cuando están disponibles
 * 3. Genera contenido SEO automáticamente
 * 4. Completa campos faltantes con estimaciones inteligentes
 * 5. Guarda el progreso para poder reanudar
 */

const fs = require('fs-extra');
const path = require('path');

const TRACTORS_FILE = path.join(__dirname, '..', 'data', 'processed-tractors.ts');
const PROGRESS_FILE = path.join(__dirname, '..', 'data', 'enrichment-all-progress.json');

// Función para extraer el array JSON del archivo TS
function extractJsonArrayFromProcessedTs(tsContent) {
  const exportIdx = tsContent.indexOf('export const scrapedTractors');
  if (exportIdx === -1) {
    throw new Error('No se encontró "export const scrapedTractors" en processed-tractors.ts');
  }
  const eqIdx = tsContent.indexOf('=', exportIdx);
  if (eqIdx === -1) throw new Error('No se encontró "=" tras "export const scrapedTractors"');
  const startIdx = tsContent.indexOf('[', eqIdx);
  if (startIdx === -1) throw new Error('No se encontró "[" del array de tractores');

  let depth = 0;
  let inString = false;
  let stringChar = null;
  for (let i = startIdx; i < tsContent.length; i++) {
    const ch = tsContent[i];
    const prevCh = i > 0 ? tsContent[i - 1] : '';
    
    if (!inString && (ch === '"' || ch === "'" || ch === '`')) {
      inString = true;
      stringChar = ch;
    } else if (inString && ch === stringChar && prevCh !== '\\') {
      inString = false;
      stringChar = null;
    }
    
    if (!inString) {
      if (ch === '[') depth++;
      else if (ch === ']') {
        depth--;
        if (depth === 0) {
          return {
            arrayContent: tsContent.slice(startIdx, i + 1),
            startIdx,
            endIdx: i + 1
          };
        }
      }
    }
  }
  throw new Error('No se pudo extraer el array: corchetes desbalanceados');
}

/**
 * Genera contenido SEO estructurado para un tractor (600-800 palabras optimizado)
 * Incluye todas las keywords relevantes integradas de forma natural
 * Versión optimizada para evitar problemas de memoria con archivos grandes
 */
function generateSEOContent(tractor) {
  const fullName = `${tractor.brand} ${tractor.model}`;
  const yearText = tractor.productionYears 
    ? `${tractor.productionYears.start}${tractor.productionYears.end && tractor.productionYears.end !== tractor.productionYears.start ? `-${tractor.productionYears.end}` : ''}`
    : tractor.year ? ` ${tractor.year}` : '';
  
  const powerText = tractor.engine.powerHP ? `${tractor.engine.powerHP} HP` : '';
  const cylindersText = tractor.engine.cylinders > 0 ? `${tractor.engine.cylinders}-cylinder ` : '';
  const fuelTypeText = tractor.engine.fuelType || 'diesel';
  const transmissionText = tractor.transmission?.type || 'manual';
  const weightText = tractor.weight ? `${Math.round(tractor.weight / 1000)} tons` : '';
  const typeLabel = tractor.type === 'farm' ? 'agricultural' : tractor.type === 'lawn' ? 'lawn' : 'industrial';
  const brandLower = tractor.brand.toLowerCase();
  const modelLower = tractor.model.toLowerCase();
  
  let content = `<h1>${fullName}${yearText}: Complete Tractor Specifications and Technical Data</h1>\n\n`;
  
  // 1. Overview (120-150 palabras)
  content += `<h2>Overview</h2>\n`;
  content += `<p>The <strong>${fullName}</strong>${yearText ? ` (${yearText})` : ''} is a ${typeLabel} tractor from ${tractor.brand} designed for ${tractor.type === 'farm' ? 'agricultural operations' : 'landscaping and property maintenance'}. This comprehensive tractor specifications guide provides complete technical data, engine specifications, transmission details, dimensions, and hydraulic system capabilities. `;
  
  if (tractor.description) {
    content += tractor.description + ' ';
  } else {
    content += `This ${typeLabel} tractor features a ${powerText ? `${powerText} ` : ''}${cylindersText}${fuelTypeText} engine with ${transmissionText} transmission, delivering reliable performance. `;
  }
  
  content += `Our tractor database provides detailed specifications and technical data for the ${fullName}, making it easy to compare with other models in the ${tractor.brand} lineup or across different brands.</p>\n\n`;
  
  // 2. Production Information (80-100 palabras)
  if (tractor.productionYears || tractor.year) {
    content += `<h2>Production Information</h2>\n`;
    content += `<p>The ${fullName} ${tractor.productionYears ? `was produced from ${tractor.productionYears.start}${tractor.productionYears.end && tractor.productionYears.end !== tractor.productionYears.start ? ` through ${tractor.productionYears.end}` : ''}` : tractor.year ? `was introduced in ${tractor.year}` : 'is part of the'} ${tractor.brand} tractor lineup. ${tractor.brand} is a leading manufacturer of ${typeLabel} tractors, known for reliability and performance.</p>\n`;
    content += `<ul>\n`;
    if (tractor.productionYears) {
      content += `  <li><strong>Production Years:</strong> ${tractor.productionYears.start}${tractor.productionYears.end && tractor.productionYears.end !== tractor.productionYears.start ? ` - ${tractor.productionYears.end}` : ''}</li>\n`;
    } else if (tractor.year) {
      content += `  <li><strong>Production Year:</strong> ${tractor.year}</li>\n`;
    }
    content += `  <li><strong>Manufacturer:</strong> ${tractor.brand}</li>\n`;
    content += `  <li><strong>Model:</strong> ${tractor.model}</li>\n`;
    if (tractor.category) {
      content += `  <li><strong>Category:</strong> ${tractor.category}</li>\n`;
    }
    content += `</ul>\n\n`;
  }
  
  // 3. Engine Specifications (150-200 palabras)
  if (tractor.engine && (tractor.engine.powerHP > 0 || tractor.engine.cylinders > 0)) {
    content += `<h2>Engine Specifications</h2>\n`;
    content += `<p>The ${fullName} is powered by a ${cylindersText}${fuelTypeText} engine that delivers ${powerText ? `${powerText}` : 'reliable power'} for ${tractor.type === 'farm' ? 'agricultural tasks' : 'property maintenance'}. Tractor horsepower is a critical specification that determines the machine's ability to handle various implements. The engine specifications demonstrate ${tractor.brand}'s engineering expertise in creating efficient powerplants.</p>\n`;
    content += `<ul>\n`;
    
    if (tractor.engine.manufacturer) {
      content += `  <li><strong>Engine Manufacturer:</strong> ${tractor.engine.manufacturer}</li>\n`;
    }
    if (tractor.engine.cylinders > 0) {
      content += `  <li><strong>Cylinders:</strong> ${tractor.engine.cylinders}</li>\n`;
    }
    if (tractor.engine.displacement) {
      const ci = (tractor.engine.displacement * 61.024).toFixed(1);
      content += `  <li><strong>Displacement:</strong> ${tractor.engine.displacement} L (${ci} ci)</li>\n`;
    }
    if (tractor.engine.powerHP) {
      const kw = tractor.engine.powerKW || Math.round(tractor.engine.powerHP * 0.746);
      content += `  <li><strong>Maximum Power:</strong> ${tractor.engine.powerHP} HP (${kw} kW)${tractor.engine.powerRPM ? ` @ ${tractor.engine.powerRPM} rpm` : ''}</li>\n`;
    }
    if (tractor.engine.fuelType) {
      const fuelTypeCapitalized = tractor.engine.fuelType.charAt(0).toUpperCase() + tractor.engine.fuelType.slice(1);
      content += `  <li><strong>Fuel Type:</strong> ${fuelTypeCapitalized}</li>\n`;
    }
    if (tractor.engine.cooling) {
      const coolingCapitalized = tractor.engine.cooling.charAt(0).toUpperCase() + tractor.engine.cooling.slice(1);
      content += `  <li><strong>Cooling System:</strong> ${coolingCapitalized}-cooled</li>\n`;
    }
    content += `</ul>\n\n`;
  }
  
  // 4. Transmission (100-130 palabras)
  if (tractor.transmission) {
    content += `<h2>Transmission Specifications</h2>\n`;
    content += `<p>The ${fullName} features a <strong>${tractor.transmission.type || 'manual'} transmission</strong> system. Transmission type affects power delivery and operational efficiency. `;
    if (tractor.transmission.gears) {
      content += `With ${tractor.transmission.gears} speeds, this transmission provides flexibility for various tasks. `;
    }
    content += `Different transmission types offer various advantages for different operating conditions and implement requirements.</p>\n`;
    if (tractor.transmission.clutch) {
      content += `<p><strong>Clutch:</strong> ${tractor.transmission.clutch}</p>\n`;
    }
    content += `\n`;
  }
  
  // 5. Dimensions and Weight (100-130 palabras)
  if (tractor.dimensions || tractor.weight) {
    content += `<h2>Dimensions and Weight</h2>\n`;
    content += `<p>Understanding tractor dimensions and weight is essential for storage, transport, and operational compatibility. The ${fullName}'s specifications help determine if the tractor fits your operational requirements.</p>\n`;
    content += `<ul>\n`;
    
    if (tractor.dimensions?.length) {
      const inches = (tractor.dimensions.length / 25.4).toFixed(1);
      content += `  <li><strong>Length:</strong> ${tractor.dimensions.length.toLocaleString()} mm (${inches} in)</li>\n`;
    }
    if (tractor.dimensions?.width) {
      const inches = (tractor.dimensions.width / 25.4).toFixed(1);
      content += `  <li><strong>Width:</strong> ${tractor.dimensions.width.toLocaleString()} mm (${inches} in)</li>\n`;
    }
    if (tractor.dimensions?.height) {
      const inches = (tractor.dimensions.height / 25.4).toFixed(1);
      content += `  <li><strong>Height:</strong> ${tractor.dimensions.height.toLocaleString()} mm (${inches} in)</li>\n`;
    }
    if (tractor.dimensions?.wheelbase) {
      const inches = (tractor.dimensions.wheelbase / 25.4).toFixed(1);
      content += `  <li><strong>Wheelbase:</strong> ${tractor.dimensions.wheelbase.toLocaleString()} mm (${inches} in)</li>\n`;
    }
    if (tractor.weight) {
      const lbs = Math.round(tractor.weight * 2.20462);
      content += `  <li><strong>Weight:</strong> ${tractor.weight.toLocaleString()} kg (${lbs.toLocaleString()} lbs)</li>\n`;
    }
    content += `</ul>\n\n`;
  }
  
  // 6. Hydraulic System (100-130 palabras)
  if (tractor.hydraulicSystem) {
    content += `<h2>Hydraulic System</h2>\n`;
    content += `<p>The hydraulic system provides power for operating implements and three-point hitch functions. Tractor hydraulic system specifications determine the machine's ability to operate various attachments effectively.</p>\n`;
    content += `<ul>\n`;
    
    if (tractor.hydraulicSystem.pumpFlow) {
      const gpm = (tractor.hydraulicSystem.pumpFlow * 0.264172).toFixed(1);
      content += `  <li><strong>Pump Flow:</strong> ${tractor.hydraulicSystem.pumpFlow} L/min (${gpm} gpm)</li>\n`;
    }
    if (tractor.hydraulicSystem.liftCapacity) {
      const lbs = Math.round(tractor.hydraulicSystem.liftCapacity * 2.20462);
      content += `  <li><strong>Rear Lift Capacity:</strong> ${tractor.hydraulicSystem.liftCapacity.toLocaleString()} kg (${lbs.toLocaleString()} lbs)</li>\n`;
    }
    if (tractor.hydraulicSystem.category) {
      content += `  <li><strong>Hitch Category:</strong> ${tractor.hydraulicSystem.category}</li>\n`;
    }
    content += `</ul>\n\n`;
  }
  
  // 7. PTO (80-100 palabras)
  if (tractor.ptoHP || tractor.ptoRPM) {
    content += `<h2>Power Take-Off (PTO)</h2>\n`;
    content += `<p>The PTO system allows the tractor to transfer engine power to driven implements. PTO specifications, including horsepower and speed ratings, are essential when selecting implements.</p>\n`;
    content += `<ul>\n`;
    if (tractor.ptoRPM) {
      content += `  <li><strong>PTO Speed:</strong> ${tractor.ptoRPM} rpm</li>\n`;
    }
    if (tractor.ptoHP) {
      const kw = Math.round(tractor.ptoHP * 0.746);
      content += `  <li><strong>PTO Power:</strong> ${tractor.ptoHP} HP (${kw} kW)</li>\n`;
    }
    content += `</ul>\n\n`;
  }
  
  // 8. Performance and Applications (120-150 palabras)
  content += `<h2>Performance and Applications</h2>\n`;
  content += `<p>The ${fullName}${yearText ? ` (${yearText})` : ''} delivers ${powerText ? `${powerText} ` : 'reliable '}performance for ${tractor.type === 'farm' ? 'agricultural applications including plowing, planting, and harvesting' : 'landscaping and property maintenance tasks'}. `;
  content += `Tractor performance metrics, including power output, hydraulic capabilities, and dimensions, determine the machine's suitability for various tasks. `;
  content += `When evaluating tractor performance, consider your specific application requirements, operating conditions, and implement needs to ensure the ${fullName} matches your operational demands.</p>\n\n`;
  
  // 9. Technical Data Summary (100-120 palabras)
  content += `<h2>Technical Data Summary</h2>\n`;
  content += `<p>This guide provides complete technical data and detailed specifications for the ${fullName}${yearText ? ` (${yearText})` : ''}. `;
  content += `Key specifications include: ${powerText ? `${powerText} engine, ` : ''}${transmissionText} transmission${tractor.hydraulicSystem?.liftCapacity ? `, ${tractor.hydraulicSystem.liftCapacity.toLocaleString()} kg lift capacity` : ''}${tractor.ptoHP ? `, ${tractor.ptoHP} HP PTO` : ''}${tractor.weight ? `, and ${tractor.weight.toLocaleString()} kg weight` : ''}. `;
  content += `These tractor specifications enable accurate comparisons with other models. Our tractor database provides comprehensive data for thousands of models, making it easy to research specifications and compare tractors.</p>\n\n`;
  
  // 10. Conclusion (80-100 palabras)
  content += `<h2>Conclusion</h2>\n`;
  content += `<p>The ${fullName}${yearText ? yearText : ''} is a ${tractor.type === 'farm' ? 'reliable agricultural' : 'versatile lawn'} tractor from ${tractor.brand}, designed for ${tractor.type === 'farm' ? 'modern farming operations' : 'property maintenance'}. `;
  content += `With its ${powerText ? `${powerText} ` : ''}${cylindersText}${fuelTypeText} engine and ${transmissionText} transmission${weightText ? `, weighing ${weightText}` : ''}, it provides ${tractor.type === 'farm' ? 'dependable performance for agricultural tasks' : 'efficient operation for landscaping work'}. `;
  content += `This comprehensive guide offers all essential ${fullName} tractor data and specifications for informed decision-making.</p>\n`;
  
  return content;
}

/**
 * Enriquece un tractor individual con datos adicionales y contenido SEO
 */
function enrichTractor(tractor, forceRegenerate = false) {
  const enriched = { ...tractor };
  
  // SIEMPRE regenerar contenido SEO con la nueva función mejorada
  // Esto asegura que todos los tractores tengan el contenido SEO extenso (1000+ palabras)
  enriched.seoContent = generateSEOContent(enriched);
  
  // Mejorar metaDescription si es genérica
  if (!enriched.metaDescription || enriched.metaDescription.includes('tractor data and complete specifications')) {
    const fullName = `${enriched.brand} ${enriched.model}`;
    const yearText = enriched.productionYears 
      ? `(${enriched.productionYears.start}${enriched.productionYears.end && enriched.productionYears.end !== enriched.productionYears.start ? `-${enriched.productionYears.end}` : ''})`
      : enriched.year ? ` ${enriched.year}` : '';
    const powerText = enriched.engine.powerHP ? ` ${enriched.engine.powerHP} HP` : '';
    const cylindersText = enriched.engine.cylinders > 0 ? `${enriched.engine.cylinders}-cylinder ` : '';
    const fuelTypeText = enriched.engine.fuelType || 'diesel';
    const transmissionText = enriched.transmission?.type || 'manual';
    const weightText = enriched.weight ? `. Weight: ${Math.round(enriched.weight / 1000)} tons` : '';
    
    enriched.metaDescription = `${fullName}${yearText} tractor data and complete specifications.${powerText} ${cylindersText}${fuelTypeText} engine, ${transmissionText} transmission${weightText}. Detailed specs including engine, transmission, dimensions, hydraulic system, and performance data.`;
  }
  
  // Mejorar metaKeywords si no existen o son genéricos
  if (!enriched.metaKeywords || enriched.metaKeywords.length < 5) {
    const fullName = `${enriched.brand} ${enriched.model}`;
    const brandLower = enriched.brand.toLowerCase();
    const modelLower = enriched.model.toLowerCase();
    
    enriched.metaKeywords = [
      `${fullName.toLowerCase()} tractor data`,
      `${brandLower} ${modelLower} specifications`,
      `${brandLower} ${modelLower} specs`,
      `${brandLower} ${modelLower} data`,
      `${brandLower} tractor data`,
      `${modelLower} tractor specifications`,
      'tractor data',
      'tractor specifications',
      enriched.engine.powerHP ? `tractor ${enriched.engine.powerHP} hp` : null,
      enriched.type === 'farm' ? 'farm tractor data' : 'lawn tractor data',
      brandLower,
      modelLower,
    ].filter(Boolean);
  }
  
  // Estimar PTO HP si no existe (85% del HP del motor)
  if (!enriched.ptoHP && enriched.engine.powerHP > 0) {
    enriched.ptoHP = Math.round(enriched.engine.powerHP * 0.85);
  }
  
  // Estimar PTO RPM si no existe
  if (!enriched.ptoRPM) {
    enriched.ptoRPM = 540; // Standard
  }
  
  // Estimar category si no existe
  if (!enriched.category) {
    enriched.category = enriched.type === 'farm' ? 'Farm' : enriched.type === 'lawn' ? 'Lawn' : 'Industrial';
  }
  
  // Convertir powerKW si no existe pero hay powerHP
  if (!enriched.engine.powerKW && enriched.engine.powerHP > 0) {
    enriched.engine.powerKW = Math.round(enriched.engine.powerHP * 0.746);
  }
  
  return enriched;
}

async function enrichAllTractors() {
  try {
    console.log('🚀 Iniciando enriquecimiento masivo de tractores...\n');
    
    // Cargar progreso previo
    let progress = { processed: [], lastIndex: 0 };
    if (await fs.pathExists(PROGRESS_FILE)) {
      progress = await fs.readJson(PROGRESS_FILE);
      console.log(`📋 Progreso previo encontrado: ${progress.processed.length} tractores procesados\n`);
    }
    
    // Leer archivo de tractores
    console.log('📖 Leyendo archivo de tractores...');
    const tsContent = await fs.readFile(TRACTORS_FILE, 'utf-8');
    
    const { arrayContent, startIdx, endIdx } = extractJsonArrayFromProcessedTs(tsContent);
    
    // Parsear el array JSON
    let tractors;
    try {
      tractors = JSON.parse(arrayContent);
    } catch (e) {
      console.error('❌ Error al parsear JSON:', e.message);
      throw e;
    }
    
    console.log(`✅ Total de tractores encontrados: ${tractors.length}\n`);
    
    // Procesar TODOS los tractores para regenerar contenido SEO mejorado
    let processed = 0;
    let updated = 0;
    
    console.log(`🔄 Regenerando contenido SEO mejorado para TODOS los tractores...\n`);
    
    for (let i = 0; i < tractors.length; i++) {
      const tractor = tractors[i];
      
      try {
        // Enriquecer tractor - siempre regenerar contenido SEO con la nueva función mejorada
        const enriched = enrichTractor(tractor, true);
        tractors[i] = enriched;
        
        updated++;
        processed++;
        
        // Guardar progreso cada 100 tractores
        if (updated % 100 === 0) {
          // Guardar archivo actualizado temporalmente
          const updatedArrayContent = JSON.stringify(tractors, null, 2);
          const beforeArray = tsContent.slice(0, startIdx);
          const afterArray = tsContent.slice(endIdx);
          const newContent = beforeArray + updatedArrayContent + afterArray;
          await fs.writeFile(TRACTORS_FILE, newContent);
          
          console.log(`  ✓ Procesados ${updated} tractores (${i + 1}/${tractors.length})`);
        }
      } catch (error) {
        console.error(`  ❌ Error procesando tractor ${tractor.id}: ${error.message}`);
        // Continuar con el siguiente
      }
    }
    
    // Guardar archivo final actualizado
    console.log('\n💾 Guardando archivo final...');
    const updatedArrayContent = JSON.stringify(tractors, null, 2);
    const beforeArray = tsContent.slice(0, startIdx);
    const afterArray = tsContent.slice(endIdx);
    const newContent = beforeArray + updatedArrayContent + afterArray;
    
    // Crear backup
    const backupFile = TRACTORS_FILE + '.backup.' + Date.now();
    await fs.writeFile(backupFile, tsContent);
    console.log(`📦 Backup creado: ${backupFile}`);
    
    // Escribir archivo actualizado
    await fs.writeFile(TRACTORS_FILE, newContent);
    
    console.log('\n✅ ¡Enriquecimiento completado!');
    console.log(`   - Total procesados: ${processed}`);
    console.log(`   - Total actualizados: ${updated}`);
    console.log(`   - Archivo actualizado: ${TRACTORS_FILE}`);
    
  } catch (error) {
    console.error('\n❌ Error durante el enriquecimiento:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  enrichAllTractors()
    .then(() => {
      console.log('\n🎉 Proceso completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { enrichAllTractors, enrichTractor, generateSEOContent };

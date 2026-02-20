/**
 * Script para REGENERAR contenido SEO optimizado (600-800 palabras)
 * Restaura el backup y regenera con contenido más conciso para evitar problemas de memoria
 */

const fs = require('fs-extra');
const path = require('path');

const TRACTORS_FILE = path.join(__dirname, '..', 'data', 'processed-tractors.ts');
const { generateOptimizedSEOContent } = require('./generateOptimizedSEOContent');

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

async function fixSEOContentSize() {
  try {
    console.log('🚀 Regenerando contenido SEO optimizado (600-800 palabras)...\n');
    
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
    
    // Procesar TODOS los tractores
    let updated = 0;
    
    console.log(`🔄 Regenerando contenido SEO optimizado...\n`);
    
    for (let i = 0; i < tractors.length; i++) {
      const tractor = tractors[i];
      
      try {
        // Regenerar contenido SEO optimizado (más conciso)
        tractors[i].seoContent = generateOptimizedSEOContent(tractor);
        updated++;
        
        // Guardar progreso cada 500 tractores
        if (updated % 500 === 0) {
          const updatedArrayContent = JSON.stringify(tractors, null, 2);
          const beforeArray = tsContent.slice(0, startIdx);
          const afterArray = tsContent.slice(endIdx);
          const newContent = beforeArray + updatedArrayContent + afterArray;
          await fs.writeFile(TRACTORS_FILE, newContent);
          
          console.log(`  ✓ Procesados ${updated} tractores (${i + 1}/${tractors.length})`);
        }
      } catch (error) {
        console.error(`  ❌ Error procesando tractor ${tractor.id}: ${error.message}`);
      }
    }
    
    // Guardar archivo final
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
    
    const finalSize = (await fs.stat(TRACTORS_FILE)).size / (1024 * 1024);
    
    console.log('\n✅ ¡Regeneración completada!');
    console.log(`   - Total regenerados: ${updated}`);
    console.log(`   - Tamaño final: ${finalSize.toFixed(2)} MB`);
    console.log(`   - Archivo: ${TRACTORS_FILE}`);
    
  } catch (error) {
    console.error('\n❌ Error durante la regeneración:', error);
    throw error;
  }
}

if (require.main === module) {
  fixSEOContentSize()
    .then(() => {
      console.log('\n🎉 Proceso completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { fixSEOContentSize };

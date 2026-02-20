/**
 * Script para REGENERAR el contenido SEO mejorado para TODOS los tractores
 * 
 * Este script:
 * 1. Lee todos los tractores existentes
 * 2. Regenera el contenido SEO con la nueva función mejorada (1000+ palabras)
 * 3. Actualiza TODOS los tractores, sin importar si ya tienen contenido SEO
 */

const fs = require('fs-extra');
const path = require('path');

const TRACTORS_FILE = path.join(__dirname, '..', 'data', 'processed-tractors.ts');
const { generateSEOContent } = require('./enrichAllTractors');

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

async function regenerateSEOContent() {
  try {
    console.log('🚀 Iniciando regeneración de contenido SEO mejorado para TODOS los tractores...\n');
    console.log('⚠️  NOTA: Se regenerará el contenido SEO (1000+ palabras) para TODOS los tractores\n');
    
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
    
    console.log(`🔄 Regenerando contenido SEO mejorado...\n`);
    
    for (let i = 0; i < tractors.length; i++) {
      const tractor = tractors[i];
      
      try {
        // SIEMPRE regenerar contenido SEO con la nueva función mejorada
        tractors[i].seoContent = generateSEOContent(tractor);
        updated++;
        
        // Guardar progreso cada 100 tractores
        if (updated % 100 === 0) {
          // Guardar archivo actualizado temporalmente
          const updatedArrayContent = JSON.stringify(tractors, null, 2);
          const beforeArray = tsContent.slice(0, startIdx);
          const afterArray = tsContent.slice(endIdx);
          const newContent = beforeArray + updatedArrayContent + afterArray;
          await fs.writeFile(TRACTORS_FILE, newContent);
          
          console.log(`  ✓ Regenerados ${updated} tractores (${i + 1}/${tractors.length})`);
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
    
    console.log('\n✅ ¡Regeneración completada!');
    console.log(`   - Total regenerados: ${updated}`);
    console.log(`   - Archivo actualizado: ${TRACTORS_FILE}`);
    
  } catch (error) {
    console.error('\n❌ Error durante la regeneración:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  regenerateSEOContent()
    .then(() => {
      console.log('\n🎉 Proceso completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { regenerateSEOContent };

/**
 * Script para actualizar la estructura del contenido SEO de todos los tractores
 * Cambia h2 a h1 para el título principal y h3 a h2 para las secciones principales
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

async function updateSEOContentStructure() {
  try {
    console.log('🔄 Actualizando estructura del contenido SEO...\n');
    
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
    
    // Actualizar contenido SEO de cada tractor
    let updated = 0;
    
    for (let i = 0; i < tractors.length; i++) {
      const tractor = tractors[i];
      
      if (tractor.seoContent) {
        // Regenerar contenido SEO con nueva estructura
        const newContent = generateSEOContent(tractor);
        tractors[i].seoContent = newContent;
        updated++;
        
        if ((i + 1) % 1000 === 0) {
          console.log(`  ✓ Actualizados ${i + 1} tractores...`);
        }
      }
    }
    
    // Guardar archivo actualizado
    console.log('\n💾 Guardando archivo actualizado...');
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
    
    console.log('\n✅ ¡Actualización completada!');
    console.log(`   - Total actualizados: ${updated}`);
    console.log(`   - Archivo actualizado: ${TRACTORS_FILE}`);
    
  } catch (error) {
    console.error('\n❌ Error durante la actualización:', error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  updateSEOContentStructure();
}

module.exports = { updateSEOContentStructure };

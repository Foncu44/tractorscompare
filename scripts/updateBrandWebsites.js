/**
 * Añade/actualiza el campo brandWebsite en data/processed-tractors.ts
 * usando el mapa data/brand-websites.json (web oficial por marca).
 *
 * - No hace scraping (solo inyecta datos del mapa).
 * - Puedes ampliar el mapa con más marcas cuando quieras.
 */
const fs = require('fs-extra');
const path = require('path');

const TRACTORS_FILE = path.join(__dirname, '..', 'data', 'processed-tractors.ts');
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'processed-tractors.ts');
const BRAND_WEBSITES_FILE = path.join(__dirname, '..', 'data', 'brand-websites.json');

function extractJsonArrayFromProcessedTs(tsContent) {
  // Busca "export const scrapedTractors" y extrae el primer array [...] balanceando corchetes.
  const exportIdx = tsContent.indexOf('export const scrapedTractors');
  if (exportIdx === -1) {
    throw new Error('No se encontró "export const scrapedTractors" en processed-tractors.ts');
  }
  const eqIdx = tsContent.indexOf('=', exportIdx);
  if (eqIdx === -1) throw new Error('No se encontró "=" tras "export const scrapedTractors"');
  const startIdx = tsContent.indexOf('[', eqIdx);
  if (startIdx === -1) throw new Error('No se encontró "[" del array de tractores');

  let depth = 0;
  for (let i = startIdx; i < tsContent.length; i++) {
    const ch = tsContent[i];
    if (ch === '[') depth++;
    else if (ch === ']') {
      depth--;
      if (depth === 0) {
        return tsContent.slice(startIdx, i + 1);
      }
    }
  }
  throw new Error('No se pudo extraer el array: corchetes desbalanceados');
}

async function updateBrandWebsites() {
  const content = await fs.readFile(TRACTORS_FILE, 'utf-8');
  const arrText = extractJsonArrayFromProcessedTs(content);
  const tractors = JSON.parse(arrText);

  const brandWebsites = await fs.readJson(BRAND_WEBSITES_FILE);

  let updated = 0;
  let skipped = 0;
  const missingBrands = new Set();

  for (const t of tractors) {
    const website = brandWebsites[t.brand];
    if (website) {
      if (t.brandWebsite !== website) {
        t.brandWebsite = website;
        updated++;
      } else {
        skipped++;
      }
    } else {
      // Si no hay mapeo, dejamos brandWebsite como undefined (no forzamos vacío)
      if (t.brandWebsite) {
        // Si existía antes pero ya no está en el mapa, lo dejamos tal cual (no borramos).
      } else {
        missingBrands.add(t.brand);
      }
    }
  }

  const dateMatch = content.match(/\/\/ Fecha: (.*)/);
  const date = dateMatch ? dateMatch[1] : new Date().toISOString();

  const newContent = `import { Tractor } from '@/types/tractor';

// Tractores extraídos desde TractorData.com
// Generado automáticamente - NO editar manualmente
// Fecha: ${date}
// Websites oficiales por marca actualizados: ${new Date().toISOString()}
// URLs de imágenes actualizadas: ${new Date().toISOString()}

// @ts-ignore - Array muy grande que causa error de complejidad de tipo en TypeScript
export const scrapedTractors: Tractor[] = ${JSON.stringify(tractors, null, 2)};
`;

  await fs.writeFile(OUTPUT_FILE, newContent, 'utf-8');

  console.log(`✅ brandWebsite actualizado en ${updated} tractores (${skipped} sin cambios)`);
  if (missingBrands.size > 0) {
    const sample = Array.from(missingBrands).slice(0, 25);
    console.log(`⚠️  Marcas sin website en data/brand-websites.json: ${missingBrands.size}`);
    console.log(`   Ejemplos: ${sample.join(', ')}`);
    console.log('   Añade más entradas a data/brand-websites.json y vuelve a ejecutar el script.');
  }
  console.log(`💾 Guardado: ${OUTPUT_FILE}`);
}

if (require.main === module) {
  updateBrandWebsites().catch((err) => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
}

module.exports = { updateBrandWebsites };


/**
 * Script para enriquecer los datos de tractores con información adicional
 * de las webs de fabricantes, catálogos técnicos y documentación.
 * 
 * Este script intenta buscar:
 * - Especificaciones técnicas detalladas (torque, bore/stroke, etc.)
 * - Enlaces a catálogos técnicos
 * - Enlaces a manuales de operador y servicio
 * - Enlaces a páginas de productos del fabricante
 */

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');

const TRACTORS_FILE = path.join(__dirname, '..', 'data', 'processed-tractors.ts');
const BRAND_WEBSITES_FILE = path.join(__dirname, '..', 'data', 'brand-websites.json');
const PROGRESS_FILE = path.join(__dirname, '..', 'data', 'enrichment-progress.json');

// Delay entre requests para evitar rate limiting
const DELAY_MS = 2000;

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

/**
 * Busca información adicional de un tractor en la web del fabricante
 */
async function searchManufacturerWebsite(brandWebsite, brand, model, year) {
  if (!brandWebsite) return null;

  try {
    // Construir posibles URLs de búsqueda
    const searchQueries = [
      `${brandWebsite}search?q=${encodeURIComponent(`${brand} ${model}`)}`,
      `${brandWebsite}products/${encodeURIComponent(model.toLowerCase().replace(/\s+/g, '-'))}`,
      `${brandWebsite}tractors/${encodeURIComponent(model.toLowerCase().replace(/\s+/g, '-'))}`,
    ];

    for (const url of searchQueries) {
      try {
        const response = await axios.get(url, {
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        });

        const $ = cheerio.load(response.data);
        
        // Buscar enlaces a PDFs (catálogos, manuales)
        const pdfLinks = [];
        $('a[href$=".pdf"], a[href*="catalog"], a[href*="manual"], a[href*="spec"]').each((i, el) => {
          const href = $(el).attr('href');
          if (href) {
            const fullUrl = href.startsWith('http') ? href : new URL(href, brandWebsite).href;
            pdfLinks.push(fullUrl);
          }
        });

        // Buscar enlaces a páginas de productos
        const productLinks = [];
        $('a[href*="product"], a[href*="tractor"], a[href*="model"]').each((i, el) => {
          const href = $(el).attr('href');
          const text = $(el).text().toLowerCase();
          if (href && (text.includes(model.toLowerCase()) || text.includes(brand.toLowerCase()))) {
            const fullUrl = href.startsWith('http') ? href : new URL(href, brandWebsite).href;
            productLinks.push(fullUrl);
          }
        });

        // Intentar extraer especificaciones técnicas del HTML
        const specs = {};
        const specText = $('body').text().toLowerCase();
        
        // Buscar torque (ej: "610 Nm", "450 lb-ft")
        const torqueMatch = specText.match(/(\d+)\s*(nm|lb-ft|lbft)/i);
        if (torqueMatch) {
          specs.torqueMax = parseInt(torqueMatch[1]);
        }

        // Buscar bore/stroke
        const boreMatch = specText.match(/bore[:\s]+(\d+)\s*mm/i);
        const strokeMatch = specText.match(/stroke[:\s]+(\d+)\s*mm/i);
        if (boreMatch) specs.bore = parseInt(boreMatch[1]);
        if (strokeMatch) specs.stroke = parseInt(strokeMatch[1]);

        if (pdfLinks.length > 0 || productLinks.length > 0 || Object.keys(specs).length > 0) {
          return {
            documentation: {
              technicalCatalog: pdfLinks.find(link => link.includes('catalog') || link.includes('spec')) || null,
              operatorManual: pdfLinks.find(link => link.includes('operator') || link.includes('manual')) || null,
              serviceManual: pdfLinks.find(link => link.includes('service') || link.includes('repair')) || null,
              partsCatalog: pdfLinks.find(link => link.includes('parts')) || null,
              manufacturerPage: productLinks[0] || null,
            },
            engine: specs,
          };
        }
      } catch (err) {
        // Continuar con la siguiente URL si esta falla
        continue;
      }
    }
  } catch (error) {
    console.error(`Error buscando en ${brandWebsite} para ${brand} ${model}:`, error.message);
  }

  return null;
}

/**
 * Busca información en TractorData.com como fuente alternativa
 */
async function searchTractorData(brand, model) {
  try {
    const searchUrl = `https://www.tractordata.com/search.html?q=${encodeURIComponent(`${brand} ${model}`)}`;
    const response = await axios.get(searchUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const $ = cheerio.load(response.data);
    
    // Buscar enlaces a páginas de tractores
    const tractorLinks = [];
    $('a[href*="/tractors/"]').each((i, el) => {
      const href = $(el).attr('href');
      if (href) {
        const fullUrl = href.startsWith('http') ? href : `https://www.tractordata.com${href}`;
        tractorLinks.push(fullUrl);
      }
    });

    if (tractorLinks.length > 0) {
      // Intentar acceder a la primera página de tractor
      try {
        const tractorPage = await axios.get(tractorLinks[0], { timeout: 10000 });
        const $tractor = cheerio.load(tractorPage.data);
        
        const specs = {};
        
        // Extraer especificaciones de la página
        $tractor('.spec-row, .specification').each((i, el) => {
          const label = $tractor(el).find('.spec-label, dt').text().toLowerCase();
          const value = $tractor(el).find('.spec-value, dd').text();
          
          if (label.includes('torque')) {
            const match = value.match(/(\d+)/);
            if (match) specs.torqueMax = parseInt(match[1]);
          }
          if (label.includes('bore')) {
            const match = value.match(/(\d+)/);
            if (match) specs.bore = parseInt(match[1]);
          }
          if (label.includes('stroke')) {
            const match = value.match(/(\d+)/);
            if (match) specs.stroke = parseInt(match[1]);
          }
        });

        if (Object.keys(specs).length > 0) {
          return { engine: specs };
        }
      } catch (err) {
        // Ignorar errores al acceder a páginas individuales
      }
    }
  } catch (error) {
    // Ignorar errores de TractorData
  }

  return null;
}

/**
 * Enriquece un tractor con información adicional
 */
async function enrichTractor(tractor, brandWebsites) {
  const brandWebsite = brandWebsites[tractor.brand] || tractor.brandWebsite;
  
  // Normalizar marca (John -> John Deere, etc.)
  let normalizedBrand = tractor.brand;
  if (tractor.brand === 'John' && tractor.model.startsWith('Deere ')) {
    normalizedBrand = 'John Deere';
  } else if (tractor.brand === 'New' && tractor.model.startsWith('Holland ')) {
    normalizedBrand = 'New Holland';
  } else if (tractor.brand === 'Massey' && tractor.model.startsWith('Ferguson ')) {
    normalizedBrand = 'Massey Ferguson';
  }

  const model = tractor.model.replace(/^(Deere |Holland |Ferguson )/, '');

  // Buscar en web del fabricante
  let enriched = null;
  if (brandWebsite) {
    enriched = await searchManufacturerWebsite(brandWebsite, normalizedBrand, model, tractor.year);
    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
  }

  // Si no se encontró nada, intentar TractorData como alternativa
  if (!enriched || Object.keys(enriched.engine || {}).length === 0) {
    const tractorDataInfo = await searchTractorData(normalizedBrand, model);
    if (tractorDataInfo) {
      enriched = enriched || {};
      enriched.engine = { ...enriched?.engine, ...tractorDataInfo.engine };
    }
    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
  }

  // Aplicar enriquecimiento al tractor
  if (enriched) {
    if (enriched.engine) {
      tractor.engine = { ...tractor.engine, ...enriched.engine };
    }
    if (enriched.documentation) {
      tractor.documentation = enriched.documentation;
    }
  }

  return enriched !== null;
}

/**
 * Función principal
 */
async function main() {
  console.log('🚀 Iniciando enriquecimiento de datos de tractores...\n');

  // Cargar datos
  const content = await fs.readFile(TRACTORS_FILE, 'utf-8');
  const arrText = extractJsonArrayFromProcessedTs(content);
  const tractors = JSON.parse(arrText);
  const brandWebsites = await fs.readJson(BRAND_WEBSITES_FILE);

  // Cargar progreso previo
  let progress = { processed: [], lastIndex: 0 };
  if (await fs.pathExists(PROGRESS_FILE)) {
    progress = await fs.readJson(PROGRESS_FILE);
  }

  console.log(`📊 Total de tractores: ${tractors.length}`);
  console.log(`✅ Ya procesados: ${progress.processed.length}`);
  console.log(`📍 Continuando desde índice: ${progress.lastIndex}\n`);

  let enriched = 0;
  let skipped = 0;
  let errors = 0;

  // Procesar tractores (empezar desde donde se quedó)
  for (let i = progress.lastIndex; i < tractors.length; i++) {
    const tractor = tractors[i];
    
    try {
      const wasEnriched = await enrichTractor(tractor, brandWebsites);
      if (wasEnriched) {
        enriched++;
        console.log(`✅ [${i + 1}/${tractors.length}] Enriquecido: ${tractor.brand} ${tractor.model}`);
      } else {
        skipped++;
        if ((i + 1) % 100 === 0) {
          console.log(`⏭️  [${i + 1}/${tractors.length}] Sin datos adicionales: ${tractor.brand} ${tractor.model}`);
        }
      }

      // Guardar progreso cada 50 tractores
      if ((i + 1) % 50 === 0) {
        progress.lastIndex = i + 1;
        progress.processed.push(tractor.id);
        await fs.writeJson(PROGRESS_FILE, progress, { spaces: 2 });
        console.log(`💾 Progreso guardado (${i + 1}/${tractors.length})`);
      }
    } catch (error) {
      errors++;
      console.error(`❌ [${i + 1}/${tractors.length}] Error en ${tractor.brand} ${tractor.model}:`, error.message);
    }
  }

  // Guardar resultados finales
  const dateMatch = content.match(/\/\/ Fecha: (.*)/);
  const date = dateMatch ? dateMatch[1] : new Date().toISOString();

  const newContent = `import { Tractor } from '@/types/tractor';

// Tractores extraídos desde TractorData.com
// Generado automáticamente - NO editar manualmente
// Fecha: ${date}
// Websites oficiales por marca actualizados: ${new Date().toISOString()}
// URLs de imágenes actualizadas: ${new Date().toISOString()}
// Datos enriquecidos con información adicional: ${new Date().toISOString()}

// @ts-ignore - Array muy grande que causa error de complejidad de tipo en TypeScript
export const scrapedTractors: Tractor[] = ${JSON.stringify(tractors, null, 2)};
`;

  await fs.writeFile(TRACTORS_FILE, newContent, 'utf-8');

  // Actualizar progreso final
  progress.lastIndex = tractors.length;
  await fs.writeJson(PROGRESS_FILE, progress, { spaces: 2 });

  console.log('\n✨ Enriquecimiento completado!');
  console.log(`✅ Enriquecidos: ${enriched}`);
  console.log(`⏭️  Sin cambios: ${skipped}`);
  console.log(`❌ Errores: ${errors}`);
}

// Ejecutar
main().catch(console.error);

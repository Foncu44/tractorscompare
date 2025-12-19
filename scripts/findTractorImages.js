/**
 * Script para buscar imágenes de tractores en la web
 * Busca SOLO imágenes con licencia libre (Creative Commons, uso libre)
 * para evitar problemas de derechos de autor
 * 
 * Prioriza:
 * 1. Wikimedia Commons (vía API oficial: URLs directas + metadatos)
 * 2. (Opcional) Google Images con filtro Creative Commons (FRÁGIL)
 * 3. (Opcional) Sitios oficiales de fabricantes (NO recomendado por licencias)
 *
 * Nota: Por defecto este script usa SOLO Wikimedia Commons para maximizar fiabilidad
 * y evitar problemas de copyright / bloqueos.
 */

const fs = require('fs-extra');
const path = require('path');

const TRACTORS_FILE = path.join(__dirname, '..', 'data', 'processed-tractors.ts');
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'tractor-images.json');
const PROGRESS_FILE = path.join(__dirname, '..', 'data', 'image-search-progress.json');

// URLs de búsqueda por marca (solo para uso informativo como último recurso)
const BRAND_WEBSITES = {
  'John Deere': 'https://www.deere.com',
  'Kubota': 'https://www.kubota.com',
  'New Holland': 'https://www.newholland.com',
  'Case IH': 'https://www.caseih.com',
  'Massey Ferguson': 'https://www.masseyferguson.com',
  'Fendt': 'https://www.fendt.com',
  'Claas': 'https://www.claas.com',
};

// Sitios conocidos con imágenes libres de derechos
const FREE_LICENSE_SITES = [
  'wikimedia.org',
  'commons.wikimedia.org',
  'flickr.com', // Muchas con CC
  'pixabay.com',
  'pexels.com',
  'unsplash.com',
  'pxhere.com',
];

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function parseArgs(argv) {
  const args = {
    limit: undefined,
    start: undefined,
    _startProvided: false,
    concurrency: 3,
    saveEvery: 25,
    force: false,
    retryNull: false,
    onlyMissing: true,
    enableGoogle: false,
    enableBrandSites: false,
    verbose: false,
  };

  const rest = argv.slice(2);
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === '--force') args.force = true;
    else if (a === '--retry-null') args.retryNull = true;
    else if (a === '--all') args.onlyMissing = false;
    else if (a === '--enable-google') args.enableGoogle = true;
    else if (a === '--enable-brand-sites') args.enableBrandSites = true;
    else if (a === '--verbose') args.verbose = true;
    else if (a === '--limit') args.limit = Number(rest[++i]);
    else if (a === '--start') {
      args.start = Number(rest[++i]) || 0;
      args._startProvided = true;
    }
    else if (a === '--concurrency') args.concurrency = Math.max(1, Number(rest[++i]) || 3);
    else if (a === '--save-every') args.saveEvery = Math.max(1, Number(rest[++i]) || 25);
  }

  return args;
}

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim() !== '' && v !== 'null' && v !== 'undefined';
}

function normalizeText(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function tokenize(s) {
  const t = normalizeText(s);
  if (!t) return [];
  return t.split(' ').filter(Boolean);
}

function scoreCandidate({ title, description }, brand, model) {
  const titleNorm = normalizeText(title);
  const descNorm = normalizeText(description || '');
  const brandTokens = tokenize(brand);
  const modelTokens = tokenize(model);
  const modelHasLetters = /[a-z]/i.test(normalizeText(model));

  // Penalizar cosas obvias que no queremos
  const badWords = ['logo', 'icon', 'manual', 'brochure', 'catalog', 'drawing', 'diagram'];
  for (const w of badWords) {
    if (titleNorm.includes(w) || descNorm.includes(w)) return -1000;
  }

  let score = 0;
  const brandHit = brandTokens.some(tok => titleNorm.includes(tok) || descNorm.includes(tok));
  const modelHit = modelTokens.some(tok => titleNorm.includes(tok) || descNorm.includes(tok));

  // Reglas duras para evitar falsos positivos:
  // - Siempre requerimos marca + modelo (si el modelo es solo numérico, además requerimos "tractor")
  if (!brandHit || !modelHit) return -999;

  for (const tok of brandTokens) {
    if (titleNorm.includes(tok)) score += 3;
    else if (descNorm.includes(tok)) score += 1;
  }
  for (const tok of modelTokens) {
    if (titleNorm.includes(tok)) score += 4;
    else if (descNorm.includes(tok)) score += 2;
  }

  // Bonus si parece foto de tractor
  const tractorWords = ['tractor', 'traktor', 'schlepper'];
  const tractorHit = tractorWords.some(w => titleNorm.includes(w) || descNorm.includes(w));
  if (tractorHit) score += 6;
  if (!modelHasLetters && !tractorHit) return -999; // si el modelo es numérico puro, exige "tractor"

  // Pequeño bonus por títulos cortos (suelen ser más “File:Brand Model.jpg”)
  score += Math.max(0, 10 - Math.floor(titleNorm.length / 10));

  return score;
}

function buildWikimediaQueries(brand, model) {
  const full = `${brand} ${model}`.replace(/\s+/g, ' ').trim();
  const quoted = `"${full}"`;
  const modelHasLetters = /[a-z]/i.test(normalizeText(model));

  return [
    // Para modelos numéricos, forzar "tractor" para evitar resultados irrelevantes
    modelHasLetters ? `intitle:${quoted}` : `intitle:${quoted} tractor`,
    `${quoted} tractor`,
    `${full} tractor`,
    full,
  ];
}

async function fetchJson(url, { timeoutMs = 25000 } = {}) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'user-agent': 'tractorscompare/1.0 (image-finder; +local-script)',
        'accept': 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

/**
 * Busca imagen en Wikimedia Commons usando la API oficial (URLs directas + metadatos)
 */
async function searchWikimediaCommons(brand, model, { verbose = false } = {}) {
  const queries = buildWikimediaQueries(brand, model);

  for (const q of queries) {
    try {
      const url =
        `https://commons.wikimedia.org/w/api.php` +
        `?action=query&format=json&origin=*` +
        `&generator=search` +
        `&gsrnamespace=6` +
        `&gsrlimit=12` +
        `&gsrsearch=${encodeURIComponent(q)}` +
        `&prop=imageinfo` +
        `&iiprop=url|extmetadata`;

      if (verbose) console.log(`  🧠 Wikimedia API query: ${q}`);
      const data = await fetchJson(url, { timeoutMs: 25000 });
      const pages = data?.query?.pages ? Object.values(data.query.pages) : [];
      if (!pages.length) continue;

      const candidates = [];
      for (const p of pages) {
        const title = p?.title || '';
        const ii = Array.isArray(p?.imageinfo) ? p.imageinfo[0] : null;
        const directUrl = ii?.url;
        const desc = ii?.extmetadata?.ImageDescription?.value || ii?.extmetadata?.ObjectName?.value || '';

        if (!isNonEmptyString(directUrl)) continue;
        // Evitar archivos no-imagen (PDF, etc.)
        const lower = directUrl.toLowerCase();
        const isRaster =
          lower.endsWith('.jpg') ||
          lower.endsWith('.jpeg') ||
          lower.endsWith('.png') ||
          lower.endsWith('.webp') ||
          lower.endsWith('.gif');
        if (!isRaster) continue;
        // Evitar miniaturas tipo 250px-...
        if (/\/\d+px-/.test(directUrl)) continue;
        candidates.push({
          title,
          url: directUrl,
          description: String(desc).replace(/<[^>]+>/g, ' ').trim(),
        });
      }

      if (!candidates.length) continue;

      candidates.sort((a, b) => scoreCandidate(b, brand, model) - scoreCandidate(a, brand, model));
      const best = candidates[0];
      const bestScore = scoreCandidate(best, brand, model);
      if (bestScore < 0) {
        if (verbose) console.log(`  ⚠️  Wikimedia: candidatos pero score bajo (${bestScore}).`);
        continue;
      }

      if (verbose) console.log(`  ✅ Wikimedia: ${best.title} (score ${bestScore})`);
      return best.url;
    } catch (e) {
      if (verbose) console.log(`  ⚠️  Wikimedia API error: ${e.message}`);
      continue;
    }
  }

  return null;
}

/**
 * Busca una imagen en Google Images con filtro de licencia libre (Creative Commons)
 */
async function searchGoogleImages(page, brand, model) {
  try {
    const searchQuery = `${brand} ${model} tractor`;
    // Buscar con filtro de licencia: Creative Commons (uso comercial y reutilización permitida)
    const googleImagesUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(searchQuery)}&safe=active&tbs=il:cl`; // il:cl = Creative Commons
    
    await page.goto(googleImagesUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    await delay(5000); // Esperar más tiempo para que carguen las imágenes
    
    // Intentar hacer scroll para cargar más imágenes
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 2);
    });
    await delay(2000);
    
    // Buscar la primera imagen válida en los resultados
    const imageUrl = await page.evaluate((freeSites) => {
      // Google Images puede usar diferentes estructuras según el navegador
      // Buscar en elementos de imagen que tengan data-src o src válido
      const allImages = Array.from(document.querySelectorAll('img'));
      const validUrls = [];
      
      for (const img of allImages) {
        let src = img.getAttribute('data-src') || 
                  img.getAttribute('data-ils') ||
                  img.getAttribute('src') || 
                  img.src;
        
        if (!src) continue;
        
        // Convertir URLs de Google Images a URLs originales si es necesario
        if (src.includes('googleusercontent.com')) {
          // Intentar extraer la URL original desde el parámetro
          const urlMatch = src.match(/url=([^&]+)/);
          if (urlMatch) {
            src = decodeURIComponent(urlMatch[1]);
          }
        }
        
        // Validar que sea una URL válida de imagen
        if (src && 
            src.startsWith('http') && 
            !src.includes('gstatic.com/') &&
            !src.includes('google.com/logos') &&
            !src.includes('googleusercontent.com/logos') &&
            !src.includes('doubleclick.net') &&
            !src.includes('google-analytics.com') &&
            (src.includes('.jpg') || src.includes('.jpeg') || src.includes('.png') || src.includes('.webp') || src.includes('imgurl='))) {
          
          // Si tiene imgurl=, extraer la URL real
          if (src.includes('imgurl=')) {
            const realUrlMatch = src.match(/imgurl=([^&]+)/);
            if (realUrlMatch) {
              src = decodeURIComponent(realUrlMatch[1]);
            }
          }
          
          // Validar que la URL final sea válida
          if (src.startsWith('http') && 
              (src.includes('.jpg') || src.includes('.jpeg') || src.includes('.png') || src.includes('.webp'))) {
            validUrls.push(src);
          }
        }
      }
      
      // Priorizar URLs de sitios con licencia libre conocidos
      for (const url of validUrls) {
        const urlLower = url.toLowerCase();
        for (const site of freeSites) {
          if (urlLower.includes(site)) {
            return url;
          }
        }
      }
      
      // Si no encontramos en sitios libres conocidos, retornar null
      // para evitar problemas de copyright
      return null;
    }, FREE_LICENSE_SITES);
    
    if (imageUrl) {
      console.log(`  ✅ Imagen libre encontrada en Google Images`);
      return imageUrl;
    }
    
    return null;
  } catch (error) {
    console.error(`  ❌ Error buscando en Google Images: ${error.message}`);
    return null;
  }
}

/**
 * Busca imagen directamente en la web del fabricante (solo para fines informativos)
 * NOTA: Los sitios oficiales generalmente permiten uso para fines informativos/educativos
 * pero debemos tener cuidado y solo usarlo como último recurso
 */
async function searchBrandWebsite(page, brand, model) {
  const brandUrl = BRAND_WEBSITES[brand];
  if (!brandUrl) {
    return null;
  }
  
  try {
    // Buscar en la página de búsqueda del fabricante
    const searchUrl = `${brandUrl}/search?q=${encodeURIComponent(model)}`;
    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    await delay(3000);
    
    const imageUrl = await page.evaluate(() => {
      const img = document.querySelector('img[src*="tractor"], img[alt*="tractor"], .product-image img, .tractor-image img');
      if (img) {
        const src = img.getAttribute('src') || img.src;
        if (src.startsWith('http')) {
          return src;
        } else if (src.startsWith('/')) {
          return window.location.origin + src;
        }
      }
      return null;
    });
    
    if (imageUrl) {
      console.log(`  ⚠️  Imagen de sitio oficial (uso informativo únicamente)`);
    }
    
    return imageUrl;
  } catch (error) {
    console.error(`  ❌ Error buscando en web del fabricante: ${error.message}`);
    return null;
  }
}

/**
 * Función principal para buscar imagen de un tractor
 * Prioriza imágenes con licencia libre para evitar problemas de copyright
 */
async function findTractorImage({ page, tractor, enableGoogle, enableBrandSites, verbose }) {
  const { brand, model } = tractor;
  
  // 1. Primero intentar buscar en Wikimedia Commons (API oficial: más fiable)
  let imageUrl = await searchWikimediaCommons(brand, model, { verbose });
  
  // 2. Si no encontramos, buscar en Google Images con filtro Creative Commons
  if (!imageUrl && enableGoogle && page) {
    console.log(`  🔍 Buscando en Google Images (Creative Commons)...`);
    imageUrl = await searchGoogleImages(page, brand, model);
  }
  
  // 3. Como último recurso, buscar en sitio oficial del fabricante
  // (uso informativo, generalmente permitido para fines educativos)
  // NOTA: Esto debe usarse con precaución y solo si no hay alternativas libres
  if (!imageUrl && enableBrandSites && page && BRAND_WEBSITES[brand]) {
    console.log(`  🔍 Intentando buscar en web del fabricante (uso informativo)...`);
    imageUrl = await searchBrandWebsite(page, brand, model);
  }
  
  // Pausa entre búsquedas para no sobrecargar
  await delay(250);
  
  return imageUrl;
}

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
        const slice = tsContent.slice(startIdx, i + 1);
        return slice;
      }
    }
  }
  throw new Error('No se pudo extraer el array: corchetes desbalanceados');
}

async function readTractors() {
  const content = await fs.readFile(TRACTORS_FILE, 'utf-8');
  const arrText = extractJsonArrayFromProcessedTs(content);
  return JSON.parse(arrText);
}

async function writeJsonAtomic(filePath, data) {
  const tmp = `${filePath}.tmp`;
  await fs.writeJson(tmp, data, { spaces: 2 });
  await fs.move(tmp, filePath, { overwrite: true });
}

/**
 * Función principal
 */
async function main() {
  const args = parseArgs(process.argv);

  console.log('🚀 Iniciando búsqueda de imágenes de tractores...');
  console.log('✅ Modo por defecto: SOLO Wikimedia Commons (API oficial)');
  if (args.enableGoogle) console.log('⚠️  Google Images activado (puede fallar/bloquearse)');
  if (args.enableBrandSites) console.log('⚠️  Webs de fabricantes activadas (revisar licencias)');
  console.log('⚠️  IMPORTANTE: se priorizan imágenes libres para evitar problemas de copyright\n');
  
  // Leer tractores procesados
  let tractors = [];
  try {
    tractors = await readTractors();
    console.log(`📊 Cargados ${tractors.length} tractores`);
  } catch (error) {
    console.error('❌ Error leyendo tractores:', error.message);
    return;
  }
  
  // Cargar progreso anterior
  let progress = { lastIndex: 0, imageUrls: {} };
  try {
    const progressData = await fs.readJson(PROGRESS_FILE);
    progress = progressData;
    console.log(`📂 Progreso anterior: ${progress.lastIndex}/${tractors.length} tractores`);
  } catch (e) {
    console.log('📂 Iniciando desde el principio...');
  }
  
  // Por compatibilidad con el comportamiento anterior: si el usuario NO pasa --start,
  // reanudamos desde progress.lastIndex.
  if (!args._startProvided && typeof progress.lastIndex === 'number' && progress.lastIndex > 0) {
    args.start = progress.lastIndex;
  }

  // Cargar URLs de imágenes ya encontradas
  try {
    const existingImages = await fs.readJson(OUTPUT_FILE);
    progress.imageUrls = { ...progress.imageUrls, ...existingImages };
    console.log(`📂 ${Object.keys(progress.imageUrls).length} imágenes ya encontradas`);
  } catch (e) {
    console.log('📂 No hay imágenes previas');
  }

  // Si se habilita Google o webs de fabricantes, necesitamos navegador (Puppeteer).
  // Para evitar conflictos de navegación, forzamos concurrencia=1.
  let browser = null;
  let page = null;
  if (args.enableGoogle || args.enableBrandSites) {
    if (args.concurrency !== 1) {
      console.log('⚠️  Con --enable-google/--enable-brand-sites se fuerza --concurrency 1 (Puppeteer no soporta navegación concurrente en una sola página).');
      args.concurrency = 1;
    }
    const puppeteer = require('puppeteer');
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1600, height: 900 });
  }

  // Procesar (sin navegador). Concurrencia limitada.
  const startIndex = Math.max(0, typeof args.start === 'number' ? args.start : 0);
  const endIndex = typeof args.limit === 'number' ? Math.min(tractors.length, startIndex + args.limit) : tractors.length;

  let processed = 0;
  let updated = 0;
  let lastSavedProcessed = 0;
  let saving = Promise.resolve();

  async function processOne(i) {
    const tractor = tractors[i];
    const tractorKey = `${tractor.brand}-${tractor.model}`;

    const existing = progress.imageUrls[tractorKey];
    const alreadyHasMapping = Object.prototype.hasOwnProperty.call(progress.imageUrls, tractorKey);

    const tractorAlreadyHasImage = isNonEmptyString(tractor.imageUrl);
    if (args.onlyMissing && tractorAlreadyHasImage && !args.force) {
      if (!alreadyHasMapping) progress.imageUrls[tractorKey] = tractor.imageUrl;
      return;
    }

    if (!args.force) {
      if (alreadyHasMapping && isNonEmptyString(existing)) return;
      if (alreadyHasMapping && existing === null && !args.retryNull) return;
    }

    console.log(`[${i + 1}/${tractors.length}] 🔍 ${tractor.brand} ${tractor.model}`);

    try {
      const imageUrl = await findTractorImage({
        page,
        tractor,
        enableGoogle: args.enableGoogle,
        enableBrandSites: args.enableBrandSites,
        verbose: args.verbose,
      });

      if (isNonEmptyString(imageUrl)) {
        progress.imageUrls[tractorKey] = imageUrl;
        updated++;
        console.log(`  ✅ Imagen: ${imageUrl}`);
      } else {
        progress.imageUrls[tractorKey] = null;
        console.log(`  ⚠️  Sin imagen libre (placeholder)`);
      }
    } catch (e) {
      progress.imageUrls[tractorKey] = null;
      console.log(`  ❌ Error: ${e.message}`);
    } finally {
      processed++;
      progress.lastIndex = Math.max(progress.lastIndex || 0, i + 1);
    }
  }

  const indices = [];
  for (let i = startIndex; i < endIndex; i++) indices.push(i);

  let cursor = 0;
  async function worker() {
    while (cursor < indices.length) {
      const idx = indices[cursor++];
      await processOne(idx);

      // Guardado incremental por batches (serializado para evitar carreras con concurrencia)
      if (processed - lastSavedProcessed >= args.saveEvery) {
        lastSavedProcessed = processed;
        saving = saving.then(async () => {
          await writeJsonAtomic(OUTPUT_FILE, progress.imageUrls);
          await writeJsonAtomic(PROGRESS_FILE, progress);
          console.log(`  💾 Guardado (${processed} procesados en esta ejecución)`);
        });
        await saving;
      }

      // Pequeño respiro para no spamear la API
      await delay(150);
    }
  }

  const workers = Array.from({ length: args.concurrency }, () => worker());
  try {
    await Promise.all(workers);
  } catch (e) {
    console.error('\n❌ Error general:', e);
  } finally {
    await saving;
    await writeJsonAtomic(OUTPUT_FILE, progress.imageUrls);
    await writeJsonAtomic(PROGRESS_FILE, progress);
    if (browser) {
      await browser.close();
    }
  }

  const foundCount = Object.values(progress.imageUrls).filter(url => url !== null).length;
  const totalCount = Object.keys(progress.imageUrls).length;

  console.log(`\n✅ Búsqueda completada!`);
  console.log(`📊 Total mapeados: ${totalCount}`);
  console.log(`🖼️  Con imagen: ${foundCount}`);
  console.log(`⚠️  Sin imagen (placeholder): ${totalCount - foundCount}`);
  console.log(`🧩 Procesados en esta ejecución: ${processed}`);
  console.log(`🆕 Nuevas/actualizadas en esta ejecución: ${updated}`);
  console.log(`💾 URLs guardadas en: ${OUTPUT_FILE}`);
  console.log(`\n📝 Siguiente paso: Ejecuta 'npm run update-images' para actualizar processed-tractors.ts`);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };

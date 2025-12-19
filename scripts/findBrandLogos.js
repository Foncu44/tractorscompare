/**
 * Script para encontrar URLs de logos de marcas desde sus páginas oficiales
 * Similar a findTractorImages.js pero para logos de marcas
 */

const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');

const BRAND_LOGOS_FILE = path.join(__dirname, '..', 'data', 'brand-logos.json');
const PROGRESS_FILE = path.join(__dirname, '..', 'data', 'brand-logo-progress.json');

// Mapeo de marcas a sus URLs oficiales conocidas
const BRAND_WEBSITES = {
  'John Deere': ['https://www.deere.com', 'https://www.johndeere.com'],
  'Kubota': ['https://www.kubota.com', 'https://www.kubota.com/us'],
  'New Holland': ['https://www.newholland.com', 'https://agriculture.newholland.com'],
  'Case IH': ['https://www.caseih.com', 'https://www.caseih.com/northamerica'],
  'Massey Ferguson': ['https://www.masseyferguson.com', 'https://www.masseyferguson.com/en'],
  'Fendt': ['https://www.fendt.com', 'https://www.fendt.com/int'],
  'Claas': ['https://www.claas.com', 'https://www.claas.com/int'],
  'Deutz-Fahr': ['https://www.deutz-fahr.com', 'https://www.deutz-fahr.com/en'],
  'Valtra': ['https://www.valtra.com', 'https://www.valtra.com/en'],
  'Landini': ['https://www.landini.it', 'https://www.landini.com'],
  'Solis': ['https://www.solis-tractors.com', 'https://www.solis-tractors.com/en'],
  'McCormick': ['https://www.mccormick.com', 'https://www.mccormick.com/en'],
  'Yanmar': ['https://www.yanmar.com', 'https://www.yanmar.com/global'],
  'Zetor': ['https://www.zetor.com', 'https://www.zetor.com/en'],
  'Iseki': ['https://www.iseki.com', 'https://www.iseki.com/en'],
  'Mahindra': ['https://www.mahindra.com', 'https://www.mahindra.com/tractors'],
  'Kioti': ['https://www.kioti.com', 'https://www.kioti.com/us'],
  'LS': ['https://www.lstractorus.com', 'https://www.lstractorus.com/en'],
  'Steyr': ['https://www.steyr-traktoren.com', 'https://www.steyr-traktoren.com/en'],
  'International Harvester': ['https://www.caseih.com', 'https://www.caseih.com/northamerica'],
  'Ford': ['https://www.ford.com', 'https://www.ford.com/trucks'],
  'Fiat': ['https://www.cnhindustrial.com', 'https://www.cnhindustrial.com/en'],
  'Renault': ['https://www.renault.com', 'https://www.renault.com/en'],
  'Mercedes-Benz': ['https://www.mercedes-benz.com', 'https://www.mercedes-benz.com/en'],
  'Caterpillar': ['https://www.cat.com', 'https://www.cat.com/en_US.html'],
  'Challenger': ['https://www.agcocorp.com', 'https://www.agcocorp.com/brands/challenger'],
  'Bobcat': ['https://www.bobcat.com', 'https://www.bobcat.com/us'],
  'Branson': ['https://www.bransontractors.com', 'https://www.bransontractors.com/us'],
  'TYM': ['https://www.tym.com', 'https://www.tym.com/en'],
  'Shibaura': ['https://www.shibaura.com', 'https://www.shibaura.com/en'],
  'Pasquali': ['https://www.pasquali.it', 'https://www.pasquali.com'],
  'Lamborghini': ['https://www.same-tractors.com', 'https://www.same-tractors.com/en'],
  'SAME': ['https://www.same-tractors.com', 'https://www.same-tractors.com/en'],
  'Deutz': ['https://www.deutz.com', 'https://www.deutz.com/en'],
  'Hurlimann': ['https://www.hurlimann-tractors.com', 'https://www.hurlimann-tractors.com/en'],
  'Valmet': ['https://www.valtra.com', 'https://www.valtra.com/en'],
  'Versatile': ['https://www.versatile-ag.com', 'https://www.versatile-ag.com/en'],
  'Steiger': ['https://www.caseih.com', 'https://www.caseih.com/northamerica'],
  'White': ['https://www.agcocorp.com', 'https://www.agcocorp.com'],
  'Oliver': ['https://www.agcocorp.com', 'https://www.agcocorp.com'],
  'Minneapolis-Moline': ['https://www.agcocorp.com', 'https://www.agcocorp.com'],
  'Allis Chalmers': ['https://www.agcocorp.com', 'https://www.agcocorp.com'],
  'Farmall': ['https://www.caseih.com', 'https://www.caseih.com/northamerica'],
  'McCormick-Deering': ['https://www.caseih.com', 'https://www.caseih.com/northamerica'],
  'Massey-Harris': ['https://www.masseyferguson.com', 'https://www.masseyferguson.com/en'],
  'Fordson': ['https://www.ford.com', 'https://www.ford.com'],
  'David Brown': ['https://www.caseih.com', 'https://www.caseih.com/northamerica'],
  'Ferguson': ['https://www.masseyferguson.com', 'https://www.masseyferguson.com/en'],
  'Bolens': ['https://www.bolens.com', 'https://www.bolens.com'],
  'Cockshutt': ['https://www.agcocorp.com', 'https://www.agcocorp.com'],
  'Avery': ['https://www.agcocorp.com', 'https://www.agcocorp.com'],
  'Hart-Parr': ['https://www.agcocorp.com', 'https://www.agcocorp.com'],
  'Minneapolis': ['https://www.agcocorp.com', 'https://www.agcocorp.com'],
  'Advance-Rumely': ['https://www.agcocorp.com', 'https://www.agcocorp.com'],
  'Hesston': ['https://www.agcocorp.com', 'https://www.agcocorp.com'],
  'Century': ['https://www.agcocorp.com', 'https://www.agcocorp.com'],
  'Farm': ['https://www.agcocorp.com', 'https://www.agcocorp.com'],
  'Chamberlain': ['https://www.chamberlain.com.au', 'https://www.chamberlain.com.au'],
  'Ursus': ['https://www.ursus.com.pl', 'https://www.ursus.com.pl/en'],
  'Belarus': ['https://www.belarus-tractor.com', 'https://www.belarus-tractor.com/en'],
  'Zanello': ['https://www.zanello.com.ar', 'https://www.zanello.com.ar/en'],
  'Barreiros': ['https://www.barreiros.com', 'https://www.barreiros.com'],
  'Ebro': ['https://www.ebro.com', 'https://www.ebro.com'],
  'Antonio': ['https://www.antonio.com', 'https://www.antonio.com'],
  'Erkunt': ['https://www.erkunt.com.tr', 'https://www.erkunt.com.tr/en'],
  'Long': ['https://www.longtractor.com', 'https://www.longtractor.com/en'],
  'Chery': ['https://www.chery.com', 'https://www.chery.com/en'],
  'Foton': ['https://www.foton.com.cn', 'https://www.foton.com.cn/en'],
  'Dongfeng': ['https://www.dongfeng.com', 'https://www.dongfeng.com/en'],
  'YTO': ['https://www.yto.com.cn', 'https://www.yto.com.cn/en'],
  'Jinma': ['https://www.jinma.com', 'https://www.jinma.com/en'],
  'Sonalika': ['https://www.sonalika.com', 'https://www.sonalika.com/en'],
  'Swaraj': ['https://www.swarajtractors.com', 'https://www.swarajtractors.com/en'],
  'TAFE': ['https://www.tafe.com', 'https://www.tafe.com/en'],
  'Escorts': ['https://www.escortsgroup.com', 'https://www.escortsgroup.com/en'],
  'Hinomoto': ['https://www.yanmar.com', 'https://www.yanmar.com/global'],
  'Satoh': ['https://www.yanmar.com', 'https://www.yanmar.com/global'],
  'Daedong': ['https://www.daedong.com', 'https://www.daedong.com/en'],
  'Hitachi': ['https://www.hitachi.com', 'https://www.hitachi.com/en'],
  'Mitsubishi': ['https://www.mitsubishi.com', 'https://www.mitsubishi.com/en'],
  'JCB': ['https://www.jcb.com', 'https://www.jcb.com/en'],
  'Lanz': ['https://www.deutz-fahr.com', 'https://www.deutz-fahr.com/en'],
  'Bolinder-Munktell': ['https://www.volvo.com', 'https://www.volvo.com/en'],
  'Volvo': ['https://www.volvo.com', 'https://www.volvo.com/en'],
  'Porsche': ['https://www.porsche.com', 'https://www.porsche.com/en'],
  'Mercedes-Benz': ['https://www.mercedes-benz.com', 'https://www.mercedes-benz.com/en'],
  'Unimog': ['https://www.mercedes-benz.com', 'https://www.mercedes-benz.com/en'],
};

/**
 * Busca el logo en la página web de una marca
 */
async function findBrandLogo(page, brand, websiteUrls) {
  for (const websiteUrl of websiteUrls) {
    try {
      console.log(`  🔍 Buscando logo en: ${websiteUrl}`);
      
      await page.goto(websiteUrl, { 
        waitUntil: 'networkidle2', 
        timeout: 30000 
      });

      // Esperar un poco para que cargue el contenido
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Buscar logo usando múltiples métodos
      let foundLogoUrl = null;

      // Método 1: Buscar en meta tags (Open Graph, Twitter Cards)
      try {
        const ogImage = await page.$('meta[property="og:image"]');
        if (ogImage) {
          const content = await ogImage.evaluate(el => el.getAttribute('content'));
          if (content && (content.includes('logo') || content.includes('brand'))) {
            foundLogoUrl = content.startsWith('http') ? content : new URL(content, websiteUrl).href;
            console.log(`  ✅ Logo encontrado en meta og:image: ${foundLogoUrl}`);
            return foundLogoUrl;
          }
        }
      } catch (e) {}

      // Método 2: Buscar en JSON-LD estructurado
      try {
        const jsonLd = await page.$('script[type="application/ld+json"]');
        if (jsonLd) {
          const jsonText = await jsonLd.evaluate(el => el.textContent);
          const jsonData = JSON.parse(jsonText);
          if (jsonData.logo || (jsonData.organization && jsonData.organization.logo)) {
            foundLogoUrl = jsonData.logo || jsonData.organization.logo;
            if (foundLogoUrl && !foundLogoUrl.startsWith('http')) {
              foundLogoUrl = new URL(foundLogoUrl, websiteUrl).href;
            }
            console.log(`  ✅ Logo encontrado en JSON-LD: ${foundLogoUrl}`);
            return foundLogoUrl;
          }
        }
      } catch (e) {}

      // Método 3: Buscar usando selectores CSS mejorados
      const logoSelectors = [
        'img[alt*="logo" i]',
        'img[alt*="' + brand + '" i]',
        'img[class*="logo" i]',
        'img[id*="logo" i]',
        'img[src*="logo" i]',
        'header img',
        'nav img',
        '.logo img',
        '#logo img',
        '[class*="brand"] img',
        '[id*="brand"] img',
        '[class*="header"] img',
        '[class*="navbar"] img',
        '[class*="nav"] img',
        'a[class*="logo"] img',
        'a[id*="logo"] img',
        'picture img',
        'source[srcset*="logo"]',
        'svg[class*="logo" i]',
        'svg[id*="logo" i]',
        'svg[aria-label*="logo" i]',
        'svg[title*="logo" i]',
      ];

      // Buscar todos los elementos que podrían ser logos
      const logoElements = await page.$$(logoSelectors.join(', '));
      
      for (const logoElement of logoElements) {
        try {
          const tagName = await logoElement.evaluate(el => el.tagName.toLowerCase());
          
          if (tagName === 'img') {
            // Para imágenes
            const src = await logoElement.evaluate(el => 
              el.getAttribute('src') || 
              el.getAttribute('data-src') || 
              el.getAttribute('data-lazy-src') ||
              el.getAttribute('data-original') ||
              el.currentSrc
            );
            
            if (src) {
              let imgUrl = null;
              
              // Convertir URL relativa a absoluta
              if (src.startsWith('//')) {
                imgUrl = 'https:' + src;
              } else if (src.startsWith('/')) {
                const urlObj = new URL(websiteUrl);
                imgUrl = urlObj.origin + src;
              } else if (src.startsWith('http')) {
                imgUrl = src;
              } else {
                const urlObj = new URL(websiteUrl);
                imgUrl = urlObj.origin + '/' + src;
              }

              // Validar que sea una imagen válida (extensión o contiene 'logo')
              if (imgUrl && (imgUrl.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/i) || imgUrl.toLowerCase().includes('logo'))) {
                // Verificar que no sea demasiado pequeño (probablemente no es el logo principal)
                try {
                  const width = await logoElement.evaluate(el => el.naturalWidth || el.width || 0);
                  const height = await logoElement.evaluate(el => el.naturalHeight || el.height || 0);
                  
                  // Si tiene dimensiones razonables o es el primer logo encontrado
                  if (width > 50 || height > 50 || !foundLogoUrl) {
                    foundLogoUrl = imgUrl;
                  }
                } catch (e) {
                  if (!foundLogoUrl) foundLogoUrl = imgUrl;
                }
              }
            }
          } else if (tagName === 'source') {
            // Para elementos source con srcset
            const srcset = await logoElement.evaluate(el => el.getAttribute('srcset'));
            if (srcset) {
              const firstSrc = srcset.split(',')[0].trim().split(' ')[0];
              if (firstSrc && (firstSrc.includes('logo') || firstSrc.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i))) {
                let srcUrl = firstSrc.startsWith('http') ? firstSrc : new URL(firstSrc, websiteUrl).href;
                if (!foundLogoUrl) foundLogoUrl = srcUrl;
              }
            }
          } else if (tagName === 'svg') {
            // Para SVG inline, buscar el SVG más grande o el primero
            try {
              const bbox = await logoElement.evaluate(el => {
                try {
                  return el.getBBox();
                } catch {
                  return { width: 0, height: 0 };
                }
              });
              
              if (bbox.width > 50 || bbox.height > 50 || !foundLogoUrl) {
                // Para SVG inline, crear un data URL o usar la página
                // Por ahora, marcar que hay SVG pero continuar buscando una imagen
                if (!foundLogoUrl) {
                  // Intentar buscar un uso de SVG como imagen
                  const svgParent = await logoElement.evaluateHandle(el => el.closest('a, div, header, nav'));
                  if (svgParent) {
                    const parentImg = await page.evaluateHandle(el => {
                      const img = el.querySelector('img[src*="logo"]');
                      return img ? img.src : null;
                    }, svgParent);
                    
                    if (parentImg) {
                      const imgSrc = await parentImg.jsonValue();
                      if (imgSrc) {
                        foundLogoUrl = imgSrc.startsWith('http') ? imgSrc : new URL(imgSrc, websiteUrl).href;
                      }
                    }
                  }
                }
              }
            } catch (e) {}
          }
        } catch (err) {
          // Continuar con el siguiente elemento
        }
      }

      // Si encontramos un logo, retornarlo
      if (foundLogoUrl) {
        console.log(`  ✅ Logo encontrado: ${foundLogoUrl}`);
        return foundLogoUrl;
      }

      // Método 4: Buscar en el HTML directamente con regex mejorado
      if (!foundLogoUrl) {
        const html = await page.content();
        
        // Buscar URLs de logos en el HTML
        const logoPatterns = [
          /<img[^>]*(?:logo|brand)[^>]*src=["']([^"']+)["']/gi,
          /<img[^>]*src=["']([^"']*logo[^"']*)["']/gi,
          /<img[^>]*data-src=["']([^"']*logo[^"']*)["']/gi,
          /og:image["'\s]*content=["']([^"']+)["']/gi,
          /"logo":\s*["']([^"']+)["']/gi,
        ];

        for (const pattern of logoPatterns) {
          const matches = html.matchAll(pattern);
          for (const match of matches) {
            if (match[1]) {
              let foundUrl = match[1];
              
              // Convertir URL relativa a absoluta
              if (foundUrl.startsWith('//')) {
                foundUrl = 'https:' + foundUrl;
              } else if (foundUrl.startsWith('/')) {
                const urlObj = new URL(websiteUrl);
                foundUrl = urlObj.origin + foundUrl;
              } else if (!foundUrl.startsWith('http')) {
                const urlObj = new URL(websiteUrl);
                foundUrl = urlObj.origin + '/' + foundUrl;
              }

              if (foundUrl && (foundUrl.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/i) || foundUrl.toLowerCase().includes('logo'))) {
                foundLogoUrl = foundUrl;
                console.log(`  ✅ Logo encontrado en HTML: ${foundLogoUrl}`);
                return foundLogoUrl;
              }
            }
          }
        }
      }

    } catch (error) {
      // Ignorar errores específicos y continuar
      const errorMsg = error.message.toLowerCase();
      if (errorMsg.includes('timeout') || errorMsg.includes('navigation') || errorMsg.includes('net::')) {
        console.log(`  ⚠️  Error de conexión en ${websiteUrl}: ${error.message}`);
      } else {
        console.log(`  ⚠️  Error al buscar en ${websiteUrl}: ${error.message}`);
      }
      continue;
    }
  }

  return null;
}

/**
 * Función principal
 */
async function main() {
  // Permitir reintentar fallos pasando --retry-failed
  const retryFailed = process.argv.includes('--retry-failed') || process.argv.includes('-r');
  const skipProcessed = !process.argv.includes('--force') && !process.argv.includes('-f');

  // Cargar progreso anterior si existe
  let progress = { processed: [], failed: [] };
  if (await fs.pathExists(PROGRESS_FILE)) {
    progress = await fs.readJson(PROGRESS_FILE);
  }

  // Cargar logos existentes
  let brandLogos = {};
  if (await fs.pathExists(BRAND_LOGOS_FILE)) {
    brandLogos = await fs.readJson(BRAND_LOGOS_FILE);
  }

  // Obtener todas las marcas únicas desde tractors.ts
  // Leer el archivo y ejecutar el código para obtener las marcas
  const tractorsPath = path.join(__dirname, '..', 'data', 'tractors.ts');
  const tractorsContent = await fs.readFile(tractorsPath, 'utf-8');
  
  // Extraer el array de tractores y obtener marcas únicas
  // Usar una aproximación más simple: leer processed-tractors.ts y extraer marcas
  const processedTractorsPath = path.join(__dirname, '..', 'data', 'processed-tractors.ts');
  const processedContent = await fs.readFile(processedTractorsPath, 'utf-8');
  
  // Extraer el array JSON de tractores
  const match = processedContent.match(/export const scrapedTractors: Tractor\[\] = (\[[\s\S]*?\]);/);
  if (!match) {
    console.error('❌ No se pudo extraer el array de tractores');
    return;
  }
  
  const tractors = JSON.parse(match[1]);
  
  // Obtener marcas únicas y normalizadas
  const brandSet = new Set();
  tractors.forEach(tractor => {
    let brand = tractor.brand;
    // Normalizar variantes de Case IH
    if (brand === 'CaseIH' || brand === 'Case' || brand === 'J.I. Case' || brand === 'J.I Case') {
      brand = 'Case IH';
    }
    // Normalizar John Deere
    if (brand === 'John' && tractor.model && tractor.model.startsWith('Deere ')) {
      brand = 'John Deere';
    }
    // Normalizar New Holland
    if (brand === 'New' && tractor.model && tractor.model.startsWith('Holland ')) {
      brand = 'New Holland';
    }
    // Normalizar Massey Ferguson
    if (brand === 'Massey' && tractor.model && tractor.model.startsWith('Ferguson ')) {
      brand = 'Massey Ferguson';
    }
    brandSet.add(brand);
  });
  
  let brands = Array.from(brandSet).sort();

  // Filtrar según opciones
  if (retryFailed) {
    brands = brands.filter(brand => progress.failed.includes(brand));
    console.log(`🔄 Modo: Reintentar fallos (${brands.length} marcas)`);
  } else if (!skipProcessed) {
    console.log(`🔄 Modo: Forzar actualización de todas las marcas`);
  }

  console.log(`📊 Total de marcas a procesar: ${brands.length}`);
  console.log(`✅ Ya procesadas: ${progress.processed.length}`);
  console.log(`❌ Fallidas: ${progress.failed.length}\n`);
  if (retryFailed) {
    console.log(`💡 Usa --force o -f para procesar todas las marcas incluyendo las ya procesadas\n`);
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-features=IsolateOrigins,site-per-process'
    ],
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  // Ignorar errores de recursos bloqueados
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const resourceType = req.resourceType();
    if (['image', 'stylesheet', 'font'].includes(resourceType) && !req.url().includes('logo')) {
      req.abort();
    } else {
      req.continue();
    }
  });

  let processed = 0;
  let found = 0;
  let failed = 0;

  for (const brand of brands) {
    // Saltar si ya fue procesada (a menos que sea modo force)
    if (skipProcessed && (progress.processed.includes(brand) || brandLogos[brand])) {
      console.log(`⏭️  Saltando ${brand} (ya procesada)`);
      continue;
    }

    // Si no es modo retry, saltar las que fallaron
    if (!retryFailed && progress.failed.includes(brand) && !skipProcessed) {
      console.log(`⏭️  Saltando ${brand} (falló anteriormente, usa --retry-failed para reintentar)`);
      continue;
    }

    console.log(`\n🔍 Procesando: ${brand}`);

    try {
      // Buscar URLs conocidas o generar búsqueda
      let websiteUrls = BRAND_WEBSITES[brand] || [];
      
      // Si no hay URLs conocidas, intentar buscar en Google
      if (websiteUrls.length === 0) {
        console.log(`  🔎 Buscando página oficial de ${brand}...`);
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(brand + ' official website tractor')}`;
        
        try {
          await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
          await new Promise(resolve => setTimeout(resolve, 3000));

          // Buscar resultados de búsqueda de Google
          const searchResults = await page.$$eval('a[href^="http"]', links => {
            return links
              .map(link => link.href)
              .filter(href => {
                // Filtrar URLs de Google y redes sociales
                const excludeDomains = ['google.com', 'youtube.com', 'facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com', 'wikipedia.org'];
                return !excludeDomains.some(domain => href.includes(domain));
              })
              .slice(0, 3); // Primeros 3 resultados
          });

          if (searchResults && searchResults.length > 0) {
            websiteUrls = searchResults;
            console.log(`  ✅ URLs encontradas: ${searchResults.join(', ')}`);
          }
        } catch (err) {
          console.log(`  ⚠️  Error en búsqueda: ${err.message}`);
        }
      }

      if (websiteUrls.length === 0) {
        console.log(`  ⚠️  No se encontraron URLs para ${brand}`);
        progress.failed.push(brand);
        failed++;
        await fs.writeJson(PROGRESS_FILE, progress, { spaces: 2 });
        continue;
      }

      // Buscar el logo
      const logoUrl = await findBrandLogo(page, brand, websiteUrls);

      if (logoUrl) {
        brandLogos[brand] = logoUrl;
        
        // Remover de la lista de fallidos si estaba ahí
        const failedIndex = progress.failed.indexOf(brand);
        if (failedIndex > -1) {
          progress.failed.splice(failedIndex, 1);
        }
        
        // Agregar a procesados si no estaba
        if (!progress.processed.includes(brand)) {
          progress.processed.push(brand);
        }
        
        found++;
        console.log(`  ✅ Logo guardado para ${brand}: ${logoUrl}`);
      } else {
        console.log(`  ❌ No se encontró logo para ${brand}`);
        
        // Solo agregar a fallidos si no está ya procesado
        if (!progress.processed.includes(brand) && !progress.failed.includes(brand)) {
          progress.failed.push(brand);
        }
        
        failed++;
      }

      processed++;

      // Guardar progreso cada 5 marcas
      if (processed % 5 === 0) {
        await fs.writeJson(BRAND_LOGOS_FILE, brandLogos, { spaces: 2 });
        await fs.writeJson(PROGRESS_FILE, progress, { spaces: 2 });
        console.log(`  💾 Progreso guardado (${processed} procesadas, ${found} encontradas, ${failed} fallidas)`);
      }

      // Esperar entre peticiones para no sobrecargar (delay aleatorio entre 1-3 segundos)
      const delay = 1000 + Math.random() * 2000;
      await new Promise(resolve => setTimeout(resolve, delay));

    } catch (error) {
      console.error(`  ❌ Error procesando ${brand}:`, error.message);
      
      // Solo agregar a fallidos si no está ya procesado
      if (!progress.processed.includes(brand) && !progress.failed.includes(brand)) {
        progress.failed.push(brand);
      }
      
      failed++;
      
      // Esperar un poco más después de un error
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  // Guardar resultados finales
  await fs.writeJson(BRAND_LOGOS_FILE, brandLogos, { spaces: 2 });
  await fs.writeJson(PROGRESS_FILE, progress, { spaces: 2 });

  await browser.close();

  console.log(`\n✅ Proceso completado:`);
  console.log(`   📊 Total procesadas: ${processed}`);
  console.log(`   ✅ Logos encontrados: ${found}`);
  console.log(`   ❌ Fallidas: ${failed}`);
  console.log(`\n💾 Resultados guardados en: ${BRAND_LOGOS_FILE}`);
  console.log(`\n💡 Para reintentar las marcas que fallaron, ejecuta:`);
  console.log(`   npm run find-brand-logos -- --retry-failed`);
  console.log(`\n💡 Para procesar todas las marcas (incluyendo ya procesadas):`);
  console.log(`   npm run find-brand-logos -- --force`);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };



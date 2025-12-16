/**
 * Script para extraer datos de tractores desde TractorData.com
 * 
 * IMPORTANTE: Este script es solo para uso educativo y desarrollo.
 * Respeta los términos de servicio de TractorData.com y no sobrecargues sus servidores.
 * 
 * Instalación:
 * npm install puppeteer cheerio axios fs-extra
 */

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'scraped-tractors.json');

// Función para crear slug desde marca y modelo
function createSlug(brand, model) {
  return `${brand.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${model.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
}

// Helper para pausar
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Función para parsear especificaciones desde una página de tractor
async function scrapeTractorPage(page, url) {
  try {
    console.log(`  Scrapeando: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await delay(2000); // Pausa para evitar rate limiting

    const content = await page.content();
    const $ = cheerio.load(content);

    // Extraer información básica
    const title = $('h1').first().text().trim();
    const parts = title.split(' ');
    const brand = parts[0] || 'Unknown';
    const model = parts.slice(1).join(' ') || 'Unknown';

    const tractor = {
      id: createSlug(brand, model),
      brand: brand,
      model: model,
      slug: createSlug(brand, model),
      type: url.includes('/lawn-tractors/') ? 'lawn' : url.includes('/farm-tractors/') ? 'farm' : 'industrial',
      imageUrl: '',
      engine: {
        cylinders: 0,
        powerHP: 0,
        fuelType: 'diesel',
        cooling: 'liquid',
      },
      transmission: {
        type: 'manual',
        gears: 0,
      },
    };

    // Intentar extraer año si está disponible
    const yearMatch = title.match(/\b(19|20)\d{2}\b/);
    if (yearMatch) {
      tractor.year = parseInt(yearMatch[0]);
    }

    // Extraer especificaciones de la tabla
    $('table tr').each((i, elem) => {
      const $row = $(elem);
      const label = $row.find('td:first-child, th:first-child').text().trim().toLowerCase();
      const value = $row.find('td:last-child, th:last-child').text().trim();

      // Motor - Potencia
      if (label.includes('engine') || label.includes('power') || label.includes('hp')) {
        const hpMatch = value.match(/(\d+(?:\.\d+)?)\s*(?:hp|HP)/i);
        if (hpMatch) {
          tractor.engine.powerHP = parseFloat(hpMatch[1]);
        }
        const kwMatch = value.match(/(\d+(?:\.\d+)?)\s*(?:kw|kW)/i);
        if (kwMatch) {
          tractor.engine.powerKW = parseFloat(kwMatch[1]);
        }
      }

      // Cilindros
      if (label.includes('cylinder')) {
        const cylMatch = value.match(/(\d+)/);
        if (cylMatch) {
          tractor.engine.cylinders = parseInt(cylMatch[1]);
        }
      }

      // Combustible
      if (label.includes('fuel')) {
        if (value.toLowerCase().includes('diesel')) {
          tractor.engine.fuelType = 'diesel';
        } else if (value.toLowerCase().includes('gasoline') || value.toLowerCase().includes('gas')) {
          tractor.engine.fuelType = 'gasoline';
        }
      }

      // Transmisión
      if (label.includes('transmission')) {
        const transValue = value.toLowerCase();
        if (transValue.includes('hydrostatic')) {
          tractor.transmission.type = 'hydrostatic';
        } else if (transValue.includes('powershift')) {
          tractor.transmission.type = 'powershift';
        } else if (transValue.includes('cvt')) {
          tractor.transmission.type = 'cvt';
        }
      }

      // Peso
      if (label.includes('weight')) {
        const weightMatch = value.match(/(\d+(?:,\d+)?)\s*(?:kg|lb)/i);
        if (weightMatch) {
          let weight = parseFloat(weightMatch[1].replace(/,/g, ''));
          if (value.toLowerCase().includes('lb')) {
            weight = weight * 0.453592; // Convertir libras a kg
          }
          tractor.weight = Math.round(weight);
        }
      }
    });

    // Intentar extraer imagen
    const imageSrc = $('img[src*="tractor"], img[alt*="tractor"]').first().attr('src');
    if (imageSrc && !imageSrc.startsWith('data:')) {
      if (imageSrc.startsWith('http')) {
        tractor.imageUrl = imageSrc;
      } else {
        tractor.imageUrl = `https://www.tractordata.com${imageSrc}`;
      }
    }

    return tractor;
  } catch (error) {
    console.error(`  Error scrapeando ${url}: ${error.message}`);
    return null;
  }
}

// Función para obtener enlaces de tractores desde una página de listado
async function getTractorLinks(page, listUrl) {
  try {
    console.log(`Obteniendo enlaces desde: ${listUrl}`);
    await page.goto(listUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await delay(3000); // Más tiempo para que cargue

    // Obtener todos los enlaces de la página usando múltiples métodos
    const links = await page.evaluate(() => {
      const tractorLinks = [];
      const seen = new Set();
      
      // Método 1: Buscar todos los enlaces que contengan patrones de tractores
      const allLinks = Array.from(document.querySelectorAll('a[href]'));
      
      allLinks.forEach(link => {
        let href = link.getAttribute('href');
        if (!href) return;
        
        // Normalizar la URL
        if (href.startsWith('/')) {
          href = `https://www.tractordata.com${href}`;
        } else if (!href.startsWith('http')) {
          return; // Skip relative paths sin /
        }
        
        // Filtrar SOLO enlaces de tractores individuales
        // Patrón exacto: /farm-tractors/000/X/X/XXXX-brand-model.html
        // Debe tener exactamente este formato con números en las posiciones correctas
        const tractorPattern = /\/(farm-tractors|lawn-tractors)\/\d{3}\/\d+\/\d+\/\d+-[\w-]+\.html$/i;
        if (tractorPattern.test(href) && !seen.has(href)) {
          // Validar que no sea una página de listado (ej: tractors.html, index.html)
          if (!href.includes('/index.html') && 
              !href.includes('/tractors.html') && 
              !href.includes('/shows/') &&
              !href.includes('/tractor-brands/')) {
            seen.add(href);
            tractorLinks.push(href);
          }
        }
      });

      // Nota: El método 2 (backup) fue removido porque capturaba enlaces incorrectos
      // Solo usamos el método 1 que filtra por patrón exacto

      return tractorLinks;
    });

    console.log(`  Encontrados ${links.length} enlaces potenciales`);
    
    // Si no encontramos enlaces, intentar guardar el HTML para debugging
    if (links.length === 0) {
      const html = await page.content();
      const debugFile = path.join(__dirname, '..', 'debug-page.html');
      await fs.writeFile(debugFile, html);
      console.log(`  ⚠️  No se encontraron enlaces. HTML guardado en ${debugFile} para debugging.`);
    }
    
    return links;
  } catch (error) {
    console.error(`Error obteniendo enlaces desde ${listUrl}: ${error.message}`);
    console.error(error.stack);
    return [];
  }
}

// Función principal
async function main() {
  console.log('🚀 Iniciando scraping de TractorData.com...\n');
  console.log('⚠️  NOTA: Este proceso puede tardar varias horas debido a la cantidad de tractores.');
  console.log('⚠️  Se incluyen pausas para no sobrecargar el servidor.\n');

  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  // Configurar user agent
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

  const allTractors = [];
  const processedUrls = new Set();

  try {
    // Estrategia: Primero obtener URLs de páginas de marcas desde la página principal
    // Luego desde cada página de marca obtener los tractores individuales
    
    const mainPage = 'https://www.tractordata.com/farm-tractors/index.html';
    
    // URLs conocidas de tractores individuales para pruebas iniciales
    const knownTractorUrls = [
      'https://www.tractordata.com/farm-tractors/000/3/8/3865-john-deere-8245r.html',
      'https://www.tractordata.com/farm-tractors/000/2/7/2724-kubota-m7-171.html',
    ];
    
    // URLs de páginas de marcas principales (para cuando funcione)
    const mainBrandPages = [
      'https://www.tractordata.com/farm-tractors/tractor-brands/johndeere/johndeere-tractors.html',
      'https://www.tractordata.com/farm-tractors/tractor-brands/kubota/kubota-tractors.html',
      'https://www.tractordata.com/farm-tractors/tractor-brands/newholland/newholland-tractors.html',
      'https://www.tractordata.com/farm-tractors/tractor-brands/caseih/caseih-tractors.html',
      'https://www.tractordata.com/farm-tractors/tractor-brands/masseyferguson/masseyferguson-tractors.html',
    ];

    // Primero probar con URLs conocidas para verificar que funciona
    console.log(`\n🔍 Probando con ${knownTractorUrls.length} tractores conocidos primero...`);
    for (const tractorUrl of knownTractorUrls) {
      if (processedUrls.has(tractorUrl)) continue;
      processedUrls.add(tractorUrl);
      
      const tractor = await scrapeTractorPage(page, tractorUrl);
      if (tractor && tractor.brand !== 'Unknown') {
        allTractors.push(tractor);
        console.log(`  ✅ ${tractor.brand} ${tractor.model}`);
      }
      await delay(2000);
    }
    
    // Luego obtener enlaces desde páginas de marcas principales
    console.log(`\n📋 Obteniendo tractores desde páginas de marcas...`);
    for (const brandUrl of mainBrandPages) {
      console.log(`\n📋 Procesando página: ${brandUrl}`);
      const links = await getTractorLinks(page, brandUrl);
      console.log(`  Encontrados ${links.length} enlaces totales`);

      // Filtrar solo enlaces válidos de tractores individuales
      const validTractorLinks = links.filter(link => {
        // Patrón: /farm-tractors/000/X/X/XXXX-brand-model.html
        return /\/(farm-tractors|lawn-tractors)\/\d{3}\/\d+\/\d+\/\d+-[\w-]+\.html$/i.test(link) &&
               !link.includes('/index.html') &&
               !link.includes('/tractors.html') &&
               !link.includes('/shows/') &&
               !link.includes('/tractor-brands/');
      });
      
      console.log(`  ✅ ${validTractorLinks.length} enlaces válidos de tractores individuales`);
      
      // Limitar para pruebas - cambiar a validTractorLinks para obtener todos
      const linksToProcess = validTractorLinks.slice(0, 10); // Solo primeros 10 para prueba
      // const linksToProcess = validTractorLinks; // Descomenta para obtener TODOS

      for (const link of linksToProcess) {
        if (processedUrls.has(link)) {
          continue;
        }
        processedUrls.add(link);

        const tractor = await scrapeTractorPage(page, link);
        if (tractor && tractor.brand !== 'Unknown') {
          allTractors.push(tractor);
          console.log(`  ✅ ${tractor.brand} ${tractor.model}`);
        }

        // Pausa entre requests
        await delay(3000);
      }
    }

    // Guardar resultados
    await fs.ensureDir(path.dirname(OUTPUT_FILE));
    await fs.writeJson(OUTPUT_FILE, allTractors, { spaces: 2 });
    console.log(`\n✅ Scraping completado!`);
    console.log(`📊 Total de tractores extraídos: ${allTractors.length}`);
    console.log(`💾 Datos guardados en: ${OUTPUT_FILE}`);

  } catch (error) {
    console.error('Error durante el scraping:', error);
  } finally {
    await browser.close();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { scrapeTractorPage, getTractorLinks };


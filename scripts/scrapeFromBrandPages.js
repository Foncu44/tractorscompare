/**
 * Script mejorado que navega primero a páginas de marcas
 * y desde ahí extrae los tractores individuales
 */

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'scraped-tractors.json');

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createSlug(brand, model) {
  return `${brand.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${model.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
}

// Páginas de marcas principales (estas URLs existen según el HTML)
const brandPages = [
  'https://www.tractordata.com/farm-tractors/tractor-brands/johndeere/johndeere-tractors.html',
  'https://www.tractordata.com/farm-tractors/tractor-brands/kubota/kubota-tractors.html',
  'https://www.tractordata.com/farm-tractors/tractor-brands/newholland/newholland-tractors.html',
  'https://www.tractordata.com/farm-tractors/tractor-brands/caseih/caseih-tractors.html',
  'https://www.tractordata.com/farm-tractors/tractor-brands/masseyferguson/masseyferguson-tractors.html',
];

async function getTractorsFromBrandPage(page, brandUrl) {
  try {
    console.log(`\n📋 Obteniendo tractores desde: ${brandUrl}`);
    await page.goto(brandUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    await delay(5000);
    
    const links = await page.evaluate(() => {
      const tractorLinks = [];
      const seen = new Set();
      
      const allLinks = Array.from(document.querySelectorAll('a[href]'));
      
      allLinks.forEach(link => {
        let href = link.getAttribute('href');
        if (!href) return;
        
        // Normalizar URL
        if (href.startsWith('/')) {
          href = `https://www.tractordata.com${href}`;
        } else if (!href.startsWith('http')) {
          return;
        }
        
        // Buscar enlaces con el patrón de tractor individual
        // Patrón: /farm-tractors/000/X/X/XXXX-brand-model.html
        const tractorPattern = /\/(farm-tractors|lawn-tractors)\/\d{3}\/\d+\/\d+\/\d+-[\w-]+\.html$/i;
        
        if (tractorPattern.test(href) && !seen.has(href)) {
          seen.add(href);
          tractorLinks.push(href);
        }
      });
      
      return tractorLinks;
    });
    
    console.log(`  ✅ Encontrados ${links.length} tractores en esta marca`);
    return links;
    
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    return [];
  }
}

async function scrapeTractorPage(page, url) {
  try {
    console.log(`  Scrapeando: ${url.substring(url.lastIndexOf('/') + 1)}`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await delay(2000);
    
    const content = await page.content();
    const $ = cheerio.load(content);
    
    const title = $('h1').first().text().trim();
    if (title.includes('Page not found') || !title) {
      return null;
    }
    
    const parts = title.split(' ');
    const brand = parts[0] || 'Unknown';
    const model = parts.slice(1).join(' ') || 'Unknown';
    
    const tractor = {
      id: createSlug(brand, model),
      brand: brand,
      model: model,
      slug: createSlug(brand, model),
      type: url.includes('/lawn-tractors/') ? 'lawn' : 'farm',
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
    
    // Extraer año
    const yearMatch = title.match(/\b(19|20)\d{2}\b/);
    if (yearMatch) {
      tractor.year = parseInt(yearMatch[0]);
    }
    
    // Extraer especificaciones de tablas
    $('table tr').each((i, elem) => {
      const $row = $(elem);
      const label = $row.find('td:first-child, th:first-child').text().trim().toLowerCase();
      const value = $row.find('td:last-child, th:last-child').text().trim();
      
      // Potencia HP
      if (label.includes('power') || label.includes('hp') || label.includes('horsepower')) {
        const hpMatch = value.match(/(\d+(?:\.\d+)?)\s*(?:hp|HP)/i);
        if (hpMatch) {
          tractor.engine.powerHP = parseFloat(hpMatch[1]);
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
            weight = weight * 0.453592;
          }
          tractor.weight = Math.round(weight);
        }
      }
    });
    
    return tractor.engine.powerHP > 0 ? tractor : null;
    
  } catch (error) {
    console.error(`  ❌ Error scrapeando: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('🚀 Iniciando scraping mejorado desde páginas de marcas...\n');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
  
  const allTractors = [];
  const processedUrls = new Set();
  
  try {
    for (const brandUrl of brandPages) {
      // Obtener enlaces de tractores desde la página de la marca
      const tractorUrls = await getTractorsFromBrandPage(page, brandUrl);
      
      // Limitar para pruebas
      const urlsToProcess = tractorUrls; // Primeros 20 para prueba
      
      console.log(`  Procesando ${urlsToProcess.length} tractores...`);
      
      for (const tractorUrl of urlsToProcess) {
        if (processedUrls.has(tractorUrl)) continue;
        processedUrls.add(tractorUrl);
        
        const tractor = await scrapeTractorPage(page, tractorUrl);
        if (tractor && tractor.brand !== 'Unknown') {
          allTractors.push(tractor);
          console.log(`    ✅ ${tractor.brand} ${tractor.model} (${tractor.engine.powerHP} HP)`);
        }
        
        await delay(3000); // Pausa entre requests
      }
    }
    
    // Guardar resultados
    await fs.ensureDir(path.dirname(OUTPUT_FILE));
    await fs.writeJson(OUTPUT_FILE, allTractors, { spaces: 2 });
    
    console.log(`\n✅ Scraping completado!`);
    console.log(`📊 Total de tractores extraídos: ${allTractors.length}`);
    console.log(`💾 Datos guardados en: ${OUTPUT_FILE}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };


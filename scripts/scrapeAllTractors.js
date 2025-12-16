/**
 * Script completo para extraer TODOS los tractores de TractorData.com
 * 
 * Proceso:
 * 1. Obtiene todas las marcas de la página principal
 * 2. Para cada marca, obtiene todos los tractores
 * 3. Para cada tractor, extrae especificaciones completas
 * 4. Guarda los datos de forma incremental
 */

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'scraped-tractors.json');
const BRANDS_FILE = path.join(__dirname, '..', 'data', 'scraped-brands.json');
const PROGRESS_FILE = path.join(__dirname, '..', 'data', 'scraping-progress.json');

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createSlug(brand, model) {
  return `${brand.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${model.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
}

/**
 * Extrae todas las marcas de la página principal
 */
async function getAllBrands(page) {
  try {
    console.log('\n📋 Obteniendo todas las marcas desde la página principal...');
    await page.goto('https://www.tractordata.com/farm-tractors/index.html', { 
      waitUntil: 'networkidle2', 
      timeout: 60000 
    });
    await delay(5000);

    const brands = await page.evaluate(() => {
      const brandLinks = [];
      const seen = new Set();
      
      // Buscar todos los enlaces de marcas en la tabla
      const links = Array.from(document.querySelectorAll('a[href]'));
      
      links.forEach(link => {
        let href = link.getAttribute('href');
        if (!href) return;
        
        // Normalizar URL
        if (href.startsWith('/')) {
          href = `https://www.tractordata.com${href}`;
        }
        
        // Buscar enlaces de marcas: /farm-tractors/tractor-brands/[brand]/[brand]-tractors.html
        const brandPattern = /\/farm-tractors\/tractor-brands\/[\w-]+\/[\w-]+-tractors\.html$/i;
        
        if (brandPattern.test(href) && !seen.has(href)) {
          seen.add(href);
          
          // Extraer nombre de la marca del texto del enlace o URL
          const linkText = link.textContent.trim();
          const brandName = linkText || href.match(/\/([\w-]+)-tractors\.html$/)?.[1]?.replace(/-/g, ' ') || 'Unknown';
          
          brandLinks.push({
            name: brandName,
            url: href,
          });
        }
      });
      
      return brandLinks;
    });
    
    console.log(`  ✅ Encontradas ${brands.length} marcas`);
    return brands;
    
  } catch (error) {
    console.error(`  ❌ Error obteniendo marcas: ${error.message}`);
    return [];
  }
}

/**
 * Obtiene todos los enlaces de tractores desde una página de marca
 */
async function getTractorsFromBrandPage(page, brandUrl) {
  try {
    await page.goto(brandUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    await delay(3000);
    
    // Verificar si hay paginación
    let allLinks = [];
    let currentPage = 1;
    let hasMorePages = true;
    
    while (hasMorePages && currentPage <= 10) { // Limitar a 10 páginas por marca
      const links = await page.evaluate(() => {
        const tractorLinks = [];
        const seen = new Set();
        
        const allLinks = Array.from(document.querySelectorAll('a[href]'));
        
        allLinks.forEach(link => {
          let href = link.getAttribute('href');
          if (!href) return;
          
          if (href.startsWith('/')) {
            href = `https://www.tractordata.com${href}`;
          } else if (!href.startsWith('http')) {
            return;
          }
          
          // Patrón de tractor individual: /farm-tractors/, /lawn-tractors/, o /industrial-tractors/
          const tractorPattern = /\/(farm-tractors|lawn-tractors|industrial-tractors)\/\d{3}\/\d+\/\d+\/\d+-[\w-]+\.html$/i;
          
          if (tractorPattern.test(href) && !seen.has(href)) {
            seen.add(href);
            tractorLinks.push(href);
          }
        });
        
        return tractorLinks;
      });
      
      allLinks.push(...links);
      
      // Verificar si hay siguiente página
      const nextPageUrl = await page.evaluate(() => {
        const nextLink = Array.from(document.querySelectorAll('a')).find(a => {
          const text = a.textContent.trim().toLowerCase();
          return text === 'next' || text === '>' || text.includes('next page');
        });
        return nextLink ? nextLink.getAttribute('href') : null;
      });
      
      if (nextPageUrl) {
        const fullNextUrl = nextPageUrl.startsWith('http') 
          ? nextPageUrl 
          : `https://www.tractordata.com${nextPageUrl}`;
        await page.goto(fullNextUrl, { waitUntil: 'networkidle2', timeout: 30000 });
        await delay(2000);
        currentPage++;
      } else {
        hasMorePages = false;
      }
    }
    
    return [...new Set(allLinks)]; // Eliminar duplicados
    
  } catch (error) {
    console.error(`  ❌ Error obteniendo tractores de marca: ${error.message}`);
    return [];
  }
}

/**
 * Extrae especificaciones completas de una página de tractor
 */
async function scrapeTractorPage(page, url) {
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await delay(2000);
    
    const content = await page.content();
    const $ = cheerio.load(content);
    
    const title = $('h1').first().text().trim();
    if (title.includes('Page not found') || !title || title === '') {
      return null;
    }
    
    // Parsear título para obtener marca y modelo
    let brand = 'Unknown';
    let model = 'Unknown';
    let year = null;
    
    // Intentar extraer año del título
    const yearMatch = title.match(/\b(19|20)\d{2}\b/);
    if (yearMatch) {
      year = parseInt(yearMatch[0]);
    }
    
    // Separar marca y modelo (formato típico: "Brand Model Year" o "Brand Model")
    const titleParts = title.replace(/\b(19|20)\d{2}\b/, '').trim().split(/\s+/);
    
    // Buscar nombres de marcas conocidas compuestas
    const compoundBrands = ['John Deere', 'New Holland', 'Case IH', 'Massey Ferguson', 'David Brown', 'Deutz-Fahr', 'Allis Chalmers', 'International Harvester', 'Minneapolis-Moline'];
    
    let brandFound = false;
    for (const compoundBrand of compoundBrands) {
      if (title.toLowerCase().includes(compoundBrand.toLowerCase())) {
        brand = compoundBrand;
        const brandParts = compoundBrand.split(/\s+/);
        model = titleParts.slice(brandParts.length).join(' ').trim();
        brandFound = true;
        break;
      }
    }
    
    if (!brandFound && titleParts.length > 0) {
      brand = titleParts[0];
      model = titleParts.slice(1).join(' ').trim();
    }
    
    if (!model || model === '') {
      model = 'Unknown';
    }
    
    const tractor = {
      id: createSlug(brand, model),
      brand: brand,
      model: model,
      slug: createSlug(brand, model),
      type: url.includes('/lawn-tractors/') ? 'lawn' : 
            url.includes('/industrial-tractors/') ? 'industrial' : 'farm',
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
    
    if (year) {
      tractor.year = year;
    }
    
    // Extraer todas las especificaciones de las tablas
    $('table tr').each((i, elem) => {
      const $row = $(elem);
      const label = $row.find('td:first-child, th:first-child').text().trim().toLowerCase();
      const value = $row.find('td:last-child, th:last-child').text().trim();
      
      // Potencia HP
      if ((label.includes('power') || label.includes('hp') || label.includes('horsepower')) && !label.includes('pto')) {
        const hpMatch = value.match(/(\d+(?:\.\d+)?)\s*(?:hp|HP)/i);
        if (hpMatch) {
          tractor.engine.powerHP = parseFloat(hpMatch[1]);
          // Convertir kW a HP si es necesario
          if (value.toLowerCase().includes('kw')) {
            const kwMatch = value.match(/(\d+(?:\.\d+)?)\s*(?:kw|kW)/i);
            if (kwMatch) {
              tractor.engine.powerKW = parseFloat(kwMatch[1]);
              if (!tractor.engine.powerHP) {
                tractor.engine.powerHP = Math.round(parseFloat(kwMatch[1]) * 1.34102);
              }
            }
          }
        }
      }
      
      // Potencia PTO
      if (label.includes('pto') && (label.includes('power') || label.includes('hp'))) {
        const ptoMatch = value.match(/(\d+(?:\.\d+)?)\s*(?:hp|HP)/i);
        if (ptoMatch) {
          tractor.ptoHP = parseFloat(ptoMatch[1]);
        }
      }
      
      // RPM PTO
      if (label.includes('pto') && label.includes('rpm')) {
        const rpmMatch = value.match(/(\d+)/);
        if (rpmMatch) {
          tractor.ptoRPM = parseInt(rpmMatch[1]);
        }
      }
      
      // Cilindros
      if (label.includes('cylinder')) {
        const cylMatch = value.match(/(\d+)/);
        if (cylMatch) {
          tractor.engine.cylinders = parseInt(cylMatch[1]);
        }
      }
      
      // Cilindrada
      if (label.includes('displacement') || label.includes('engine size')) {
        const dispMatch = value.match(/(\d+(?:\.\d+)?)\s*(?:l|L|liters?|litres?)/i);
        if (dispMatch) {
          tractor.engine.displacement = parseFloat(dispMatch[1]);
        }
      }
      
      // Combustible
      if (label.includes('fuel')) {
        const fuelValue = value.toLowerCase();
        if (fuelValue.includes('diesel')) {
          tractor.engine.fuelType = 'diesel';
        } else if (fuelValue.includes('gasoline') || fuelValue.includes('gas') || fuelValue.includes('petrol')) {
          tractor.engine.fuelType = 'gasoline';
        } else if (fuelValue.includes('electric')) {
          tractor.engine.fuelType = 'electric';
        }
      }
      
      // Refrigeración
      if (label.includes('cooling')) {
        if (value.toLowerCase().includes('liquid') || value.toLowerCase().includes('water')) {
          tractor.engine.cooling = 'liquid';
        } else if (value.toLowerCase().includes('air')) {
          tractor.engine.cooling = 'air';
        }
      }
      
      // Turbo
      if (label.includes('turbo') || label.includes('supercharg')) {
        tractor.engine.turbocharged = value.toLowerCase().includes('yes') || value.toLowerCase().includes('turbo');
      }
      
      // Transmisión
      if (label.includes('transmission')) {
        const transValue = value.toLowerCase();
        if (transValue.includes('hydrostatic')) {
          tractor.transmission.type = 'hydrostatic';
        } else if (transValue.includes('powershift') || transValue.includes('power shift')) {
          tractor.transmission.type = 'powershift';
        } else if (transValue.includes('cvt') || transValue.includes('continuously variable')) {
          tractor.transmission.type = 'cvt';
        } else if (transValue.includes('manual') || transValue.includes('gear')) {
          tractor.transmission.type = 'manual';
        }
        
        // Número de marchas
        const gearsMatch = value.match(/(\d+)\s*(?:speed|gear|speed|forward)/i);
        if (gearsMatch) {
          tractor.transmission.gears = parseInt(gearsMatch[1]);
        }
        
        if (!tractor.transmission.description && value.length < 200) {
          tractor.transmission.description = value;
        }
      }
      
      // Peso
      if (label.includes('weight') || label.includes('operating weight')) {
        const weightMatch = value.match(/(\d+(?:,\d+)?)\s*(?:kg|lb|pounds?)/i);
        if (weightMatch) {
          let weight = parseFloat(weightMatch[1].replace(/,/g, ''));
          if (value.toLowerCase().includes('lb') || value.toLowerCase().includes('pound')) {
            weight = Math.round(weight * 0.453592);
          }
          tractor.weight = weight;
        }
      }
      
      // Dimensiones
      if (label.includes('length') && !tractor.dimensions) {
        tractor.dimensions = {};
      }
      if (label.includes('length')) {
        const lengthMatch = value.match(/(\d+(?:\.\d+)?)\s*(?:mm|cm|in|inch)/i);
        if (lengthMatch) {
          let length = parseFloat(lengthMatch[1]);
          if (value.toLowerCase().includes('in') || value.toLowerCase().includes('inch')) {
            length = Math.round(length * 25.4);
          } else if (value.toLowerCase().includes('cm')) {
            length = Math.round(length * 10);
          }
          if (!tractor.dimensions) tractor.dimensions = {};
          tractor.dimensions.length = length;
        }
      }
      
      if (label.includes('width')) {
        const widthMatch = value.match(/(\d+(?:\.\d+)?)\s*(?:mm|cm|in|inch)/i);
        if (widthMatch) {
          let width = parseFloat(widthMatch[1]);
          if (value.toLowerCase().includes('in') || value.toLowerCase().includes('inch')) {
            width = Math.round(width * 25.4);
          } else if (value.toLowerCase().includes('cm')) {
            width = Math.round(width * 10);
          }
          if (!tractor.dimensions) tractor.dimensions = {};
          tractor.dimensions.width = width;
        }
      }
      
      if (label.includes('height')) {
        const heightMatch = value.match(/(\d+(?:\.\d+)?)\s*(?:mm|cm|in|inch)/i);
        if (heightMatch) {
          let height = parseFloat(heightMatch[1]);
          if (value.toLowerCase().includes('in') || value.toLowerCase().includes('inch')) {
            height = Math.round(height * 25.4);
          } else if (value.toLowerCase().includes('cm')) {
            height = Math.round(height * 10);
          }
          if (!tractor.dimensions) tractor.dimensions = {};
          tractor.dimensions.height = height;
        }
      }
      
      if (label.includes('wheelbase')) {
        const wheelbaseMatch = value.match(/(\d+(?:\.\d+)?)\s*(?:mm|cm|in|inch)/i);
        if (wheelbaseMatch) {
          let wheelbase = parseFloat(wheelbaseMatch[1]);
          if (value.toLowerCase().includes('in') || value.toLowerCase().includes('inch')) {
            wheelbase = Math.round(wheelbase * 25.4);
          } else if (value.toLowerCase().includes('cm')) {
            wheelbase = Math.round(wheelbase * 10);
          }
          if (!tractor.dimensions) tractor.dimensions = {};
          tractor.dimensions.wheelbase = wheelbase;
        }
      }
      
      // Sistema hidráulico
      if (label.includes('hydraulic') && (label.includes('flow') || label.includes('capacity'))) {
        if (!tractor.hydraulicSystem) tractor.hydraulicSystem = {};
        
        const flowMatch = value.match(/(\d+(?:\.\d+)?)\s*(?:l\/min|gpm|gal\/min)/i);
        if (flowMatch) {
          let flow = parseFloat(flowMatch[1]);
          if (value.toLowerCase().includes('gpm') || value.toLowerCase().includes('gal')) {
            flow = Math.round(flow * 3.78541); // Convertir GPM a L/min
          }
          if (label.includes('pump')) {
            tractor.hydraulicSystem.pumpFlow = flow;
          } else if (label.includes('steering')) {
            tractor.hydraulicSystem.steeringFlow = flow;
          }
        }
        
        if (label.includes('lift') || label.includes('capacity')) {
          const liftMatch = value.match(/(\d+(?:,\d+)?)\s*(?:kg|lb)/i);
          if (liftMatch) {
            let lift = parseFloat(liftMatch[1].replace(/,/g, ''));
            if (value.toLowerCase().includes('lb')) {
              lift = Math.round(lift * 0.453592);
            }
            tractor.hydraulicSystem.liftCapacity = lift;
          }
        }
      }
      
      if (label.includes('hydraulic') && label.includes('valve')) {
        if (!tractor.hydraulicSystem) tractor.hydraulicSystem = {};
        const valveMatch = value.match(/(\d+)/);
        if (valveMatch) {
          tractor.hydraulicSystem.valves = parseInt(valveMatch[1]);
        }
      }
    });
    
    // Buscar potencia en otros lugares si no se encontró en tablas
    if (tractor.engine.powerHP === 0) {
      // Buscar en todo el contenido HTML
      const allText = $('body').text();
      
      // Buscar patrones comunes de potencia
      const hpPatterns = [
        /(\d+(?:\.\d+)?)\s*(?:hp|HP|horsepower)/gi,
        /(?:power|engine|rated)[:\s]*(\d+(?:\.\d+)?)\s*(?:hp|HP)/gi,
        /(\d+(?:\.\d+)?)\s*(?:hp|HP)\s*(?:engine|power|rated)/gi,
      ];
      
      for (const pattern of hpPatterns) {
        const matches = allText.match(pattern);
        if (matches && matches.length > 0) {
          // Tomar el primer match y extraer el número
          const firstMatch = matches[0];
          const numMatch = firstMatch.match(/(\d+(?:\.\d+)?)/);
          if (numMatch) {
            const hpValue = parseFloat(numMatch[1]);
            // Aceptar solo valores razonables (entre 5 y 1000 HP)
            if (hpValue >= 5 && hpValue <= 1000) {
              tractor.engine.powerHP = hpValue;
              break;
            }
          }
        }
      }
      
      // Si aún no encontramos HP, buscar kW y convertir
      if (tractor.engine.powerHP === 0) {
        const kwPatterns = [
          /(\d+(?:\.\d+)?)\s*(?:kw|kW|kilowatts?)/gi,
          /(?:power|engine|rated)[:\s]*(\d+(?:\.\d+)?)\s*(?:kw|kW)/gi,
        ];
        
        for (const pattern of kwPatterns) {
          const matches = allText.match(pattern);
          if (matches && matches.length > 0) {
            const firstMatch = matches[0];
            const numMatch = firstMatch.match(/(\d+(?:\.\d+)?)/);
            if (numMatch) {
              const kwValue = parseFloat(numMatch[1]);
              if (kwValue >= 3.7 && kwValue <= 750) {
                tractor.engine.powerKW = kwValue;
                tractor.engine.powerHP = Math.round(kwValue * 1.34102);
                break;
              }
            }
          }
        }
      }
    }
    
    // Buscar cilindros en otros lugares si no se encontró
    if (tractor.engine.cylinders === 0) {
      const allText = $('body').text();
      const cylPatterns = [
        /(\d+)\s*(?:cylinder|cyl|cylinders?)/gi,
        /(?:engine|motor)[:\s]*(\d+)\s*(?:cylinder|cyl)/gi,
      ];
      
      for (const pattern of cylPatterns) {
        const matches = allText.match(pattern);
        if (matches && matches.length > 0) {
          const firstMatch = matches[0];
          const numMatch = firstMatch.match(/(\d+)/);
          if (numMatch) {
            const cylValue = parseInt(numMatch[1]);
            if (cylValue >= 1 && cylValue <= 12) {
              tractor.engine.cylinders = cylValue;
              break;
            }
          }
        }
      }
    }
    
    // Extraer también desde divs y otros elementos, no solo tablas
    $('div, p, span, td, th').each((i, elem) => {
      const text = $(elem).text().trim();
      const lowerText = text.toLowerCase();
      
      // Buscar HP si no lo tenemos
      if (tractor.engine.powerHP === 0 && (lowerText.includes('hp') || lowerText.includes('horsepower'))) {
        const hpMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:hp|HP|horsepower)/i);
        if (hpMatch) {
          const hpValue = parseFloat(hpMatch[1]);
          if (hpValue >= 5 && hpValue <= 1000) {
            tractor.engine.powerHP = hpValue;
          }
        }
      }
      
      // Buscar kW si no tenemos HP
      if (tractor.engine.powerHP === 0 && (lowerText.includes('kw') || lowerText.includes('kilowatt'))) {
        const kwMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:kw|kW|kilowatts?)/i);
        if (kwMatch) {
          const kwValue = parseFloat(kwMatch[1]);
          if (kwValue >= 3.7 && kwValue <= 750) {
            tractor.engine.powerKW = kwValue;
            tractor.engine.powerHP = Math.round(kwValue * 1.34102);
          }
        }
      }
      
      // Buscar cilindros
      if (tractor.engine.cylinders === 0 && (lowerText.includes('cylinder') || lowerText.includes('cyl'))) {
        const cylMatch = text.match(/(\d+)\s*(?:cylinder|cyl|cylinders?)/i);
        if (cylMatch) {
          const cylValue = parseInt(cylMatch[1]);
          if (cylValue >= 1 && cylValue <= 12) {
            tractor.engine.cylinders = cylValue;
          }
        }
      }
    });
    
    // Aceptar el tractor si tiene al menos marca y modelo válidos
    // Si no tiene HP, usar un valor por defecto basado en el modelo (opcional)
    if (tractor.brand === 'Unknown' || tractor.model === 'Unknown') {
      return null;
    }
    
    // Si no tiene HP después de todo, intentar extraerlo del URL o usar un valor mínimo
    if (tractor.engine.powerHP === 0) {
      // Intentar extraer del URL si tiene un patrón numérico
      const urlMatch = url.match(/\/(\d{4,5})-/);
      if (urlMatch) {
        // A veces el ID en el URL puede dar pistas
        // Pero mejor no asumir, mejor guardar sin HP que perder el tractor
      }
      
      // Por ahora, guardamos tractores sin HP (será 0) y los procesamos después
      // O podemos establecer un valor mínimo razonable
      // tractor.engine.powerHP = 10; // Valor mínimo por defecto
    }
    
    return tractor;
    
  } catch (error) {
    console.error(`  ❌ Error scrapeando tractor: ${error.message}`);
    return null;
  }
}

/**
 * Función principal
 */
async function main() {
  console.log('🚀 Iniciando scraping COMPLETO de TractorData.com...\n');
  console.log('⚠️  Este proceso puede tomar varias horas debido a la cantidad de datos\n');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  let allTractors = [];
  const processedUrls = new Set();
  let brands = [];
  let progress = {
    lastBrandIndex: 0,
    lastTractorIndex: 0,
    totalTractors: 0,
    totalBrands: 0,
  };
  
  try {
    // Cargar progreso anterior si existe
    try {
      const progressData = await fs.readJson(PROGRESS_FILE);
      progress = progressData;
      console.log(`📂 Progreso anterior encontrado: ${progress.lastBrandIndex}/${progress.totalBrands} marcas`);
    } catch (e) {
      console.log('📂 Iniciando desde el principio...');
    }
    
    // Cargar tractores anteriores si existen
    try {
      const existingTractors = await fs.readJson(OUTPUT_FILE);
      allTractors = existingTractors;
      // No podemos reconstruir las URLs exactas desde los IDs, pero guardamos el progreso
      console.log(`📂 ${allTractors.length} tractores ya existentes cargados`);
    } catch (e) {
      console.log('📂 No hay datos anteriores, empezando desde cero...');
    }
    
    // Cargar marcas si existen, sino obtenerlas
    try {
      brands = await fs.readJson(BRANDS_FILE);
      console.log(`📂 ${brands.length} marcas cargadas desde archivo`);
    } catch (e) {
      console.log('📂 Obteniendo marcas desde la web...');
      brands = await getAllBrands(page);
      await fs.writeJson(BRANDS_FILE, brands, { spaces: 2 });
      progress.totalBrands = brands.length;
    }
    
    console.log(`\n📊 Total de marcas a procesar: ${brands.length}`);
    console.log(`📊 Total de tractores actuales: ${allTractors.length}\n`);
    
    // Procesar marcas
    for (let i = progress.lastBrandIndex; i < brands.length; i++) {
      const brand = brands[i];
      console.log(`\n[${i + 1}/${brands.length}] 🏭 Procesando marca: ${brand.name}`);
      console.log(`   URL: ${brand.url}`);
      
      try {
        // Obtener todos los tractores de esta marca
        const tractorUrls = await getTractorsFromBrandPage(page, brand.url);
        console.log(`   ✅ Encontrados ${tractorUrls.length} tractores`);
        
        // Procesar cada tractor
        for (let j = 0; j < tractorUrls.length; j++) {
          const tractorUrl = tractorUrls[j];
          
          if (processedUrls.has(tractorUrl)) {
            console.log(`   ⏭️  Saltando (ya procesado): ${tractorUrl.substring(tractorUrl.lastIndexOf('/') + 1)}`);
            continue;
          }
          
          processedUrls.add(tractorUrl);
          
          const tractor = await scrapeTractorPage(page, tractorUrl);
          
          if (tractor && tractor.brand !== 'Unknown' && tractor.model !== 'Unknown') {
            allTractors.push(tractor);
            const hpInfo = tractor.engine.powerHP > 0 ? `${tractor.engine.powerHP} HP` : 'HP desconocida';
            console.log(`   ✅ [${j + 1}/${tractorUrls.length}] ${tractor.brand} ${tractor.model} (${hpInfo})`);
          } else {
            // Guardar la URL fallida para debugging
            const filename = tractorUrl.substring(tractorUrl.lastIndexOf('/') + 1);
            console.log(`   ⚠️  [${j + 1}/${tractorUrls.length}] No se pudo extraer: ${filename}`);
          }
          
          // Guardar progreso cada 10 tractores
          if ((j + 1) % 10 === 0 || j === tractorUrls.length - 1) {
            await fs.writeJson(OUTPUT_FILE, allTractors, { spaces: 2 });
            progress.lastBrandIndex = i;
            progress.lastTractorIndex = j;
            progress.totalTractors = allTractors.length;
            await fs.writeJson(PROGRESS_FILE, progress, { spaces: 2 });
            console.log(`   💾 Guardado progreso: ${allTractors.length} tractores totales`);
          }
          
          // Pausa más larga cada 50 tractores para evitar sobrecarga
          if ((j + 1) % 50 === 0) {
            console.log(`   ⏸️  Pausa de 10 segundos para evitar sobrecarga del servidor...`);
            await delay(10000);
          }
          
          // Pausa entre requests para no sobrecargar el servidor
          await delay(2500);
        }
        
        // Actualizar progreso de marca
        progress.lastBrandIndex = i + 1;
        progress.totalTractors = allTractors.length;
        await fs.writeJson(PROGRESS_FILE, progress, { spaces: 2 });
        
      } catch (error) {
        console.error(`   ❌ Error procesando marca ${brand.name}: ${error.message}`);
        // Continuar con la siguiente marca
      }
    }
    
    // Guardar resultado final
    await fs.writeJson(OUTPUT_FILE, allTractors, { spaces: 2 });
    
    console.log(`\n✅ Scraping completado!`);
    console.log(`📊 Total de marcas procesadas: ${brands.length}`);
    console.log(`📊 Total de tractores extraídos: ${allTractors.length}`);
    console.log(`💾 Datos guardados en: ${OUTPUT_FILE}`);
    console.log(`\n📝 Siguiente paso: Ejecuta 'npm run process-scraped' para procesar los datos`);
    
  } catch (error) {
    console.error('\n❌ Error general:', error);
    console.log(`\n💾 Progreso guardado. Puedes continuar ejecutando el script nuevamente.`);
  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };


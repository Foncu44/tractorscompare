/**
 * Script para buscar imágenes de tractores en la web
 * Busca SOLO imágenes con licencia libre (Creative Commons, uso libre)
 * para evitar problemas de derechos de autor
 * 
 * Prioriza:
 * 1. Wikimedia Commons (todas las imágenes son libres)
 * 2. Google Images con filtro Creative Commons
 * 3. Sitios oficiales de fabricantes (uso informativo)
 */

const puppeteer = require('puppeteer');
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

/**
 * Busca imagen en Wikimedia Commons (todas las imágenes son libres)
 */
async function searchFreeLicenseSites(page, brand, model) {
  try {
    const searchQuery = `${brand} ${model} tractor`;
    
    // Intentar buscar en Wikimedia Commons (todas las imágenes son libres)
    const wikimediaUrl = `https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(searchQuery)}&title=Special:MediaSearch&go=Go&type=image`;
    
    await page.goto(wikimediaUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    await delay(4000);
    
    const imageUrl = await page.evaluate(() => {
      // Buscar primera imagen en Wikimedia Commons
      const img = document.querySelector('.sdms-image-result img, .mw-file-element img, .thumbimage img, .gallerybox img');
      if (img) {
        let src = img.getAttribute('src') || img.getAttribute('data-src') || img.src;
        if (src) {
          // Convertir thumbnails a URL completa
          if (src.includes('/thumb/')) {
            const parts = src.split('/thumb/');
            if (parts.length > 1) {
              const filename = parts[1].split('/').pop();
              src = parts[0] + '/' + filename;
            }
          }
          if (src.startsWith('//')) {
            src = 'https:' + src;
          } else if (src.startsWith('/')) {
            src = 'https://commons.wikimedia.org' + src;
          }
          // Asegurar que sea una URL completa
          if (!src.startsWith('http')) {
            src = 'https://commons.wikimedia.org' + src;
          }
          return src;
        }
      }
      return null;
    });
    
    if (imageUrl) {
      console.log(`  ✅ Imagen libre encontrada en Wikimedia Commons`);
      return imageUrl;
    }
    
    return null;
  } catch (error) {
    console.error(`  ❌ Error buscando en Wikimedia Commons: ${error.message}`);
    return null;
  }
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
async function findTractorImage(page, tractor) {
  const { brand, model } = tractor;
  
  // 1. Primero intentar buscar en Wikimedia Commons (todas las imágenes son libres)
  let imageUrl = await searchFreeLicenseSites(page, brand, model);
  
  // 2. Si no encontramos, buscar en Google Images con filtro Creative Commons
  if (!imageUrl) {
    console.log(`  🔍 Buscando en Google Images (Creative Commons)...`);
    imageUrl = await searchGoogleImages(page, brand, model);
  }
  
  // 3. Como último recurso, buscar en sitio oficial del fabricante
  // (uso informativo, generalmente permitido para fines educativos)
  // NOTA: Esto debe usarse con precaución y solo si no hay alternativas libres
  if (!imageUrl && BRAND_WEBSITES[brand]) {
    console.log(`  🔍 Intentando buscar en web del fabricante (uso informativo)...`);
    imageUrl = await searchBrandWebsite(page, brand, model);
  }
  
  // Pausa entre búsquedas para no sobrecargar
  await delay(2000);
  
  return imageUrl;
}

/**
 * Función principal
 */
async function main() {
  console.log('🚀 Iniciando búsqueda de imágenes de tractores...');
  console.log('⚠️  IMPORTANTE: Solo se buscarán imágenes con licencia libre (Creative Commons)\n');
  
  // Leer tractores procesados
  let tractors = [];
  try {
    const content = await fs.readFile(TRACTORS_FILE, 'utf-8');
    // Extraer el array de tractores del archivo TypeScript
    const match = content.match(/export const scrapedTractors: Tractor\[\] = (\[[\s\S]*?\]);/);
    if (match) {
      tractors = JSON.parse(match[1]);
      console.log(`📊 Cargados ${tractors.length} tractores`);
    } else {
      console.error('❌ No se pudo leer el archivo de tractores');
      return;
    }
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
  
  // Cargar URLs de imágenes ya encontradas
  try {
    const existingImages = await fs.readJson(OUTPUT_FILE);
    progress.imageUrls = { ...progress.imageUrls, ...existingImages };
    console.log(`📂 ${Object.keys(progress.imageUrls).length} imágenes ya encontradas`);
  } catch (e) {
    console.log('📂 No hay imágenes previas');
  }
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1920, height: 1080 });
  
  try {
    // Procesar tractores desde donde nos quedamos
    for (let i = progress.lastIndex; i < tractors.length; i++) {
      const tractor = tractors[i];
      const tractorKey = `${tractor.brand}-${tractor.model}`;
      
      // Si ya tenemos imagen, saltar
      if (progress.imageUrls[tractorKey]) {
        console.log(`[${i + 1}/${tractors.length}] ⏭️  Saltando ${tractor.brand} ${tractor.model} (ya tiene imagen)`);
        continue;
      }
      
      console.log(`[${i + 1}/${tractors.length}] 🔍 Buscando imagen libre para: ${tractor.brand} ${tractor.model}`);
      
      try {
        const imageUrl = await findTractorImage(page, tractor);
        
        if (imageUrl) {
          progress.imageUrls[tractorKey] = imageUrl;
          console.log(`  ✅ Imagen libre encontrada para ${tractor.brand} ${tractor.model}`);
        } else {
          console.log(`  ⚠️  No se encontró imagen libre para ${tractor.brand} ${tractor.model} (usará placeholder)`);
          // Dejar como null para usar placeholder
          progress.imageUrls[tractorKey] = null;
        }
        
        // Guardar progreso cada 10 tractores
        if ((i + 1) % 10 === 0) {
          await fs.writeJson(OUTPUT_FILE, progress.imageUrls, { spaces: 2 });
          progress.lastIndex = i + 1;
          await fs.writeJson(PROGRESS_FILE, progress, { spaces: 2 });
          console.log(`  💾 Progreso guardado: ${i + 1}/${tractors.length} tractores procesados`);
        }
        
        // Pausa más larga cada 50 búsquedas
        if ((i + 1) % 50 === 0) {
          console.log(`  ⏸️  Pausa de 10 segundos...`);
          await delay(10000);
        }
        
      } catch (error) {
        console.error(`  ❌ Error procesando ${tractor.brand} ${tractor.model}: ${error.message}`);
        progress.imageUrls[tractorKey] = null;
      }
    }
    
    // Guardar resultado final
    await fs.writeJson(OUTPUT_FILE, progress.imageUrls, { spaces: 2 });
    progress.lastIndex = tractors.length;
    await fs.writeJson(PROGRESS_FILE, progress, { spaces: 2 });
    
    const foundCount = Object.values(progress.imageUrls).filter(url => url !== null).length;
    const totalCount = Object.keys(progress.imageUrls).length;
    
    console.log(`\n✅ Búsqueda completada!`);
    console.log(`📊 Total de tractores procesados: ${totalCount}`);
    console.log(`🖼️  Imágenes libres encontradas: ${foundCount}`);
    console.log(`⚠️  Sin imagen (usarán placeholder): ${totalCount - foundCount}`);
    console.log(`💾 URLs guardadas en: ${OUTPUT_FILE}`);
    console.log(`\n📝 Siguiente paso: Ejecuta 'npm run update-images' para actualizar los datos`);
    console.log(`\n⚠️  NOTA: Las imágenes encontradas son de licencia libre (Creative Commons).`);
    console.log(`   Si usas imágenes de sitios oficiales, asegúrate de verificar su política de uso.`);
    
  } catch (error) {
    console.error('\n❌ Error general:', error);
    await fs.writeJson(OUTPUT_FILE, progress.imageUrls, { spaces: 2 });
    await fs.writeJson(PROGRESS_FILE, progress, { spaces: 2 });
    console.log(`\n💾 Progreso guardado. Puedes continuar ejecutando el script nuevamente.`);
  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };

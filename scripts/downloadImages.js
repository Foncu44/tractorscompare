/**
 * Script para descargar imágenes de tractores desde Google Images
 * 
 * IMPORTANTE: Este script es solo para uso educativo.
 * Asegúrate de respetar los derechos de autor y los términos de servicio.
 * 
 * Instalación:
 * npm install puppeteer axios fs-extra
 */

const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'tractors');

// Tractores a buscar
const tractors = [
  { id: 'john-deere-8245r', brand: 'John Deere', model: '8245R' },
  { id: 'kubota-m7-171', brand: 'Kubota', model: 'M7-171' },
  { id: 'new-holland-t8-435', brand: 'New Holland', model: 'T8.435' },
  { id: 'case-ih-magnum-240', brand: 'Case IH', model: 'Magnum 240' },
  { id: 'massey-ferguson-8660', brand: 'Massey Ferguson', model: '8660' },
];

// Asegurar que el directorio existe
fs.ensureDirSync(IMAGES_DIR);

/**
 * Descarga una imagen desde una URL
 */
async function downloadImage(url, filepath) {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`✓ Imagen guardada: ${path.basename(filepath)}`);
        resolve(true);
      });
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`✗ Error descargando: ${error.message}`);
    return false;
  }
}

/**
 * Busca imágenes en Google Images usando Puppeteer
 */
async function searchGoogleImages(query, maxResults = 5) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch&tbs=isz:m`;
    await page.goto(searchUrl, { waitUntil: 'networkidle2' });
    
    // Esperar a que las imágenes carguen
    await page.waitForSelector('img', { timeout: 5000 });
    
    // Extraer URLs de imágenes
    const imageUrls = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return images
        .map(img => img.src || img.getAttribute('data-src'))
        .filter(url => url && url.startsWith('http'))
        .slice(0, 10); // Primeras 10 imágenes
    });

    await browser.close();
    return imageUrls;
  } catch (error) {
    console.error(`Error buscando imágenes: ${error.message}`);
    await browser.close();
    return [];
  }
}

/**
 * Descarga imágenes para un tractor específico
 */
async function downloadTractorImages(tractor) {
  const imagePath = path.join(IMAGES_DIR, `${tractor.id}.jpg`);
  
  // Si ya existe, saltar
  if (await fs.pathExists(imagePath)) {
    console.log(`✓ Imagen ya existe: ${tractor.brand} ${tractor.model}`);
    return true;
  }

  console.log(`\n🔍 Buscando imágenes para: ${tractor.brand} ${tractor.model}...`);
  const query = `${tractor.brand} ${tractor.model} tractor`;
  
  const imageUrls = await searchGoogleImages(query);
  
  if (imageUrls.length === 0) {
    console.log(`✗ No se encontraron imágenes para ${tractor.brand} ${tractor.model}`);
    return false;
  }

  // Intentar descargar la primera imagen válida
  for (const url of imageUrls) {
    try {
      // Filtrar URLs de thumbnails y datos pequeños
      if (url.includes('data:image') || url.includes('gstatic.com')) {
        continue;
      }

      console.log(`  Intentando descargar: ${url.substring(0, 80)}...`);
      const success = await downloadImage(url, imagePath);
      
      if (success) {
        // Verificar que el archivo tiene un tamaño razonable (al menos 10KB)
        const stats = await fs.stat(imagePath);
        if (stats.size > 10000) {
          console.log(`✅ Imagen descargada exitosamente: ${tractor.brand} ${tractor.model}`);
          return true;
        } else {
          // Archivo muy pequeño, probablemente thumbnail, intentar siguiente
          await fs.remove(imagePath);
          continue;
        }
      }
    } catch (error) {
      console.log(`  Error con esta URL, intentando siguiente...`);
      continue;
    }
  }

  console.log(`✗ No se pudo descargar imagen válida para ${tractor.brand} ${tractor.model}`);
  return false;
}

/**
 * Proceso principal
 */
async function main() {
  console.log('🚀 Iniciando descarga de imágenes de tractores...\n');
  console.log('⚠️  NOTA: Este script busca imágenes en Google Images.');
  console.log('⚠️  Asegúrate de respetar los derechos de autor.\n');

  let successCount = 0;
  let failCount = 0;

  for (const tractor of tractors) {
    const success = await downloadTractorImages(tractor);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }

    // Pausa entre búsquedas para no sobrecargar
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log(`\n📊 Resumen:`);
  console.log(`   ✅ Descargadas: ${successCount}`);
  console.log(`   ❌ Fallidas: ${failCount}`);
  console.log(`\n📁 Imágenes guardadas en: ${IMAGES_DIR}`);
}

// Ejecutar
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { downloadTractorImages, searchGoogleImages };


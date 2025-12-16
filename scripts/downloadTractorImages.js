/**
 * Script para descargar imágenes de tractores
 * 
 * NOTA: Este script requiere que instales las dependencias:
 * npm install axios cheerio fs-extra
 * 
 * También puedes usar una herramienta visual como:
 * - Google Images Download (https://github.com/hardikvasa/google-images-download)
 * - O descargar manualmente desde Google Images
 */

const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const { tractors } = require('../data/tractors.ts');

// Carpeta donde se guardarán las imágenes
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'tractors');

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
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`Error descargando imagen: ${error.message}`);
    return false;
  }
}

/**
 * Busca imagen en Unsplash (alternativa gratuita)
 */
async function searchUnsplashImage(query) {
  try {
    // Unsplash Source API (gratuita, sin API key requerida)
    const searchQuery = encodeURIComponent(query);
    const url = `https://source.unsplash.com/800x600/?${searchQuery}`;
    return url;
  } catch (error) {
    console.error(`Error buscando en Unsplash: ${error.message}`);
    return null;
  }
}

/**
 * Descarga imágenes para todos los tractores
 */
async function downloadAllImages() {
  console.log('Iniciando descarga de imágenes...\n');

  for (const tractor of tractors) {
    const imageFilename = `${tractor.id}.jpg`;
    const imagePath = path.join(IMAGES_DIR, imageFilename);
    
    // Si la imagen ya existe, saltar
    if (await fs.pathExists(imagePath)) {
      console.log(`✓ Imagen ya existe: ${tractor.brand} ${tractor.model}`);
      continue;
    }

    console.log(`📥 Descargando: ${tractor.brand} ${tractor.model}...`);
    
    // Si el tractor ya tiene una URL de imagen, intentar descargarla
    if (tractor.imageUrl && !tractor.imageUrl.includes('unsplash.com')) {
      const success = await downloadImage(tractor.imageUrl, imagePath);
      if (success) {
        console.log(`✓ Descargada: ${imageFilename}`);
        continue;
      }
    }

    // Si no, buscar en Unsplash
    const searchQuery = `${tractor.brand} ${tractor.model} tractor`;
    const unsplashUrl = await searchUnsplashImage(searchQuery);
    
    if (unsplashUrl) {
      const success = await downloadImage(unsplashUrl, imagePath);
      if (success) {
        console.log(`✓ Descargada desde Unsplash: ${imageFilename}`);
      } else {
        console.log(`✗ Error descargando: ${tractor.brand} ${tractor.model}`);
      }
    } else {
      console.log(`✗ No se encontró imagen para: ${tractor.brand} ${tractor.model}`);
    }

    // Pequeña pausa para no sobrecargar el servidor
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n✅ Proceso completado!');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  downloadAllImages().catch(console.error);
}

module.exports = { downloadAllImages, downloadImage };


/**
 * Script TypeScript para configurar imágenes locales
 * Ejecutar con: npx ts-node scripts/setupImages.ts
 */

import * as fs from 'fs-extra';
import * as path from 'path';

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'tractors');

// Asegurar que el directorio existe
async function setupImageDirectories() {
  await fs.ensureDir(IMAGES_DIR);
  console.log(`✓ Directorio creado: ${IMAGES_DIR}`);
  
  // Crear un archivo .gitkeep para mantener la carpeta en git
  const gitkeepPath = path.join(IMAGES_DIR, '.gitkeep');
  if (!await fs.pathExists(gitkeepPath)) {
    await fs.writeFile(gitkeepPath, '');
    console.log('✓ Archivo .gitkeep creado');
  }
  
  console.log('\n✅ Estructura de carpetas lista!');
  console.log(`📁 Coloca las imágenes en: ${IMAGES_DIR}`);
  console.log('\nFormato esperado: [id-del-tractor].jpg');
}

setupImageDirectories().catch(console.error);


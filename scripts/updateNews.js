/**
 * Script combinado para actualizar noticias:
 * 1. Busca noticias nuevas desde RSS feeds
 * 2. Elimina noticias duplicadas
 * 3. Elimina noticias antiguas (más de 3 meses)
 * 
 * Uso:
 * node scripts/updateNews.js
 * 
 * O con npm:
 * npm run update-news
 */

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const path = require('path');

const SCRIPTS_DIR = path.join(__dirname);

/**
 * Ejecuta un script y muestra su output
 */
async function runScript(scriptName, description) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📰 ${description}`);
  console.log(`${'='.repeat(60)}\n`);
  
  try {
    const { stdout, stderr } = await execPromise(`node ${path.join(SCRIPTS_DIR, scriptName)}`);
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    return true;
  } catch (error) {
    console.error(`❌ Error ejecutando ${scriptName}:`, error.message);
    if (error.stdout) console.log(error.stdout);
    if (error.stderr) console.error(error.stderr);
    return false;
  }
}

/**
 * Función principal
 */
async function main() {
  console.log('🚀 Iniciando actualización completa de noticias...\n');
  console.log('Este proceso incluye:');
  console.log('  1. Búsqueda de noticias nuevas desde RSS feeds');
  console.log('  2. Eliminación de noticias duplicadas');
  console.log('  3. Limpieza de noticias antiguas (más de 3 meses)\n');
  
  const startTime = Date.now();
  
  // Paso 1: Buscar noticias nuevas
  const fetchSuccess = await runScript(
    'fetchNews.js',
    'Paso 1/3: Buscando noticias nuevas desde RSS feeds...'
  );
  
  if (!fetchSuccess) {
    console.error('\n❌ Error al buscar noticias nuevas. Abortando...');
    process.exit(1);
  }
  
  // Paso 2: Eliminar duplicados
  const dedupeSuccess = await runScript(
    'removeDuplicateNews.js',
    'Paso 2/3: Eliminando noticias duplicadas...'
  );
  
  if (!dedupeSuccess) {
    console.warn('\n⚠️  Advertencia: Error al eliminar duplicados. Continuando...');
  }
  
  // Paso 3: Limpiar noticias antiguas
  const cleanSuccess = await runScript(
    'cleanOldNews.js',
    'Paso 3/3: Eliminando noticias antiguas (más de 3 meses)...'
  );
  
  if (!cleanSuccess) {
    console.warn('\n⚠️  Advertencia: Error al limpiar noticias antiguas. Continuando...');
  }
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  
  console.log(`\n${'='.repeat(60)}`);
  console.log('✅ ¡Actualización completada!');
  console.log(`⏱️  Tiempo total: ${duration} segundos`);
  console.log(`${'='.repeat(60)}\n`);
  
  console.log('📋 Resumen:');
  console.log('  ✅ Noticias nuevas buscadas');
  if (dedupeSuccess) console.log('  ✅ Duplicados eliminados');
  if (cleanSuccess) console.log('  ✅ Noticias antiguas eliminadas');
  console.log('\n💡 Tip: Ejecuta este script periódicamente para mantener las noticias actualizadas.\n');
}

// Ejecutar
if (require.main === module) {
  main().catch((err) => {
    console.error('❌ Error fatal:', err);
    process.exit(1);
  });
}

module.exports = { main };


/**
 * Script para eliminar noticias antiguas del archivo news.json
 * 
 * Elimina noticias que tienen más de 3 meses de antigüedad.
 * 
 * Uso:
 * node scripts/cleanOldNews.js
 * 
 * O con npm:
 * npm run clean-old-news
 */

const fs = require('fs');
const path = require('path');

const NEWS_FILE = path.join(__dirname, '..', 'data', 'news.json');
const MONTHS_TO_KEEP = 3;

/**
 * Verifica si una fecha está dentro de los últimos N meses
 */
function isWithinLastMonths(publishedAtISO, months) {
  const date = new Date(publishedAtISO);
  if (isNaN(date.getTime())) {
    return false; // Fecha inválida, considerar como antigua
  }
  
  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setMonth(cutoff.getMonth() - months);
  
  return date >= cutoff;
}

/**
 * Formatea una fecha para mostrar
 */
function formatDate(dateISO) {
  const date = new Date(dateISO);
  if (isNaN(date.getTime())) return 'Fecha inválida';
  return date.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });
}

/**
 * Función principal
 */
function main() {
  console.log('🔍 Leyendo archivo de noticias...');
  
  if (!fs.existsSync(NEWS_FILE)) {
    console.error(`❌ Error: No se encontró el archivo ${NEWS_FILE}`);
    process.exit(1);
  }
  
  const data = JSON.parse(fs.readFileSync(NEWS_FILE, 'utf-8'));
  const originalCount = data.items.length;
  
  console.log(`📰 Total de noticias: ${originalCount}`);
  console.log(`📅 Filtrando noticias de los últimos ${MONTHS_TO_KEEP} meses...\n`);
  
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - MONTHS_TO_KEEP);
  
  const kept = [];
  const removed = [];
  
  for (const item of data.items) {
    if (isWithinLastMonths(item.publishedAt, MONTHS_TO_KEEP)) {
      kept.push(item);
    } else {
      removed.push({
        title: item.title,
        source: item.source,
        publishedAt: item.publishedAt,
        formattedDate: formatDate(item.publishedAt)
      });
    }
  }
  
  console.log(`✅ Noticias mantenidas: ${kept.length}`);
  console.log(`🗑️  Noticias eliminadas: ${removed.length}`);
  console.log(`📊 Reducción: ${((removed.length / originalCount) * 100).toFixed(1)}%\n`);
  
  if (removed.length > 0) {
    console.log('📋 Noticias eliminadas (más antiguas de 3 meses):\n');
    // Mostrar solo las primeras 10 para no saturar la consola
    const toShow = removed.slice(0, 10);
    toShow.forEach((item, index) => {
      console.log(`${index + 1}. [${item.source}] ${item.title}`);
      console.log(`   Fecha: ${item.formattedDate}\n`);
    });
    
    if (removed.length > 10) {
      console.log(`... y ${removed.length - 10} noticias más.\n`);
    }
  }
  
  // Crear backup del archivo original
  const backupFile = NEWS_FILE.replace('.json', `.backup.${Date.now()}.json`);
  console.log(`💾 Creando backup: ${path.basename(backupFile)}`);
  fs.writeFileSync(backupFile, JSON.stringify(data, null, 2), 'utf-8');
  
  // Actualizar el archivo con las noticias recientes
  data.items = kept;
  data.fetchedAt = new Date().toISOString();
  data.lastCleaned = new Date().toISOString();
  
  console.log(`💾 Guardando archivo actualizado...`);
  fs.writeFileSync(NEWS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  
  console.log('\n✅ ¡Proceso completado!');
  console.log(`📁 Backup guardado en: ${path.basename(backupFile)}`);
  console.log(`📰 Noticias finales: ${kept.length} (${removed.length} eliminadas)`);
  console.log(`📅 Fecha de corte: ${cutoffDate.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  })}`);
}

// Ejecutar
if (require.main === module) {
  main();
}

module.exports = { cleanOldNews: main, isWithinLastMonths };


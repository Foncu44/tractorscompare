/**
 * Script para eliminar noticias duplicadas del archivo news.json
 * 
 * Identifica noticias que son la misma pero de distintos medios y mantiene solo una versión.
 * 
 * Uso:
 * node scripts/removeDuplicateNews.js
 */

const fs = require('fs');
const path = require('path');

const NEWS_FILE = path.join(__dirname, '..', 'data', 'news.json');

/**
 * Normaliza un título para comparación:
 * - Convierte a minúsculas
 * - Elimina puntuación
 * - Elimina el nombre del medio al final (después del último " - ")
 * - Elimina espacios extra
 */
function normalizeTitle(title) {
  if (!title) return '';
  
  // Eliminar el nombre del medio al final (formato: "Título - Nombre del Medio")
  let normalized = title.split(' - ')[0].trim();
  
  // Convertir a minúsculas
  normalized = normalized.toLowerCase();
  
  // Eliminar puntuación común
  normalized = normalized.replace(/[.,;:!?'"()\[\]{}]/g, '');
  
  // Eliminar espacios extra
  normalized = normalized.replace(/\s+/g, ' ').trim();
  
  return normalized;
}

/**
 * Extrae palabras clave importantes del título (palabras de más de 3 caracteres)
 */
function extractKeywords(title) {
  const normalized = normalizeTitle(title);
  const words = normalized.split(' ');
  return words.filter(word => word.length > 3).sort();
}

/**
 * Calcula la similitud entre dos títulos normalizados
 * Retorna un valor entre 0 y 1 (1 = idénticos)
 */
function calculateSimilarity(title1, title2) {
  const norm1 = normalizeTitle(title1);
  const norm2 = normalizeTitle(title2);
  
  // Si son idénticos después de normalizar
  if (norm1 === norm2) return 1.0;
  
  // Extraer palabras clave
  const keywords1 = extractKeywords(title1);
  const keywords2 = extractKeywords(title2);
  
  if (keywords1.length === 0 || keywords2.length === 0) return 0;
  
  // Calcular intersección de palabras clave
  const intersection = keywords1.filter(k => keywords2.includes(k));
  const union = [...new Set([...keywords1, ...keywords2])];
  
  // Jaccard similarity
  const similarity = intersection.length / union.length;
  
  // También verificar si uno contiene al otro
  if (norm1.includes(norm2) || norm2.includes(norm1)) {
    return Math.max(similarity, 0.7);
  }
  
  return similarity;
}

/**
 * Determina qué noticia mantener cuando hay duplicados
 * Prioriza: imageUrl > mejor excerpt > más reciente
 */
function chooseBestNews(news1, news2) {
  // Si una tiene imageUrl y la otra no, mantener la que tiene
  if (news1.imageUrl && !news2.imageUrl) return news1;
  if (news2.imageUrl && !news1.imageUrl) return news2;
  
  // Si una tiene mejor excerpt (más largo y con más información)
  if (news1.excerpt && news2.excerpt) {
    const excerpt1 = news1.excerpt.replace(/&nbsp;/g, ' ').trim();
    const excerpt2 = news2.excerpt.replace(/&nbsp;/g, ' ').trim();
    if (excerpt1.length > excerpt2.length * 1.2) return news1;
    if (excerpt2.length > excerpt1.length * 1.2) return news2;
  } else if (news1.excerpt && !news2.excerpt) return news1;
  else if (news2.excerpt && !news1.excerpt) return news2;
  
  // Preferir URL directa sobre Google News
  const isGoogleNews1 = news1.url && news1.url.includes('news.google.com');
  const isGoogleNews2 = news2.url && news2.url.includes('news.google.com');
  if (!isGoogleNews1 && isGoogleNews2) return news1;
  if (isGoogleNews1 && !isGoogleNews2) return news2;
  
  // Si todo es igual, mantener la más reciente
  const date1 = new Date(news1.publishedAt);
  const date2 = new Date(news2.publishedAt);
  return date1 >= date2 ? news1 : news2;
}

/**
 * Elimina noticias duplicadas del array
 */
function removeDuplicates(newsItems) {
  const kept = [];
  const removed = [];
  const seen = new Set();
  
  // Umbral de similitud para considerar duplicados (0.6 = 60% similar)
  const SIMILARITY_THRESHOLD = 0.6;
  
  for (let i = 0; i < newsItems.length; i++) {
    const current = newsItems[i];
    const currentTitle = normalizeTitle(current.title);
    
    // Si ya procesamos un título idéntico, saltar
    if (seen.has(currentTitle)) {
      removed.push({
        title: current.title,
        source: current.source,
        reason: 'Título idéntico después de normalizar'
      });
      continue;
    }
    
    let isDuplicate = false;
    
    // Comparar con todas las noticias ya procesadas
    for (let j = 0; j < kept.length; j++) {
      const existing = kept[j];
      const similarity = calculateSimilarity(current.title, existing.title);
      
      if (similarity >= SIMILARITY_THRESHOLD) {
        // Son duplicados, decidir cuál mantener
        const best = chooseBestNews(current, existing);
        
        if (best === current) {
          // Reemplazar la existente con la actual
          removed.push({
            title: existing.title,
            source: existing.source,
            reason: `Duplicado de "${current.title}" (similaridad: ${(similarity * 100).toFixed(1)}%)`
          });
          kept[j] = current;
          seen.add(currentTitle);
        } else {
          // Mantener la existente, descartar la actual
          removed.push({
            title: current.title,
            source: current.source,
            reason: `Duplicado de "${existing.title}" (similaridad: ${(similarity * 100).toFixed(1)}%)`
          });
        }
        
        isDuplicate = true;
        break;
      }
    }
    
    if (!isDuplicate) {
      kept.push(current);
      seen.add(currentTitle);
    }
  }
  
  return { kept, removed };
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
  console.log('🔎 Buscando duplicados...\n');
  
  const { kept, removed } = removeDuplicates(data.items);
  
  console.log(`✅ Noticias únicas: ${kept.length}`);
  console.log(`🗑️  Noticias eliminadas: ${removed.length}`);
  console.log(`📊 Reducción: ${((removed.length / originalCount) * 100).toFixed(1)}%\n`);
  
  if (removed.length > 0) {
    console.log('📋 Noticias eliminadas:\n');
    removed.forEach((item, index) => {
      console.log(`${index + 1}. [${item.source}] ${item.title}`);
      console.log(`   Razón: ${item.reason}\n`);
    });
  }
  
  // Crear backup del archivo original
  const backupFile = NEWS_FILE.replace('.json', `.backup.${Date.now()}.json`);
  console.log(`💾 Creando backup: ${path.basename(backupFile)}`);
  fs.writeFileSync(backupFile, JSON.stringify(data, null, 2), 'utf-8');
  
  // Actualizar el archivo con las noticias únicas
  data.items = kept;
  data.fetchedAt = new Date().toISOString();
  
  console.log(`💾 Guardando archivo actualizado...`);
  fs.writeFileSync(NEWS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  
  console.log('\n✅ ¡Proceso completado!');
  console.log(`📁 Backup guardado en: ${path.basename(backupFile)}`);
  console.log(`📰 Noticias finales: ${kept.length} (${originalCount - kept.length} eliminadas)`);
}

// Ejecutar
if (require.main === module) {
  main();
}

module.exports = { removeDuplicates, normalizeTitle, calculateSimilarity };


/**
 * Descarga noticias (RSS) y guarda data/news.json.
 * Objetivo: noticias de agricultura y tractores (últimos 6 meses).
 *
 * Fuentes: Google News RSS (y extrae el enlace real desde el <description> cuando sea posible).
 * Nota: no garantiza 100% la URL final en todos los casos, pero normalmente el <description>
 * incluye el link directo al medio original.
 */
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const OUT_FILE = path.join(__dirname, '..', 'data', 'news.json');

function googleRss(query) {
  return `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en&gl=US&ceid=US:en`;
}

const FEEDS = [
  { category: 'tractors', url: googleRss('tractors OR "agricultural machinery" OR "farm equipment"'), source: 'Google News' },
  { category: 'agriculture', url: googleRss('agriculture OR "agricultural technology" OR "farming equipment" OR "farm machinery"'), source: 'Google News' },
  { category: 'industry', url: googleRss('"tractor" OR "combine harvester" OR "agricultural equipment"'), source: 'Google News' },
];

function extractFirstHref(htmlText) {
  const m = htmlText && htmlText.match(/href=\"(https?:\/\/[^\"]+)\"/i);
  return m ? m[1] : null;
}

function extractFirstImg(htmlText) {
  if (!htmlText) return null;
  // Buscar múltiples patrones de imágenes
  const patterns = [
    /<img[^>]+src=["'](https?:\/\/[^"']+)["']/i,
    /<img[^>]+src=["']([^"']+)["']/i,
    /src=["'](https?:\/\/[^"']+\.(jpg|jpeg|png|webp|gif))["']/i,
  ];
  
  for (const pattern of patterns) {
    const m = htmlText.match(pattern);
    if (m && m[1]) {
      // Si es una URL relativa, intentar construirla (aunque normalmente no debería pasar)
      if (m[1].startsWith('http')) {
        return m[1];
      }
    }
  }
  return null;
}

/**
 * Intenta obtener la imagen principal de una página de noticias
 */
async function fetchArticleImage(url) {
  try {
    const res = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      maxRedirects: 5,
    });
    
    const $ = cheerio.load(res.data);
    
    // Buscar en meta tags (og:image, article:image, twitter:image)
    const ogImage = $('meta[property="og:image"]').attr('content');
    if (ogImage) return ogImage;
    
    const articleImage = $('meta[property="article:image"]').attr('content');
    if (articleImage) return articleImage;
    
    const twitterImage = $('meta[name="twitter:image"]').attr('content');
    if (twitterImage) return twitterImage;
    
    // Buscar la primera imagen grande en el contenido
    const images = $('article img, .article img, .content img, main img');
    for (let i = 0; i < images.length; i++) {
      const img = $(images[i]);
      const src = img.attr('src') || img.attr('data-src') || img.attr('data-lazy-src');
      if (src) {
        const fullUrl = src.startsWith('http') ? src : new URL(src, url).href;
        // Filtrar imágenes pequeñas (probablemente iconos)
        const width = parseInt(img.attr('width') || '0');
        const height = parseInt(img.attr('height') || '0');
        if (width > 200 || height > 200 || (!width && !height)) {
          return fullUrl;
        }
      }
    }
    
    return null;
  } catch (error) {
    // Silenciosamente fallar si no se puede obtener la imagen
    return null;
  }
}

function stripHtml(htmlText) {
  if (!htmlText) return '';
  return htmlText
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function withinLastMonths(dateISO, months) {
  const t = Date.parse(dateISO);
  if (Number.isNaN(t)) return false;
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - months);
  return t >= cutoff.getTime();
}

async function fetchRss(url) {
  const res = await axios.get(url, {
    timeout: 30000,
    headers: {
      'User-Agent': 'tractorscompare-bot/1.0 (+https://tractorscompare.com)',
      'Accept': 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8',
    },
  });
  return res.data;
}

async function main() {
  console.log('📰 Descargando RSS...');
  const allItems = [];

  for (const feed of FEEDS) {
    console.log(`- ${feed.category}: ${feed.url}`);
    const xml = await fetchRss(feed.url);
    const $ = cheerio.load(xml, { xmlMode: true });
    
    const items = [];
    $('item').each((_, el) => {
      const title = $(el).find('title').first().text().trim();
      const link = $(el).find('link').first().text().trim();
      const pubDate = $(el).find('pubDate').first().text().trim();
      const source = $(el).find('source').first().text().trim() || feed.source;
      const description = $(el).find('description').first().text();
      
      // Buscar imagen en media:content (si existe)
      const mediaContent = $(el).find('media\\:content, content').first().attr('url');
      const mediaThumbnail = $(el).find('media\\:thumbnail, thumbnail').first().attr('url');

      const url = extractFirstHref(description) || link;
      const imageUrl = mediaContent || mediaThumbnail || extractFirstImg(description) || undefined;
      const excerpt = stripHtml(description).slice(0, 220);

      const publishedAt = pubDate ? new Date(pubDate).toISOString() : null;
      if (!publishedAt) return;

      items.push({
        title,
        url,
        publishedAt,
        source,
        imageUrl,
        category: feed.category,
        excerpt,
      });
    });
    
    allItems.push(...items);
  }
  
  console.log(`📸 Obteniendo imágenes de artículos (${allItems.length} items, procesando todos los que no tienen imagen)...`);
  // Obtener imágenes de todos los artículos sin imagen
  let processed = 0;
  for (let i = 0; i < allItems.length; i++) {
    const item = allItems[i];
    if (!item.imageUrl && item.url) {
      processed++;
      if (processed % 10 === 0) {
        console.log(`  Procesando ${processed}/${allItems.length}...`);
      }
      try {
        const articleImage = await fetchArticleImage(item.url);
        if (articleImage) {
          item.imageUrl = articleImage;
          console.log(`  ✅ Imagen encontrada para: ${item.title.substring(0, 50)}...`);
        }
        // Delay para no sobrecargar los servidores
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        // Continuar si falla
      }
    }
  }

  // Filtrar últimos 6 meses + dedupe por URL
  const recent = allItems.filter((i) => withinLastMonths(i.publishedAt, 6));
  const deduped = [];
  const seen = new Set();
  for (const item of recent.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))) {
    const key = item.url;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
  }

  // Limitar para no crecer sin control
  const finalItems = deduped.slice(0, 120);

  await fs.writeJson(OUT_FILE, { fetchedAt: new Date().toISOString(), items: finalItems }, { spaces: 2 });
  console.log(`✅ Guardado ${finalItems.length} noticias en ${OUT_FILE}`);
}

if (require.main === module) {
  main().catch((err) => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
}


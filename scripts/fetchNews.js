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
  return `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=es&gl=ES&ceid=ES:es`;
}

const FEEDS = [
  { category: 'tractors', url: googleRss('tractores OR "maquinaria agrícola"'), source: 'Google News' },
  { category: 'agriculture', url: googleRss('agricultura OR "tecnología agrícola" OR "maquinaria agrícola"'), source: 'Google News' },
  { category: 'industry', url: googleRss('"tractor" OR "cosechadora" OR "tractor" tecnología'), source: 'Google News' },
];

function extractFirstHref(htmlText) {
  const m = htmlText && htmlText.match(/href=\"(https?:\/\/[^\"]+)\"/i);
  return m ? m[1] : null;
}

function extractFirstImg(htmlText) {
  const m = htmlText && htmlText.match(/<img[^>]+src=\"(https?:\/\/[^\"]+)\"/i);
  return m ? m[1] : null;
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
    $('item').each((_, el) => {
      const title = $(el).find('title').first().text().trim();
      const link = $(el).find('link').first().text().trim();
      const pubDate = $(el).find('pubDate').first().text().trim();
      const source = $(el).find('source').first().text().trim() || feed.source;
      const description = $(el).find('description').first().text();

      const url = extractFirstHref(description) || link;
      const imageUrl = extractFirstImg(description) || undefined;
      const excerpt = stripHtml(description).slice(0, 220);

      const publishedAt = pubDate ? new Date(pubDate).toISOString() : null;
      if (!publishedAt) return;

      allItems.push({
        title,
        url,
        publishedAt,
        source,
        imageUrl,
        category: feed.category,
        excerpt,
      });
    });
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


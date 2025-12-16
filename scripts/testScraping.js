/**
 * Script de prueba simple para verificar que el scraping funciona
 * Prueba con URLs conocidas de tractores individuales
 */

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const testUrls = [
  'https://www.tractordata.com/farm-tractors/000/3/8/3865-john-deere-8245r.html',
  'https://www.tractordata.com/farm-tractors/000/2/7/2724-kubota-m7-171.html',
];

async function testScraping() {
  console.log('🧪 Probando scraping con URLs conocidas...\n');
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
  
  for (const url of testUrls) {
    try {
      console.log(`📄 Probando: ${url}`);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      
      const content = await page.content();
      const $ = cheerio.load(content);
      
      const title = $('h1').first().text().trim();
      console.log(`  Título: ${title}`);
      
      // Buscar especificaciones en tablas
      const tables = $('table').length;
      console.log(`  Tablas encontradas: ${tables}`);
      
      // Buscar potencia
      $('table tr').each((i, elem) => {
        const $row = $(elem);
        const text = $row.text().toLowerCase();
        if (text.includes('hp') || text.includes('horsepower')) {
          console.log(`  Encontrado HP: ${$row.text().trim()}`);
        }
      });
      
      console.log(`  ✅ Página cargada correctamente\n`);
      
    } catch (error) {
      console.error(`  ❌ Error: ${error.message}\n`);
    }
  }
  
  await browser.close();
  console.log('✅ Prueba completada');
}

testScraping().catch(console.error);


// Script para verificar los datos cargados
// Ejecutar con: node scripts/checkData.js

const fs = require('fs');
const path = require('path');

console.log('=== VERIFICANDO DATOS CARGADOS ===\n');

// Leer archivo de tractores procesados
const processedPath = path.join(__dirname, '../data/processed-tractors.ts');
let processedContent = fs.readFileSync(processedPath, 'utf8');

// Contar tractores en processed-tractors.ts
const tractorMatches = processedContent.match(/"id":\s*"[^"]+"/g);
const tractorCount = tractorMatches ? tractorMatches.length : 0;
console.log(`📊 Tractores en processed-tractors.ts: ${tractorCount.toLocaleString()}`);

// Extraer marcas únicas
const brandMatches = processedContent.match(/"brand":\s*"([^"]+)"/g);
const brands = new Set();
if (brandMatches) {
  brandMatches.forEach(match => {
    const brand = match.match(/"brand":\s*"([^"]+)"/)[1];
    // Normalizar marcas
    let normalizedBrand = brand;
    if (brand === 'CaseIH' || brand === 'Case' || brand === 'J.I. Case' || brand === 'J.I Case') {
      normalizedBrand = 'Case IH';
    } else if (brand === 'John') {
      // Verificar si el modelo empieza con "Deere"
      const modelMatch = processedContent.substring(processedContent.indexOf(match)).match(/"model":\s*"([^"]+)"/);
      if (modelMatch && modelMatch[1].startsWith('Deere ')) {
        normalizedBrand = 'John Deere';
      }
    } else if (brand === 'New') {
      const modelMatch = processedContent.substring(processedContent.indexOf(match)).match(/"model":\s*"([^"]+)"/);
      if (modelMatch && modelMatch[1].startsWith('Holland ')) {
        normalizedBrand = 'New Holland';
      }
    } else if (brand === 'Massey') {
      const modelMatch = processedContent.substring(processedContent.indexOf(match)).match(/"model":\s*"([^"]+)"/);
      if (modelMatch && modelMatch[1].startsWith('Ferguson ')) {
        normalizedBrand = 'Massey Ferguson';
      }
    }
    brands.add(normalizedBrand);
  });
}

console.log(`🏭 Marcas únicas encontradas: ${brands.size}\n`);

// Contar tractores por marca (aproximado)
console.log('📋 Marcas encontradas:');
console.log('─'.repeat(50));
const sortedBrands = Array.from(brands).sort();
sortedBrands.forEach(brand => {
  const brandRegex = new RegExp(`"brand":\\s*"${brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g');
  const count = (processedContent.match(brandRegex) || []).length;
  console.log(`${brand.padEnd(30)} ~${count.toString().padStart(5)} tractores`);
});

// Verificar archivo de tractores estáticos
let staticCount = 0;
const tractorsPath = path.join(__dirname, '../data/tractors.ts');
if (fs.existsSync(tractorsPath)) {
  const tractorsContent = fs.readFileSync(tractorsPath, 'utf8');
  const staticMatches = tractorsContent.match(/id:\s*'[^']+'/g);
  staticCount = staticMatches ? staticMatches.length : 0;
  console.log(`\n📦 Tractores estáticos: ${staticCount.toLocaleString()}`);
}

// Verificar archivo JSON scrapeado
let scrapedCount = 0;
const scrapedPath = path.join(__dirname, '../data/scraped-tractors.json');
if (fs.existsSync(scrapedPath)) {
  try {
    const scrapedData = JSON.parse(fs.readFileSync(scrapedPath, 'utf8'));
    scrapedCount = Array.isArray(scrapedData) ? scrapedData.length : 0;
    console.log(`📥 Tractores en scraped-tractors.json: ${scrapedCount.toLocaleString()}`);
  } catch (e) {
    console.log('⚠️  No se pudo leer scraped-tractors.json');
  }
}

console.log(`\n✅ Total estimado de tractores: ${(tractorCount + staticCount).toLocaleString()}`);
if (scrapedCount > tractorCount) {
  console.log(`\n⚠️  ADVERTENCIA: Hay ${(scrapedCount - tractorCount).toLocaleString()} tractores en scraped-tractors.json que no están procesados.`);
  console.log(`   Ejecuta: npm run process-scraped`);
}
console.log('\n💡 Nota: Los datos se normalizan al cargar (John -> John Deere, CaseIH -> Case IH, etc.)');


const fs = require('fs');
const path = require('path');

const scrapedFile = path.join(__dirname, '..', 'data', 'scraped-tractors.json');

try {
  const data = JSON.parse(fs.readFileSync(scrapedFile, 'utf8'));
  const types = {};
  
  data.forEach(t => {
    const type = t.type || 'undefined';
    types[type] = (types[type] || 0) + 1;
  });
  
  console.log('Tipos de tractores en scraped-tractors.json:');
  Object.keys(types).sort().forEach(type => {
    console.log(`  ${type}: ${types[type]}`);
  });
  
  console.log(`\nTotal: ${data.length} tractores`);
  
  // Verificar algunos ejemplos
  console.log('\nEjemplos de tractores:');
  const sample = data.slice(0, 5);
  sample.forEach(t => {
    console.log(`  ${t.brand} ${t.model}: type="${t.type || 'undefined'}"`);
  });
  
} catch (error) {
  console.error('Error:', error.message);
}


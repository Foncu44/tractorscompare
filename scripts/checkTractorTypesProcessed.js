const fs = require('fs');
const path = require('path');

const processedFile = path.join(__dirname, '..', 'data', 'processed-tractors.ts');

try {
  const content = fs.readFileSync(processedFile, 'utf8');
  
  // Extraer tipos de tractores
  const typeMatches = content.match(/"type":\s*"([^"]+)"/g);
  const types = {};
  
  if (typeMatches) {
    typeMatches.forEach(match => {
      const type = match.match(/"type":\s*"([^"]+)"/)[1];
      types[type] = (types[type] || 0) + 1;
    });
  }
  
  console.log('Tipos de tractores en processed-tractors.ts:');
  Object.keys(types).sort().forEach(type => {
    console.log(`  ${type}: ${types[type]}`);
  });
  
  const total = Object.values(types).reduce((a, b) => a + b, 0);
  console.log(`\nTotal: ${total} tractores`);
  
} catch (error) {
  console.error('Error:', error.message);
}


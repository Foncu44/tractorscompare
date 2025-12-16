const fs = require('fs');
const path = require('path');

const processedFile = path.join(__dirname, '..', 'data', 'processed-tractors.ts');

try {
  const content = fs.readFileSync(processedFile, 'utf8');
  
  // Buscar solo el campo "type" del tractor (no de transmission)
  // Patrón: "type": "farm" o "type": "lawn" o "type": "industrial" que NO esté dentro de transmission
  const typePattern = /"type":\s*"(farm|lawn|industrial)"/g;
  const matches = content.match(typePattern);
  
  const types = {};
  if (matches) {
    matches.forEach(match => {
      const typeMatch = match.match(/"type":\s*"(farm|lawn|industrial)"/);
      if (typeMatch) {
        const type = typeMatch[1];
        types[type] = (types[type] || 0) + 1;
      }
    });
  }
  
  console.log('Tipos de tractores en processed-tractors.ts:');
  console.log('─'.repeat(50));
  Object.keys(types).sort().forEach(type => {
    console.log(`  ${type.padEnd(15)} ${types[type].toString().padStart(6)} tractores`);
  });
  
  const total = Object.values(types).reduce((a, b) => a + b, 0);
  console.log('─'.repeat(50));
  console.log(`  Total:        ${total.toString().padStart(6)} tractores`);
  
} catch (error) {
  console.error('Error:', error.message);
}


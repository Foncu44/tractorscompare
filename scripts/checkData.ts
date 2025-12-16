import { tractors, getAllBrands, getTractorsByBrand } from '../data/tractors';

console.log('=== RESUMEN DE DATOS CARGADOS ===\n');

// Total de tractores
console.log(`📊 Total de tractores: ${tractors.length.toLocaleString()}`);

// Total de marcas
const brands = getAllBrands();
console.log(`🏭 Total de marcas: ${brands.length}\n`);

// Tractores por marca
console.log('📋 Tractores por marca:');
console.log('─'.repeat(50));
brands.forEach(brand => {
  const brandTractors = getTractorsByBrand(brand);
  console.log(`${brand.padEnd(25)} ${brandTractors.length.toString().padStart(5)} tractores`);
});

// Top 10 marcas con más tractores
console.log('\n🏆 Top 10 marcas con más tractores:');
console.log('─'.repeat(50));
const brandsWithCount = brands.map(brand => ({
  brand,
  count: getTractorsByBrand(brand).length
})).sort((a, b) => b.count - a.count).slice(0, 10);

brandsWithCount.forEach((item, index) => {
  console.log(`${(index + 1).toString().padStart(2)}. ${item.brand.padEnd(25)} ${item.count.toString().padStart(5)} tractores`);
});

// Estadísticas adicionales
const farmTractors = tractors.filter(t => t.type === 'farm').length;
const lawnTractors = tractors.filter(t => t.type === 'lawn').length;
const withHP = tractors.filter(t => t.engine.powerHP > 0).length;

console.log('\n📈 Estadísticas adicionales:');
console.log('─'.repeat(50));
console.log(`Tractores agrícolas (farm): ${farmTractors.toLocaleString()}`);
console.log(`Tractores de jardín (lawn): ${lawnTractors.toLocaleString()}`);
console.log(`Tractores con HP especificado: ${withHP.toLocaleString()}`);
console.log(`Tractores sin HP: ${(tractors.length - withHP).toLocaleString()}`);


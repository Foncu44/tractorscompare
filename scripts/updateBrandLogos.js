/**
 * Script para actualizar brandLogos.ts con las URLs de logos encontradas
 */

const fs = require('fs-extra');
const path = require('path');

const LOGOS_FILE = path.join(__dirname, '..', 'data', 'brand-logos.json');
const BRAND_LOGOS_TS = path.join(__dirname, '..', 'lib', 'brandLogos.ts');

async function updateBrandLogos() {
  try {
    console.log('📖 Leyendo URLs de logos...');
    let brandLogos = {};
    try {
      brandLogos = await fs.readJson(LOGOS_FILE);
      console.log(`✅ ${Object.keys(brandLogos).length} URLs de logos cargadas`);
    } catch (error) {
      console.log('⚠️  No se encontró archivo de logos, continuando sin actualizar...');
      return;
    }

    if (Object.keys(brandLogos).length === 0) {
      console.log('⚠️  No hay logos para actualizar');
      return;
    }

    console.log('📖 Leyendo brandLogos.ts...');
    let content = await fs.readFile(BRAND_LOGOS_TS, 'utf-8');

    // Generar el nuevo mapeo de logos con URLs externas
    const logoMapEntries = [];
    const brandVariations = {};

    // Agrupar variaciones de marcas
    for (const [brand, logoUrl] of Object.entries(brandLogos)) {
      if (!logoUrl || logoUrl.trim() === '') continue;

      const normalizedBrand = brand.toLowerCase();
      
      // Crear variaciones comunes
      const variations = [
        brand, // Original
        brand.toLowerCase(), // lowercase
        brand.toUpperCase(), // UPPERCASE
        brand.replace(/\s+/g, ''), // Sin espacios
      ];

      // Casos especiales
      if (brand === 'Case IH') {
        variations.push('Case', 'case', 'CASE', 'CaseIH', 'caseih');
      } else if (brand === 'John Deere') {
        variations.push('JohnDeere', 'johndeere');
      } else if (brand === 'New Holland') {
        variations.push('NewHolland', 'newholland');
      } else if (brand === 'Massey Ferguson') {
        variations.push('MasseyFerguson', 'masseyferguson');
      }

      for (const variation of variations) {
        if (!brandVariations[variation]) {
          brandVariations[variation] = logoUrl;
        }
      }
    }

    // Generar el objeto brandMap
    for (const [variation, logoUrl] of Object.entries(brandVariations)) {
      logoMapEntries.push(`    '${variation}': '${logoUrl}',`);
    }

    // Reemplazar la función getBrandLogo
    const newGetBrandLogoFunction = `export function getBrandLogo(brandName: string): string | null {
  const brandMap: Record<string, string> = {
${logoMapEntries.join('\n')}
  };

  return brandMap[brandName] || null;
}`;

    // Reemplazar la función en el archivo
    const functionRegex = /export function getBrandLogo\(brandName: string\): string \| null \{[\s\S]*?\n\}/;
    if (functionRegex.test(content)) {
      content = content.replace(functionRegex, newGetBrandLogoFunction);
    } else {
      // Si no existe, agregarla después de los comentarios iniciales
      const commentMatch = content.match(/(\/\*\*[\s\S]*?\*\/)/);
      if (commentMatch) {
        content = content.replace(
          commentMatch[0],
          commentMatch[0] + '\n\n' + newGetBrandLogoFunction
        );
      }
    }

    // Guardar el archivo actualizado
    await fs.writeFile(BRAND_LOGOS_TS, content, 'utf-8');
    console.log(`💾 brandLogos.ts actualizado con ${Object.keys(brandVariations).length} variaciones de logos`);
    console.log(`✅ ${Object.keys(brandLogos).length} marcas actualizadas`);

  } catch (error) {
    console.error('❌ Error actualizando logos:', error);
    throw error;
  }
}

if (require.main === module) {
  updateBrandLogos().catch(console.error);
}

module.exports = { updateBrandLogos };


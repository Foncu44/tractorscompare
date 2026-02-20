/**
 * Script para enriquecer los datos de tractores con especificaciones detalladas
 * basadas en información de TractorData.com y otras fuentes
 */

const fs = require('fs-extra');
const path = require('path');

const TRACTORS_FILE = path.join(__dirname, '..', 'data', 'processed-tractors.ts');

// Función para extraer el array JSON del archivo TS
function extractJsonArrayFromProcessedTs(tsContent) {
  const exportIdx = tsContent.indexOf('export const scrapedTractors');
  if (exportIdx === -1) {
    throw new Error('No se encontró "export const scrapedTractors" en processed-tractors.ts');
  }
  const eqIdx = tsContent.indexOf('=', exportIdx);
  if (eqIdx === -1) throw new Error('No se encontró "=" tras "export const scrapedTractors"');
  const startIdx = tsContent.indexOf('[', eqIdx);
  if (startIdx === -1) throw new Error('No se encontró "[" del array de tractores');

  let depth = 0;
  let inString = false;
  let stringChar = null;
  for (let i = startIdx; i < tsContent.length; i++) {
    const ch = tsContent[i];
    const prevCh = i > 0 ? tsContent[i - 1] : '';
    
    // Manejar strings
    if (!inString && (ch === '"' || ch === "'" || ch === '`')) {
      inString = true;
      stringChar = ch;
    } else if (inString && ch === stringChar && prevCh !== '\\') {
      inString = false;
      stringChar = null;
    }
    
    if (!inString) {
      if (ch === '[') depth++;
      else if (ch === ']') {
        depth--;
        if (depth === 0) {
          return {
            arrayContent: tsContent.slice(startIdx, i + 1),
            startIdx,
            endIdx: i + 1
          };
        }
      }
    }
  }
  throw new Error('No se pudo extraer el array: corchetes desbalanceados');
}

// Datos enriquecidos para International Harvester 353
const enrichedIH353 = {
  id: "international-harvester-353",
  brand: "International Harvester",
  model: "353",
  type: "farm",
  slug: "international-harvester-353",
  imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e6/International_Harvester_353.jpg",
  productionYears: {
    start: 1967,
    end: 1972
  },
  engine: {
    manufacturer: "International Harvester",
    model: "D-155",
    cylinders: 3,
    displacement: 2.5, // 154.8 ci = 2.5 L
    powerHP: 38, // Gross power
    powerHPNet: 35.6, // Net power
    powerKW: 28.3,
    powerRPM: 1900,
    torqueMax: 143.7, // 106 lb-ft = 143.7 Nm
    torqueRPM: 1350,
    bore: 98, // 3.87 inches = 98 mm
    stroke: 111, // 4.37 inches = 111 mm
    compression: 16, // 16:1
    fuelType: "diesel",
    cooling: "liquid",
    starterVolts: 12
  },
  transmission: {
    type: "manual",
    gears: 8,
    description: "8-speed transmission, optional 12-speed creeper",
    clutch: "254mm dry disc",
    features: ["8 forward and 2 reverse", "Optional 12 forward and 6 reverse creeper"]
  },
  dimensions: {
    length: 3080, // 121.6 inches = 308 cm = 3080 mm
    width: 1620, // 63.8 inches = 162 cm = 1620 mm
    height: 1520, // 60 inches = 152 cm = 1520 mm (steering wheel)
    wheelbase: 1920, // 75.6 inches = 192 cm = 1920 mm
    groundClearance: 370, // 14.6 inches = 37 cm = 370 mm
    frontTread: {
      min: 1219, // 48 inches = 1219 mm
      max: 1859 // 73.2 inches = 1859 mm
    },
    rearTread: {
      min: 1280, // 50.4 inches = 1280 mm
      max: 1880 // 74 inches = 1880 mm
    }
  },
  weight: 1724, // 3801 lbs = 1724 kg
  hydraulicSystem: {
    liftCapacity: 1759, // 3880 lbs = 1759 kg
    category: "Category II/I"
  },
  ptoHP: 35.6, // Estimated based on net power
  ptoRPM: 540,
  ptoRearType: "Independent",
  ptoRearSpeeds: "540",
  capacities: {
    fuelTank: 60.2, // 15.9 gallons = 60.2 L
    hydraulicReservoir: 12.9, // 3.4 gallons = 12.9 L
    engineOil: 6.5, // 6.9 qts = 6.5 L
    coolant: 13.0 // 13.7 qts = 13.0 L
  },
  tires: {
    front: ["5.50-16", "6.00-16", "7.50-16"],
    rear: ["11.2/10-28", "9-32", "10-36", "11-32", "12-28", "9-36", "11-28", "11-36"]
  },
  description: "The International Harvester 353 is a classic farm tractor produced from 1967 to 1972. It features a 3-cylinder diesel engine producing 38 HP (gross) and 35.6 HP (net), with an 8-speed manual transmission. This reliable tractor was built in Neuss, Germany, and is known for its durability and versatility in agricultural applications.",
  seoContent: `
    <h2>International Harvester 353: Complete Tractor Specifications Guide</h2>
    
    <h3>Overview</h3>
    <p>The <strong>International Harvester 353</strong> is a classic agricultural tractor that was manufactured from <strong>1967 to 1972</strong> in Neuss, Germany. This reliable farm tractor is part of International Harvester's extensive lineup and remains popular among farmers and collectors today.</p>
    
    <h3>Production Information</h3>
    <ul>
      <li><strong>Production Years:</strong> 1967 - 1972</li>
      <li><strong>Manufacturer:</strong> International Harvester</li>
      <li><strong>Built in:</strong> Neuss, Germany</li>
    </ul>
    
    <h3>Engine Specifications</h3>
    <p>The International Harvester 353 is powered by the <strong>International Harvester D-155</strong> engine, a 3-cylinder diesel engine with the following specifications:</p>
    <ul>
      <li><strong>Engine Model:</strong> D-155</li>
      <li><strong>Cylinders:</strong> 3</li>
      <li><strong>Displacement:</strong> 2.5 L (154.8 ci)</li>
      <li><strong>Bore × Stroke:</strong> 98 mm × 111 mm (3.87 in × 4.37 in)</li>
      <li><strong>Maximum Power (Gross):</strong> 38 HP (28.3 kW) @ 1900 rpm</li>
      <li><strong>Net Power:</strong> 35.6 HP (26.5 kW)</li>
      <li><strong>Maximum Torque:</strong> 143.7 Nm (106 lb-ft) @ 1350 rpm</li>
      <li><strong>Compression Ratio:</strong> 16:1</li>
      <li><strong>Fuel Type:</strong> Diesel</li>
      <li><strong>Cooling:</strong> Liquid-cooled</li>
      <li><strong>Starter Voltage:</strong> 12V</li>
      <li><strong>Engine Oil Capacity:</strong> 6.5 L (6.9 qts)</li>
      <li><strong>Coolant Capacity:</strong> 13.0 L (13.7 qts)</li>
    </ul>
    
    <h3>Transmission</h3>
    <p>The International 353 features a <strong>manual transmission</strong> with two available options:</p>
    <ul>
      <li><strong>8-Speed Transmission:</strong> 8 forward and 2 reverse gears</li>
      <li><strong>12-Speed Creeper (Optional):</strong> 12 forward and 6 reverse gears for ultra-slow operation</li>
    </ul>
    <p><strong>Clutch:</strong> 254mm dry disc</p>
    <p><strong>Transmission Oil Capacity:</strong> 34.5 L (36.5 qts)</p>
    
    <h3>Dimensions and Weight</h3>
    <ul>
      <li><strong>Length:</strong> 3080 mm (121.6 in)</li>
      <li><strong>Width:</strong> 1620 mm (63.8 in)</li>
      <li><strong>Height (Steering Wheel):</strong> 1520 mm (60 in)</li>
      <li><strong>Wheelbase:</strong> 1920 mm (75.6 in)</li>
      <li><strong>Ground Clearance:</strong> 370 mm (14.6 in)</li>
      <li><strong>Front Tread:</strong> 1219 - 1859 mm (48 - 73.2 in)</li>
      <li><strong>Rear Tread:</strong> 1280 - 1880 mm (50.4 - 74 in)</li>
      <li><strong>Weight:</strong> 1724 kg (3801 lbs)</li>
    </ul>
    
    <h3>Tires</h3>
    <p><strong>Front Tire Options:</strong></p>
    <ul>
      <li>5.50-16</li>
      <li>6.00-16</li>
      <li>7.50-16</li>
    </ul>
    <p><strong>Rear Tire Options:</strong></p>
    <ul>
      <li>11.2/10-28</li>
      <li>9-32</li>
      <li>10-36</li>
      <li>11-32</li>
      <li>12-28</li>
      <li>9-36</li>
      <li>11-28</li>
      <li>11-36</li>
    </ul>
    
    <h3>Hydraulic System</h3>
    <ul>
      <li><strong>Rear Lift Capacity:</strong> 1759 kg (3880 lbs)</li>
      <li><strong>Hitch Category:</strong> Category II/I</li>
      <li><strong>Hydraulic Oil Capacity:</strong> 12.9 L (3.4 gallons)</li>
    </ul>
    
    <h3>Power Take-Off (PTO)</h3>
    <ul>
      <li><strong>Rear PTO Type:</strong> Independent</li>
      <li><strong>Rear PTO Speed:</strong> 540 rpm</li>
      <li><strong>PTO Power:</strong> Approximately 35.6 HP (based on net engine power)</li>
    </ul>
    
    <h3>Capacities</h3>
    <ul>
      <li><strong>Fuel Tank:</strong> 60.2 L (15.9 gallons)</li>
      <li><strong>Hydraulic Reservoir:</strong> 12.9 L (3.4 gallons)</li>
      <li><strong>Engine Oil:</strong> 6.5 L (6.9 qts)</li>
      <li><strong>Cooling System:</strong> 13.0 L (13.7 qts)</li>
      <li><strong>Transmission Oil:</strong> 34.5 L (36.5 qts)</li>
    </ul>
    
    <h3>Mechanical Features</h3>
    <ul>
      <li><strong>Drive:</strong> Two-wheel drive (2WD)</li>
      <li><strong>Differential Lock:</strong> Mechanical rear</li>
      <li><strong>Operator Station:</strong> Open operator station</li>
    </ul>
    
    <h3>Conclusion</h3>
    <p>The International Harvester 353 is a well-regarded classic tractor that offers reliable performance for a variety of agricultural tasks. With its 38 HP diesel engine, versatile transmission options, and robust construction, it remains a popular choice for farmers seeking a dependable workhorse. Whether you're looking for detailed specifications, maintenance information, or historical data about this model, this comprehensive guide provides all the essential information about the International Harvester 353 tractor.</p>
  `,
  metaDescription: "Complete International Harvester 353 tractor specifications (1967-1972). 38 HP 3-cylinder diesel engine, 8-speed manual transmission, 1724 kg weight. Detailed specs including engine, transmission, dimensions, tires, hydraulics, and PTO data.",
  metaKeywords: [
    "international harvester 353",
    "international 353",
    "ih 353",
    "international harvester 353 specs",
    "international 353 tractor",
    "353 tractor specifications",
    "ih 353 specifications",
    "international harvester 353 data",
    "international 353 tractor data",
    "tractor data",
    "tractor specifications"
  ],
  priceRange: {
    min: 21888,
    max: 32832
  }
};

async function enrichTractorData() {
  try {
    console.log('Leyendo archivo de tractores...');
    const tsContent = await fs.readFile(TRACTORS_FILE, 'utf-8');
    
    const { arrayContent, startIdx, endIdx } = extractJsonArrayFromProcessedTs(tsContent);
    
    // Parsear el array JSON
    let tractors;
    try {
      tractors = JSON.parse(arrayContent);
    } catch (e) {
      console.error('Error al parsear JSON:', e.message);
      throw e;
    }
    
    console.log(`Total de tractores encontrados: ${tractors.length}`);
    
    // Buscar el International 353
    const ih353Index = tractors.findIndex(t => t.id === 'international-harvester-353');
    
    if (ih353Index === -1) {
      console.log('No se encontró el International Harvester 353 en los datos.');
      console.log('Buscando por slug...');
      const ih353BySlug = tractors.findIndex(t => t.slug === 'international-harvester-353');
      if (ih353BySlug === -1) {
        console.log('Tractor no encontrado. Agregando como nuevo...');
        tractors.push(enrichedIH353);
      } else {
        console.log('Encontrado por slug, actualizando...');
        tractors[ih353BySlug] = { ...tractors[ih353BySlug], ...enrichedIH353 };
      }
    } else {
      console.log('International Harvester 353 encontrado, actualizando datos...');
      // Fusionar datos existentes con datos enriquecidos
      tractors[ih353Index] = { ...tractors[ih353Index], ...enrichedIH353 };
    }
    
    // Convertir de vuelta a JSON con formato
    const updatedArrayContent = JSON.stringify(tractors, null, 2);
    
    // Reconstruir el archivo TS
    const beforeArray = tsContent.slice(0, startIdx);
    const afterArray = tsContent.slice(endIdx);
    const newContent = beforeArray + updatedArrayContent + afterArray;
    
    // Crear backup
    const backupFile = TRACTORS_FILE + '.backup.' + Date.now();
    await fs.writeFile(backupFile, tsContent);
    console.log(`Backup creado: ${backupFile}`);
    
    // Escribir archivo actualizado
    await fs.writeFile(TRACTORS_FILE, newContent);
    console.log('✓ Datos del International Harvester 353 enriquecidos exitosamente!');
    console.log(`✓ Archivo actualizado: ${TRACTORS_FILE}`);
    
  } catch (error) {
    console.error('Error al enriquecer datos:', error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  enrichTractorData();
}

module.exports = { enrichTractorData, enrichedIH353 };

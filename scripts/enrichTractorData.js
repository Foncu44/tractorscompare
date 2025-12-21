/**
 * Script para enriquecer los datos de tractores con información adicional
 * de las webs de fabricantes, catálogos técnicos y documentación.
 * 
 * Este script intenta buscar:
 * - Especificaciones técnicas detalladas (torque, bore/stroke, etc.)
 * - Enlaces a catálogos técnicos
 * - Enlaces a manuales de operador y servicio
 * - Enlaces a páginas de productos del fabricante
 */

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');

const TRACTORS_FILE = path.join(__dirname, '..', 'data', 'processed-tractors.ts');
const BRAND_WEBSITES_FILE = path.join(__dirname, '..', 'data', 'brand-websites.json');
const PROGRESS_FILE = path.join(__dirname, '..', 'data', 'enrichment-progress.json');

// Delay entre requests para evitar rate limiting
const DELAY_MS = 2000;

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
  for (let i = startIdx; i < tsContent.length; i++) {
    const ch = tsContent[i];
    if (ch === '[') depth++;
    else if (ch === ']') {
      depth--;
      if (depth === 0) {
        return tsContent.slice(startIdx, i + 1);
      }
    }
  }
  throw new Error('No se pudo extraer el array: corchetes desbalanceados');
}

/**
 * Busca información adicional de un tractor en la web del fabricante
 */
async function searchManufacturerWebsite(brandWebsite, brand, model, year) {
  if (!brandWebsite) return null;

  try {
    // Construir posibles URLs de búsqueda
    const searchQueries = [
      `${brandWebsite}search?q=${encodeURIComponent(`${brand} ${model}`)}`,
      `${brandWebsite}products/${encodeURIComponent(model.toLowerCase().replace(/\s+/g, '-'))}`,
      `${brandWebsite}tractors/${encodeURIComponent(model.toLowerCase().replace(/\s+/g, '-'))}`,
    ];

    for (const url of searchQueries) {
      try {
        const response = await axios.get(url, {
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        });

        const $ = cheerio.load(response.data);
        
        // Buscar enlaces a PDFs (catálogos, manuales)
        const pdfLinks = [];
        $('a[href$=".pdf"], a[href*="catalog"], a[href*="manual"], a[href*="spec"]').each((i, el) => {
          const href = $(el).attr('href');
          if (href) {
            const fullUrl = href.startsWith('http') ? href : new URL(href, brandWebsite).href;
            pdfLinks.push(fullUrl);
          }
        });

        // Buscar enlaces a páginas de productos
        const productLinks = [];
        $('a[href*="product"], a[href*="tractor"], a[href*="model"]').each((i, el) => {
          const href = $(el).attr('href');
          const text = $(el).text().toLowerCase();
          if (href && (text.includes(model.toLowerCase()) || text.includes(brand.toLowerCase()))) {
            const fullUrl = href.startsWith('http') ? href : new URL(href, brandWebsite).href;
            productLinks.push(fullUrl);
          }
        });

        // Intentar extraer especificaciones técnicas del HTML
        const specs = {};
        const specText = $('body').text().toLowerCase();
        
        // Buscar torque (ej: "610 Nm", "450 lb-ft")
        const torqueMatch = specText.match(/(\d+)\s*(nm|lb-ft|lbft)/i);
        if (torqueMatch) {
          specs.torqueMax = parseInt(torqueMatch[1]);
        }

        // Buscar bore/stroke
        const boreMatch = specText.match(/bore[:\s]+(\d+)\s*mm/i);
        const strokeMatch = specText.match(/stroke[:\s]+(\d+)\s*mm/i);
        if (boreMatch) specs.bore = parseInt(boreMatch[1]);
        if (strokeMatch) specs.stroke = parseInt(strokeMatch[1]);

        if (pdfLinks.length > 0 || productLinks.length > 0 || Object.keys(specs).length > 0) {
          return {
            documentation: {
              technicalCatalog: pdfLinks.find(link => link.includes('catalog') || link.includes('spec')) || null,
              operatorManual: pdfLinks.find(link => link.includes('operator') || link.includes('manual')) || null,
              serviceManual: pdfLinks.find(link => link.includes('service') || link.includes('repair')) || null,
              partsCatalog: pdfLinks.find(link => link.includes('parts')) || null,
              manufacturerPage: productLinks[0] || null,
            },
            engine: specs,
          };
        }
      } catch (err) {
        // Continuar con la siguiente URL si esta falla
        continue;
      }
    }
  } catch (error) {
    console.error(`Error buscando en ${brandWebsite} para ${brand} ${model}:`, error.message);
  }

  return null;
}

/**
 * Extrae especificaciones detalladas del texto HTML
 */
function extractDetailedSpecs($, pageText) {
  const specs = {
    engine: {},
    transmission: {},
    hydraulics: {},
    pto: {},
    capacities: {},
    dimensions: {}
  };

  const text = pageText.toLowerCase();
  
  // Motor - Manufacturer y Model
  const engineManufacturerMatch = text.match(/(?:engine|motor)[\s\w]*manufacturer[:\s]+([a-z\s]+(?:powertech|deere|perkins|cummins|deutz|fpt|agco)[a-z\s]*)/i);
  if (engineManufacturerMatch) {
    specs.engine.manufacturer = engineManufacturerMatch[1].trim();
  }
  
  const engineModelMatch = text.match(/(?:engine|motor)[\s\w]*model[:\s]+([a-z0-9\-\s]+)/i);
  if (engineModelMatch) {
    specs.engine.model = engineModelMatch[1].trim();
  }

  // Motor - Torque con RPM
  const torqueMatch = text.match(/(?:max|maximum)[\s]*torque[:\s]+(\d+)\s*(?:nm|lb-ft)[\s]*@[\s]*(\d+)\s*rpm/i);
  if (torqueMatch) {
    specs.engine.torqueMax = parseInt(torqueMatch[1]);
    specs.engine.torqueRPM = parseInt(torqueMatch[2]);
  }

  // Motor - Torque Reserve
  const torqueReserveMatch = text.match(/torque[\s]*reserve[:\s]+(\d+)\s*%/i);
  if (torqueReserveMatch) {
    specs.engine.torqueReserve = parseInt(torqueReserveMatch[1]);
  }

  // Motor - Bore × Stroke
  const boreStrokeMatch = text.match(/(?:bore|diámetro)[\s]*[×x][\s]*(?:stroke|carrera)[:\s]+(\d+)\s*mm[\s]*[×x][\s]*(\d+)\s*mm/i);
  if (boreStrokeMatch) {
    specs.engine.bore = parseInt(boreStrokeMatch[1]);
    specs.engine.stroke = parseInt(boreStrokeMatch[2]);
  } else {
    const boreMatch = text.match(/bore[:\s]+(\d+)\s*mm/i);
    const strokeMatch = text.match(/stroke[:\s]+(\d+)\s*mm/i);
    if (boreMatch) specs.engine.bore = parseInt(boreMatch[1]);
    if (strokeMatch) specs.engine.stroke = parseInt(strokeMatch[1]);
  }

  // Motor - Fuel System
  const fuelSystemMatch = text.match(/(?:fuel|combustible)[\s]*system[:\s]+([a-z\s]+(?:common[\s]*rail|direct[\s]*injection|injection))/i);
  if (fuelSystemMatch) {
    specs.engine.fuelSystem = fuelSystemMatch[1].trim();
  }

  // Motor - Aspiration
  const aspirationMatch = text.match(/(?:aspiration|aspiración)[:\s]+([a-z\s]+(?:turbocharged|turboalimentado|naturally[\s]*aspirated|con[\s]*intercooler))/i);
  if (aspirationMatch) {
    specs.engine.aspiration = aspirationMatch[1].trim();
  }

  // Motor - Emissions
  const emissionsMatch = text.match(/(?:emissions|normativa|standard)[:\s]+([a-z0-9\s\/]+(?:tier[\s]*4|stage[\s]*v|tier[\s]*3))/i);
  if (emissionsMatch) {
    specs.engine.emissions = emissionsMatch[1].trim();
  }

  // Transmisión - Speed Range
  const speedRangeMatch = text.match(/(?:speed|velocidad)[\s]*range[:\s]+([\d\.\s\-\/]+(?:km\/h|mph))/i);
  if (speedRangeMatch) {
    specs.transmission.speedRange = speedRangeMatch[1].trim();
  }

  // Transmisión - Reverser
  const reverserMatch = text.match(/(?:reverser|inversor)[:\s]+([a-z\s]+(?:electro|hidráulico|hydraulic))/i);
  if (reverserMatch) {
    specs.transmission.reverser = reverserMatch[1].trim();
  }

  // Transmisión - Clutch
  const clutchMatch = text.match(/(?:clutch|embrague)[:\s]+([a-z\s]+(?:wet|húmedo|multi|disco|disc))/i);
  if (clutchMatch) {
    specs.transmission.clutch = clutchMatch[1].trim();
  }

  // Transmisión - Features
  const features = [];
  if (text.includes('clutchless') || text.includes('sin embrague')) features.push('Clutchless shift');
  if (text.includes('eco mode') || text.includes('modo eco')) features.push('ECO Mode');
  if (text.includes('cruise control') || text.includes('control crucero')) features.push('Cruise control');
  if (text.includes('automatic speed') || text.includes('gestión automática')) features.push('Automatic speed management');
  if (features.length > 0) {
    specs.transmission.features = features;
  }

  // Hidráulica - Type
  const hydraulicsTypeMatch = text.match(/(?:hydraulic|hidráulico)[\s]*(?:system|sistema|type)[:\s]+([a-z\s]+(?:closed|abierto|center|centro|compensation|compensación))/i);
  if (hydraulicsTypeMatch) {
    specs.hydraulics.type = hydraulicsTypeMatch[1].trim();
  }

  // Hidráulica - Max Pressure
  const maxPressureMatch = text.match(/(?:max|maximum)[\s]*pressure[:\s]+(\d+)\s*bar/i);
  if (maxPressureMatch) {
    specs.hydraulics.maxPressure = parseInt(maxPressureMatch[1]);
  }

  // Hidráulica - Valves
  const rearValvesMatch = text.match(/(?:rear|traseras)[\s]*valves[:\s]+(\d+)[\s]*(?:standard|estándar)[,\s]*(?:up[\s]*to|hasta)[\s]*(\d+)/i);
  if (rearValvesMatch) {
    specs.hydraulics.rearValves = parseInt(rearValvesMatch[1]);
    specs.hydraulics.rearValvesMax = parseInt(rearValvesMatch[2]);
  }

  const frontValvesMatch = text.match(/(?:front|delanteras)[\s]*valves[:\s]+(\d+)[\s]*(?:optional|opcionales)/i);
  if (frontValvesMatch) {
    specs.hydraulics.frontValves = parseInt(frontValvesMatch[1]);
  }

  // Hidráulica - Front Lift Capacity
  const frontLiftMatch = text.match(/(?:front|delantero)[\s]*lift[:\s]+(\d+[,\d]*)\s*kg/i);
  if (frontLiftMatch) {
    specs.hydraulics.frontLiftCapacity = parseInt(frontLiftMatch[1].replace(/,/g, ''));
  }

  // PTO - Rear Type
  const ptoRearTypeMatch = text.match(/(?:pto|toma[\s]*fuerza)[\s]*(?:rear|trasero)[\s]*type[:\s]+([a-z]+)/i);
  if (ptoRearTypeMatch) {
    specs.pto.ptoRearType = ptoRearTypeMatch[1].trim();
  }

  // PTO - Rear Speeds
  const ptoSpeedsMatch = text.match(/(?:pto|toma)[\s]*(?:rear|trasero)[\s]*speeds[:\s]+([\d\s\/E]+)/i);
  if (ptoSpeedsMatch) {
    specs.pto.ptoRearSpeeds = ptoSpeedsMatch[1].trim();
  }

  // PTO - Front
  const ptoFrontMatch = text.match(/(?:pto|toma)[\s]*(?:front|delantero)[:\s]+([\d\s]+rpm[\s]*(?:optional|opcional)?)/i);
  if (ptoFrontMatch) {
    specs.pto.ptoFront = ptoFrontMatch[1].trim();
  }

  // PTO - Actuation
  const ptoActuationMatch = text.match(/(?:pto|toma)[\s]*actuation[:\s]+([a-z]+)/i);
  if (ptoActuationMatch) {
    specs.pto.ptoActuation = ptoActuationMatch[1].trim();
  }

  // Capacidades - Fuel Tank
  const fuelTankMatch = text.match(/(?:fuel|combustible)[\s]*(?:tank|depósito)[:\s]+(\d+)\s*l/i);
  if (fuelTankMatch) {
    specs.capacities.fuelTank = parseInt(fuelTankMatch[1]);
  }

  // Capacidades - Hydraulic Oil
  const hydraulicOilMatch = text.match(/(?:hydraulic|hidráulico)[\s]*(?:oil|aceite|reservoir)[:\s]+(\d+)\s*l/i);
  if (hydraulicOilMatch) {
    specs.capacities.hydraulicReservoir = parseInt(hydraulicOilMatch[1]);
  }

  // Capacidades - Engine Oil
  const engineOilMatch = text.match(/(?:engine|motor)[\s]*(?:oil|aceite)[:\s]+(\d+)\s*l/i);
  if (engineOilMatch) {
    specs.capacities.engineOil = parseInt(engineOilMatch[1]);
  }

  // Capacidades - Coolant
  const coolantMatch = text.match(/(?:coolant|refrigeración|cooling)[\s]*(?:system|sistema)[:\s]+(\d+)\s*l/i);
  if (coolantMatch) {
    specs.capacities.coolant = parseInt(coolantMatch[1]);
  }

  // Capacidades - Transmission Oil
  const transmissionOilMatch = text.match(/(?:transmission|transmisión)[\s]*(?:oil|aceite)[:\s]+(\d+)\s*l/i);
  if (transmissionOilMatch) {
    specs.capacities.transmissionOil = parseInt(transmissionOilMatch[1]);
  }

  return specs;
}

/**
 * Busca información en TractorData.com como fuente alternativa
 */
async function searchTractorData(brand, model) {
  try {
    const searchUrl = `https://www.tractordata.com/search.html?q=${encodeURIComponent(`${brand} ${model}`)}`;
    const response = await axios.get(searchUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const $ = cheerio.load(response.data);
    
    // Buscar enlaces a páginas de tractores
    const tractorLinks = [];
    $('a[href*="/tractors/"]').each((i, el) => {
      const href = $(el).attr('href');
      if (href) {
        const fullUrl = href.startsWith('http') ? href : `https://www.tractordata.com${href}`;
        tractorLinks.push(fullUrl);
      }
    });

    if (tractorLinks.length > 0) {
      // Intentar acceder a la primera página de tractor
      try {
        const tractorPage = await axios.get(tractorLinks[0], { timeout: 10000 });
        const $tractor = cheerio.load(tractorPage.data);
        const pageText = $tractor('body').text();
        
        const specs = extractDetailedSpecs($tractor, pageText);
        
        // También extraer de tablas estructuradas
        $tractor('table tr, .spec-row, .specification').each((i, el) => {
          const label = $tractor(el).find('td:first-child, th:first-child, .spec-label, dt').text().toLowerCase().trim();
          const value = $tractor(el).find('td:last-child, th:last-child, .spec-value, dd').text().trim();
          
          if (!label || !value) return;
          
          // Motor
          if (label.includes('torque') && !specs.engine.torqueMax) {
            const match = value.match(/(\d+)\s*(?:nm|lb-ft)/i);
            if (match) specs.engine.torqueMax = parseInt(match[1]);
            const rpmMatch = value.match(/@\s*(\d+)\s*rpm/i);
            if (rpmMatch) specs.engine.torqueRPM = parseInt(rpmMatch[1]);
          }
          if (label.includes('bore') && !specs.engine.bore) {
            const match = value.match(/(\d+)/);
            if (match) specs.engine.bore = parseInt(match[1]);
          }
          if (label.includes('stroke') && !specs.engine.stroke) {
            const match = value.match(/(\d+)/);
            if (match) specs.engine.stroke = parseInt(match[1]);
          }
          if (label.includes('manufacturer') && !specs.engine.manufacturer) {
            specs.engine.manufacturer = value;
          }
          if (label.includes('engine model') && !specs.engine.model) {
            specs.engine.model = value;
          }
          
          // Transmisión
          if (label.includes('speed range') && !specs.transmission.speedRange) {
            specs.transmission.speedRange = value;
          }
          if (label.includes('reverser') && !specs.transmission.reverser) {
            specs.transmission.reverser = value;
          }
          
          // Hidráulica
          if (label.includes('hydraulic type') && !specs.hydraulics.type) {
            specs.hydraulics.type = value;
          }
          if (label.includes('max pressure') && !specs.hydraulics.maxPressure) {
            const match = value.match(/(\d+)/);
            if (match) specs.hydraulics.maxPressure = parseInt(match[1]);
          }
          
          // PTO
          if (label.includes('pto') && label.includes('rear') && label.includes('type') && !specs.pto.ptoRearType) {
            specs.pto.ptoRearType = value;
          }
          if (label.includes('pto') && label.includes('speeds') && !specs.pto.ptoRearSpeeds) {
            specs.pto.ptoRearSpeeds = value;
          }
          
          // Capacidades
          if (label.includes('fuel tank') && !specs.capacities.fuelTank) {
            const match = value.match(/(\d+)/);
            if (match) specs.capacities.fuelTank = parseInt(match[1]);
          }
        });

        // Limpiar objetos vacíos
        const result = {};
        if (Object.keys(specs.engine).length > 0) result.engine = specs.engine;
        if (Object.keys(specs.transmission).length > 0) result.transmission = specs.transmission;
        if (Object.keys(specs.hydraulics).length > 0) result.hydraulics = specs.hydraulics;
        if (Object.keys(specs.pto).length > 0) result.pto = specs.pto;
        if (Object.keys(specs.capacities).length > 0) result.capacities = specs.capacities;

        if (Object.keys(result).length > 0) {
          return result;
        }
      } catch (err) {
        // Ignorar errores al acceder a páginas individuales
      }
    }
  } catch (error) {
    // Ignorar errores de TractorData
  }

  return null;
}

/**
 * Estima un rango de precios basado en las características del tractor
 */
function estimatePriceRange(tractor) {
  const powerHP = tractor.engine?.powerHP || 0;
  const year = tractor.year || new Date().getFullYear() - 5; // Asumir 5 años si no hay año
  const type = tractor.type || 'farm';
  const brand = tractor.brand || '';
  
  // Factores de marca (premium brands son más caras)
  const premiumBrands = ['John Deere', 'Case IH', 'New Holland', 'Fendt', 'Claas', 'Deutz-Fahr', 'Valtra'];
  const midRangeBrands = ['Massey Ferguson', 'Kubota', 'McCormick', 'Landini', 'SAME'];
  const brandMultiplier = premiumBrands.includes(brand) ? 1.3 : 
                         midRangeBrands.includes(brand) ? 1.1 : 1.0;
  
  // Base de precio por tipo
  let basePricePerHP = 0;
  if (type === 'farm') {
    basePricePerHP = 800; // $800 por HP para tractores agrícolas
  } else if (type === 'lawn') {
    basePricePerHP = 200; // $200 por HP para tractores de jardín
  } else {
    basePricePerHP = 1000; // $1000 por HP para tractores industriales
  }
  
  // Calcular precio base
  let basePrice = powerHP * basePricePerHP * brandMultiplier;
  
  // Ajustar por año (tractores más nuevos son más caros)
  const currentYear = new Date().getFullYear();
  let age = currentYear - year;
  if (age < 0) age = 0; // Si el año es futuro, tratarlo como nuevo
  
  // Factor de depreciación por año (máximo 50% de descuento para tractores muy viejos)
  const depreciationFactor = Math.max(0.5, 1 - (age * 0.02)); // 2% menos por año
  basePrice = basePrice * depreciationFactor;
  
  // Ajustar por tamaño (tractores muy pequeños o muy grandes tienen diferentes precios)
  if (powerHP < 20) {
    basePrice = basePrice * 1.2; // Tractores pequeños son relativamente más caros
  } else if (powerHP > 200) {
    basePrice = basePrice * 1.15; // Tractores grandes también son más caros
  }
  
  // Crear rango de precios (±20% del precio estimado)
  const minPrice = Math.round(basePrice * 0.8);
  const maxPrice = Math.round(basePrice * 1.2);
  
  // Asegurar mínimo razonable
  const finalMin = Math.max(minPrice, type === 'lawn' ? 2000 : 10000);
  const finalMax = Math.max(maxPrice, type === 'lawn' ? 3000 : 15000);
  
  return {
    min: finalMin,
    max: finalMax
  };
}

/**
 * Busca precio en la web del fabricante o TractorData
 */
async function searchPrice(brand, model, year, powerHP) {
  // Intentar buscar en TractorData.com
  try {
    const searchUrl = `https://www.tractordata.com/search.html?q=${encodeURIComponent(`${brand} ${model}`)}`;
    const response = await axios.get(searchUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const $ = cheerio.load(response.data);
    
    // Buscar enlaces a páginas de tractores
    const tractorLinks = [];
    $('a[href*="/tractors/"]').each((i, el) => {
      const href = $(el).attr('href');
      if (href) {
        const fullUrl = href.startsWith('http') ? href : `https://www.tractordata.com${href}`;
        tractorLinks.push(fullUrl);
      }
    });

    if (tractorLinks.length > 0) {
      try {
        const tractorPage = await axios.get(tractorLinks[0], { timeout: 10000 });
        const $tractor = cheerio.load(tractorPage.data);
        
        // Buscar precio en la página
        const pageText = $tractor('body').text();
        const pricePatterns = [
          /\$([\d,]+)\s*-\s*\$([\d,]+)/, // $50,000 - $100,000
          /price[:\s]+\$([\d,]+)/i,
          /(\d+)\s*-\s*(\d+)\s*(?:usd|dollars?)/i,
        ];
        
        for (const pattern of pricePatterns) {
          const match = pageText.match(pattern);
          if (match) {
            if (match[2]) {
              // Rango de precios
              return {
                min: parseInt(match[1].replace(/,/g, '')),
                max: parseInt(match[2].replace(/,/g, ''))
              };
            } else {
              // Precio único, crear rango ±20%
              const price = parseInt(match[1].replace(/,/g, ''));
              return {
                min: Math.round(price * 0.8),
                max: Math.round(price * 1.2)
              };
            }
          }
        }
      } catch (err) {
        // Ignorar errores
      }
    }
  } catch (error) {
    // Ignorar errores
  }
  
  return null;
}

/**
 * Verifica si un tractor necesita enriquecimiento adicional
 */
function needsEnrichment(tractor) {
  // Verificar si faltan datos detallados que ahora podemos extraer
  const hasDetailedEngine = tractor.engine?.manufacturer || tractor.engine?.model || 
                           tractor.engine?.torqueReserve || tractor.engine?.fuelSystem || 
                           tractor.engine?.aspiration || tractor.engine?.emissions;
  const hasDetailedTransmission = tractor.transmission?.speedRange || tractor.transmission?.reverser || 
                                 tractor.transmission?.clutch || tractor.transmission?.features?.length > 0;
  const hasDetailedHydraulics = tractor.hydraulicSystem?.type || tractor.hydraulicSystem?.maxPressure || 
                               tractor.hydraulicSystem?.rearValvesMax || tractor.hydraulicSystem?.frontValves ||
                               tractor.hydraulicSystem?.frontLiftCapacity;
  const hasDetailedPTO = tractor.ptoRearType || tractor.ptoRearSpeeds || tractor.ptoFront || 
                        tractor.ptoActuation;
  const hasDetailedCapacities = tractor.capacities?.fuelTank || tractor.capacities?.hydraulicReservoir || 
                               tractor.capacities?.coolant || tractor.capacities?.engineOil || 
                               tractor.capacities?.transmissionOil;
  
  // Si falta alguno de estos datos detallados, necesita enriquecimiento
  return !hasDetailedEngine || !hasDetailedTransmission || !hasDetailedHydraulics || 
         !hasDetailedPTO || !hasDetailedCapacities;
}

/**
 * Enriquece un tractor con información adicional
 */
async function enrichTractor(tractor, brandWebsites) {
  const brandWebsite = brandWebsites[tractor.brand] || tractor.brandWebsite;
  
  // Normalizar marca (John -> John Deere, etc.)
  let normalizedBrand = tractor.brand;
  if (tractor.brand === 'John' && tractor.model.startsWith('Deere ')) {
    normalizedBrand = 'John Deere';
  } else if (tractor.brand === 'New' && tractor.model.startsWith('Holland ')) {
    normalizedBrand = 'New Holland';
  } else if (tractor.brand === 'Massey' && tractor.model.startsWith('Ferguson ')) {
    normalizedBrand = 'Massey Ferguson';
  }

  const model = tractor.model.replace(/^(Deere |Holland |Ferguson )/, '');

  let enriched = false;

  // 1. Buscar precio (solo si no tiene)
  if (!tractor.priceRange) {
    const priceData = await searchPrice(normalizedBrand, model, tractor.year, tractor.engine?.powerHP);
    if (priceData) {
      tractor.priceRange = priceData;
      enriched = true;
    } else {
      // Si no se encuentra, estimar basado en características
      tractor.priceRange = estimatePriceRange(tractor);
      enriched = true;
    }
    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
  }

  // 2. Buscar en web del fabricante
  if (brandWebsite) {
    const manufacturerInfo = await searchManufacturerWebsite(brandWebsite, normalizedBrand, model, tractor.year);
    if (manufacturerInfo?.documentation && !tractor.documentation) {
      tractor.documentation = manufacturerInfo.documentation;
      enriched = true;
    }
    if (manufacturerInfo?.engine && Object.keys(manufacturerInfo.engine).length > 0) {
      tractor.engine = { ...tractor.engine, ...manufacturerInfo.engine };
      enriched = true;
    }
    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
  }

  // 3. Buscar especificaciones técnicas adicionales de TractorData.com
  // Solo si necesita enriquecimiento o si no tiene datos detallados
  if (needsEnrichment(tractor)) {
    const tractorDataInfo = await searchTractorData(normalizedBrand, model);
    if (tractorDataInfo) {
      if (tractorDataInfo.engine && Object.keys(tractorDataInfo.engine).length > 0) {
        tractor.engine = { ...tractor.engine, ...tractorDataInfo.engine };
        enriched = true;
      }
      if (tractorDataInfo.transmission && Object.keys(tractorDataInfo.transmission).length > 0) {
        tractor.transmission = { ...tractor.transmission, ...tractorDataInfo.transmission };
        enriched = true;
      }
      if (tractorDataInfo.hydraulics && Object.keys(tractorDataInfo.hydraulics).length > 0) {
        if (!tractor.hydraulicSystem) tractor.hydraulicSystem = {};
        tractor.hydraulicSystem = { ...tractor.hydraulicSystem, ...tractorDataInfo.hydraulics };
        enriched = true;
      }
      if (tractorDataInfo.pto && Object.keys(tractorDataInfo.pto).length > 0) {
        Object.assign(tractor, tractorDataInfo.pto);
        enriched = true;
      }
      if (tractorDataInfo.capacities && Object.keys(tractorDataInfo.capacities).length > 0) {
        if (!tractor.capacities) tractor.capacities = {};
        tractor.capacities = { ...tractor.capacities, ...tractorDataInfo.capacities };
        enriched = true;
      }
    }
    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
  }

  return enriched;
}

/**
 * Función principal
 */
async function main() {
  console.log('🚀 Iniciando enriquecimiento de datos de tractores...\n');

  // Cargar datos
  const content = await fs.readFile(TRACTORS_FILE, 'utf-8');
  const arrText = extractJsonArrayFromProcessedTs(content);
  const tractors = JSON.parse(arrText);
  const brandWebsites = await fs.readJson(BRAND_WEBSITES_FILE);

  // Cargar progreso previo
  let progress = { processed: [], lastIndex: 0 };
  if (await fs.pathExists(PROGRESS_FILE)) {
    progress = await fs.readJson(PROGRESS_FILE);
  }

  console.log(`📊 Total de tractores: ${tractors.length}`);
  console.log(`✅ Ya procesados: ${progress.processed.length}`);
  console.log(`📍 Continuando desde índice: ${progress.lastIndex}\n`);

  let enriched = 0;
  let pricesAdded = 0;
  let skipped = 0;
  let errors = 0;

  // Primero, asegurar que todos los tractores tengan precio estimado
  console.log('💰 Asignando rangos de precios estimados a todos los tractores...');
  for (let i = 0; i < tractors.length; i++) {
    if (!tractors[i].priceRange) {
      tractors[i].priceRange = estimatePriceRange(tractors[i]);
      pricesAdded++;
    }
  }
  console.log(`✅ ${pricesAdded} tractores recibieron rango de precios estimado\n`);

  // Verificar si necesitamos procesar desde el principio (si hay nuevos campos que extraer)
  // Muestra una muestra de tractores para verificar si necesitan enriquecimiento
  let needsFullReenrichment = false;
  const sampleSize = Math.min(10, tractors.length);
  for (let i = 0; i < sampleSize; i++) {
    if (needsEnrichment(tractors[i])) {
      needsFullReenrichment = true;
      break;
    }
  }

  let startIndex = progress.lastIndex;
  if (startIndex >= tractors.length || needsFullReenrichment) {
    if (needsFullReenrichment) {
      console.log('🔄 Detectados nuevos campos para extraer. Reiniciando proceso para enriquecer todos los tractores...\n');
    } else {
      console.log('🔄 Reiniciando proceso desde el principio...\n');
    }
    startIndex = 0;
    progress.lastIndex = 0;
    progress.processed = [];
  }

  // Procesar tractores para datos adicionales
  for (let i = startIndex; i < tractors.length; i++) {
    const tractor = tractors[i];
    
    try {
      const wasEnriched = await enrichTractor(tractor, brandWebsites);
      if (wasEnriched) {
        enriched++;
        if ((i + 1) % 50 === 0) {
          console.log(`✅ [${i + 1}/${tractors.length}] Enriquecido: ${tractor.brand} ${tractor.model}`);
        }
      } else {
        skipped++;
        if ((i + 1) % 100 === 0) {
          console.log(`⏭️  [${i + 1}/${tractors.length}] Sin datos adicionales: ${tractor.brand} ${tractor.model}`);
        }
      }

      // Guardar progreso cada 50 tractores
      if ((i + 1) % 50 === 0) {
        progress.lastIndex = i + 1;
        progress.processed.push(tractor.id);
        await fs.writeJson(PROGRESS_FILE, progress, { spaces: 2 });
        console.log(`💾 Progreso guardado (${i + 1}/${tractors.length})`);
      }
    } catch (error) {
      errors++;
      console.error(`❌ [${i + 1}/${tractors.length}] Error en ${tractor.brand} ${tractor.model}:`, error.message);
    }
  }

  // Guardar resultados finales
  const dateMatch = content.match(/\/\/ Fecha: (.*)/);
  const date = dateMatch ? dateMatch[1] : new Date().toISOString();

  const newContent = `import { Tractor } from '@/types/tractor';

// Tractores extraídos desde TractorData.com
// Generado automáticamente - NO editar manualmente
// Fecha: ${date}
// Websites oficiales por marca actualizados: ${new Date().toISOString()}
// URLs de imágenes actualizadas: ${new Date().toISOString()}
// Datos enriquecidos con información adicional: ${new Date().toISOString()}

// @ts-ignore - Array muy grande que causa error de complejidad de tipo en TypeScript
export const scrapedTractors: Tractor[] = ${JSON.stringify(tractors, null, 2)};
`;

  await fs.writeFile(TRACTORS_FILE, newContent, 'utf-8');

  // Actualizar progreso final
  progress.lastIndex = tractors.length;
  await fs.writeJson(PROGRESS_FILE, progress, { spaces: 2 });

  console.log('\n✨ Enriquecimiento completado!');
  console.log(`💰 Precios asignados: ${pricesAdded}`);
  console.log(`✅ Enriquecidos con datos adicionales: ${enriched}`);
  console.log(`⏭️  Sin cambios adicionales: ${skipped}`);
  console.log(`❌ Errores: ${errors}`);
}

// Ejecutar
main().catch(console.error);

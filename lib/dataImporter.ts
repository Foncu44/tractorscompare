import { Tractor } from '@/types/tractor';

/**
 * Importa tractores desde un archivo JSON
 */
export async function importTractorsFromJSON(jsonData: string): Promise<Tractor[]> {
  try {
    const data = JSON.parse(jsonData);
    
    // Valida que sea un array
    if (!Array.isArray(data)) {
      throw new Error('Los datos deben ser un array de tractores');
    }
    
    // Valida cada tractor
    return data.map((tractor, index) => {
      // Validación básica
      if (!tractor.id || !tractor.brand || !tractor.model) {
        throw new Error(`Tractor en índice ${index} falta información requerida (id, brand, model)`);
      }
      
      return tractor as Tractor;
    });
  } catch (error) {
    console.error('Error al importar tractores desde JSON:', error);
    throw error;
  }
}

/**
 * Importa tractores desde un archivo CSV
 * Formato esperado: id,brand,model,year,type,powerHP,...
 */
export async function importTractorsFromCSV(csvData: string): Promise<Tractor[]> {
  const lines = csvData.split('\n').filter(line => line.trim());
  
  if (lines.length < 2) {
    throw new Error('El CSV debe tener al menos un encabezado y una fila de datos');
  }
  
  const headers = lines[0].split(',').map(h => h.trim());
  const tractors: Tractor[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const tractor: any = {};
    
    headers.forEach((header, index) => {
      const value = values[index];
      
      // Manejo de valores anidados (ej: engine.powerHP)
      if (header.includes('.')) {
        const [parent, child] = header.split('.');
        if (!tractor[parent]) {
          tractor[parent] = {};
        }
        tractor[parent][child] = parseValue(value);
      } else {
        tractor[header] = parseValue(value);
      }
    });
    
    // Valida datos requeridos
    if (tractor.id && tractor.brand && tractor.model) {
      // Genera slug si no existe
      if (!tractor.slug) {
        tractor.slug = `${tractor.brand.toLowerCase().replace(/\s+/g, '-')}-${tractor.model.toLowerCase().replace(/\s+/g, '-')}`;
      }
      
      tractors.push(tractor as Tractor);
    }
  }
  
  return tractors;
}

/**
 * Parsea valores según su tipo
 */
function parseValue(value: string): any {
  if (!value || value === '') return undefined;
  
  // Números
  if (/^-?\d+$/.test(value)) {
    return parseInt(value, 10);
  }
  
  if (/^-?\d*\.\d+$/.test(value)) {
    return parseFloat(value);
  }
  
  // Booleanos
  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;
  
  // String
  return value;
}

/**
 * Valida un tractor según el esquema
 */
export function validateTractor(tractor: any): tractor is Tractor {
  return (
    typeof tractor.id === 'string' &&
    typeof tractor.brand === 'string' &&
    typeof tractor.model === 'string' &&
    typeof tractor.type === 'string' &&
    ['farm', 'lawn', 'industrial'].includes(tractor.type) &&
    typeof tractor.engine === 'object' &&
    typeof tractor.engine.powerHP === 'number' &&
    typeof tractor.transmission === 'object'
  );
}


/**
 * Cargador dinámico de datos de tractores
 * Carga los datos solo cuando se necesitan, reduciendo el bundle inicial
 */

let tractorsCache: any[] | null = null;
let loadingPromise: Promise<any[]> | null = null;

/**
 * Carga los datos de tractores de forma asíncrona
 * Los datos se cachean después de la primera carga
 */
export async function loadTractors(): Promise<any[]> {
  // Si ya están cargados, devolver del cache
  if (tractorsCache) {
    return tractorsCache;
  }

  // Si ya hay una carga en progreso, esperar a que termine
  if (loadingPromise) {
    return loadingPromise;
  }

  // Cargar dinámicamente el módulo de tractores
  loadingPromise = import('@/data/tractors').then((module) => {
    tractorsCache = module.tractors;
    return tractorsCache;
  });

  return loadingPromise;
}

/**
 * Obtiene todas las marcas de forma asíncrona
 */
export async function loadBrands(): Promise<string[]> {
  const { getAllBrands } = await import('@/data/tractors');
  return getAllBrands();
}

/**
 * Obtiene un tractor por slug de forma asíncrona
 */
export async function loadTractorBySlug(slug: string) {
  const { getTractorBySlug } = await import('@/data/tractors');
  return getTractorBySlug(slug);
}

/**
 * Obtiene tractores por marca de forma asíncrona
 */
export async function loadTractorsByBrand(brand: string) {
  const { getTractorsByBrand } = await import('@/data/tractors');
  return getTractorsByBrand(brand);
}

/**
 * Busca tractores de forma asíncrona
 */
export async function searchTractors(query: string) {
  const { searchTractors } = await import('@/data/tractors');
  return searchTractors(query);
}

/**
 * Obtiene una marca por slug de forma asíncrona
 */
export async function loadBrandBySlug(slug: string) {
  const { getBrandBySlug } = await import('@/data/tractors');
  return getBrandBySlug(slug);
}

/**
 * Convierte nombre de marca a slug (función síncrona simple)
 * Esta función no depende de los datos de tractores, así que la importamos directamente
 */
export { brandToSlug } from '@/data/tractors';


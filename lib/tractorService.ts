import { Tractor } from '@/types/tractor';
import { 
  tractors as staticTractors,
  getTractorById as getStaticTractorById,
  getTractorBySlug as getStaticTractorBySlug,
  getTractorsByBrand as getStaticTractorsByBrand,
  getTractorsByType as getStaticTractorsByType,
  getAllBrands as getStaticAllBrands,
  searchTractors as searchStaticTractors,
} from '@/data/tractors';

/**
 * Configuración de fuente de datos
 * Cambia entre 'static', 'api', o 'hybrid'
 */
const DATA_SOURCE = process.env.NEXT_PUBLIC_TRACTOR_DATA_SOURCE || 'static';
const API_BASE_URL = process.env.NEXT_PUBLIC_TRACTOR_API_URL || '';

/**
 * Cliente API para obtener datos de tractores
 */
class TractorAPIClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async fetchTractors(): Promise<Tractor[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tractors`);
      if (!response.ok) {
        throw new Error('Error al obtener tractores');
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener tractores:', error);
      return [];
    }
  }

  async fetchTractorById(id: string): Promise<Tractor | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tractors/${id}`);
      if (!response.ok) {
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener tractor:', error);
      return null;
    }
  }

  async fetchTractorBySlug(slug: string): Promise<Tractor | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tractors/slug/${slug}`);
      if (!response.ok) {
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener tractor:', error);
      return null;
    }
  }

  async fetchTractorsByBrand(brand: string): Promise<Tractor[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tractors/brand/${encodeURIComponent(brand)}`);
      if (!response.ok) {
        return [];
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener tractores por marca:', error);
      return [];
    }
  }

  async fetchTractorsByType(type: Tractor['type']): Promise<Tractor[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tractors/type/${type}`);
      if (!response.ok) {
        return [];
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener tractores por tipo:', error);
      return [];
    }
  }

  async searchTractors(query: string): Promise<Tractor[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tractors/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        return [];
      }
      return await response.json();
    } catch (error) {
      console.error('Error al buscar tractores:', error);
      return [];
    }
  }

  async fetchBrands(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/brands`);
      if (!response.ok) {
        return [];
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener marcas:', error);
      return [];
    }
  }
}

const apiClient = API_BASE_URL ? new TractorAPIClient(API_BASE_URL) : null;

/**
 * Servicio unificado de tractores que funciona con datos estáticos o API
 */
export const tractorService = {
  /**
   * Obtiene todos los tractores
   */
  async getAllTractors(): Promise<Tractor[]> {
    if (DATA_SOURCE === 'api' && apiClient) {
      return await apiClient.fetchTractors();
    } else if (DATA_SOURCE === 'hybrid' && apiClient) {
      // En modo hybrid, intenta API primero, luego fallback a estático
      try {
        const apiTractors = await apiClient.fetchTractors();
        if (apiTractors.length > 0) {
          return apiTractors;
        }
      } catch (error) {
        console.warn('API no disponible, usando datos estáticos');
      }
    }
    return staticTractors;
  },

  /**
   * Obtiene un tractor por ID
   */
  async getTractorById(id: string): Promise<Tractor | undefined> {
    if (DATA_SOURCE === 'api' && apiClient) {
      return (await apiClient.fetchTractorById(id)) || undefined;
    } else if (DATA_SOURCE === 'hybrid' && apiClient) {
      const apiTractor = await apiClient.fetchTractorById(id);
      if (apiTractor) return apiTractor;
    }
    return getStaticTractorById(id);
  },

  /**
   * Obtiene un tractor por slug
   */
  async getTractorBySlug(slug: string): Promise<Tractor | undefined> {
    if (DATA_SOURCE === 'api' && apiClient) {
      return (await apiClient.fetchTractorBySlug(slug)) || undefined;
    } else if (DATA_SOURCE === 'hybrid' && apiClient) {
      const apiTractor = await apiClient.fetchTractorBySlug(slug);
      if (apiTractor) return apiTractor;
    }
    return getStaticTractorBySlug(slug);
  },

  /**
   * Obtiene tractores por marca
   */
  async getTractorsByBrand(brand: string): Promise<Tractor[]> {
    if (DATA_SOURCE === 'api' && apiClient) {
      return await apiClient.fetchTractorsByBrand(brand);
    } else if (DATA_SOURCE === 'hybrid' && apiClient) {
      const apiTractors = await apiClient.fetchTractorsByBrand(brand);
      if (apiTractors.length > 0) return apiTractors;
    }
    return getStaticTractorsByBrand(brand);
  },

  /**
   * Obtiene tractores por tipo
   */
  async getTractorsByType(type: Tractor['type']): Promise<Tractor[]> {
    if (DATA_SOURCE === 'api' && apiClient) {
      return await apiClient.fetchTractorsByType(type);
    } else if (DATA_SOURCE === 'hybrid' && apiClient) {
      const apiTractors = await apiClient.fetchTractorsByType(type);
      if (apiTractors.length > 0) return apiTractors;
    }
    return getStaticTractorsByType(type);
  },

  /**
   * Busca tractores
   */
  async searchTractors(query: string): Promise<Tractor[]> {
    if (DATA_SOURCE === 'api' && apiClient) {
      return await apiClient.searchTractors(query);
    } else if (DATA_SOURCE === 'hybrid' && apiClient) {
      const apiTractors = await apiClient.searchTractors(query);
      if (apiTractors.length > 0) return apiTractors;
    }
    return searchStaticTractors(query);
  },

  /**
   * Obtiene todas las marcas
   */
  async getAllBrands(): Promise<string[]> {
    if (DATA_SOURCE === 'api' && apiClient) {
      return await apiClient.fetchBrands();
    } else if (DATA_SOURCE === 'hybrid' && apiClient) {
      const apiBrands = await apiClient.fetchBrands();
      if (apiBrands.length > 0) return apiBrands;
    }
    return getStaticAllBrands();
  },
};

// Funciones helper para uso síncrono (solo datos estáticos)
export const getTractorById = getStaticTractorById;
export const getTractorBySlug = getStaticTractorBySlug;
export const getTractorsByBrand = getStaticTractorsByBrand;
export const getTractorsByType = getStaticTractorsByType;
export const getAllBrands = getStaticAllBrands;
export const searchTractors = searchStaticTractors;
export { staticTractors as tractors };


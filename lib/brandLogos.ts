/**
 * Mapping de marcas a sus logos
 */

export function getBrandLogo(brandName: string): string | null {
  const brandMap: Record<string, string> = {
    // John Deere (ahora es JPG)
    'John Deere': '/images/brands/John-Deere.jpg',
    'john deere': '/images/brands/John-Deere.jpg',
    'JOHN DEERE': '/images/brands/John-Deere.jpg',
    'JohnDeere': '/images/brands/John-Deere.jpg',
    // Kubota (ahora es PNG)
    'Kubota': '/images/brands/kubota-logo.png',
    'kubota': '/images/brands/kubota-logo.png',
    'KUBOTA': '/images/brands/kubota-logo.png',
    // New Holland (ahora es PNG)
    'New Holland': '/images/brands/newholland-logo.png',
    'new holland': '/images/brands/newholland-logo.png',
    'NEW HOLLAND': '/images/brands/newholland-logo.png',
    'NewHolland': '/images/brands/newholland-logo.png',
    // Case IH
    'Case IH': '/images/brands/caseih-logo-new.png',
    'case ih': '/images/brands/caseih-logo-new.png',
    'CASE IH': '/images/brands/caseih-logo-new.png',
    'Case': '/images/brands/caseih-logo-new.png',
    'case': '/images/brands/caseih-logo-new.png',
    'CASE': '/images/brands/caseih-logo-new.png',
    'CaseIH': '/images/brands/caseih-logo-new.png',
    // Massey Ferguson
    'Massey Ferguson': '/images/brands/MasseyFerguson-logo.png',
    'massey ferguson': '/images/brands/MasseyFerguson-logo.png',
    'MASSEY FERGUSON': '/images/brands/MasseyFerguson-logo.png',
    'MasseyFerguson': '/images/brands/MasseyFerguson-logo.png',
    // Fendt (ahora es PNG)
    'Fendt': '/images/brands/FENDT.png',
    'fendt': '/images/brands/FENDT.png',
    'FENDT': '/images/brands/FENDT.png',
    // Claas
    'Claas': '/images/brands/Claas-logo.png',
    'claas': '/images/brands/Claas-logo.png',
    'CLAAS': '/images/brands/Claas-logo.png',
  };

  return brandMap[brandName] || null;
}

/**
 * Colores de marca para fondos (estilo TractorData.es)
 */
export function getBrandColor(brandName: string): string {
  const colorMap: Record<string, string> = {
    'John Deere': 'bg-[#367C2B]', // Verde John Deere
    'john deere': 'bg-[#367C2B]',
    'Kubota': 'bg-[#FF6600]', // Naranja Kubota
    'kubota': 'bg-[#FF6600]',
    'New Holland': 'bg-[#003087]', // Azul New Holland
    'new holland': 'bg-[#003087]',
    'Case IH': 'bg-[#FF0000]', // Rojo Case IH
    'case ih': 'bg-[#FF0000]',
    'Case': 'bg-[#FF0000]',
    'case': 'bg-[#FF0000]',
    'Massey Ferguson': 'bg-[#DC143C]', // Rojo Massey Ferguson
    'massey ferguson': 'bg-[#DC143C]',
    'Fendt': 'bg-[#00A859]', // Verde Fendt
    'fendt': 'bg-[#00A859]',
    'Claas': 'bg-[#6DB644]', // Verde lima Claas
    'claas': 'bg-[#6DB644]',
    'Deutz-Fahr': 'bg-[#1E3A8A]', // Azul oscuro
    'deutz-fahr': 'bg-[#1E3A8A]',
    'Valtra': 'bg-[#7C3AED]', // Púrpura
    'valtra': 'bg-[#7C3AED]',
    'Landini': 'bg-[#3B82F6]', // Azul claro
    'landini': 'bg-[#3B82F6]',
    'Solis': 'bg-[#2563EB]', // Azul
    'solis': 'bg-[#2563EB]',
    'McCormick': 'bg-[#DC2626]', // Rojo
    'mccormick': 'bg-[#DC2626]',
  };

  return colorMap[brandName] || 'bg-gray-600'; // Color por defecto
}


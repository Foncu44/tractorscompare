/**
 * Mapping de marcas a sus logos
 */

export function getBrandLogo(brandName: string): string | null {
  const brandMap: Record<string, string> = {
    'Mahindra': 'https://www.mahindra.com//sites/default/files/2025-07/mahindra-red-logo.webp',
    'mahindra': 'https://www.mahindra.com//sites/default/files/2025-07/mahindra-red-logo.webp',
    'MAHINDRA': 'https://www.mahindra.com//sites/default/files/2025-07/mahindra-red-logo.webp',
    'Massey Ferguson': 'https://www.masseyferguson.com/content/dam/public/masseyfergusonglobal/markets/en/logos/icon-logo-agco-200x74.png',
    'massey ferguson': 'https://www.masseyferguson.com/content/dam/public/masseyfergusonglobal/markets/en/logos/icon-logo-agco-200x74.png',
    'MASSEY FERGUSON': 'https://www.masseyferguson.com/content/dam/public/masseyfergusonglobal/markets/en/logos/icon-logo-agco-200x74.png',
    'MasseyFerguson': 'https://www.masseyferguson.com/content/dam/public/masseyfergusonglobal/markets/en/logos/icon-logo-agco-200x74.png',
    'masseyferguson': 'https://www.masseyferguson.com/content/dam/public/masseyfergusonglobal/markets/en/logos/icon-logo-agco-200x74.png',
    'Massey-Harris': 'https://www.masseyferguson.com/content/dam/public/masseyfergusonglobal/markets/en/logos/icon-logo-agco-200x74.png',
    'massey-harris': 'https://www.masseyferguson.com/content/dam/public/masseyfergusonglobal/markets/en/logos/icon-logo-agco-200x74.png',
    'MASSEY-HARRIS': 'https://www.masseyferguson.com/content/dam/public/masseyfergusonglobal/markets/en/logos/icon-logo-agco-200x74.png',
    // McCormick - sin logo oficial disponible
    // 'McCormick': null,
    // 'McCormick-Deering': null,
    // Advance-Rumely, Allis Chalmers - marcas históricas AGCO, sin logos oficiales disponibles
    // 'Advance-Rumely': null,
    // 'Allis Chalmers': null,
    'Antonio': 'https://images.squarespace-cdn.com/content/v1/57aac7409f7456bea4405591/1476207017391-B0EXW9YH7D3EA7MY7XY8/New_ATO_Logo_Long.png?format=1000w',
    'antonio': 'https://images.squarespace-cdn.com/content/v1/57aac7409f7456bea4405591/1476207017391-B0EXW9YH7D3EA7MY7XY8/New_ATO_Logo_Long.png?format=1000w',
    'ANTONIO': 'https://images.squarespace-cdn.com/content/v1/57aac7409f7456bea4405591/1476207017391-B0EXW9YH7D3EA7MY7XY8/New_ATO_Logo_Long.png?format=1000w',
    // Avery - marca histórica AGCO, sin logo oficial disponible
    // 'Avery': null,
    'Bobcat': 'https://res.cloudinary.com/doosan-bobcat/image/upload/c_pad,f_auto,h_600,q_auto,w_600/v1671465872/bobcat-assets/emea-approved/company/about-us/20221219-bobcat-properties-logo.jpg',
    'bobcat': 'https://res.cloudinary.com/doosan-bobcat/image/upload/c_pad,f_auto,h_600,q_auto,w_600/v1671465872/bobcat-assets/emea-approved/company/about-us/20221219-bobcat-properties-logo.jpg',
    'BOBCAT': 'https://res.cloudinary.com/doosan-bobcat/image/upload/c_pad,f_auto,h_600,q_auto,w_600/v1671465872/bobcat-assets/emea-approved/company/about-us/20221219-bobcat-properties-logo.jpg',
    // Bolinder-Munktell - marca histórica, sin logo oficial disponible
    // 'Bolinder-Munktell': null,
    'Branson': 'https://www.bransontractors.com/wp-content/uploads/2021/06/branson-logo.png',
    'branson': 'https://www.bransontractors.com/wp-content/uploads/2021/06/branson-logo.png',
    'BRANSON': 'https://www.bransontractors.com/wp-content/uploads/2021/06/branson-logo.png',
    // Marcas sin logos oficiales disponibles - se mostrará el nombre como fallback
    // 'Bristol': null,
    // 'Brockway': null,
    // 'Buhler': null,
    // 'Bukh': null,
    // 'C.O.D.': null,
    // 'CBT': null,
    // 'CNH': null,
    // 'CO-OP': null,
    // 'Cabelas': null,
    // 'Cameco': null,
    // 'Captain': null,
    // 'Carraro': null,
    'Caterpillar': 'https://www.cat.com/content/dam/cat-com/logos/cat-logo.svg',
    'caterpillar': 'https://www.cat.com/content/dam/cat-com/logos/cat-logo.svg',
    'CATERPILLAR': 'https://www.cat.com/content/dam/cat-com/logos/cat-logo.svg',
    // 'Centaur': null,
    // 'Century': null, // marca AGCO histórica
    // 'Challenger': null, // marca AGCO
    'Claas': 'https://www.claas.com/content/dam/claas/claas-com/logos/claas-logo.svg',
    'claas': 'https://www.claas.com/content/dam/claas/claas-com/logos/claas-logo.svg',
    'CLAAS': 'https://www.claas.com/content/dam/claas/claas-com/logos/claas-logo.svg',
    // 'Cletrac': null,
    // 'Cockshutt': null, // marca AGCO histórica
    // 'Coleman': null,
    // 'Corbitt': null,
    // 'County': null,
    // 'Cub': null,
    // 'Custom': null,
    // Deutz - logo ya actualizado más abajo
    'Deutz-Fahr': 'https://www.deutz-fahr.com/content/dam/deutz-fahr/deutz-fahr-com/logos/deutz-fahr-logo.svg',
    'deutz-fahr': 'https://www.deutz-fahr.com/content/dam/deutz-fahr/deutz-fahr-com/logos/deutz-fahr-logo.svg',
    'DEUTZ-FAHR': 'https://www.deutz-fahr.com/content/dam/deutz-fahr/deutz-fahr-com/logos/deutz-fahr-logo.svg',
    // 'Ebro': null,
    // 'Erkunt': null, // sin logo oficial disponible
    // 'Farm': null, // marca AGCO
    'Fendt': 'https://www.fendt.com/content/dam/fendt/fendt-com/logos/fendt-logo.svg',
    'fendt': 'https://www.fendt.com/content/dam/fendt/fendt-com/logos/fendt-logo.svg',
    'FENDT': 'https://www.fendt.com/content/dam/fendt/fendt-com/logos/fendt-logo.svg',
    'Ferguson': 'https://www.masseyferguson.com/content/dam/public/masseyfergusonglobal/markets/en/logos/icon-logo-agco-200x74.png',
    'ferguson': 'https://www.masseyferguson.com/content/dam/public/masseyfergusonglobal/markets/en/logos/icon-logo-agco-200x74.png',
    'FERGUSON': 'https://www.masseyferguson.com/content/dam/public/masseyfergusonglobal/markets/en/logos/icon-logo-agco-200x74.png',
    'Fiat': 'https://www.cnhindustrial.com/content/dam/cnhi/cnhicorporate/logos/fiat-logo.svg',
    'fiat': 'https://www.cnhindustrial.com/content/dam/cnhi/cnhicorporate/logos/fiat-logo.svg',
    'FIAT': 'https://www.cnhindustrial.com/content/dam/cnhi/cnhicorporate/logos/fiat-logo.svg',
    'Ford': 'https://www.ford.com/content/dam/ford/brand-assets/ford-logo.svg',
    'ford': 'https://www.ford.com/content/dam/ford/brand-assets/ford-logo.svg',
    'FORD': 'https://www.ford.com/content/dam/ford/brand-assets/ford-logo.svg',
    'Fordson': 'https://www.ford.com/content/dam/ford/brand-assets/ford-logo.svg',
    'fordson': 'https://www.ford.com/content/dam/ford/brand-assets/ford-logo.svg',
    'FORDSON': 'https://www.ford.com/content/dam/ford/brand-assets/ford-logo.svg',
    // 'Foton': null, // sin logo oficial disponible
    // 'Hart-Parr': null, // marca AGCO histórica
    // 'Hesston': null, // marca AGCO
    'Hinomoto': 'https://www.yanmar.com/content/dam/yanmar/yanmar-com/logos/yanmar-logo.svg',
    'hinomoto': 'https://www.yanmar.com/content/dam/yanmar/yanmar-com/logos/yanmar-logo.svg',
    'HINOMOTO': 'https://www.yanmar.com/content/dam/yanmar/yanmar-com/logos/yanmar-logo.svg',
    'Hitachi': 'https://www.hitachi.com/content/dam/hitachi/hitachi-com/logos/hitachi-logo.svg',
    'hitachi': 'https://www.hitachi.com/content/dam/hitachi/hitachi-com/logos/hitachi-logo.svg',
    'HITACHI': 'https://www.hitachi.com/content/dam/hitachi/hitachi-com/logos/hitachi-logo.svg',
    'JCB': 'https://www.jcb.com/-/media/jcb/images/logo/jcb-logo.svg',
    'jcb': 'https://www.jcb.com/-/media/jcb/images/logo/jcb-logo.svg',
    'John Deere': 'https://www.deere.com/assets/images/common/deere-logo.svg',
    'john deere': 'https://www.deere.com/assets/images/common/deere-logo.svg',
    'JOHN DEERE': 'https://www.deere.com/assets/images/common/deere-logo.svg',
    'JohnDeere': 'https://www.deere.com/assets/images/common/deere-logo.svg',
    'johndeere': 'https://www.deere.com/assets/images/common/deere-logo.svg',
    'Kioti': 'https://kioti-com.files.svdcdn.com/production/img/usa_logo_emblem_registered_2023_2500px_720.png?dm=1765828176',
    'kioti': 'https://kioti-com.files.svdcdn.com/production/img/usa_logo_emblem_registered_2023_2500px_720.png?dm=1765828176',
    'KIOTI': 'https://kioti-com.files.svdcdn.com/production/img/usa_logo_emblem_registered_2023_2500px_720.png?dm=1765828176',
    'Kubota': 'https://www.kubota.com/assets/images/logo/kubota-logo.svg',
    'kubota': 'https://www.kubota.com/assets/images/logo/kubota-logo.svg',
    'KUBOTA': 'https://www.kubota.com/assets/images/logo/kubota-logo.svg',
    'Lamborghini': 'https://www.same-tractors.com/content/dam/same/same-com/logos/lamborghini-tractors-logo.svg',
    'lamborghini': 'https://www.same-tractors.com/content/dam/same/same-com/logos/lamborghini-tractors-logo.svg',
    'LAMBORGHINI': 'https://www.same-tractors.com/content/dam/same/same-com/logos/lamborghini-tractors-logo.svg',
    'Landini': 'https://www.landini.it/wp-content/uploads/2018/01/landini_logo_web.png',
    'landini': 'https://www.landini.it/wp-content/uploads/2018/01/landini_logo_web.png',
    'LANDINI': 'https://www.landini.it/wp-content/uploads/2018/01/landini_logo_web.png',
    'Lanz': 'https://www.deutz-fahr.com/_nuxt/img/f3b2a84.png',
    'lanz': 'https://www.deutz-fahr.com/_nuxt/img/f3b2a84.png',
    'LANZ': 'https://www.deutz-fahr.com/_nuxt/img/f3b2a84.png',
    'Mercedes-Benz': 'https://www.mercedes-benz.com/logos/mb-star-white.svg',
    'mercedes-benz': 'https://www.mercedes-benz.com/logos/mb-star-white.svg',
    'MERCEDES-BENZ': 'https://www.mercedes-benz.com/logos/mb-star-white.svg',
    // 'Minneapolis': null, // marca AGCO histórica
    // 'Minneapolis-Moline': null, // marca AGCO histórica
    // Mitsubishi - logo ya actualizado más abajo
    // 'Oliver': null, // marca AGCO histórica
    'Pasquali': 'https://www.pasquali.it/content/dam/pasquali/pasquali-com/logos/pasquali-logo.svg',
    'pasquali': 'https://www.pasquali.it/content/dam/pasquali/pasquali-com/logos/pasquali-logo.svg',
    'PASQUALI': 'https://www.pasquali.it/content/dam/pasquali/pasquali-com/logos/pasquali-logo.svg',
    'Porsche': 'https://www.porsche.com/content/dam/porsche-com/logos/porsche-logo.svg',
    'porsche': 'https://www.porsche.com/content/dam/porsche-com/logos/porsche-logo.svg',
    'PORSCHE': 'https://www.porsche.com/content/dam/porsche-com/logos/porsche-logo.svg',
    // Renault - logo ya actualizado más abajo
    'SAME': 'https://www.same-tractors.com/content/dam/same/same-com/logos/same-logo.svg',
    'same': 'https://www.same-tractors.com/content/dam/same/same-com/logos/same-logo.svg',
    'Satoh': 'https://www.yanmar.com/content/dam/yanmar/yanmar-com/logos/yanmar-logo.svg',
    'satoh': 'https://www.yanmar.com/content/dam/yanmar/yanmar-com/logos/yanmar-logo.svg',
    'SATOH': 'https://www.yanmar.com/content/dam/yanmar/yanmar-com/logos/yanmar-logo.svg',
    'Shibaura': 'https://www.shibaura.com/wp-content/uploads/2023/11/logoWebsite-2.png',
    'shibaura': 'https://www.shibaura.com/wp-content/uploads/2023/11/logoWebsite-2.png',
    'SHIBAURA': 'https://www.shibaura.com/wp-content/uploads/2023/11/logoWebsite-2.png',
    'Solis': 'https://www.solis-tractors.com/wp-content/uploads/2021/06/solis-logo.png',
    'solis': 'https://www.solis-tractors.com/wp-content/uploads/2021/06/solis-logo.png',
    'SOLIS': 'https://www.solis-tractors.com/wp-content/uploads/2021/06/solis-logo.png',
    'Sonalika': 'https://www.sonalika.com/uploaded_files/media_room/sonalika-tractor-logo-1716630288.webp',
    'sonalika': 'https://www.sonalika.com/uploaded_files/media_room/sonalika-tractor-logo-1716630288.webp',
    'SONALIKA': 'https://www.sonalika.com/uploaded_files/media_room/sonalika-tractor-logo-1716630288.webp',
    'Swaraj': 'https://www.swarajtractors.com/sites/default/files/images/swaraj-logo.png',
    'swaraj': 'https://www.swarajtractors.com/sites/default/files/images/swaraj-logo.png',
    'SWARAJ': 'https://www.swarajtractors.com/sites/default/files/images/swaraj-logo.png',
    'TAFE': 'https://www.tafe.com/img/tafe-logo-share.png',
    'tafe': 'https://www.tafe.com/img/tafe-logo-share.png',
    'TYM': 'https://www.tym.com/content/dam/tym/tym-com/logos/tym-logo.svg',
    'tym': 'https://www.tym.com/content/dam/tym/tym-com/logos/tym-logo.svg',
    'Unimog': 'https://www.mercedes-benz.com/logos/mb-star-white.svg',
    'unimog': 'https://www.mercedes-benz.com/logos/mb-star-white.svg',
    'UNIMOG': 'https://www.mercedes-benz.com/logos/mb-star-white.svg',
    'Valmet': 'https://www.valtra.com/content/dam/valtra/valtra-com/logos/valmet-logo.svg',
    'valmet': 'https://www.valtra.com/content/dam/valtra/valtra-com/logos/valmet-logo.svg',
    'VALMET': 'https://www.valtra.com/content/dam/valtra/valtra-com/logos/valmet-logo.svg',
    'Valtra': 'https://www.valtra.com/content/dam/valtra/valtra-com/logos/valtra-logo.svg',
    'valtra': 'https://www.valtra.com/content/dam/valtra/valtra-com/logos/valtra-logo.svg',
    'VALTRA': 'https://www.valtra.com/content/dam/valtra/valtra-com/logos/valtra-logo.svg',
    'Versatile': 'https://www.versatile-ag.com/content/dam/versatile/versatile-com/logos/versatile-logo.svg',
    'versatile': 'https://www.versatile-ag.com/content/dam/versatile/versatile-com/logos/versatile-logo.svg',
    'VERSATILE': 'https://www.versatile-ag.com/content/dam/versatile/versatile-com/logos/versatile-logo.svg',
    // Volvo - logo ya actualizado más abajo
    // 'White': null, // marca AGCO histórica
    'Yanmar': 'https://www.yanmar.com/content/dam/yanmar/yanmar-com/logos/yanmar-logo.svg',
    'yanmar': 'https://www.yanmar.com/content/dam/yanmar/yanmar-com/logos/yanmar-logo.svg',
    'YANMAR': 'https://www.yanmar.com/content/dam/yanmar/yanmar-com/logos/yanmar-logo.svg',
    'Zanello': 'https://zanello.com.ar/wp-content/uploads/2021/12/1-02.png',
    'zanello': 'https://zanello.com.ar/wp-content/uploads/2021/12/1-02.png',
    'ZANELLO': 'https://zanello.com.ar/wp-content/uploads/2021/12/1-02.png',
    'Zetor': 'https://www.zetor.com/content/dam/zetor/zetor-com/logos/zetor-logo.svg',
    'zetor': 'https://www.zetor.com/content/dam/zetor/zetor-com/logos/zetor-logo.svg',
    'ZETOR': 'https://www.zetor.com/content/dam/zetor/zetor-com/logos/zetor-logo.svg',
    // AGCO brands
    'AGCO': 'https://www.agcocorp.com/content/dam/agcocorp/brand-assets/agco-logo.png',
    'agco': 'https://www.agcocorp.com/content/dam/agcocorp/brand-assets/agco-logo.png',
    // New Holland
    'New Holland': 'https://agriculture.newholland.com/content/dam/nhag/nhag/global/images/brand-assets/new-holland-logo.svg',
    'new holland': 'https://agriculture.newholland.com/content/dam/nhag/nhag/global/images/brand-assets/new-holland-logo.svg',
    'NEW HOLLAND': 'https://agriculture.newholland.com/content/dam/nhag/nhag/global/images/brand-assets/new-holland-logo.svg',
    // Case IH
    'Case IH': 'https://www.caseih.com/content/dam/caseih/northamerica/north-america/images/brand-assets/case-ih-logo.svg',
    'case ih': 'https://www.caseih.com/content/dam/caseih/northamerica/north-america/images/brand-assets/case-ih-logo.svg',
    'CASE IH': 'https://www.caseih.com/content/dam/caseih/northamerica/north-america/images/brand-assets/case-ih-logo.svg',
    'Case': 'https://www.caseih.com/content/dam/caseih/northamerica/north-america/images/brand-assets/case-ih-logo.svg',
    'case': 'https://www.caseih.com/content/dam/caseih/northamerica/north-america/images/brand-assets/case-ih-logo.svg',
    // Marcas sin logos oficiales disponibles - se mostrará el nombre como fallback
    // 'Belarus': null,
    // 'Bolens': null,
    // 'Benye': null,
    // 'Barreiros': null,
    // 'Apollo': null,
    // 'ArmaTrac': null,
    // 'AgraCat': null,
    // 'Agrinar': null,
    // 'AgTrac': null,
    // 'Agri-Power': null,
    // 'Ascot': null,
    // 'ATC': null,
    // 'Ag': null,
    // 'B.F.': null,
    // 'Bad': null,
    // 'Bombardier': null,
    // Volvo
    'Volvo': 'https://www.volvo.com/content/dam/volvo/volvo-com/markets/global/logos/volvo-logo.svg',
    'volvo': 'https://www.volvo.com/content/dam/volvo/volvo-com/markets/global/logos/volvo-logo.svg',
    'VOLVO': 'https://www.volvo.com/content/dam/volvo/volvo-com/markets/global/logos/volvo-logo.svg',
    // Renault
    'Renault': 'https://www.renault.com/content/dam/renault/renault-com/logos/renault-logo.svg',
    'renault': 'https://www.renault.com/content/dam/renault/renault-com/logos/renault-logo.svg',
    'RENAULT': 'https://www.renault.com/content/dam/renault/renault-com/logos/renault-logo.svg',
    // Mitsubishi
    'Mitsubishi': 'https://www.mitsubishi.com/content/dam/mitsubishi/mitsubishi-com/logos/mitsubishi-logo.svg',
    'mitsubishi': 'https://www.mitsubishi.com/content/dam/mitsubishi/mitsubishi-com/logos/mitsubishi-logo.svg',
    'MITSUBISHI': 'https://www.mitsubishi.com/content/dam/mitsubishi/mitsubishi-com/logos/mitsubishi-logo.svg',
    // Deutz
    'Deutz': 'https://www.deutz.com/content/dam/deutz/deutz-com/logos/deutz-logo.svg',
    'deutz': 'https://www.deutz.com/content/dam/deutz/deutz-com/logos/deutz-logo.svg',
    'DEUTZ': 'https://www.deutz.com/content/dam/deutz/deutz-com/logos/deutz-logo.svg',
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


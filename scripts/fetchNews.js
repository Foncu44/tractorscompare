/**
 * Descarga noticias (RSS) y guarda data/news.json.
 * Objetivo: noticias de agricultura y tractores (últimos 3 meses).
 *
 * Fuentes: Google News RSS (y extrae el enlace real desde el <description> cuando sea posible).
 * Nota: no garantiza 100% la URL final en todos los casos, pero normalmente el <description>
 * incluye el link directo al medio original.
 */
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const OUT_FILE = path.join(__dirname, '..', 'data', 'news.json');

function googleRss(query) {
  return `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en&gl=US&ceid=US:en`;
}

const FEEDS = [
  { category: 'tractors', url: googleRss('tractors OR "agricultural machinery" OR "farm equipment"'), source: 'Google News' },
  { category: 'agriculture', url: googleRss('agriculture OR "agricultural technology" OR "farming equipment" OR "farm machinery"'), source: 'Google News' },
  { category: 'industry', url: googleRss('"tractor" OR "combine harvester" OR "agricultural equipment"'), source: 'Google News' },
];

function extractFirstHref(htmlText) {
  if (!htmlText) return null;
  // Buscar múltiples patrones de URLs
  const patterns = [
    /href=["'](https?:\/\/[^"']+)["']/i,
    /<a[^>]+href=["'](https?:\/\/[^"']+)["']/i,
    /url=(https?:\/\/[^&"'\s]+)/i,
  ];
  
  for (const pattern of patterns) {
    const m = htmlText.match(pattern);
    if (m && m[1]) {
      // Filtrar URLs de Google News
      if (!m[1].includes('news.google.com') && !m[1].includes('google.com/url')) {
        return m[1];
      }
    }
  }
  return null;
}

function extractFirstImg(htmlText) {
  if (!htmlText) return null;
  // Buscar múltiples patrones de imágenes
  const patterns = [
    /<img[^>]+src=["'](https?:\/\/[^"']+)["']/i,
    /<img[^>]+src=["']([^"']+)["']/i,
    /src=["'](https?:\/\/[^"']+\.(jpg|jpeg|png|webp|gif))["']/i,
  ];
  
  for (const pattern of patterns) {
    const m = htmlText.match(pattern);
    if (m && m[1]) {
      // Si es una URL relativa, intentar construirla (aunque normalmente no debería pasar)
      if (m[1].startsWith('http')) {
        return m[1];
      }
    }
  }
  return null;
}

// Variable global para reutilizar el navegador de Puppeteer
let browserInstance = null;

/**
 * Obtiene o crea una instancia del navegador Puppeteer
 */
async function getBrowser() {
  if (!browserInstance) {
    browserInstance = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }
  return browserInstance;
}

/**
 * Cierra el navegador Puppeteer
 */
async function closeBrowser() {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}

/**
 * Resuelve la URL real desde una URL de Google News usando Puppeteer
 */
async function resolveGoogleNewsUrl(googleUrl, debug = false) {
  try {
    // Si no es una URL de Google News, devolverla tal cual
    if (!googleUrl.includes('news.google.com')) {
      return googleUrl;
    }
    
    if (debug) console.log(`    🔄 Resolviendo URL de Google News...`);
    
    // Método 1: Intentar extraer de parámetros URL original (más rápido y confiable)
    try {
      const urlObj = new URL(googleUrl);
      const urlParam = urlObj.searchParams.get('url');
      if (urlParam && urlParam.startsWith('http')) {
        const decoded = decodeURIComponent(urlParam);
        // Validar que no sea una URL de Google
        if (!decoded.includes('news.google.com') && 
            !decoded.includes('policies.google.com') &&
            !decoded.includes('accounts.google.com')) {
          if (debug) console.log(`    ✅ URL resuelta desde parámetro URL: ${decoded}`);
          return decoded;
        }
      }
    } catch (e) {
      // Ignorar errores de parsing
    }
    
    // Método 1.5: Intentar seguir redirecciones HTTP directamente (más rápido que Puppeteer)
    try {
      const response = await axios.get(googleUrl, {
        timeout: 15000,
        maxRedirects: 10,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        validateStatus: (status) => status < 500,
      });
      
      // Obtener la URL final después de todas las redirecciones
      const finalUrl = response.request.res.responseUrl || 
                      response.request.res.requestUrl || 
                      response.request.res.responseUrl || 
                      googleUrl;
      
      if (finalUrl !== googleUrl && 
          !finalUrl.includes('news.google.com') && 
          !finalUrl.includes('policies.google.com') &&
          !finalUrl.includes('accounts.google.com')) {
        if (debug) console.log(`    ✅ URL resuelta por redirección HTTP: ${finalUrl}`);
        return finalUrl;
      }
    } catch (e) {
      if (debug) console.log(`    ⚠️  Error en redirección HTTP: ${e.message}`);
    }
    
    // Método 2: Usar Puppeteer para renderizar JavaScript y obtener la URL real (solo si otros métodos fallan)
    try {
      const browser = await getBrowser();
      const page = await browser.newPage();
      
      // Configurar user agent
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      
      // Navegar a la página de Google News
      await page.goto(googleUrl, { 
        waitUntil: 'networkidle0', 
        timeout: 20000 
      });
      
      // Esperar más tiempo para que se cargue completamente el JavaScript
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Intentar hacer clic en "Seguir leyendo" o similar si existe
      try {
        const continueButton = await page.$('a:has-text("Continue reading"), a:has-text("Read more"), button:has-text("Continue")');
        if (continueButton) {
          await continueButton.click();
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (e) {
        // Ignorar si no hay botón
      }
      
      // Esperar a que se carguen los enlaces del artículo
      try {
        await page.waitForSelector('article a[href^="http"], a[href^="http"]', { timeout: 10000 });
      } catch (e) {
        // Si no hay enlaces, continuar de todas formas
      }
      
      // Obtener la URL actual después de posibles redirecciones
      const currentUrl = page.url();
      if (currentUrl !== googleUrl && !currentUrl.includes('news.google.com')) {
        if (debug) console.log(`    ✅ URL obtenida de redirección de página: ${currentUrl}`);
        await page.close();
        return currentUrl;
      }
      
      // Intentar encontrar el enlace real del artículo
      const realUrl = await page.evaluate(() => {
        // Lista de dominios de Google a excluir
        const googleDomains = [
          'news.google.com',
          'google.com/search',
          'google.com/url',
          'policies.google.com',
          'accounts.google.com',
          'support.google.com',
          'myaccount.google.com',
          'www.google.com',
          'google.com/privacy',
          'google.com/terms',
        ];
        
        const isGoogleUrl = (url) => {
          if (!url) return true;
          return googleDomains.some(domain => url.toLowerCase().includes(domain));
        };
        
        // Método 1: Buscar el título del artículo y su enlace asociado (más confiable)
        const titleSelectors = [
          'h1 a[href^="http"]',
          'h2 a[href^="http"]',
          'h3 a[href^="http"]',
          'article h1 a[href^="http"]',
          'article h2 a[href^="http"]',
          '[role="article"] h1 a[href^="http"]',
          '[role="article"] h2 a[href^="http"]',
        ];
        
        for (const selector of titleSelectors) {
          const titleLink = document.querySelector(selector);
          if (titleLink) {
            const href = titleLink.getAttribute('href');
            if (href && !isGoogleUrl(href)) {
              try {
                const urlObj = new URL(href);
                if (urlObj.searchParams.has('url')) {
                  const decoded = decodeURIComponent(urlObj.searchParams.get('url'));
                  if (decoded.startsWith('http') && !isGoogleUrl(decoded)) {
                    return decoded;
                  }
                }
                urlObj.search = '';
                if (!isGoogleUrl(urlObj.href)) {
                  return urlObj.href;
                }
              } catch (e) {
                if (!isGoogleUrl(href)) {
                  return href;
                }
              }
            }
          }
        }
        
        // Método 2: Buscar enlaces grandes/principales en el contenido del artículo
        const articleContent = document.querySelector('article, [role="article"], main, .article-body, .post-content');
        if (articleContent) {
          const articleLinks = Array.from(articleContent.querySelectorAll('a[href^="http"]'));
          // Priorizar enlaces con mucho texto (probablemente el enlace al artículo completo)
          const sortedLinks = articleLinks
            .map(link => ({
              href: link.getAttribute('href'),
              text: (link.textContent || '').trim(),
              area: link.getBoundingClientRect().width * link.getBoundingClientRect().height
            }))
            .filter(item => {
              if (!item.href) return false;
              if (isGoogleUrl(item.href)) return false;
              // Filtrar enlaces pequeños (probablemente iconos/botones)
              return item.text.length > 10 || item.area > 1000;
            })
            .sort((a, b) => {
              // Priorizar por área (más grande = más importante)
              if (Math.abs(a.area - b.area) > 500) {
                return b.area - a.area;
              }
              // Luego por longitud del texto
              return b.text.length - a.text.length;
            });
          
          for (const item of sortedLinks.slice(0, 5)) {
            try {
              const urlObj = new URL(item.href);
              if (urlObj.searchParams.has('url')) {
                const decoded = decodeURIComponent(urlObj.searchParams.get('url'));
                if (decoded.startsWith('http') && !isGoogleUrl(decoded)) {
                  return decoded;
                }
              }
              urlObj.search = '';
              if (!isGoogleUrl(urlObj.href)) {
                return urlObj.href;
              }
            } catch (e) {
              if (!isGoogleUrl(item.href)) {
                return item.href;
              }
            }
          }
        }
        
        // Método 3: Buscar todos los enlaces y filtrar
        const allLinks = Array.from(document.querySelectorAll('a[href^="http"]'));
        const validLinks = allLinks
          .map(link => {
            const href = link.getAttribute('href');
            const text = (link.textContent || '').trim();
            const rect = link.getBoundingClientRect();
            return {
              href: href,
              text: text,
              area: rect.width * rect.height,
              parent: link.closest('article, [role="article"], main, .article-body')
            };
          })
          .filter(item => {
            if (!item.href) return false;
            if (isGoogleUrl(item.href)) return false;
            // Filtrar enlaces muy pequeños o sin texto
            if (item.area < 100 && item.text.length < 5) return false;
            return true;
          })
          .sort((a, b) => {
            // Priorizar enlaces dentro de artículos
            if (a.parent && !b.parent) return -1;
            if (!a.parent && b.parent) return 1;
            // Luego por área
            if (Math.abs(a.area - b.area) > 500) {
              return b.area - a.area;
            }
            // Luego por longitud del texto
            return b.text.length - a.text.length;
          });
        
        // Probar los primeros 10 enlaces más prometedores
        for (const item of validLinks.slice(0, 10)) {
          try {
            const urlObj = new URL(item.href);
            if (urlObj.searchParams.has('url')) {
              const decoded = decodeURIComponent(urlObj.searchParams.get('url'));
              if (decoded.startsWith('http') && !isGoogleUrl(decoded)) {
                return decoded;
              }
            }
            urlObj.search = '';
            if (!isGoogleUrl(urlObj.href)) {
              return urlObj.href;
            }
          } catch (e) {
            if (!isGoogleUrl(item.href)) {
              return item.href;
            }
          }
        }
        
        return null;
      });
      
      await page.close();
      
      if (realUrl) {
        if (debug) console.log(`    ✅ URL resuelta con Puppeteer: ${realUrl}`);
        return realUrl;
      }
      
      if (debug) console.log(`    ⚠️  Puppeteer no encontró enlace`);
    } catch (e) {
      if (debug) console.log(`    ⚠️  Error con Puppeteer: ${e.message}`);
    }
    
    
    if (debug) console.log(`    ⚠️  No se pudo resolver URL, usando original`);
    return googleUrl;
  } catch (error) {
    if (debug) console.log(`    ❌ Error resolviendo URL: ${error.message}`);
    // Si falla, devolver la URL original
    return googleUrl;
  }
}

/**
 * Intenta obtener la imagen principal o video principal de una página de noticias
 */
async function fetchArticleImage(url, debug = false) {
  try {
    if (debug) console.log(`    🔍 Buscando imagen en: ${url}`);
    
    // Si la URL ya es una URL real (no de Google News), usarla directamente
    let realUrl = url;
    if (url.includes('news.google.com')) {
      // Solo resolver si es una URL de Google News
      realUrl = await resolveGoogleNewsUrl(url, debug);
      if (realUrl === url && debug) {
        console.log(`    ⚠️  No se pudo resolver URL de Google News, intentando con URL original`);
      }
    } else if (debug) {
      console.log(`    ✅ URL ya es directa, no necesita resolución: ${url}`);
    }
    
    const res = await axios.get(realUrl, {
      timeout: 20000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.google.com/',
      },
      maxRedirects: 10,
      validateStatus: (status) => status < 500, // Aceptar 4xx pero no 5xx
    });
    
    if (res.status >= 400) {
      if (debug) console.log(`    ⚠️  Status ${res.status} para ${realUrl}`);
      return null;
    }
    
    const $ = cheerio.load(res.data);
    const baseUrl = new URL(realUrl);
    
    // 1. PRIORIDAD ALTA: Meta tags de Open Graph y Twitter (imágenes principales)
    const ogImage = $('meta[property="og:image"]').attr('content') || 
                    $('meta[property="og:image:secure_url"]').attr('content');
    if (ogImage) {
      try {
        const fullUrl = ogImage.startsWith('http') ? ogImage : new URL(ogImage, realUrl).href;
        // Filtrar imágenes genéricas de Google News, pero permitir otras
        if (!fullUrl.includes('googleusercontent.com') && !fullUrl.includes('google.com/news')) {
          if (debug) console.log(`    ✅ Encontrada og:image: ${fullUrl}`);
          return fullUrl;
        }
      } catch (e) {
        // URL mal formada, continuar
      }
    }
    
    const articleImage = $('meta[property="article:image"]').attr('content');
    if (articleImage) {
      try {
        const fullUrl = articleImage.startsWith('http') ? articleImage : new URL(articleImage, realUrl).href;
        if (!fullUrl.includes('googleusercontent.com')) {
          if (debug) console.log(`    ✅ Encontrada article:image: ${fullUrl}`);
          return fullUrl;
        }
      } catch (e) {
        // URL mal formada, continuar
      }
    }
    
    const twitterImage = $('meta[name="twitter:image"]').attr('content') ||
                        $('meta[name="twitter:image:src"]').attr('content');
    if (twitterImage) {
      try {
        const fullUrl = twitterImage.startsWith('http') ? twitterImage : new URL(twitterImage, realUrl).href;
        if (!fullUrl.includes('googleusercontent.com')) {
          if (debug) console.log(`    ✅ Encontrada twitter:image: ${fullUrl}`);
          return fullUrl;
        }
      } catch (e) {
        // URL mal formada, continuar
      }
    }
    
    // 2. PRIORIDAD ALTA: Videos - buscar poster/thumbnail del video principal
    const videoPoster = $('video[poster]').first().attr('poster');
    if (videoPoster) {
      try {
        const fullUrl = videoPoster.startsWith('http') ? videoPoster : new URL(videoPoster, realUrl).href;
        if (debug) console.log(`    ✅ Encontrado video poster: ${fullUrl}`);
        return fullUrl;
      } catch (e) {
        // URL mal formada, continuar
      }
    }
    
    // Buscar videos embebidos (YouTube, Vimeo, etc.) y sus thumbnails
    const youtubeMatch = $('iframe[src*="youtube"], iframe[src*="youtu.be"], iframe[data-src*="youtube"]').first().attr('src') || 
                        $('iframe[src*="youtube"], iframe[src*="youtu.be"], iframe[data-src*="youtube"]').first().attr('data-src');
    if (youtubeMatch) {
      const ytIdMatch = youtubeMatch.match(/(?:youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/v\/)([a-zA-Z0-9_-]+)/);
      if (ytIdMatch && ytIdMatch[1]) {
        const ytThumb = `https://img.youtube.com/vi/${ytIdMatch[1]}/maxresdefault.jpg`;
        if (debug) console.log(`    ✅ Encontrado YouTube thumbnail: ${ytThumb}`);
        return ytThumb;
      }
    }
    
    // Buscar videos de Vimeo
    const vimeoMatch = $('iframe[src*="vimeo"]').first().attr('src') || 
                      $('iframe[data-src*="vimeo"]').first().attr('data-src');
    if (vimeoMatch) {
      const vimeoIdMatch = vimeoMatch.match(/vimeo\.com\/(\d+)/);
      if (vimeoIdMatch && vimeoIdMatch[1]) {
        // Vimeo requiere API para obtener thumbnail, pero podemos intentar
        const vimeoThumb = `https://vumbnail.com/${vimeoIdMatch[1]}.jpg`;
        if (debug) console.log(`    ✅ Encontrado Vimeo: ${vimeoThumb}`);
        return vimeoThumb;
      }
    }
    
    // 3. PRIORIDAD MEDIA: Imágenes hero/featured/principal en el contenido
    // Selectores específicos para sitios comunes de noticias
    const heroSelectors = [
      // Al Jazeera y sitios similares
      'figure.article-featured-image img',
      'figure.article-featured-image .responsive-image img',
      '.article-featured-image img',
      '.responsive-image img',
      
      // Selectores genéricos comunes
      'img.hero-image',
      'img.featured-image',
      'img.main-image',
      'img.article-image',
      'img.lead-image',
      'img.story-image',
      '.hero img',
      '.featured-image img',
      '.article-header img',
      '.post-header img',
      '.story-header img',
      'header img',
      '.entry-content img:first-of-type',
      'article > img:first-of-type',
      '.article-body img:first-of-type',
      '.post-content img:first-of-type',
      'figure img:first-of-type',
      '.media img',
      '.image img',
      
      // BBC, CNN, etc.
      '.article-image img',
      '.story-image img',
      '.main-image img',
      '[data-module="ArticleImage"] img',
    ];
    
    for (const selector of heroSelectors) {
      const img = $(selector).first();
      if (img.length) {
        if (debug) console.log(`    🔎 Probando selector: ${selector}`);
        
        // Priorizar srcset si está disponible (contiene URLs de alta resolución)
        let src = img.attr('srcset');
        if (src && debug) {
          console.log(`    📸 srcset encontrado: ${src.substring(0, 100)}...`);
        }
        
        if (src) {
          // Extraer la URL más grande del srcset (última en la lista generalmente)
          const srcsetUrls = src.split(',').map(s => s.trim().split(/\s+/)[0]);
          if (srcsetUrls.length > 0) {
            src = srcsetUrls[srcsetUrls.length - 1]; // Tomar la última (más grande)
            if (debug) console.log(`    📸 URL extraída de srcset: ${src}`);
          }
        }
        
        // Si no hay srcset, buscar en otros atributos
        if (!src) {
          src = img.attr('src') || 
                img.attr('data-src') || 
                img.attr('data-lazy-src') || 
                img.attr('data-original') ||
                img.attr('data-url') ||
                img.attr('data-image') ||
                img.attr('data-srcset');
          
          if (src && debug) {
            console.log(`    📸 src encontrado: ${src.substring(0, 100)}...`);
          }
        }
        
        if (src) {
          try {
            // Limpiar parámetros de tamaño si existen (ej: ?resize=770%2C513&quality=80)
            // Pero mantener la URL base completa
            let fullUrl = src.startsWith('http') ? src : new URL(src, realUrl).href;
            
            if (debug) console.log(`    🔗 URL completa: ${fullUrl}`);
            
            // Filtrar imágenes genéricas y pequeñas
            const lowerUrl = fullUrl.toLowerCase();
            if (!lowerUrl.includes('googleusercontent.com') && 
                !lowerUrl.includes('google.com/news') &&
                !lowerUrl.includes('logo') && 
                !lowerUrl.includes('icon') &&
                !lowerUrl.includes('avatar') &&
                !lowerUrl.includes('placeholder')) {
              const width = parseInt(img.attr('width') || '0');
              const height = parseInt(img.attr('height') || '0');
              if (debug) console.log(`    📏 Dimensiones: ${width}x${height}`);
              
              // Aceptar imágenes sin dimensiones o con dimensiones razonables
              if (width > 200 || height > 200 || (!width && !height)) {
                if (debug) console.log(`    ✅ Encontrada imagen hero (${selector}): ${fullUrl}`);
                return fullUrl;
              } else {
                if (debug) console.log(`    ⚠️  Imagen muy pequeña: ${width}x${height}`);
              }
            } else {
              if (debug) console.log(`    ⚠️  URL filtrada (genérica): ${fullUrl}`);
            }
          } catch (e) {
            // URL mal formada, continuar
            if (debug) console.log(`    ⚠️  Error procesando URL: ${e.message}`);
          }
        } else {
          if (debug) console.log(`    ⚠️  No se encontró src en selector ${selector}`);
        }
      } else {
        if (debug) console.log(`    ⚠️  Selector ${selector} no encontró elementos`);
      }
    }
    
    // 4. PRIORIDAD BAJA: Buscar todas las imágenes grandes en el contenido principal
    const contentSelectors = [
      'article img',
      '.article img',
      '.content img',
      '.post-content img',
      'main img',
      '.entry-content img',
      '.story-body img',
      '.article-body img',
    ];
    
    const candidateImages = [];
    for (const selector of contentSelectors) {
      $(selector).each((i, el) => {
        const img = $(el);
        const src = img.attr('src') || 
                   img.attr('data-src') || 
                   img.attr('data-lazy-src') || 
                   img.attr('data-original') ||
                   img.attr('data-url') ||
                   img.attr('data-image');
        if (!src) return;
        
        try {
          const fullUrl = src.startsWith('http') ? src : new URL(src, realUrl).href;
          
          // Filtrar imágenes no deseadas
          const lowerUrl = fullUrl.toLowerCase();
          if (lowerUrl.includes('googleusercontent.com') || 
              lowerUrl.includes('google.com/news') ||
              lowerUrl.includes('logo') || 
              lowerUrl.includes('icon') ||
              lowerUrl.includes('avatar') ||
              lowerUrl.includes('profile') ||
              lowerUrl.includes('advertisement') ||
              lowerUrl.includes('ad-') ||
              lowerUrl.includes('sponsor') ||
              lowerUrl.includes('pixel') ||
              lowerUrl.includes('tracking') ||
              lowerUrl.includes('analytics')) {
            return;
          }
          
          // Obtener dimensiones
          const width = parseInt(img.attr('width') || '0');
          const height = parseInt(img.attr('height') || '0');
          const style = img.attr('style') || '';
          const styleWidth = style.match(/width:\s*(\d+)px/);
          const styleHeight = style.match(/height:\s*(\d+)px/);
          const finalWidth = styleWidth ? parseInt(styleWidth[1]) : width;
          const finalHeight = styleHeight ? parseInt(styleHeight[1]) : height;
          
          // Priorizar imágenes grandes (reducir mínimo a 200x150)
          const size = finalWidth * finalHeight;
          const minSize = 200 * 150;
          
          if (size >= minSize || (!finalWidth && !finalHeight)) {
            candidateImages.push({
              url: fullUrl,
              size: size || 999999,
              width: finalWidth,
              height: finalHeight,
            });
          }
        } catch (e) {
          // URL mal formada, continuar
        }
      });
    }
    
    // Ordenar por tamaño y devolver la más grande
    if (candidateImages.length > 0) {
      candidateImages.sort((a, b) => b.size - a.size);
      if (debug) console.log(`    ✅ Encontrada imagen en contenido: ${candidateImages[0].url}`);
      return candidateImages[0].url;
    }
    
    if (debug) console.log(`    ❌ No se encontró imagen en ${realUrl}`);
    return null;
  } catch (error) {
    // Log error solo en modo debug
    if (debug) {
      console.log(`    ❌ Error al obtener imagen de ${url}: ${error.message}`);
      if (error.response) {
        console.log(`       Status: ${error.response.status}`);
      }
      if (error.code) {
        console.log(`       Code: ${error.code}`);
      }
    }
    return null;
  }
}

function stripHtml(htmlText) {
  if (!htmlText) return '';
  return htmlText
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function withinLastMonths(dateISO, months) {
  const t = Date.parse(dateISO);
  if (Number.isNaN(t)) return false;
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - months);
  return t >= cutoff.getTime();
}

async function fetchRss(url) {
  const res = await axios.get(url, {
    timeout: 30000,
    headers: {
      'User-Agent': 'tractorscompare-bot/1.0 (+https://tractorscompare.com)',
      'Accept': 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8',
    },
  });
  return res.data;
}

async function main() {
  console.log('📰 Descargando RSS...');
  const allItems = [];

  for (const feed of FEEDS) {
    console.log(`- ${feed.category}: ${feed.url}`);
    const xml = await fetchRss(feed.url);
    const $ = cheerio.load(xml, { xmlMode: true });
    
    const items = [];
    $('item').each((_, el) => {
      const title = $(el).find('title').first().text().trim();
      const link = $(el).find('link').first().text().trim();
      const pubDate = $(el).find('pubDate').first().text().trim();
      const source = $(el).find('source').first().text().trim() || feed.source;
      const description = $(el).find('description').first().text();
      
      // Buscar imagen en media:content (si existe) - múltiples formas
      const mediaContent = $(el).find('media\\:content').first().attr('url') ||
                          $(el).find('content').first().attr('url') ||
                          $(el).find('media\\:content[type^="image"]').first().attr('url');
      const mediaThumbnail = $(el).find('media\\:thumbnail').first().attr('url') ||
                            $(el).find('thumbnail').first().attr('url');
      const enclosure = $(el).find('enclosure[type^="image"]').first().attr('url');

      // Extraer URL real del artículo (priorizar href del description, luego link)
      let url = extractFirstHref(description);
      if (!url) {
        // Si el link no es de Google News, usarlo directamente
        if (link && !link.includes('news.google.com')) {
          url = link;
        } else {
          // Si es de Google News, usar el link (se resolverá después si es necesario)
          url = link;
        }
      }
      
      // Si la URL extraída es de Google News, marcar para resolver después
      // Pero si ya tenemos una URL real, usarla directamente
      
      // Priorizar imágenes del RSS feed, luego del description HTML
      const imageUrl = mediaContent || mediaThumbnail || enclosure || extractFirstImg(description) || undefined;
      const excerpt = stripHtml(description).slice(0, 220);

      const publishedAt = pubDate ? new Date(pubDate).toISOString() : null;
      if (!publishedAt) return;

      items.push({
        title,
        url,
        publishedAt,
        source,
        imageUrl,
        category: feed.category,
        excerpt,
      });
    });
    
    allItems.push(...items);
  }
  
  console.log(`📸 Obteniendo imágenes principales de artículos (${allItems.length} items)...`);
  // Obtener imágenes principales de TODOS los artículos (reemplazar las genéricas de Google News)
  let processed = 0;
  let imagesFound = 0;
  let imagesReplaced = 0;
  let errors = 0;
  
  // Probar con los primeros 3 artículos en modo debug
  const debugFirst = 3;
  
  for (let i = 0; i < allItems.length; i++) {
    const item = allItems[i];
    if (!item.url) continue;
    
    processed++;
    const isDebug = processed <= debugFirst;
    
    if (processed % 5 === 0 || isDebug) {
      console.log(`  Procesando ${processed}/${allItems.length}... (${imagesFound} imágenes encontradas, ${errors} errores)`);
    }
    
    try {
      // Solo intentar obtener imagen si no tenemos una buena imagen del RSS
      // o si la que tenemos es genérica de Google
      const hasGoodImage = item.imageUrl && 
                          !item.imageUrl.includes('googleusercontent.com') && 
                          !item.imageUrl.includes('google.com/news');
      
      if (!hasGoodImage) {
        const articleImage = await fetchArticleImage(item.url, isDebug);
        if (articleImage) {
        const hadImage = !!item.imageUrl;
        const wasGoogleImage = item.imageUrl && (
          item.imageUrl.includes('googleusercontent.com') || 
          item.imageUrl.includes('google.com/news')
        );
        
          item.imageUrl = articleImage;
          imagesFound++;
          if (hadImage && wasGoogleImage) {
            imagesReplaced++;
          }
          if (isDebug || processed % 10 === 0) {
            console.log(`  ✅ [${processed}/${allItems.length}] Imagen encontrada: ${item.title.substring(0, 60)}...`);
            if (isDebug) console.log(`     URL: ${articleImage}`);
          }
        } else {
          if (isDebug) {
            console.log(`  ⚠️  [${processed}/${allItems.length}] No se encontró imagen para: ${item.title.substring(0, 60)}...`);
          }
        }
      } else if (isDebug) {
        console.log(`  ℹ️  [${processed}/${allItems.length}] Ya tiene buena imagen del RSS: ${item.imageUrl?.substring(0, 60)}...`);
      }
      // Delay para no sobrecargar los servidores
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      errors++;
      if (isDebug || processed % 20 === 0) {
        console.log(`  ❌ Error en artículo ${processed}: ${error.message}`);
        if (isDebug) console.log(`     URL: ${item.url}`);
      }
    }
  }
  
  console.log(`\n📊 Resumen de imágenes:`);
  console.log(`   ✅ Imágenes encontradas: ${imagesFound}`);
  console.log(`   🔄 Imágenes reemplazadas: ${imagesReplaced}`);
  console.log(`   📰 Artículos procesados: ${processed}\n`);

  // Cerrar el navegador de Puppeteer
  await closeBrowser();

  // Filtrar últimos 3 meses + dedupe por URL
  const recent = allItems.filter((i) => withinLastMonths(i.publishedAt, 3));
  const deduped = [];
  const seen = new Set();
  for (const item of recent.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))) {
    const key = item.url;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
  }

  // Limitar para no crecer sin control
  const finalItems = deduped.slice(0, 120);

  await fs.writeJson(OUT_FILE, { fetchedAt: new Date().toISOString(), items: finalItems }, { spaces: 2 });
  console.log(`✅ Guardado ${finalItems.length} noticias en ${OUT_FILE}`);
}

if (require.main === module) {
  main().catch((err) => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
}


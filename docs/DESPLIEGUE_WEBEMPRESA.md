# Guía de Despliegue en Webempresa

Esta guía te ayudará a subir tu aplicación Next.js a Webempresa. Como Webempresa no soporta Node.js, usaremos la exportación estática de Next.js.

## 📋 Requisitos Previos

- Cuenta en Webempresa
- Acceso FTP o al panel de control (cPanel/WePanel)
- Node.js instalado en tu máquina local (para generar el build)

## 🚀 Pasos para el Despliegue

### 1. Generar el Build Estático

En tu máquina local, ejecuta:

```bash
npm run build
```

Esto generará una carpeta `out/` con todos los archivos estáticos (HTML, CSS, JS) listos para subir.

### 2. Preparar los Archivos para Subir

Los archivos que debes subir están en la carpeta `out/`. Esta carpeta contiene:
- Archivos HTML estáticos
- Archivos CSS y JavaScript
- Imágenes y recursos estáticos
- `sitemap.xml` y `robots.txt`

### 3. Subir Archivos a Webempresa

Tienes dos opciones:

#### Opción A: FTP/SFTP

1. Conecta a tu servidor Webempresa usando un cliente FTP (FileZilla, WinSCP, etc.)
2. Navega a la carpeta `public_html` o `www` (depende de tu configuración)
3. Sube **todo el contenido** de la carpeta `out/` a `public_html/`
   - **IMPORTANTE**: Sube el contenido de `out/`, no la carpeta `out/` misma
   - Debe quedar: `public_html/index.html`, `public_html/_next/`, etc.

#### Opción B: Panel de Control (cPanel/WePanel)

1. Accede a tu panel de control de Webempresa
2. Abre el "Administrador de archivos" o "File Manager"
3. Navega a `public_html`
4. Sube los archivos usando la función de subida del panel
5. O comprime la carpeta `out/` en un ZIP y descomprímela en `public_html`

### 4. Configurar el Dominio

1. Asegúrate de que tu dominio apunta a Webempresa (DNS configurados)
2. Si usas un subdominio, configúralo en el panel de control

### 5. Verificar el Despliegue

1. Visita tu dominio en el navegador
2. Verifica que todas las páginas cargan correctamente
3. Prueba la navegación entre páginas
4. Verifica que las imágenes se cargan correctamente

## ⚠️ Limitaciones del Modo Estático

### Formulario de Contacto

El formulario de contacto **NO funcionará** con la API route actual en modo estático. Se ha configurado para usar Formspree (servicio externo gratuito) que funciona perfectamente con sitios estáticos.

Si prefieres otra solución, puedes:
- Usar otro servicio de formularios (SendGrid, Mailgun, etc.)
- Configurar un script PHP simple (Webempresa soporta PHP)
- Usar un servicio de terceros como Typeform o Google Forms

### API Routes

Las API routes de Next.js (`/api/*`) **NO funcionan** en exportación estática. Si necesitas funcionalidad del servidor, deberás:
- Usar servicios externos (APIs de terceros)
- Crear scripts PHP (Webempresa soporta PHP)
- Considerar un hosting que soporte Node.js (Vercel, Netlify, etc.)

## 📁 Estructura de Archivos en el Servidor

Después de subir, tu estructura debería verse así:

```
public_html/
├── index.html
├── _next/
│   ├── static/
│   └── ...
├── contacto.html
├── sobre-nosotros.html
├── privacidad.html
├── terminos.html
├── tractores/
│   └── [varios archivos HTML]
├── marcas/
│   └── [varios archivos HTML]
├── sitemap.xml
├── robots.txt
└── images/
    └── [imágenes]
```

## 🔧 Configuración Adicional

### .htaccess para Rewrites (Opcional)

Si necesitas reglas de reescritura, crea un archivo `.htaccess` en `public_html/`:

```apache
# Habilitar compresión
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Cache de archivos estáticos
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### SSL/HTTPS

Webempresa ofrece certificados SSL gratuitos (Let's Encrypt). Asegúrate de activarlo en el panel de control.

## 🔄 Actualizar el Sitio

Cada vez que hagas cambios:

1. Ejecuta `npm run build` localmente
2. Sube los archivos nuevos/modificados de la carpeta `out/` al servidor
3. Limpia la caché del navegador si es necesario

## 🐛 Solución de Problemas

### Las páginas no cargan
- Verifica que subiste el contenido de `out/`, no la carpeta completa
- Verifica los permisos de archivos (deben ser 644 para archivos, 755 para carpetas)
- Revisa los logs de error en el panel de control

### Las imágenes no se ven
- Verifica que la carpeta `public/images/` se subió correctamente
- Verifica las rutas en el código (deben ser relativas)

### Errores 404
- Verifica que el `sitemap.xml` se generó correctamente
- Asegúrate de que todas las páginas se generaron en el build

### El formulario no funciona
- Verifica que el formulario está configurado para usar Formspree o el servicio que hayas elegido
- Revisa la consola del navegador para errores

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs de error en el panel de Webempresa
2. Contacta al soporte de Webempresa
3. Verifica la documentación de Next.js sobre exportación estática

## 🔗 Recursos Útiles

- [Documentación de Next.js - Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Panel de Control Webempresa](https://www.webempresa.com)
- [Documentación de Webempresa](https://guias.webempresa.com)


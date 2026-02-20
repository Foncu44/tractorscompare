# Problema de Redirección HTTPS - Bucle Infinito

## 🚨 Problema Detectado

El sitio está experimentando un **bucle de redirección HTTPS infinito**:

- El servidor Nginx está redirigiendo `https://tractorscompare.com/` a sí mismo
- Error: `NS_ERROR_REDIRECT_LOOP`
- Todas las solicitudes devuelven código `301 Moved Permanently`

## 🔍 Causa

El problema **NO es del código de la aplicación**, sino de la **configuración del servidor Nginx**.

Cuando usas Next.js con `output: 'export'` (sitio estático), las redirecciones HTTPS deben configurarse **en el servidor**, no en el código.

El archivo `.htaccess` que existe en `public/.htaccess` es para Apache, pero tu servidor usa **Nginx**, que ignora completamente los archivos `.htaccess`.

## ✅ Solución

### Opción 1: Contactar con Webempresa (Recomendado)

Si estás usando Webempresa como hosting:

1. **Accede al panel de control** de Webempresa
2. **Ve a la sección de SSL/HTTPS**
3. **Asegúrate de que el certificado SSL está activado** (Webempresa ofrece Let's Encrypt gratuito)
4. **Revisa la configuración de redirección HTTPS**:
   - Debe redirigir HTTP → HTTPS
   - **NO debe redirigir HTTPS → HTTPS** (esto causa el bucle)

### Opción 2: Configuración Manual de Nginx

Si tienes acceso a la configuración de Nginx, asegúrate de que la configuración sea así:

```nginx
server {
    listen 80;
    server_name tractorscompare.com www.tractorscompare.com;

    # Redirigir HTTP a HTTPS (SOLO cuando NO es HTTPS)
    return 301 https://tractorscompare.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tractorscompare.com www.tractorscompare.com;

    # Certificados SSL
    ssl_certificate /ruta/al/certificado.crt;
    ssl_certificate_key /ruta/al/privada.key;

    # Redirigir www a no-www (opcional)
    if ($host = www.tractorscompare.com) {
        return 301 https://tractorscompare.com$request_uri;
    }

    # Root del sitio
    root /ruta/a/tu/sitio;
    index index.html;

    # Servir archivos estáticos
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**⚠️ IMPORTANTE**: La clave es que el bloque `listen 443` **NO debe redirigir a sí mismo**. Solo debe servir el contenido.

### Opción 3: Eliminar Redirecciones HTTPS Temporalmente

Si necesitas que el sitio funcione inmediatamente mientras solucionas el problema del servidor:

1. **Comenta las reglas de redirección HTTPS** en la configuración de Nginx
2. **O pide a Webempresa que desactive temporalmente** la redirección HTTPS forzada
3. El sitio funcionará en HTTP hasta que se corrija

## 📝 Cambios Realizados en el Código

He eliminado las reglas de redirección HTTPS del archivo `.htaccess` porque:

- El servidor usa Nginx (no Apache), así que `.htaccess` no se procesa de todos modos
- Las redirecciones HTTPS deben manejarse en el servidor, no en el código
- Para un sitio estático de Next.js, no necesitas redirección HTTPS en el código

## 🔧 Verificación

Para verificar que el problema está resuelto:

1. **Limpia la caché del navegador** (Ctrl+Shift+Delete)
2. **Intenta acceder a** `https://tractorscompare.com/`
3. **Revisa las herramientas de desarrollador** (F12) → Pestaña Network
4. **Deberías ver**:
   - Código `200 OK` para las solicitudes
   - No más códigos `301` en bucle
   - El contenido de la página cargándose correctamente

## 📞 Soporte

Si el problema persiste después de revisar la configuración del servidor:

1. **Contacta al soporte de Webempresa** y menciona:

   - "Bucle de redirección HTTPS"
   - "El servidor Nginx está redirigiendo HTTPS a HTTPS"
   - "Necesito que revisen la configuración de redirección SSL"

2. **Puedes mostrarles esta documentación** como referencia

## 🔗 Referencias

- [Documentación de Next.js - Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Nginx - Redirección HTTP a HTTPS](https://www.nginx.com/blog/creating-nginx-rewrite-rules/)
- [Webempresa - SSL/HTTPS](https://guias.webempresa.com)

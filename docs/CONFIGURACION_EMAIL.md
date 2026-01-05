# Configuración del Formulario de Contacto

El formulario de contacto está configurado para enviar correos electrónicos a `contact@tractorscompare.com`. Para que funcione correctamente, necesitas configurar las variables de entorno SMTP.

## Variables de Entorno Requeridas

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# SMTP Configuration for Contact Form
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com
```

## Configuración por Proveedor

### Gmail

1. **Habilita la verificación en 2 pasos** en tu cuenta de Google:
   - Ve a [myaccount.google.com/security](https://myaccount.google.com/security)
   - Activa la verificación en 2 pasos

2. **Genera una Contraseña de Aplicación**:
   - Ve a [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Selecciona "Correo" y "Otro (nombre personalizado)"
   - Ingresa "TractorsCompare" como nombre
   - Copia la contraseña generada (16 caracteres)

3. **Configura las variables de entorno**:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=tu-email@gmail.com
   SMTP_PASSWORD=la-contraseña-de-aplicación-generada
   SMTP_FROM=tu-email@gmail.com
   ```

### Outlook / Microsoft 365

```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@outlook.com
SMTP_PASSWORD=tu-contraseña
SMTP_FROM=tu-email@outlook.com
```

### Mailgun

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@tu-dominio.mailgun.org
SMTP_PASSWORD=tu-password-de-mailgun
SMTP_FROM=noreply@tractorscompare.com
```

### SendGrid

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=tu-api-key-de-sendgrid
SMTP_FROM=noreply@tractorscompare.com
```

### Otros Proveedores SMTP

Para otros proveedores, consulta su documentación para obtener:
- **SMTP_HOST**: El servidor SMTP (ej: smtp.tu-proveedor.com)
- **SMTP_PORT**: Puerto SMTP (generalmente 587 para TLS o 465 para SSL)
- **SMTP_SECURE**: `true` para SSL (puerto 465) o `false` para TLS (puerto 587)
- **SMTP_USER**: Tu usuario/email
- **SMTP_PASSWORD**: Tu contraseña o API key

## Verificación

Una vez configuradas las variables de entorno:

1. Reinicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Prueba el formulario de contacto en `/contacto`

3. Verifica que recibes el correo en `contact@tractorscompare.com`

## Notas de Seguridad

- **Nunca** subas el archivo `.env` al repositorio (ya está en `.gitignore`)
- Usa contraseñas de aplicación en lugar de contraseñas regulares cuando sea posible
- Para producción, configura las variables de entorno en tu plataforma de hosting (Vercel, Netlify, etc.)

## Solución de Problemas

### Error: "SMTP credentials not configured"
- Verifica que todas las variables de entorno estén configuradas
- Asegúrate de que el archivo `.env` esté en la raíz del proyecto
- Reinicia el servidor después de agregar/modificar variables de entorno

### Error: "Invalid login"
- Verifica que las credenciales sean correctas
- Para Gmail, asegúrate de usar una Contraseña de Aplicación, no tu contraseña regular
- Verifica que la verificación en 2 pasos esté activada (requerido para Gmail)

### Error: "Connection timeout"
- Verifica que el puerto y host sean correctos
- Verifica tu conexión a internet
- Algunos proveedores pueden requerir que agregues la IP del servidor a una lista blanca


# Configuración del Formulario de Contacto para Sitio Estático

El formulario de contacto ha sido configurado para funcionar tanto en desarrollo (con API route) como en producción estática (con Formspree).

## 🔧 Configuración para Producción Estática

### Opción 1: Usar Formspree (Recomendado - Gratis)

Formspree es un servicio gratuito que permite enviar formularios desde sitios estáticos sin necesidad de backend.

#### Pasos:

1. **Crear cuenta en Formspree**:
   - Ve a [https://formspree.io](https://formspree.io)
   - Crea una cuenta gratuita (hasta 50 envíos/mes gratis)

2. **Crear un nuevo formulario**:
   - En el dashboard, haz clic en "New Form"
   - Configura el email de destino: `contact@tractorscompare.com`
   - Copia el endpoint que te proporciona (ej: `https://formspree.io/f/xxxxxxxxxx`)

3. **Configurar la variable de entorno**:
   - Crea o edita el archivo `.env.local` en la raíz del proyecto
   - Agrega:
     ```env
     NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/xxxxxxxxxx
     ```
   - Reemplaza `xxxxxxxxxx` con tu ID de formulario de Formspree

4. **Rebuild y despliegue**:
   ```bash
   npm run build
   ```
   - El formulario ahora usará Formspree en lugar de la API route

### Opción 2: Usar mailto: (Simple pero limitado)

Si no quieres usar Formspree, el formulario mostrará un enlace directo a `contact@tractorscompare.com` como alternativa.

**Ventajas:**
- No requiere configuración
- Funciona inmediatamente

**Desventajas:**
- Requiere que el usuario tenga un cliente de correo configurado
- Menos profesional

### Opción 3: Script PHP (Webempresa soporta PHP)

Si prefieres mantener el control total, puedes crear un script PHP simple:

1. Crea un archivo `contact.php` en `public/`:
```php
<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $subject = htmlspecialchars($_POST['subject']);
    $message = htmlspecialchars($_POST['message']);
    
    $to = "contact@tractorscompare.com";
    $email_subject = "Contacto desde TractorsCompare: " . $subject;
    $email_body = "Nombre: $name\n";
    $email_body .= "Email: $email\n";
    $email_body .= "Asunto: $subject\n\n";
    $email_body .= "Mensaje:\n$message";
    
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    
    mail($to, $email_subject, $email_body, $headers);
    
    header("Location: /contacto?success=1");
    exit;
}
?>
```

2. Modifica `ContactForm.tsx` para enviar a `/contact.php` en lugar de `/api/contact`

## 📝 Notas Importantes

- **En desarrollo local**: El formulario intentará usar `/api/contact` primero
- **En producción estática**: Si `NEXT_PUBLIC_FORMSPREE_ENDPOINT` está configurado, usará Formspree
- **Fallback**: Si todo falla, muestra un enlace mailto:

## 🔄 Actualizar después de cambios

Cada vez que cambies la configuración del formulario:
1. Ejecuta `npm run build`
2. Sube los archivos actualizados al servidor

## 🆓 Límites de Formspree Gratis

- **50 envíos por mes** en el plan gratuito
- Si necesitas más, considera:
  - Plan de pago de Formspree ($10/mes para 250 envíos)
  - Alternativas como SendGrid, Mailgun, etc.
  - Script PHP propio


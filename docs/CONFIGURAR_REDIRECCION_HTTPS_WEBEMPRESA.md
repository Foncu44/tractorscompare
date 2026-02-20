# Configurar Redirección HTTP a HTTPS en Webempresa

## 📋 Prerequisitos

✅ **Certificados SSL instalados** (ya los tienes activos según las imágenes)
- `tractorscompare.com` ✓
- `www.tractorscompare.com` ✓
- Certificado Let's Encrypt válido hasta 2026-03-15

## 🔧 Opciones para Configurar la Redirección

### Opción 1: A través de "Dominios" (Recomendado - Más Fácil) ⭐

Webempresa (que usa cPanel) tiene una opción específica para forzar HTTPS:

1. **Accede al panel de control** de Webempresa (cPanel o WePanel)
2. **Busca y haz clic en la sección "Dominios"**
3. **En la lista de dominios**, busca `tractorscompare.com`
4. **Activa el interruptor/checkbox** que dice **"Forzar redireccionamiento HTTPS"** o **"Forzar HTTPS"**
   - Suele estar al lado del nombre del dominio
   - Puede ser un toggle, checkbox o botón
5. **Guarda los cambios**

**✅ Esto automáticamente configura la redirección HTTP → HTTPS para tu dominio.**

### Opción 2: A través de "Dominios" → Configuración del Dominio

Si no encuentras el interruptor anterior:

1. **Accede a "Dominios"**
2. **Haz clic en el nombre de tu dominio** `tractorscompare.com` (o en un ícono de engranaje/configuración)
3. **Busca una sección llamada**:
   - "Redirecciones"
   - "Forzar HTTPS"
   - "Configuración SSL/HTTPS"
4. **Activa la opción "Forzar redireccionamiento HTTPS"**
5. **Guarda los cambios**

### Opción 3: A través de "Redirecciones" (Manual)

Si las opciones anteriores no están disponibles:

1. **Busca en el panel** la sección **"Redirecciones"** (puede estar en "Dominios" o como sección separada)
2. **Crea una nueva redirección**:
   - **Tipo**: 301 (Permanente)
   - **Desde**: `http://tractorscompare.com` (o `http://tractorscompare.com/*`)
   - **Hacia**: `https://tractorscompare.com$1` (o `https://tractorscompare.com/$1`)
3. **Repite para www** (opcional, para redirigir www también):
   - **Tipo**: 301 (Permanente)
   - **Desde**: `http://www.tractorscompare.com` (o `http://www.tractorscompare.com/*`)
   - **Hacia**: `https://tractorscompare.com$1` (o `https://tractorscompare.com/$1`)

### Opción 4: Contactar con Soporte de Webempresa

Si no encuentras ninguna de estas opciones en el panel:

1. **Abre un ticket de soporte** en Webempresa
2. **Pide específicamente**:
   - "Necesito configurar redirección HTTP a HTTPS para tractorscompare.com"
   - "El certificado SSL está instalado pero no redirige automáticamente"
   - "Quiero que todas las solicitudes HTTP se redirijan a HTTPS"

## ⚠️ IMPORTANTE: Evitar el Bucle de Redirección

**El problema actual es que HTTPS se está redirigiendo a sí mismo.**

La redirección correcta debe ser:
- ✅ `http://tractorscompare.com` → `https://tractorscompare.com`
- ✅ `http://www.tractorscompare.com` → `https://tractorscompare.com`
- ✅ `https://www.tractorscompare.com` → `https://tractorscompare.com`
- ❌ **NO** `https://tractorscompare.com` → `https://tractorscompare.com` (esto causa el bucle)

Si encuentras una regla que redirige HTTPS a HTTPS, **debes eliminarla o corregirla**.

## 🧪 Verificación

Después de configurar la redirección:

1. **Abre una ventana de incógnito** (Ctrl+Shift+N)
2. **Intenta acceder a** `http://tractorscompare.com`
3. **Debería redirigir automáticamente a** `https://tractorscompare.com`
4. **Abre las herramientas de desarrollador** (F12) → Pestaña Network
5. **Verifica**:
   - Primera solicitud: `http://tractorscompare.com` → Código `301`
   - Segunda solicitud: `https://tractorscompare.com` → Código `200 OK`
   - **NO debería haber bucles**

## 📍 Dónde Encontrar la Opción en el Panel

En Webempresa (cPanel), la opción **"Forzar redireccionamiento HTTPS"** generalmente está en:

1. **"Dominios"** → Lista de dominios → Interruptor junto a `tractorscompare.com`
2. **"Dominios"** → Haz clic en tu dominio → Sección de configuración
3. **"Dominios"** → "Administrar Redirecciones" o "Redirecciones"

**💡 Tip**: Busca un interruptor/toggle, checkbox o botón que diga:
- "Forzar HTTPS"
- "Forzar redireccionamiento HTTPS"
- "Redirect to HTTPS"
- "Force HTTPS Redirect"

## 📞 Si No Encuentras la Opción

Si no puedes encontrar ninguna opción en el panel:

1. **Contacta con soporte de Webempresa** por teléfono o chat
2. **Di exactamente**: "Necesito configurar redirección automática de HTTP a HTTPS para tractorscompare.com. El certificado SSL ya está instalado."
3. **Pueden hacerlo ellos** desde su panel de administración

## 🎯 Solución Temporal (Mientras Tanto)

Si necesitas que el sitio funcione inmediatamente:

1. **Accede directamente a** `https://tractorscompare.com` (escribe HTTPS manualmente)
2. **O pide a soporte** que desactive temporalmente cualquier redirección HTTPS mal configurada
3. El sitio funcionará, pero no redirigirá automáticamente desde HTTP

## 📝 Nota sobre Next.js

Para sitios estáticos de Next.js (`output: 'export'`):
- **NO necesitas** configurar redirección en el código
- **SÍ necesitas** configurarla en el servidor (Webempresa)
- El archivo `.htaccess` no funciona con Nginx (que es lo que usa Webempresa)

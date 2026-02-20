# Solución Error EBUSY en Build de Next.js

## 🚨 Error

```
Error: EBUSY: resource busy or locked, unlink 'C:\Users\Foncu\Documents\GitHub\tractorscompare\out\tractores\avery-track-runner.txt'
```

## 🔍 Causa

Este error ocurre cuando Next.js intenta eliminar o sobrescribir un archivo durante el build, pero Windows lo tiene bloqueado por algún proceso.

## ✅ Soluciones (en orden de facilidad)

### Solución 1: Cerrar Ventanas de Explorer (Más Común) ⭐

1. **Cierra todas las ventanas de Windows Explorer** que estén abiertas en la carpeta `out/` o `tractorscompare/`
2. **Cierra el explorador de archivos** si tienes abierta la carpeta del proyecto
3. **Intenta el build de nuevo**:
   ```powershell
   npm run build
   ```

### Solución 2: Cerrar VS Code / Editores

1. **Cierra el archivo** que está causando el error si lo tienes abierto
2. **Cierra VS Code completamente** y vuelve a abrirlo
3. **Intenta el build de nuevo**

### Solución 3: Eliminar la Carpeta `out/` Manualmente

1. **Cierra VS Code** (Cursor)
2. **Abre PowerShell como administrador**
3. **Elimina la carpeta `out/`**:
   ```powershell
   cd "C:\Users\Foncu\Documents\GitHub\tractorscompare"
   Remove-Item -Recurse -Force out
   ```
4. **Vuelve a abrir Cursor/VS Code**
5. **Ejecuta el build de nuevo**:
   ```powershell
   npm run build
   ```

### Solución 4: Reiniciar el Sistema

Si ninguna de las soluciones anteriores funciona:

1. **Guarda todo tu trabajo**
2. **Cierra todos los programas**
3. **Reinicia tu computadora**
4. **Ejecuta el build de nuevo**

### Solución 5: Verificar Procesos que Bloquean el Archivo

1. **Abre PowerShell como administrador**
2. **Ejecuta**:
   ```powershell
   # Ver procesos que podrían estar bloqueando
   Get-Process | Where-Object {$_.Path -like "*tractorscompare*"}
   ```
3. **Si encuentras procesos**, ciérralos manualmente
4. **Intenta el build de nuevo**

### Solución 6: Desactivar Antivirus Temporalmente

A veces el antivirus está escaneando los archivos:

1. **Desactiva temporalmente** Windows Defender o tu antivirus
2. **Ejecuta el build**
3. **Vuelve a activar el antivirus**

## 🔧 Script de Limpieza Automática

Puedes crear un script para limpiar antes del build:

**`scripts/clean-build.ps1`**:
```powershell
# Cerrar procesos de Node
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Esperar un momento
Start-Sleep -Seconds 2

# Eliminar carpeta out si existe
if (Test-Path "out") {
    Remove-Item -Recurse -Force out -ErrorAction SilentlyContinue
}

Write-Host "Limpieza completada. Ejecuta 'npm run build' ahora."
```

Luego ejecuta:
```powershell
.\scripts\clean-build.ps1
npm run build
```

## 💡 Prevención

Para evitar este problema en el futuro:

1. **Cierra las ventanas de Explorer** antes de hacer build
2. **No tengas archivos de `out/` abiertos** en editores
3. **Añade `out/` a `.gitignore`** (ya debería estar)
4. **Usa el script de limpieza** antes de cada build importante

## 🎯 Solución Rápida Recomendada

**La solución más rápida suele ser:**

1. ✅ Cerrar todas las ventanas de Explorer
2. ✅ Cerrar y volver a abrir Cursor/VS Code
3. ✅ Ejecutar: `npm run build`

Si el problema persiste, elimina la carpeta `out/` manualmente y vuelve a intentar.

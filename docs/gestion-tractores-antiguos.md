# Gestión de tractores antiguos (discontinuados)

Este proyecto ya incluye un script para limpiar modelos antiguos de forma segura.

## Comando recomendado

```bash
npm run prune-old-tractors -- --before-year 1995
```

Ese comando corre en **modo simulación** (no toca archivos) y te muestra cuántos tractores eliminaría.

## Aplicar cambios reales

```bash
npm run prune-old-tractors -- --before-year 1995 --apply
```

Al aplicar:

1. Crea una copia de seguridad en `data/backups/`.
2. Reescribe `data/scraped-tractors.json` sin los modelos antiguos.
3. Regenera `data/processed-tractors.ts` automáticamente.

## Opciones útiles

- `--remove-without-year`: también elimina tractores sin año conocido.
- `--no-rebuild`: no regenera `processed-tractors.ts` (solo si quieres hacerlo luego manualmente).

## Recomendación operativa

1. Ejecuta primero en simulación.
2. Revisa ejemplos de eliminación mostrados en consola.
3. Ejecuta con `--apply`.
4. Corre lint/build para validar.

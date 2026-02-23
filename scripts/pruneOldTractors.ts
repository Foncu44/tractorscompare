#!/usr/bin/env tsx

import { promises as fs } from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

interface TractorRecord {
  id?: string;
  brand?: string;
  model?: string;
  year?: number;
  productionYears?: {
    start?: number;
    end?: number;
  };
}

interface CliOptions {
  beforeYear: number;
  applyChanges: boolean;
  removeWithoutYear: boolean;
  rebuildProcessed: boolean;
}

const ROOT = process.cwd();
const SCRAPED_FILE = path.join(ROOT, 'data', 'scraped-tractors.json');
const BACKUP_DIR = path.join(ROOT, 'data', 'backups');

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    beforeYear: 1990,
    applyChanges: false,
    removeWithoutYear: false,
    rebuildProcessed: true,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--before-year') {
      const value = Number(argv[i + 1]);
      if (!Number.isFinite(value)) {
        throw new Error('El valor de --before-year debe ser un número.');
      }
      options.beforeYear = value;
      i += 1;
    } else if (arg === '--apply') {
      options.applyChanges = true;
    } else if (arg === '--remove-without-year') {
      options.removeWithoutYear = true;
    } else if (arg === '--no-rebuild') {
      options.rebuildProcessed = false;
    } else if (arg === '--help' || arg === '-h') {
      printHelpAndExit();
    }
  }

  return options;
}

function printHelpAndExit(): never {
  console.log(`\nUso:\n  npm run prune-old-tractors -- --before-year 1985 [--apply] [--remove-without-year] [--no-rebuild]\n\nOpciones:\n  --before-year <year>      Elimina tractores cuya producción termina en ese año o antes.\n  --apply                   Aplica cambios en data/scraped-tractors.json (sin esto es simulación).\n  --remove-without-year     También elimina tractores que no tengan año conocido.\n  --no-rebuild              No regenera data/processed-tractors.ts tras aplicar.\n  -h, --help                Muestra esta ayuda.\n`);
  process.exit(0);
}

function getEndYear(tractor: TractorRecord): number | undefined {
  if (tractor.productionYears?.end && Number.isFinite(tractor.productionYears.end)) {
    return tractor.productionYears.end;
  }

  if (tractor.year && Number.isFinite(tractor.year)) {
    return tractor.year;
  }

  if (tractor.productionYears?.start && Number.isFinite(tractor.productionYears.start)) {
    return tractor.productionYears.start;
  }

  return undefined;
}

async function ensureBackup(originalContent: string): Promise<string> {
  await fs.mkdir(BACKUP_DIR, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(BACKUP_DIR, `scraped-tractors.${timestamp}.json`);
  await fs.writeFile(backupPath, originalContent, 'utf-8');
  return backupPath;
}

function summarizeExamples(list: TractorRecord[], max = 8): string {
  return list
    .slice(0, max)
    .map((t) => `${t.id || 'sin-id'} (${t.brand || 'Unknown'} ${t.model || ''})`)
    .join(', ');
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const originalContent = await fs.readFile(SCRAPED_FILE, 'utf-8');
  const tractors = JSON.parse(originalContent) as TractorRecord[];

  const toRemove: TractorRecord[] = [];
  const toKeep: TractorRecord[] = [];

  for (const tractor of tractors) {
    const endYear = getEndYear(tractor);

    const shouldRemoveByYear = endYear !== undefined && endYear <= options.beforeYear;
    const shouldRemoveByMissingYear = endYear === undefined && options.removeWithoutYear;

    if (shouldRemoveByYear || shouldRemoveByMissingYear) {
      toRemove.push(tractor);
    } else {
      toKeep.push(tractor);
    }
  }

  console.log(`\n📊 Total tractores: ${tractors.length}`);
  console.log(`🗑️  Candidatos a eliminar: ${toRemove.length}`);
  console.log(`✅ Tractores conservados: ${toKeep.length}`);
  console.log(`📌 Filtro aplicado: endYear <= ${options.beforeYear}${options.removeWithoutYear ? ' + sin año' : ''}`);

  if (toRemove.length > 0) {
    console.log(`\nEjemplos a eliminar: ${summarizeExamples(toRemove)}`);
  }

  if (!options.applyChanges) {
    console.log('\nℹ️ Modo simulación: no se realizaron cambios. Usa --apply para guardar.');
    return;
  }

  const backupPath = await ensureBackup(originalContent);
  await fs.writeFile(SCRAPED_FILE, `${JSON.stringify(toKeep, null, 2)}\n`, 'utf-8');
  console.log(`\n💾 Archivo actualizado: ${SCRAPED_FILE}`);
  console.log(`🛟 Copia de seguridad: ${backupPath}`);

  if (options.rebuildProcessed) {
    console.log('\n🔄 Regenerando data/processed-tractors.ts...');
    const result = spawnSync('node', ['scripts/processScrapedData.js'], {
      cwd: ROOT,
      stdio: 'inherit',
    });

    if (result.status !== 0) {
      throw new Error('Falló la regeneración de processed-tractors.ts.');
    }
  }

  console.log('\n✅ Limpieza completada.');
}

main().catch((error) => {
  console.error('❌ Error en pruneOldTractors:', error);
  process.exit(1);
});

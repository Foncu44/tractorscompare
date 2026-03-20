/**
 * Image registry I/O utilities.
 *
 * The registry is a JSON array stored at data/image-registry.json.
 * Every image candidate lives here from first discovery through publication.
 * Writes are atomic (write tmp → rename) to prevent corruption.
 */

import fs from 'fs';
import path from 'path';
import type { TractorImageRecord, ImageStatus } from '@/types/tractorImageRecord';

const REGISTRY_PATH = path.join(process.cwd(), 'data', 'image-registry.json');

// ---------------------------------------------------------------------------
// Core I/O
// ---------------------------------------------------------------------------

export function loadRegistry(): TractorImageRecord[] {
  if (!fs.existsSync(REGISTRY_PATH)) return [];
  try {
    return JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8')) as TractorImageRecord[];
  } catch {
    return [];
  }
}

/** Atomic write: write to .tmp then rename. */
export function saveRegistry(records: TractorImageRecord[]): void {
  const tmp = REGISTRY_PATH + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(records, null, 2), 'utf-8');
  fs.renameSync(tmp, REGISTRY_PATH);
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export function addRecord(record: TractorImageRecord): void {
  const registry = loadRegistry();
  registry.push(record);
  saveRegistry(registry);
}

export function addRecords(newRecords: TractorImageRecord[]): void {
  if (newRecords.length === 0) return;
  const registry = loadRegistry();
  registry.push(...newRecords);
  saveRegistry(registry);
}

export function updateRecord(id: string, updates: Partial<TractorImageRecord>): boolean {
  const registry = loadRegistry();
  const idx = registry.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  registry[idx] = {
    ...registry[idx],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  saveRegistry(registry);
  return true;
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export function findByTractorId(tractorId: string): TractorImageRecord[] {
  return loadRegistry().filter((r) => r.tractor_id === tractorId);
}

/**
 * Returns the single published primary image for a tractor, if any.
 * Falls back to any published image if no primary is set.
 */
export function findPublishedPrimary(tractorId: string): TractorImageRecord | undefined {
  const all = loadRegistry().filter(
    (r) => r.tractor_id === tractorId && r.status === 'published',
  );
  return all.find((r) => r.is_primary) ?? all[0];
}

export function findByStatus(status: ImageStatus): TractorImageRecord[] {
  return loadRegistry().filter((r) => r.status === status);
}

export function findByStatuses(statuses: ImageStatus[]): TractorImageRecord[] {
  return loadRegistry().filter((r) => statuses.includes(r.status));
}

/** Returns the registry record that owns a given file hash (for dedup). */
export function findByHash(hash: string): TractorImageRecord | undefined {
  return loadRegistry().find((r) => r.file_hash === hash);
}

/**
 * Returns the set of tractor IDs that already have at least one registry
 * entry with one of the given statuses.  Used by the collector to skip
 * tractors that are already in progress.
 */
export function tractorIdsInRegistry(
  statuses: ImageStatus[] = ['pending', 'downloaded', 'approved', 'published'],
): Set<string> {
  const registry = loadRegistry();
  const set = new Set<string>();
  for (const r of registry) {
    if (statuses.includes(r.status)) set.add(r.tractor_id);
  }
  return set;
}

// ---------------------------------------------------------------------------
// Stats helper
// ---------------------------------------------------------------------------

export function registryStats(): Record<ImageStatus | 'total', number> {
  const registry = loadRegistry();
  const counts: Record<string, number> = {
    total: registry.length,
    pending: 0,
    downloaded: 0,
    approved: 0,
    rejected: 0,
    published: 0,
  };
  for (const r of registry) counts[r.status] = (counts[r.status] ?? 0) + 1;
  return counts as Record<ImageStatus | 'total', number>;
}

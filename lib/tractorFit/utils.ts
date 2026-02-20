/**
 * Safe filename for tractor ID (Windows + cross-platform)
 */
const WINDOWS_RESERVED = new Set([
  'con', 'prn', 'aux', 'nul', 'com1', 'com2', 'com3', 'com4', 'com5', 'com6', 'com7', 'com8', 'com9',
  'lpt1', 'lpt2', 'lpt3', 'lpt4', 'lpt5', 'lpt6', 'lpt7', 'lpt8', 'lpt9',
]);

export function sanitizeTractorId(id: string): string {
  if (!id || typeof id !== 'string') return 'unknown';
  const safe = id.replace(/[^a-zA-Z0-9\-_]/g, '_').replace(/\.\./g, '_');
  const lower = safe.toLowerCase();
  if (WINDOWS_RESERVED.has(lower)) return safe + '_';
  return safe || 'unknown';
}

/**
 * Parse JSON with BOM strip. Returns null on error (for use in pages so build does not crash).
 */
export function tryParseJson<T>(content: string): T | null {
  const trimmed = content.trim().replace(/^\uFEFF/, '');
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    return null;
  }
}

/**
 * Parse JSON with BOM strip and clear error message (throws for scripts).
 */
export function safeParseJson<T>(filePath: string, content: string): T {
  const result = tryParseJson<T>(content);
  if (result !== null) return result;
  throw new Error(`Invalid JSON at ${filePath}`);
}

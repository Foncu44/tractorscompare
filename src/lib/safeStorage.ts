/**
 * Safe storage helpers for environments where localStorage/sessionStorage may be blocked (e.g. iframes, private mode).
 * Use these instead of direct localStorage/sessionStorage when running in iframes or third-party contexts.
 */

function safeGet(store: Storage | null, key: string): string | null {
  if (store == null) return null;
  try {
    return store.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(store: Storage | null, key: string, value: string): void {
  if (store == null) return;
  try {
    store.setItem(key, value);
  } catch {
    // no-op if blocked (e.g. quota, security)
  }
}

/**
 * Returns the value for key or null if blocked/unavailable.
 */
export function safeLocalStorageGet(key: string): string | null {
  return typeof window === 'undefined' ? null : safeGet(window.localStorage, key);
}

/**
 * No-ops if localStorage is blocked or unavailable.
 */
export function safeLocalStorageSet(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  safeSet(window.localStorage, key, value);
}

/**
 * Returns the value for key or null if blocked/unavailable.
 */
export function safeSessionStorageGet(key: string): string | null {
  return typeof window === 'undefined' ? null : safeGet(window.sessionStorage, key);
}

/**
 * No-ops if sessionStorage is blocked or unavailable.
 */
export function safeSessionStorageSet(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  safeSet(window.sessionStorage, key, value);
}

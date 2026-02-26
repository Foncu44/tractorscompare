/**
 * Detects if the page is running inside an iframe (e.g. AdSense preview).
 * Use to skip analytics, GTM, or other code that may throw under iframe restrictions.
 */
export function isInIframe(): boolean {
  try {
    return typeof window !== 'undefined' && window.self !== window.top;
  } catch {
    return true;
  }
}

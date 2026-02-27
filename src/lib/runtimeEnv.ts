/**
 * Client-safe runtime environment helpers.
 * Used to avoid loading third-party scripts (GTM, GA, Translate, etc.) in AdSense preview iframe.
 */

export const isBrowser = typeof window !== 'undefined';

export const isInIframe = (): boolean => {
  try {
    return isBrowser && window.self !== window.top;
  } catch {
    return true;
  }
};

/**
 * Heuristics: treat as AdSense preview when in iframe AND
 * referrer includes googleusercontent/adsense OR URL contains "preview".
 * When true, we skip GTM/GA/Vercel Analytics to prevent client exceptions.
 */
export const isAdSensePreview = (): boolean => {
  if (!isBrowser) return false;
  const href = window.location.href;
  const ref = document.referrer || '';
  return isInIframe() && (
    ref.includes('googleusercontent.com') ||
    ref.includes('adsense') ||
    href.includes('preview')
  );
};

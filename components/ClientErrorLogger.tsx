'use client';

import { useEffect } from 'react';

const PREFIX = '[TC-CLIENT-ERROR]';

/**
 * Production-safe client error logger. Only active when NEXT_PUBLIC_DEBUG_ERRORS === "true".
 * Logs window.onerror and unhandledrejection with location.href and userAgent for debugging
 * (e.g. AdSense preview iframe exceptions).
 */
export default function ClientErrorLogger() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DEBUG_ERRORS !== 'true') return;

    const ctx = () => ({
      href: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    });

    const onError = (event: ErrorEvent) => {
      console.error(PREFIX, 'window.onerror:', event.message, event.filename, event.lineno, event.colno, event.error, ctx());
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error(PREFIX, 'unhandledrejection:', event.reason, ctx());
    };

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onUnhandledRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
    };
  }, []);

  return null;
}

'use client';

import { useEffect } from 'react';

const PREFIX = '[TractorsCompare Error]';

/**
 * Minimal client-side error logger. Only active when NEXT_PUBLIC_DEBUG_ERRORS=true.
 * Use for production preview testing to detect client-side exceptions (e.g. AdSense/CSP).
 */
export default function ClientErrorLogger() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_DEBUG_ERRORS !== 'true') {
      return;
    }

    const onError = (event: ErrorEvent) => {
      console.error(PREFIX, 'window.onerror:', event.message, event.filename, event.lineno, event.colno, event.error);
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error(PREFIX, 'unhandledrejection:', event.reason);
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

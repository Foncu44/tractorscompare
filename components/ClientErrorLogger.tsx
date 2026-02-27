'use client';

import { useEffect } from 'react';

const PREFIX = '[TC CLIENT ERROR]';

/**
 * Lightweight client error logger. Only active when NEXT_PUBLIC_DEBUG_ERRORS === "true".
 * Logs window.onerror and unhandledrejection with href and stack for debugging
 * (e.g. AdSense preview iframe exceptions).
 */
export default function ClientErrorLogger() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DEBUG_ERRORS !== 'true') return;

    const href = typeof window !== 'undefined' ? window.location.href : '';
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';

    const onError = (event: ErrorEvent) => {
      const stack = event.error?.stack ?? event.error ?? '';
      console.error(PREFIX, 'window.onerror', { message: event.message, filename: event.filename, lineno: event.lineno, colno: event.colno, stack, href, ua });
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const stack = reason?.stack ?? (reason instanceof Error ? reason.stack : '');
      console.error(PREFIX, 'unhandledrejection', { reason, stack: stack || String(reason), href, ua });
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

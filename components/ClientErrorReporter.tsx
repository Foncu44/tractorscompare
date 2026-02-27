'use client';

import { useEffect } from 'react';

const ENDPOINT = '/api/client-error';

function sendPayload(payload: Record<string, unknown>) {
  try {
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  } catch (_) {}
}

/**
 * When NEXT_PUBLIC_DEBUG_ERRORS === "true", attaches window.onerror and
 * unhandledrejection and POSTs to /api/client-error for Vercel logs.
 */
export default function ClientErrorReporter() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DEBUG_ERRORS !== 'true') return;

    const getContext = () => ({
      href: typeof window !== 'undefined' ? window.location.href : '',
      referrer: typeof document !== 'undefined' ? document.referrer || '' : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      timestamp: new Date().toISOString(),
    });

    const onError = (event: ErrorEvent) => {
      const payload = {
        type: 'window.onerror',
        message: event.message,
        stack: event.error?.stack ?? null,
        source: event.filename ?? null,
        lineno: event.lineno ?? null,
        colno: event.colno ?? null,
        ...getContext(),
      };
      console.error('[TC CLIENT ERROR]', payload);
      sendPayload(payload);
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const payload = {
        type: 'unhandledrejection',
        message: reason instanceof Error ? reason.message : String(reason),
        stack: reason instanceof Error ? reason.stack : null,
        source: null,
        lineno: null,
        colno: null,
        ...getContext(),
      };
      console.error('[TC CLIENT ERROR]', payload);
      sendPayload(payload);
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

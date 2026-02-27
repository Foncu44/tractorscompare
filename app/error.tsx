'use client';

import { useEffect } from 'react';

const CLIENT_ERROR_ENDPOINT = '/api/client-error';

function reportToApi(payload: Record<string, unknown>) {
  try {
    fetch(CLIENT_ERROR_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'error-boundary', ...payload }),
      keepalive: true,
    }).catch(() => {});
  } catch (_) {}
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    const href = typeof window !== 'undefined' ? window.location.href : '';
    const referrer = typeof document !== 'undefined' ? document.referrer || '' : '';
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const payload = {
      message: error.message,
      stack: error.stack ?? null,
      digest: error.digest ?? null,
      href,
      referrer,
      userAgent,
      timestamp: new Date().toISOString(),
    };
    console.error('[TC ERROR BOUNDARY]', payload);
    reportToApi(payload);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 font-serif">
      <h1 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h1>
      <p className="text-gray-600 mb-4 text-center max-w-md">
        A client-side error occurred. We have logged the details. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
      >
        Try again
      </button>
    </div>
  );
}

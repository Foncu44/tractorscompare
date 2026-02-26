'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    const href = typeof window !== 'undefined' ? window.location.href : '';
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    console.error('[TC ERROR BOUNDARY]', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      href,
      ua,
    });
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

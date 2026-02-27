'use client';

import { useEffect } from 'react';

const LOG_PREFIX = '[TC-CLIENT-ERROR]';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    console.error(LOG_PREFIX, 'Global error boundary:', {
      message: error.message,
      stack: error.stack,
      pathname,
      digest: error.digest,
    });
  }, [error]);

  return (
    <html lang="en">
      <body className="font-serif antialiased">
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
          <h1 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h1>
          <p className="text-gray-600 mb-4 text-center max-w-md">
            A critical error occurred. We have logged the details. Please try again.
          </p>
          <button
            type="button"
            onClick={reset}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}

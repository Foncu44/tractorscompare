'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const LOG_PREFIX = '[TC-CLIENT-ERROR]';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();

  useEffect(() => {
    console.error(LOG_PREFIX, 'App error boundary:', {
      message: error.message,
      stack: error.stack,
      pathname: pathname ?? typeof window !== 'undefined' ? window.location.pathname : '',
      digest: error.digest,
    });
  }, [error, pathname]);

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

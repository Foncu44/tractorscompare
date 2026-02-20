'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/noticias');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-600">Redirecting to news...</p>
    </div>
  );
}

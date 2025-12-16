import Link from 'next/link';
import { Tractor } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container-custom py-20 text-center">
      <Tractor className="w-24 h-24 text-gray-400 mx-auto mb-6" />
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page not found</h2>
      <p className="text-gray-600 mb-8">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className="btn-primary inline-block">
        Back to Home
      </Link>
    </div>
  );
}


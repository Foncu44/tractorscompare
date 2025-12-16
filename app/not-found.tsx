import Link from 'next/link';
import { Tractor } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container-custom py-20 text-center">
      <Tractor className="w-24 h-24 text-gray-400 mx-auto mb-6" />
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Página no encontrada</h2>
      <p className="text-gray-600 mb-8">
        Lo sentimos, la página que buscas no existe o ha sido movida.
      </p>
      <Link href="/" className="btn-primary inline-block">
        Volver al Inicio
      </Link>
    </div>
  );
}


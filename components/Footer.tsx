import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">TractorsCompare</h3>
            <p className="text-sm">
              La fuente más completa de información sobre tractores agrícolas, de jardín e industriales. 
              Compara especificaciones y encuentra el tractor perfecto.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tractores" className="hover:text-white transition-colors">
                  Todos los Tractores
                </Link>
              </li>
              <li>
                <Link href="/marcas" className="hover:text-white transition-colors">
                  Marcas
                </Link>
              </li>
              <li>
                <Link href="/comparar" className="hover:text-white transition-colors">
                  Comparar Tractores
                </Link>
              </li>
              <li>
                <Link href="/noticias" className="hover:text-white transition-colors">
                  Noticias
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Categorías</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tractores?tipo=farm" className="hover:text-white transition-colors">
                  Tractores Agrícolas
                </Link>
              </li>
              <li>
                <Link href="/tractores?tipo=lawn" className="hover:text-white transition-colors">
                  Tractores de Jardín
                </Link>
              </li>
              <li>
                <Link href="/tractores?tipo=industrial" className="hover:text-white transition-colors">
                  Tractores Industriales
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contacto" className="hover:text-white transition-colors">
                  Contactar
                </Link>
              </li>
              <li>
                <Link href="/sobre-nosotros" className="hover:text-white transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="hover:text-white transition-colors">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="hover:text-white transition-colors">
                  Términos de Uso
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {currentYear} TractorsCompare. Todos los derechos reservados.</p>
          <p className="mt-2 text-xs text-gray-500">
            Toda la información es proporcionada como referencia. Consulta siempre las especificaciones oficiales del fabricante.
          </p>
        </div>
      </div>
    </footer>
  );
}


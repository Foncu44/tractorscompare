import Link from 'next/link';
import { FileText } from 'lucide-react';

const LINKS: { href: string; label: string }[] = [
  { href: '/specs', label: 'Specs methodology' },
  { href: '/used', label: 'Used tractor data' },
  { href: '/disclaimer', label: 'Disclaimer' },
];

export default function DataSourcesLinks() {
  return (
    <footer className="mt-10 md:mt-12 pt-6 border-t border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Data sources & methodology</h3>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
        {LINKS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="inline-flex items-center gap-1 hover:text-primary-700"
            >
              {item.label}
              <FileText className="h-3 w-3" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </footer>
  );
}

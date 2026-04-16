import type { Metadata } from 'next';
import { TractoresAgricolasView } from '@/components/TractoresAgricolasView';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function TractoresAgricolasPage() {
  return <TractoresAgricolasView locale="es" />;
}

import type { Metadata } from 'next';
import { TractoresJardinView } from '@/components/TractoresJardinView';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function TractoresJardinPage() {
  return <TractoresJardinView locale="es" />;
}

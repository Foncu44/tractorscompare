import type { Metadata } from 'next';
import { CompararView } from '@/components/CompararView';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ComparePage() {
  return <CompararView />;
}

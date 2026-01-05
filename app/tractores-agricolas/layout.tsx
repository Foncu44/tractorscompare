import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agricultural Tractors – Specifications and Comparison | TractorsCompare',
  description: 'Find agricultural tractor specifications by brand, power and features. Complete database with thousands of agricultural tractor models.',
  keywords: ['agricultural tractors', 'best agricultural tractors', 'agricultural tractor specifications', 'agricultural tractors by power', 'compare agricultural tractors', 'agricultural tractor specs'],
};

export default function TractoresAgricolasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


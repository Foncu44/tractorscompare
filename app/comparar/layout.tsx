import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compare Tractors – Specifications and Comparison | TractorsCompare',
  description: 'Compare tractors side by side: engine, power, features, price and more. Agricultural tractor technical specifications comparison tool.',
  keywords: ['compare tractors', 'tractor comparison tool', 'compare tractor specifications', 'tractor comparisons', 'tractor specs comparison', 'compare tractor models'],
};

export default function CompararLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


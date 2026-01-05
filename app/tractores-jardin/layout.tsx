import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lawn Tractors – Specifications and Comparison | TractorsCompare',
  description: 'Find lawn tractor and mower specifications by brand and model. Compare technical features of lawn tractors.',
  keywords: ['lawn tractors', 'garden tractors', 'mowers', 'lawn tractor specifications', 'best lawn tractors', 'lawn tractor specs'],
};

export default function TractoresJardinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


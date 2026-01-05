import NewsSections from '@/components/NewsSections';
import newsData from '@/data/news.json';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Industry News - Agriculture & Tractors',
  description: 'Recent news about agriculture, tractors and agricultural machinery (last 6 months).',
};

export const dynamic = 'force-static';

export default function NoticiasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fbf7f1] to-white">
      <NewsSections items={(newsData as any).items || []} showAll={true} />
    </div>
  );
}


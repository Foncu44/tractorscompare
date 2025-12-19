import NewsSections from '@/components/NewsSections';
import newsData from '@/data/news.json';

export const metadata = {
  title: 'Industry News - Agriculture & Tractors',
  description: 'Recent news about agriculture, tractors and agricultural machinery (last 6 months).',
};

export const dynamic = 'force-static';

export default function NoticiasPage() {
  return <NewsSections items={(newsData as any).items || []} />;
}


import { permanentRedirect } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

// No generateStaticParams — do not pre-build these duplicate pages.
// Middleware 308-redirects /tractores/* → /en/tractors/* before reaching here,
// but this server-side fallback handles any direct access.
export const dynamic = 'force-dynamic';

export default async function TractoresSlugPage({ params }: Props) {
  const { slug } = await params;
  permanentRedirect(`/en/tractors/${slug}`);
}

import { TractoresJardinView } from '@/components/TractoresJardinView';
import type { Locale } from '@/lib/i18n/config';

export const dynamic = 'force-static';

export default async function LawnGardenTractorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <TractoresJardinView locale={locale as Locale} />;
}

import { TractoresAgricolasView } from '@/components/TractoresAgricolasView';
import type { Locale } from '@/lib/i18n/config';

export const dynamic = 'force-static';

export default async function AgriculturalTractorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <TractoresAgricolasView locale={locale as Locale} />;
}

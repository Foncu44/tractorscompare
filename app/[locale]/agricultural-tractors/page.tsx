import TractoresAgricolasPage from '@/app/tractores-agricolas/page';
import type { Locale } from '@/lib/i18n/config';

export const dynamic = 'force-static';

export default async function AgriculturalTractorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <TractoresAgricolasPage locale={locale as Locale} />;
}

import CompararPage from '@/app/comparar/page';
import type { Locale } from '@/lib/i18n/config';

export const dynamic = 'force-dynamic';

export default async function ComparePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <CompararPage locale={locale as Locale} />;
}

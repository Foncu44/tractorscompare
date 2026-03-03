const fs = require('fs');
const path = require('path');
const src = path.join(__dirname, '..', 'app', 'tractores', '[slug]', 'page.tsx');
const dst = path.join(__dirname, '..', 'app', '[locale]', 'tractors', '[slug]', 'page.tsx');
let s = fs.readFileSync(src, 'utf8');

s = s.replace(
  "import { getTractorImage } from '@/lib/tractorImages';",
  "import { getTractorImage } from '@/lib/tractorImages';\nimport { pathForLocale, getCanonicalUrl } from '@/lib/i18n/routes';\nimport type { Locale } from '@/lib/i18n/config';\nimport { locales } from '@/lib/i18n/config';"
);
s = s.replace('params: Promise<{ slug: string }>;', 'params: Promise<{ locale: string; slug: string }>;');
s = s.replace(
  /export async function generateStaticParams\(\) \{\s*return tractors\.map\(\(tractor\) => \(\{\s*slug: tractor\.slug,\s*\}\)\);\s*\}/,
  "export async function generateStaticParams() {\n  return locales.flatMap((locale) => tractors.map((tractor) => ({ locale, slug: tractor.slug })));\n}"
);
s = s.replace(
  '{ params }: { params: Promise<{ slug: string }> }',
  '{ params }: { params: Promise<{ locale: string; slug: string }> }'
);
s = s.replace(
  'export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {\n  const { slug } = await params;',
  'export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {\n  const { locale, slug } = await params;'
);
s = s.replace(
  "canonical: `https://tractorscompare.com/tractores/${tractor.slug}`",
  "canonical: getCanonicalUrl('tractors/' + tractor.slug, locale)"
);
s = s.replace(
  'export default async function TractorDetailPage({ params }: TractorDetailPageProps) {\n  const { slug } = await params;\n  const tractor = getTractorBySlug(slug);',
  'export default async function TractorDetailPage({ params }: TractorDetailPageProps) {\n  const { locale, slug } = await params;\n  const loc = locale as Locale;\n  const tractor = getTractorBySlug(slug);'
);
s = s.replace('<Link href="/marcas" className="inline-flex', '<Link href={pathForLocale(\'brands\', loc)} className="inline-flex');
s = s.replace(
  /<Link href=\{`\/marcas\/\$\{brandToSlug\(tractor\.brand\)\}`\} className="text-primary-700/,
  '<Link href={pathForLocale(\'brands/\' + brandToSlug(tractor.brand), loc)} className="text-primary-700/'
);
s = s.replace(
  /<Link href=\{`\/comparar\?tractores=\$\{tractor\.id\}`\} className="flex-1"/,
  '<Link href={`${pathForLocale(\'compare\', loc)}?tractores=${tractor.id}`} className="flex-1"'
);
s = s.replace(
  /<Link href=\{`\/marcas\/\$\{brandToSlug\(tractor\.brand\)\}`\} className="flex-1">/,
  '<Link href={pathForLocale(\'brands/\' + brandToSlug(tractor.brand), loc)} className="flex-1">'
);

fs.mkdirSync(path.dirname(dst), { recursive: true });
fs.writeFileSync(dst, s);
console.log('Written', dst);

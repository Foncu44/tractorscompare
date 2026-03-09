import type { FaqItem } from '@/lib/tractorPageContent';
import { ChevronDown } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';
import { t } from '@/lib/i18n/t';

export interface TractorFaqProps {
  locale?: Locale;
  faqs: FaqItem[];
  /** If true, render FAQPage JSON-LD with baseUrl for item URLs */
  baseUrl?: string;
  /** Optional tractor slug for FAQ item URLs in schema */
  tractorSlug?: string;
}

const BASE = 'https://tractorscompare.com';

export function TractorFaqSchema({ faqs, tractorSlug }: { faqs: FaqItem[]; tractorSlug?: string }) {
  const mainEntity = faqs.map((faq, i) => ({
    '@type': 'Question' as const,
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer' as const,
      text: faq.answer,
    },
  }));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function TractorFaq({ locale = 'en', faqs, baseUrl = BASE, tractorSlug }: TractorFaqProps) {
  if (faqs.length === 0) return null;

  return (
    <section
      className="mt-8 md:mt-12 bg-white rounded-card border border-gray-200 shadow-card p-4 md:p-6"
      aria-labelledby="faq-heading"
    >
      <TractorFaqSchema faqs={faqs} tractorSlug={tractorSlug} />
      <h2 id="faq-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
        {t('faq.title', undefined, locale)}
      </h2>
      <ul className="space-y-4">
        {faqs.map((faq, i) => (
          <li key={i} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
            <h3 className="text-base font-semibold text-gray-900 mb-1">{faq.question}</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{faq.answer}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

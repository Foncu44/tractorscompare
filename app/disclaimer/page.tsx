import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Editorial & Advertising Disclosure | TractorsCompare',
  description:
    'Learn how TractorsCompare produces content, updates tractor data, and uses advertising such as Google AdSense.',
};

export default function DisclaimerPage() {
  return (
    <main className="container-custom py-10">
      <article className="max-w-4xl mx-auto prose prose-gray">
        <h1>Editorial & Advertising Disclosure</h1>
        <p>
          TractorsCompare is an informational website focused on tractor specifications,
          model comparisons, and buying guidance. Our goal is to publish helpful,
          transparent, and verifiable content for users.
        </p>

        <h2>How we build and maintain tractor data</h2>
        <ul>
          <li>We combine structured technical sources and editorial review workflows.</li>
          <li>
            Some records may contain estimated values when official manufacturer data is
            unavailable.
          </li>
          <li>
            Obsolete or legacy models can be removed from public listings during periodic
            maintenance updates.
          </li>
        </ul>

        <h2>Advertising disclosure</h2>
        <p>
          This website may display ads served by third-party providers, including Google
          AdSense. Advertising helps fund hosting, data maintenance, and editorial work.
        </p>
        <ul>
          <li>Ads are automatically selected and may vary by user location and context.</li>
          <li>
            We do not guarantee product availability, final pricing, or claims shown in
            third-party ads.
          </li>
          <li>
            Clicking an ad may redirect you to external websites with their own policies.
          </li>
        </ul>

        <h2>Editorial independence</h2>
        <p>
          Advertising partnerships do not directly influence our comparison methodologies,
          score calculations, or technical recommendations.
        </p>

        <h2>Updates and corrections</h2>
        <p>
          If you detect an outdated specification or a discontinued model that should no
          longer appear, contact us through the Contact page and include the tractor brand,
          model, and URL.
        </p>
      </article>
    </main>
  );
}

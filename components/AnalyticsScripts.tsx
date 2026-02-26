'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { isInIframe } from '@/lib/isInIframe';

/**
 * Loads GTM/GA only when NOT inside an iframe (e.g. AdSense preview).
 * Inside iframes these scripts can throw; we skip them to avoid client-side exceptions.
 */
export default function AnalyticsScripts() {
  const [allowAnalytics, setAllowAnalytics] = useState(false);

  useEffect(() => {
    setAllowAnalytics(!isInIframe());
  }, []);

  if (!allowAnalytics) return null;

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-5WVZHK0232"
        strategy="lazyOnload"
      />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-5WVZHK0232', {
            'send_page_view': false
          });
          if (typeof window !== 'undefined') {
            ['mousedown', 'touchstart', 'keydown'].forEach(function(event) {
              document.addEventListener(event, function() {
                gtag('config', 'G-5WVZHK0232', {
                  'send_page_view': true
                });
              }, { once: true });
            });
          }
        `}
      </Script>
    </>
  );
}

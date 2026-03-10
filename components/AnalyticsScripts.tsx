'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { isAdSensePreview } from '@/src/lib/runtimeEnv';

/**
 * Loads GA4 only when NOT in AdSense preview (iframe + google referrer).
 * In preview, these scripts can throw; we skip them to avoid client-side exceptions.
 *
 * FIX: Using a single gtag('config') call to avoid _ga cookie expires overwrite.
 * Page view is sent via gtag('event') on first interaction — no second config call.
 */
export default function AnalyticsScripts() {
  const [allowAnalytics, setAllowAnalytics] = useState(false);

  useEffect(() => {
    setAllowAnalytics(!isAdSensePreview());
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
          gtag('config', 'G-5WVZHK0232', { send_page_view: false });
          var _gaSent = false;
          ['mousedown', 'touchstart', 'keydown', 'scroll'].forEach(function(ev) {
            document.addEventListener(ev, function() {
              if (!_gaSent) {
                _gaSent = true;
                gtag('event', 'page_view', { send_to: 'G-5WVZHK0232' });
              }
            }, { once: true, passive: true });
          });
        `}
      </Script>
    </>
  );
}

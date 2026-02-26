'use client';

import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { isInIframe } from '@/lib/isInIframe';

/**
 * Renders Vercel Analytics only when NOT inside an iframe (e.g. AdSense preview).
 */
export default function VercelAnalyticsSafe() {
  const [allow, setAllow] = useState(false);

  useEffect(() => {
    setAllow(!isInIframe());
  }, []);

  if (!allow) return null;
  return <Analytics />;
}

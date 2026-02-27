'use client';

import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { isAdSensePreview } from '@/src/lib/runtimeEnv';

/**
 * Renders Vercel Analytics only when NOT in AdSense preview (iframe + google referrer).
 */
export default function VercelAnalyticsSafe() {
  const [allow, setAllow] = useState(false);

  useEffect(() => {
    setAllow(!isAdSensePreview());
  }, []);

  if (!allow) return null;
  return <Analytics />;
}

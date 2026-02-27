'use client';

import { useState, useEffect } from 'react';

/**
 * Returns false on first render (SSR + initial client render), then true after mount.
 * Use to avoid reading window/document/navigator during render and prevent hydration mismatch.
 */
export function useHasMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}

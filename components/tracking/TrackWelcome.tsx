'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { trackRegistration } from '@/lib/meta-events';

export default function TrackWelcome() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('welcome') === 'google') {
      trackRegistration('google');
      // Clean up URL without reload
      window.history.replaceState({}, '', '/dashboard');
    }
  }, [searchParams]);

  return null;
}

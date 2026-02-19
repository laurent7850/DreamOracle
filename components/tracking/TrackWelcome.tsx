'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { trackRegistration, trackStartTrial } from '@/lib/meta-events';

export default function TrackWelcome() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('welcome') === 'google') {
      trackRegistration('google');
      trackStartTrial('PREMIUM');
      // Clean up URL without reload
      window.history.replaceState({}, '', '/dashboard');
    }
  }, [searchParams]);

  return null;
}

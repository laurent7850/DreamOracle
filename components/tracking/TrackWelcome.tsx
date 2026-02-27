'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { trackRegistration, trackStartTrial } from '@/lib/meta-events';
import { trackGARegistration, trackGATrialStart } from '@/lib/ga-events';

export default function TrackWelcome() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('welcome') === 'google') {
      // Meta Pixel
      trackRegistration('google');
      trackStartTrial('PREMIUM');
      // Google Analytics
      trackGARegistration('google');
      trackGATrialStart('PREMIUM');
      // Clean up URL without reload
      window.history.replaceState({}, '', '/dashboard');
    }
  }, [searchParams]);

  return null;
}

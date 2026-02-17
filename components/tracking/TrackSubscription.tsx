'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { trackSubscription } from '@/lib/meta-events';

interface TrackSubscriptionProps {
  tier: string;
}

export default function TrackSubscription({ tier }: TrackSubscriptionProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('subscription') === 'success') {
      if (tier === 'ESSENTIAL' || tier === 'PREMIUM') {
        trackSubscription(tier);
      }
      // Clean up URL without reload
      window.history.replaceState({}, '', '/settings');
    }
  }, [searchParams, tier]);

  return null;
}

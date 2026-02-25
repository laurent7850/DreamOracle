"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Captures UTM params from the URL and stores them in sessionStorage + cookie.
 * Should be placed in the root layout so UTMs are captured on any entry page
 * (landing page, pricing, register, etc.)
 *
 * sessionStorage → read by register form (credentials flow)
 * cookie → read by server-side NextAuth callback (Google OAuth flow)
 */
export function UTMCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const utmSource = searchParams.get("utm_source");
    const utmCampaign = searchParams.get("utm_campaign");
    const utmMedium = searchParams.get("utm_medium");

    // Only update if at least one UTM param is present in the URL
    if (utmSource || utmCampaign || utmMedium) {
      // Store in sessionStorage (for credentials registration flow)
      if (utmSource) sessionStorage.setItem("utm_source", utmSource);
      if (utmCampaign) sessionStorage.setItem("utm_campaign", utmCampaign);
      if (utmMedium) sessionStorage.setItem("utm_medium", utmMedium);

      // Store in cookie (for Google OAuth server-side callback)
      // Cookie expires in 30 days, accessible server-side
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
      if (utmSource) document.cookie = `utm_source=${encodeURIComponent(utmSource)};path=/;expires=${expires};SameSite=Lax`;
      if (utmCampaign) document.cookie = `utm_campaign=${encodeURIComponent(utmCampaign)};path=/;expires=${expires};SameSite=Lax`;
      if (utmMedium) document.cookie = `utm_medium=${encodeURIComponent(utmMedium)};path=/;expires=${expires};SameSite=Lax`;
    }
  }, [searchParams]);

  return null;
}

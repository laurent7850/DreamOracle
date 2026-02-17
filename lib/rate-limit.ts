/**
 * Simple in-memory rate limiter for API endpoints.
 * Uses a sliding window approach with Map storage.
 * Suitable for single-instance deployments.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (entry.resetAt < now) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  maxRequests: number;
  /** Time window in seconds */
  windowSeconds: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check if a request is within the rate limit.
 * @param key - Unique identifier (e.g., userId, IP address)
 * @param config - Rate limit configuration
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  // If no entry or expired, create new window
  if (!entry || entry.resetAt < now) {
    const resetAt = now + config.windowSeconds * 1000;
    rateLimitMap.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: config.maxRequests - 1, resetAt };
  }

  // Increment count
  entry.count++;

  if (entry.count > config.maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Pre-configured rate limits for different endpoint types.
 */
export const RATE_LIMITS = {
  /** AI interpretation: 10 per minute */
  interpretation: { maxRequests: 10, windowSeconds: 60 },
  /** Dream coach: 20 per minute */
  coach: { maxRequests: 20, windowSeconds: 60 },
  /** Transcription: 10 per minute */
  transcription: { maxRequests: 10, windowSeconds: 60 },
  /** Auth/login attempts: 5 per minute */
  auth: { maxRequests: 5, windowSeconds: 60 },
  /** Registration: 3 per 10 minutes */
  register: { maxRequests: 3, windowSeconds: 600 },
  /** Export: 10 per minute */
  export: { maxRequests: 10, windowSeconds: 60 },
  /** General API: 60 per minute */
  general: { maxRequests: 60, windowSeconds: 60 },
} as const;

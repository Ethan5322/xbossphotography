/*
 * Lightweight in-memory rate limiter (fixed window).
 *
 * NOTE: state lives in the function instance's memory, so on Vercel's
 * serverless/multi-instance runtime this is best-effort per instance — it
 * stops casual spam and brute force, not a determined distributed attack.
 * For strict global limits, swap this for Upstash Redis (@upstash/ratelimit).
 */

interface Entry { count: number; resetAt: number }

const store = new Map<string, Entry>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfter: number; // seconds
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    // Opportunistic cleanup so the map doesn't grow unbounded
    if (store.size > 5000) {
      for (const [k, v] of store) if (v.resetAt < now) store.delete(k);
    }
    return { allowed: true, remaining: limit - 1, retryAfter: 0 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count, retryAfter: 0 };
}

export function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

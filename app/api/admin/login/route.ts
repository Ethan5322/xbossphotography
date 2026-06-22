import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { signAdminToken, COOKIE_NAME } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

// Timing-safe comparison so the response time doesn't leak the password
function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash('sha256').update(a).digest();
  const hb = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export async function POST(req: NextRequest) {
  // Brute-force protection — max 5 attempts per IP per 15 minutes
  const ip = getClientIp(req);
  const rl = rateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Too many attempts. Please try again in ${Math.ceil(rl.retryAfter / 60)} minutes.` },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    );
  }

  const { password } = await req.json();
  const expected = process.env.ADMIN_PASSWORD ?? '';

  if (!password || !expected || !safeEqual(String(password), expected)) {
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
  }

  const token = await signAdminToken();

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 hours
    path: '/',
  });

  return res;
}

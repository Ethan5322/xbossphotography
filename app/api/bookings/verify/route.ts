import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { verifyAdminToken, COOKIE_NAME } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  const code = req.nextUrl.searchParams.get('code')?.trim().toUpperCase();
  if (!code) {
    return NextResponse.json({ error: 'No verification code provided.' }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  const { data: booking, error } = await supabase
    .from('photographer_bookings')
    .select('*')
    .eq('verification_code', code)
    .maybeSingle();

  if (error) {
    console.error('Verify booking error:', error);
    return NextResponse.json({ error: 'Database error.' }, { status: 500 });
  }

  if (!booking) {
    return NextResponse.json({ found: false }, { status: 404 });
  }

  return NextResponse.json({ found: true, booking });
}

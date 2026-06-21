import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { verifyAdminToken, COOKIE_NAME } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  const today = new Date().toISOString().split('T')[0];

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('photographer_bookings')
    .select('*')
    .eq('event_date', today)
    .order('event_time', { ascending: true });

  if (error) {
    console.error('Today bookings error:', error);
    return NextResponse.json({ error: 'Database error.' }, { status: 500 });
  }

  return NextResponse.json({ bookings: data ?? [] });
}

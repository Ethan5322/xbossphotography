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

  const search = req.nextUrl.searchParams.get('search')?.trim() ?? '';
  const page = parseInt(req.nextUrl.searchParams.get('page') ?? '1', 10);
  const perPage = 20;
  const offset = (page - 1) * perPage;

  const supabase = createServerSupabaseClient();

  let query = supabase
    .from('photographer_bookings')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + perPage - 1);

  if (search) {
    query = query.or(
      `full_name.ilike.%${search}%,verification_code.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
    );
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Booking history error:', error);
    return NextResponse.json({ error: 'Database error.' }, { status: 500 });
  }

  return NextResponse.json({
    bookings: data ?? [],
    total: count ?? 0,
    page,
    perPage,
  });
}

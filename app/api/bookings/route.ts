import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { generateVerificationCode } from '@/lib/verification';
import { sendWhatsAppNotification } from '@/lib/whatsapp';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { validateBookingPayload } from '@/lib/validation';
import type { CreateBookingPayload, Booking } from '@/types/booking';

export async function POST(req: NextRequest) {
  try {
    // Spam / abuse protection — max 5 bookings per IP per 10 minutes
    const ip = getClientIp(req);
    const rl = rateLimit(`booking:${ip}`, 5, 10 * 60 * 1000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many booking attempts. Please try again in a few minutes.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
      );
    }

    const payload: CreateBookingPayload = await req.json();

    // Server-side validation (the source of truth — client checks are bypassable)
    const check = validateBookingPayload(payload);
    if (!check.valid) {
      return NextResponse.json({ error: check.error }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    // Generate a unique verification code (retry on collision — extremely rare)
    let verification_code = '';
    for (let attempt = 0; attempt < 5; attempt++) {
      const candidate = generateVerificationCode();
      const { data: existing } = await supabase
        .from('photographer_bookings')
        .select('id')
        .eq('verification_code', candidate)
        .maybeSingle();

      if (!existing) {
        verification_code = candidate;
        break;
      }
    }

    if (!verification_code) {
      return NextResponse.json({ error: 'Could not generate a unique booking code. Please try again.' }, { status: 500 });
    }

    const insertData = {
      full_name: payload.full_name,
      phone: payload.phone,
      email: payload.email,
      country: payload.country,
      province: payload.province,
      area: payload.area,
      event_type: payload.event_type,
      event_date: payload.event_date,
      event_time: payload.event_time,
      package: payload.package,
      terms_accepted: true,
      verification_code,
      status: 'pending' as const,
      source: payload.source ?? 'chatbot',
      notes: payload.notes ?? null,
    };

    const { data: booking, error } = await supabase
      .from('photographer_bookings')
      .insert(insertData)
      .select()
      .single();

    if (error || !booking) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to save booking. Please try again.' }, { status: 500 });
    }

    // Send WhatsApp notification (non-blocking — don't let this fail the response)
    sendWhatsAppNotification(booking as Booking).catch((e) =>
      console.error('WhatsApp notification error:', e)
    );

    return NextResponse.json({
      id: booking.id,
      verification_code: booking.verification_code,
      created_at: booking.created_at,
    });
  } catch (err) {
    console.error('Booking creation error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}

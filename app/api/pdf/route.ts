import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { renderToBuffer } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import { BookingDocument } from '@/components/pdf/BookingDocument';
import type { Booking } from '@/types/booking';
import React from 'react';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing booking id' }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  const { data: booking, error } = await supabase
    .from('photographer_bookings')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  const verifyUrl = `${baseUrl}/admin/verify?code=${booking.verification_code}`;

  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    width: 160,
    margin: 1,
    color: { dark: '#0D0D0D', light: '#FFFFFF' },
  });

  const element = React.createElement(BookingDocument, {
    booking: booking as Booking,
    qrDataUrl,
  });

  // @react-pdf/renderer uses its own internal ReactElement type — cast is safe here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(element as any);

  // buffer.buffer is the underlying ArrayBuffer which satisfies BodyInit
  return new Response(buffer.buffer as ArrayBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="XBOSS-${booking.verification_code}.pdf"`,
      'Cache-Control': 'no-store',
    },
  });
}

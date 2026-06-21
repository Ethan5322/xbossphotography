import type { Booking } from '@/types/booking';
import { getPackageById } from './packages';
import { format } from 'date-fns';

export async function sendWhatsAppNotification(booking: Booking): Promise<void> {
  const phone = process.env.CALLMEBOT_PHONE;
  const apikey = process.env.CALLMEBOT_APIKEY;

  if (!phone || !apikey) {
    console.warn('CallMeBot credentials not set — WhatsApp notification skipped.');
    return;
  }

  const pkg = getPackageById(booking.package);
  const packageLabel = pkg ? `${pkg.name} (${pkg.priceFormatted})` : booking.package;

  const eventDate = format(new Date(booking.event_date), 'dd MMMM yyyy');

  const message = [
    '🎯 NEW BOOKING — X-BOSS Photography Studio',
    '',
    `👤 Name: ${booking.full_name}`,
    `📞 Phone: ${booking.phone}`,
    `📧 Email: ${booking.email}`,
    `📍 Location: ${booking.area}, ${booking.province}, ${booking.country}`,
    `🎉 Event: ${booking.event_type}`,
    `📅 Date: ${eventDate} at ${booking.event_time}`,
    `📦 Package: ${packageLabel}`,
    `🔑 Verification Code: ${booking.verification_code}`,
    '',
    `Source: ${booking.source === 'admin' ? 'Admin (manual)' : 'Chatbot'}`,
    `Booked: ${format(new Date(booking.created_at), 'dd MMM yyyy HH:mm')}`,
  ].join('\n');

  const encoded = encodeURIComponent(message);
  const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encoded}&apikey=${apikey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error('CallMeBot response error:', res.status, await res.text());
    }
  } catch (err) {
    console.error('WhatsApp notification failed:', err);
  }
}

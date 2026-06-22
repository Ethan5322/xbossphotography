import { PACKAGES } from './packages';

const VALID_PACKAGES = new Set(PACKAGES.map((p) => p.id));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateBookingPayload(p: any): { valid: boolean; error?: string } {
  if (!p || typeof p !== 'object') return { valid: false, error: 'Invalid request body.' };

  const required = ['full_name', 'phone', 'email', 'country', 'province', 'area', 'event_type', 'event_date', 'event_time', 'package'];
  for (const f of required) {
    if (typeof p[f] !== 'string' || !p[f].trim()) {
      return { valid: false, error: `Missing or invalid field: ${f}` };
    }
  }

  if (p.full_name.trim().length < 2 || p.full_name.length > 120) {
    return { valid: false, error: 'Please provide a valid full name.' };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email) || p.email.length > 160) {
    return { valid: false, error: 'Please provide a valid email address.' };
  }

  const phone = p.phone.replace(/[\s\-().]/g, '');
  if (!/^\+?\d{7,15}$/.test(phone)) {
    return { valid: false, error: 'Please provide a valid phone number.' };
  }

  if (!VALID_PACKAGES.has(p.package)) {
    return { valid: false, error: 'Invalid package selected.' };
  }

  if (isNaN(new Date(p.event_date).getTime())) {
    return { valid: false, error: 'Invalid event date.' };
  }

  if (p.terms_accepted !== true) {
    return { valid: false, error: 'Terms and conditions must be accepted.' };
  }

  // Length caps to prevent oversized/abusive payloads
  for (const f of ['country', 'province', 'area', 'event_type']) {
    if (p[f].length > 120) return { valid: false, error: `Field is too long: ${f}` };
  }
  if (p.notes != null && (typeof p.notes !== 'string' || p.notes.length > 1000)) {
    return { valid: false, error: 'Notes are too long.' };
  }

  return { valid: true };
}

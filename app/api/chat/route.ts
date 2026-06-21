import { NextRequest, NextResponse } from 'next/server';
import type { BookingStep, CollectedData } from '@/types/booking';

// ── Validation ────────────────────────────────────────────────────────────────

function validateInput(step: BookingStep, input: string): { valid: boolean; error?: string } {
  const trimmed = input.trim();

  switch (step) {
    case 'name':
      return trimmed.split(/\s+/).length >= 2
        ? { valid: true }
        : { valid: false };

    case 'phone': {
      const cleaned = trimmed.replace(/[\s\-().]/g, '');
      return /^\+\d{7,15}$/.test(cleaned) ? { valid: true } : { valid: false };
    }

    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
        ? { valid: true }
        : { valid: false };

    case 'event_date': {
      const date = new Date(trimmed);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return !isNaN(date.getTime()) && date >= today ? { valid: true } : { valid: false };
    }

    case 'event_time':
      return /^([01]?\d|2[0-3])[:h]([0-5]\d)$/.test(trimmed)
        ? { valid: true }
        : { valid: false };

    default:
      return trimmed.length > 0 ? { valid: true } : { valid: false };
  }
}

// ── Scripted responses ────────────────────────────────────────────────────────

function getRetryMessage(step: BookingStep): string {
  switch (step) {
    case 'name':
      return 'Thank you for reaching out! We just need your full name — both first and last — so we can address your booking correctly. Could you please try again?';
    case 'phone':
      return 'No problem at all! We need your phone number with the international dialling code — for example, +27 82 123 4567 for South Africa. Could you try again?';
    case 'email':
      return "That doesn't look quite right. Could you double-check your email address and try again? We need it to send you your booking confirmation.";
    case 'event_date':
      return 'We need a valid future date for your event. Could you please share it again? For example: 15 March 2026.';
    case 'event_time':
      return 'Could you clarify the time? Please use a format like 10:00 or 14:30.';
    default:
      return "I'm sorry, something doesn't look right there. Could you please try again?";
  }
}

const EVENT_OPENERS: Record<string, string> = {
  Wedding:     'A wedding — how incredibly special! We consider it a true honour to be entrusted with such a once-in-a-lifetime occasion.',
  Birthday:    'A birthday celebration — we love it! Every birthday deserves to be remembered beautifully.',
  Graduation:  'Congratulations are in order! A graduation is such a proud milestone, and we would love to document every proud moment for you.',
  Anniversary: 'How wonderful! Anniversaries are such meaningful occasions, and we would be delighted to capture this one.',
};

const PACKAGE_CLOSERS: Record<string, string> = {
  standard:      'Excellent choice! The Standard Package is perfect for intimate events. Just one final step — please review our Terms and Conditions below before we confirm your booking.',
  medium:        'A great choice! The Medium Package includes a beautiful printed album you will treasure for years. Please review our Terms and Conditions below to complete your booking.',
  premium:       'Wonderful! The Premium Package gives you full-day coverage with two photographers — not a single moment will be missed. Please review our Terms and Conditions below.',
  super_premium: 'A spectacular choice — the ultimate X-BOSS experience! Every moment captured, nothing missed. Please review our Terms and Conditions below to complete your booking.',
};

function buildResponse(step: BookingStep, data: CollectedData): string {
  const firstName = data.full_name?.split(' ')[0] ?? '';

  switch (step) {
    case 'greeting':
      return 'Welcome to X-BOSS Photography Studio! I am your dedicated booking assistant, and I am thrilled to help you secure your session with us.\n\nWe will have everything set up in just a few simple steps. To get us started — may I have your full name, please?';

    case 'name':
      return `Wonderful to meet you, ${firstName}! We are so glad you have chosen X-BOSS Photography Studio. To make sure we can reach you, could I have your phone number? Please include your international dialling code — for example, +27 for South Africa.`;

    case 'phone':
      return 'Perfect, thank you! And which email address should we send your booking confirmation to?';

    case 'email':
      return `Excellent — your confirmation will be on its way to ${data.email}. Now let us get your location sorted. Which country will your event be taking place in?`;

    case 'country':
      return `${data.country} — noted! Which province or region within ${data.country} will the event be held?`;

    case 'province':
      return 'And the specific area name or postal code for the venue?';

    case 'area':
      return 'Wonderful. Now for the exciting part — what kind of event are we capturing for you? Please select from the options below.';

    case 'event_type': {
      if (data.event_type === 'Custom') {
        return 'Of course! We love capturing unique occasions. Please describe your event in your own words.';
      }
      const opener = EVENT_OPENERS[data.event_type ?? ''] ?? `How exciting — ${data.event_type ?? 'your event'}!`;
      return `${opener}\n\nWhat date is your event? You can type it in any clear format, for example: 15 March 2026.`;
    }

    case 'custom_event':
      return `That sounds like a truly unique occasion — we would be honoured to capture it for you!\n\nWhat date is your event?`;

    case 'event_date': {
      let displayDate = data.event_date ?? '';
      try {
        displayDate = new Date(data.event_date!).toLocaleDateString('en-ZA', {
          day: 'numeric', month: 'long', year: 'numeric',
        });
      } catch { /* leave as-is */ }
      return `${displayDate} is locked in — how exciting! And what time would you like our team to arrive at the venue? For example, 10:00.`;
    }

    case 'event_time':
      return `Perfect — we will be there at ${data.event_time} and ready to create something truly memorable.\n\nNow let us talk packages! Please have a look at our options below and select the one that suits you best.`;

    case 'package': {
      const closer = PACKAGE_CLOSERS[data.package ?? ''] ?? 'Great choice! Please review our Terms and Conditions below to complete your booking.';
      return firstName ? closer.replace('Excellent choice!', `Excellent choice, ${firstName}!`).replace('Wonderful!', `Wonderful, ${firstName}!`) : closer;
    }

    default:
      return 'Please continue with the next step.';
  }
}

// ── Field + next-step mapping ─────────────────────────────────────────────────

function getFieldForStep(step: BookingStep): keyof CollectedData | null {
  const map: Partial<Record<BookingStep, keyof CollectedData>> = {
    name: 'full_name', phone: 'phone', email: 'email',
    country: 'country', province: 'province', area: 'area',
    event_type: 'event_type', custom_event: 'event_type',
    event_date: 'event_date', event_time: 'event_time',
    package: 'package',
  };
  return map[step] ?? null;
}

function getNextStep(step: BookingStep, data: CollectedData): BookingStep {
  const flow: BookingStep[] = [
    'greeting', 'name', 'phone', 'email', 'country', 'province',
    'area', 'event_type', 'event_date', 'event_time', 'package', 'terms',
  ];
  if (step === 'event_type' && data.event_type === 'Custom') return 'custom_event';
  if (step === 'custom_event') return 'event_date';
  const idx = flow.indexOf(step);
  return flow[idx + 1] ?? 'terms';
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { step, userInput, data } = await req.json() as {
      step: BookingStep;
      userInput?: string;
      data: CollectedData;
    };

    let isValid = true;
    const updatedData: CollectedData = { ...data };

    if (step !== 'greeting' && userInput) {
      isValid = validateInput(step, userInput).valid;

      if (isValid) {
        const field = getFieldForStep(step);
        if (field) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (updatedData as any)[field] = userInput.trim();
        }
      }
    }

    const message = isValid
      ? buildResponse(step, updatedData)
      : getRetryMessage(step);

    const nextStep = isValid ? getNextStep(step, updatedData) : step;

    return NextResponse.json({ message, valid: isValid, nextStep, updatedData });
  } catch (err) {
    console.error('Chat route error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

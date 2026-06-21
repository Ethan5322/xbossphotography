import { NextRequest, NextResponse } from 'next/server';
import { processChatStep } from '@/lib/chat-script';
import type { BookingStep, CollectedData } from '@/types/booking';

// The chatbot is fully scripted. The client computes responses locally for
// instant replies; this endpoint mirrors that logic for any server-side use.
export async function POST(req: NextRequest) {
  try {
    const { step, userInput, data } = await req.json() as {
      step: BookingStep;
      userInput?: string;
      data: CollectedData;
    };

    return NextResponse.json(processChatStep(step, userInput, data));
  } catch (err) {
    console.error('Chat route error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

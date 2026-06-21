'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Download, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';
import { Aperture } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { EventTypeOptions, PackageOptions, TermsBox } from './OptionButtons';
import { DatePicker, TimePicker } from './DateTimePicker';
import { ReviewCard } from './ReviewCard';
import { processChatStep } from '@/lib/chat-script';
import type { BookingStep, ChatMessage, CollectedData } from '@/types/booking';

let msgCounter = 0;
const newId = () => `msg-${++msgCounter}`;

interface CompletedBooking {
  id: string;
  verification_code: string;
}

// ── Progress phases ─────────────────────────────────────────────────────────────
const PHASES: { label: string; steps: BookingStep[] }[] = [
  { label: 'Your Details', steps: ['name', 'phone', 'email'] },
  { label: 'Location',     steps: ['country', 'province', 'area'] },
  { label: 'Event',        steps: ['event_type', 'custom_event', 'event_date', 'event_time'] },
  { label: 'Package',      steps: ['package'] },
  { label: 'Review',       steps: ['review'] },
  { label: 'Confirmation', steps: ['terms', 'processing', 'complete'] },
];

const ORDERED: BookingStep[] = ['name', 'phone', 'email', 'country', 'province', 'area', 'event_type', 'event_date', 'event_time', 'package', 'review', 'terms'];

const EDIT_LABELS: Partial<Record<BookingStep, string>> = {
  name: 'full name', phone: 'phone number', email: 'email address',
  country: 'country', province: 'province', area: 'area',
  event_type: 'event type', event_date: 'event date', event_time: 'arrival time',
  package: 'package',
};

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [step, setStep] = useState<BookingStep>('greeting');
  const [data, setData] = useState<CollectedData>({});
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [completed, setCompleted] = useState<CompletedBooking | null>(null);
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [closed, setClosed] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initialized = useRef(false);

  const scrollToBottom = () => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); };
  useEffect(() => { scrollToBottom(); }, [messages, loading]);

  const addMessage = useCallback((role: ChatMessage['role'], content: string) => {
    setMessages((prev) => [...prev, { id: newId(), role, content, timestamp: new Date(), messageType: 'text' }]);
  }, []);

  // Prefill +27 when entering the phone step fresh
  useEffect(() => {
    if (step === 'phone' && !editing && input === '') setInput('+27 ');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const callChat = useCallback(async (
    currentStep: BookingStep,
    userInput: string | undefined,
    currentData: CollectedData,
    isEdit: boolean,
  ) => {
    setLoading(true);

    // The bot is fully scripted, so the response is computed instantly on the
    // client — a brief pause just keeps the typing indicator feeling natural.
    await new Promise((resolve) => setTimeout(resolve, 240));

    const result = processChatStep(currentStep, userInput, currentData);
    const updatedData: CollectedData = { ...currentData, ...result.updatedData };
    setData(updatedData);

    // Invalid input — show retry, stay on the same step
    if (!result.valid) {
      addMessage('assistant', result.message);
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
      return;
    }

    if (isEdit) {
      // Editing a single field, then return to the review summary
      if (currentStep === 'event_type' && updatedData.event_type === 'Custom') {
        addMessage('assistant', 'Of course — please describe your event in your own words.');
        setStep('custom_event'); // remain in edit mode for the description
      } else {
        addMessage('assistant', 'Perfect — your booking summary has been updated below.');
        setEditing(false);
        setStep('review');
      }
      setLoading(false);
      return;
    }

    // Normal forward flow — intercept the jump to terms with a review step
    addMessage('assistant', result.message);
    setStep(result.nextStep === 'terms' ? 'review' : result.nextStep);
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [addMessage]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    callChat('greeting', undefined, {}, false);
  }, [callChat]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    addMessage('user', trimmed);
    setInput('');
    await callChat(step, trimmed, data, editing);
  };

  const handleOptionSelect = async (value: string, displayValue?: string) => {
    if (loading) return;
    addMessage('user', displayValue ?? value);
    let updatedData = { ...data };
    if (step === 'event_type') updatedData = { ...updatedData, event_type: value };
    if (step === 'package') updatedData = { ...updatedData, package: value as CollectedData['package'] };
    await callChat(step, value, updatedData, editing);
  };

  const handleDateSelect = async (iso: string, display: string) => {
    if (loading) return;
    addMessage('user', display);
    await callChat('event_date', iso, { ...data, event_date: iso }, editing);
  };

  const handleTimeSelect = async (time: string, display: string) => {
    if (loading) return;
    addMessage('user', display);
    await callChat('event_time', time, { ...data, event_time: time }, editing);
  };

  const handleEdit = (targetStep: BookingStep) => {
    if (loading) return;
    setEditing(true);
    setStep(targetStep);
    const label = EDIT_LABELS[targetStep] ?? 'detail';
    addMessage('assistant', `Sure — please update your ${label} below.`);
    // Prefill the input for text-based fields
    const textPrefill: Partial<Record<BookingStep, string | undefined>> = {
      name: data.full_name, phone: data.phone, email: data.email,
      country: data.country, province: data.province, area: data.area,
    };
    setInput(textPrefill[targetStep] ?? '');
  };

  const handleConfirmReview = () => {
    if (loading) return;
    addMessage('user', 'My details are correct — please continue.');
    addMessage('assistant', 'Thank you for confirming. Just one final step — please review and accept our Terms and Conditions below to secure your booking.');
    setStep('terms');
  };

  const handleTermsAccept = async () => {
    if (loading) return;
    addMessage('user', 'I have read and accept the Terms and Conditions.');
    setStep('processing');
    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, terms_accepted: true }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Booking failed');
      }
      const result: CompletedBooking = await res.json();
      setCompleted(result);
      setStep('complete');
      addMessage(
        'assistant',
        `Your booking with X-BOSS Photography Studio is confirmed!\n\nYour unique verification code is:\n\n${result.verification_code}\n\nPlease keep this safe — it is your proof of booking. Download your full Booking Confirmation PDF below. We will be in touch shortly to finalise the details.\n\nThank you, ${data.full_name?.split(' ')[0]} — we look forward to capturing your special moments.`
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setFatalError(msg);
      setStep('error');
      addMessage('assistant', `I am sorry — we were unable to complete your booking at this time. Error: ${msg}\n\nPlease try again or contact us directly.`);
    } finally {
      setLoading(false);
    }
  };

  const handleTermsDecline = () => {
    if (loading) return;
    // No booking is created — simply cancel and exit the chatbot entirely.
    setCancelled(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleFinish = () => {
    setClosed(true);
    // Closes the tab if it was opened by the QR/script; otherwise the
    // farewell screen below confirms the session has ended.
    window.close();
  };

  // ── What to render below the messages ─────────────────────────────────────
  const showInput        = ['name', 'phone', 'email', 'country', 'province', 'area', 'custom_event'].includes(step) && !loading;
  const showEventOptions = step === 'event_type' && !loading;
  const showPackageOptions = step === 'package' && !loading;
  const showDatePicker   = step === 'event_date' && !loading;
  const showTimePicker   = step === 'event_time' && !loading;
  const showReview       = step === 'review' && !loading;
  const showTerms        = step === 'terms' && !loading;

  // ── Progress ───────────────────────────────────────────────────────────────
  const idxStep   = step === 'custom_event' ? 'event_type' : step;
  const currentIdx = ORDERED.indexOf(idxStep as BookingStep);
  const progressPct = currentIdx >= 0 ? Math.round(((currentIdx + 1) / ORDERED.length) * 100)
                    : step === 'complete' ? 100 : 0;
  const phaseLabel = PHASES.find((p) => p.steps.includes(step))?.label ?? '';
  const showProgress = !['greeting', 'error'].includes(step) && step !== 'complete';

  // ── Cancelled screen (after Decline) ───────────────────────────────────────
  if (cancelled) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center animate-fade-in">
        <div className="w-14 h-14 rounded-2xl border border-red-900/40 bg-red-950/20 flex items-center justify-center mb-6">
          <X className="w-7 h-7 text-red-500/70" strokeWidth={1.5} />
        </div>
        <h2 className="font-playfair text-[#C8C0B0] text-xl font-semibold mb-3">
          Booking Cancelled
        </h2>
        <p className="text-[#9A9488] text-sm leading-relaxed max-w-xs mb-1">
          Your booking has been cancelled. No details were submitted or saved.
        </p>
        <p className="text-[#524E46] text-xs leading-relaxed max-w-xs">
          You may now close this window. If you change your mind, you are always welcome to book with us again.
        </p>
      </div>
    );
  }

  // ── Farewell screen (after Finish & Close) ─────────────────────────────────
  if (closed) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center animate-fade-in">
        <div className="w-14 h-14 rounded-2xl border border-gold/30 bg-gold/10 flex items-center justify-center mb-6">
          <CheckCircle className="w-7 h-7 text-gold" strokeWidth={1.5} />
        </div>
        <h2 className="font-playfair text-gold text-xl font-semibold mb-3">
          Thank You
        </h2>
        <p className="text-[#9A9488] text-sm leading-relaxed max-w-xs mb-1">
          Your booking with X-BOSS Photography Studio is complete.
        </p>
        <p className="text-[#524E46] text-xs leading-relaxed max-w-xs">
          You may now safely close this window. We look forward to capturing your special moments.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">

      {/* ── Progress header ─────────────────────────────────────── */}
      {showProgress && (
        <div className="px-5 pt-3 pb-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-gold/80 tracking-[0.24em] uppercase font-medium">
              {editing ? 'Editing Details' : phaseLabel}
            </span>
            <span className="text-[10px] text-[#4A4540] tracking-[0.18em] uppercase tabular-nums">
              {progressPct}%
            </span>
          </div>
          <div className="w-full h-[3px] rounded-full bg-[#1C1914] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold/70 to-gold transition-all duration-700 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {/* ── Messages ─────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-4 space-y-5">

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {loading && (
          <div className="flex items-start gap-3 animate-fade-in">
            <div className="flex-shrink-0 w-7 h-7 mt-0.5 rounded-lg border border-gold/25 bg-gold/10
                            flex items-center justify-center">
              <Aperture className="w-3.5 h-3.5 text-gold" strokeWidth={1.5} />
            </div>
            <TypingIndicator />
          </div>
        )}

        {showEventOptions && (
          <div className="pl-10">
            <EventTypeOptions onSelect={(v) => handleOptionSelect(v)} disabled={loading} />
          </div>
        )}
        {showPackageOptions && (
          <div className="pl-10 w-full">
            <PackageOptions onSelect={(v) => handleOptionSelect(v, v.replace('_', ' '))} disabled={loading} />
          </div>
        )}
        {showDatePicker && (
          <div className="pl-10 w-full pr-1">
            <DatePicker onSelect={handleDateSelect} disabled={loading} />
          </div>
        )}
        {showTimePicker && (
          <div className="pl-10 w-full pr-1">
            <TimePicker onSelect={handleTimeSelect} disabled={loading} />
          </div>
        )}
        {showReview && (
          <div className="pl-10 w-full pr-1">
            <ReviewCard data={data} onConfirm={handleConfirmReview} onEdit={handleEdit} disabled={loading} />
          </div>
        )}
        {showTerms && (
          <div className="pl-10 w-full pr-1">
            <TermsBox onAccept={handleTermsAccept} onDecline={handleTermsDecline} disabled={loading} />
          </div>
        )}

        {/* ── Booking confirmed card ─────────────────────────────── */}
        {step === 'complete' && completed && (
          <div className="pl-10 animate-slide-up">
            <div className="bg-[#0F0E0C] border border-[#2C2820] rounded-2xl p-5 max-w-xs">

              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-4 h-4 text-gold" strokeWidth={1.5} />
                <span className="text-gold text-[11px] font-medium tracking-[0.2em] uppercase">
                  Booking Confirmed
                </span>
              </div>

              <div className="border border-gold/20 rounded-xl bg-gold/5 px-4 py-4 mb-4 text-center">
                <p className="text-[9px] text-[#4A4540] tracking-[0.3em] uppercase mb-2">
                  Verification Code
                </p>
                <p className="font-playfair text-xl text-gold tracking-[0.18em] font-semibold">
                  {completed.verification_code}
                </p>
              </div>

              <a
                href={`/api/pdf?id=${completed.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl
                           bg-gold text-[#0D0C0B] font-semibold text-sm tracking-wide
                           hover:bg-gold-light hover:shadow-[0_0_20px_rgba(201,168,76,0.3)]
                           transition-all duration-300"
              >
                <Download className="w-4 h-4" strokeWidth={2} />
                Download Confirmation PDF
              </a>

              <button
                onClick={handleFinish}
                className="flex items-center justify-center gap-2 w-full mt-3 py-3 rounded-xl
                           border border-[#2C2820] text-[#9A9488] font-medium text-sm tracking-wide
                           hover:border-gold/40 hover:text-gold
                           transition-all duration-200"
              >
                <X className="w-4 h-4" strokeWidth={2} />
                Finish &amp; Close
              </button>
            </div>
          </div>
        )}

        {step === 'error' && fatalError && (
          <div className="pl-10 animate-slide-up">
            <div className="flex items-center gap-2.5 bg-[#0F0E0C] border border-red-950 rounded-xl px-4 py-3 max-w-xs">
              <AlertCircle className="w-4 h-4 text-red-500/60 flex-shrink-0" strokeWidth={1.5} />
              <p className="text-red-500/60 text-xs leading-relaxed">
                Booking could not be saved. Please refresh and try again.
              </p>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input area ───────────────────────────────────────────── */}
      <div className="flex-shrink-0 relative px-5 pb-5 pt-2">
        <div className="absolute inset-x-0 -top-8 h-8 bg-gradient-to-b from-transparent to-[#0D0C0B] pointer-events-none" />

        {showInput ? (
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type={step === 'email' ? 'email' : step === 'phone' ? 'tel' : 'text'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={step === 'phone' ? '+27 82 123 4567' : step === 'email' ? 'you@example.com' : 'Type your reply…'}
              disabled={loading}
              autoFocus
              className="flex-1 bg-[#141210] border border-[#2C2820] rounded-full
                         px-5 py-3.5 text-sm text-[#D4CEBD] placeholder-[#3A3530]
                         focus:outline-none focus:border-gold/45
                         focus:shadow-[0_0_0_3px_rgba(201,168,76,0.07)]
                         transition-all duration-200
                         disabled:opacity-40"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="flex-shrink-0 w-11 h-11 rounded-full bg-gold
                         flex items-center justify-center
                         hover:bg-gold-light hover:shadow-[0_0_18px_rgba(201,168,76,0.4)]
                         transition-all duration-200
                         disabled:opacity-25 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {loading
                ? <Loader2 className="w-4 h-4 text-[#0D0C0B] animate-spin" strokeWidth={2.5} />
                : <Send className="w-4 h-4 text-[#0D0C0B]" strokeWidth={2.5} />}
            </button>
          </div>
        ) : (
          <p className="text-center text-[10px] text-[#3A3530] tracking-[0.22em] uppercase py-2">
            {step === 'complete'    ? '✦  Booking confirmed  —  save your verification code  ✦'
            : step === 'processing'  ? 'Securing your booking…'
            : step === 'error'       ? 'Session ended'
            : step === 'review'      ? 'Review your details above, then confirm'
            : step === 'terms'       ? 'Please read and accept the terms above'
            :                          'Select an option above to continue'}
          </p>
        )}
      </div>

    </div>
  );
}

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { Aperture } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { EventTypeOptions, PackageOptions, TermsBox } from './OptionButtons';
import type { BookingStep, ChatMessage, CollectedData } from '@/types/booking';

let msgCounter = 0;
const newId = () => `msg-${++msgCounter}`;

interface CompletedBooking {
  id: string;
  verification_code: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [step, setStep] = useState<BookingStep>('greeting');
  const [data, setData] = useState<CollectedData>({});
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState<CompletedBooking | null>(null);
  const [fatalError, setFatalError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initialized = useRef(false);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages, loading]);

  const addMessage = useCallback((role: ChatMessage['role'], content: string) => {
    setMessages((prev) => [...prev, { id: newId(), role, content, timestamp: new Date(), messageType: 'text' }]);
  }, []);

  const callChat = useCallback(async (currentStep: BookingStep, userInput: string | undefined, currentData: CollectedData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: currentStep, userInput, data: currentData }),
      });
      if (!res.ok) throw new Error('Chat API error');
      const json = await res.json();
      addMessage('assistant', json.message);
      const updatedData: CollectedData = { ...currentData, ...json.updatedData };
      setData(updatedData);
      if (json.valid) setStep(json.nextStep as BookingStep);
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch {
      addMessage('assistant', 'I apologise — something went wrong on my end. Please try sending your message again.');
    } finally {
      setLoading(false);
    }
  }, [addMessage]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    callChat('greeting', undefined, {});
  }, [callChat]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    addMessage('user', trimmed);
    setInput('');
    await callChat(step, trimmed, data);
  };

  const handleOptionSelect = async (value: string, displayValue?: string) => {
    if (loading) return;
    addMessage('user', displayValue ?? value);
    let updatedData = { ...data };
    if (step === 'event_type') updatedData = { ...updatedData, event_type: value };
    if (step === 'package') updatedData = { ...updatedData, package: value as CollectedData['package'] };
    await callChat(step, value, updatedData);
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
    addMessage('user', 'I decline the Terms and Conditions.');
    addMessage('assistant', `That is completely fine — your booking has not been submitted and no details have been saved. If you change your mind, you are welcome to start a new session at any time. We would love to work with you.`);
    setStep('error');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const showInput = !['event_type', 'package', 'terms', 'processing', 'complete', 'error', 'greeting'].includes(step) && !loading;
  const showEventOptions  = step === 'event_type' && !loading;
  const showPackageOptions = step === 'package' && !loading;
  const showTerms          = step === 'terms' && !loading;

  const progressSteps: BookingStep[] = ['name', 'phone', 'email', 'country', 'province', 'area', 'event_type', 'event_date', 'event_time', 'package', 'terms'];
  const currentIdx  = progressSteps.indexOf(step);
  const progressPct = currentIdx >= 0 ? Math.round(((currentIdx + 1) / progressSteps.length) * 100)
                    : step === 'complete' ? 100 : 0;

  return (
    <div className="flex flex-col h-full">

      {/* ── Progress bar ─────────────────────────────────────── */}
      {step !== 'complete' && step !== 'error' && step !== 'greeting' && (
        <div className="w-full h-px bg-[#1C1914]">
          <div
            className="h-full bg-gold transition-all duration-700 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      )}

      {/* ── Messages ─────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-5 pt-8 pb-4 space-y-5">

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex items-start gap-3 animate-fade-in">
            <div className="flex-shrink-0 w-7 h-7 mt-0.5 rounded-lg border border-gold/25 bg-gold/10
                            flex items-center justify-center">
              <Aperture className="w-3.5 h-3.5 text-gold" strokeWidth={1.5} />
            </div>
            <TypingIndicator />
          </div>
        )}

        {/* Inline option panels */}
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
        {showTerms && (
          <div className="pl-10 w-full pr-1">
            <TermsBox onAccept={handleTermsAccept} onDecline={handleTermsDecline} disabled={loading} />
          </div>
        )}

        {/* ── Booking confirmed card ─────────────────────────── */}
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

      {/* ── Input area ───────────────────────────────────────── */}
      <div className="flex-shrink-0 relative px-5 pb-5 pt-2">
        {/* Fade out scroll content behind input */}
        <div className="absolute inset-x-0 -top-8 h-8 bg-gradient-to-b from-transparent to-[#0D0C0B] pointer-events-none" />

        {showInput ? (
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your reply…"
              disabled={loading}
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
              <Send className="w-4 h-4 text-[#0D0C0B]" strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          <p className="text-center text-[10px] text-[#3A3530] tracking-[0.22em] uppercase py-2">
            {step === 'complete'   ? '✦  Booking confirmed  —  save your verification code  ✦'
            : step === 'processing' ? 'Processing your booking…'
            : step === 'error'      ? 'Session ended'
            :                         'Select an option above to continue'}
          </p>
        )}
      </div>

    </div>
  );
}

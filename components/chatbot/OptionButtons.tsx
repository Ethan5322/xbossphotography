'use client';

import { PACKAGES } from '@/lib/packages';
import { TERMS_AND_CONDITIONS } from '@/lib/terms';
import { useState, useRef, useEffect } from 'react';

const EVENT_TYPES = ['Wedding', 'Birthday', 'Graduation', 'Anniversary', 'Custom'];

interface EventOptionsProps {
  onSelect: (value: string) => void;
  disabled: boolean;
}

export function EventTypeOptions({ onSelect, disabled }: EventOptionsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-3 animate-fade-in">
      {EVENT_TYPES.map((type) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          disabled={disabled}
          className="px-5 py-2.5 rounded-full text-[13px] font-medium tracking-wide
                     border border-[#2C2820] text-[#7A7060] bg-transparent
                     hover:border-gold/50 hover:text-gold hover:bg-gold/5
                     transition-all duration-200
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {type}
        </button>
      ))}
    </div>
  );
}

interface PackageOptionsProps {
  onSelect: (packageId: string) => void;
  disabled: boolean;
}

export function PackageOptions({ onSelect, disabled }: PackageOptionsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 animate-fade-in w-full">
      {PACKAGES.map((pkg) => (
        <button
          key={pkg.id}
          onClick={() => onSelect(pkg.id)}
          disabled={disabled}
          className="text-left p-4 rounded-xl border border-[#252218] bg-[#0F0E0C]
                     hover:border-gold/40 hover:bg-[#161410]
                     hover:shadow-[0_0_24px_rgba(201,168,76,0.07)]
                     transition-all duration-250
                     disabled:opacity-40 disabled:cursor-not-allowed group"
        >
          <div className="flex items-start justify-between mb-2">
            <span className="font-medium text-[#C8C0B0] text-sm group-hover:text-gold transition-colors duration-200">
              {pkg.name}
            </span>
            <span className="text-gold font-bold text-sm ml-3 shrink-0">{pkg.priceFormatted}</span>
          </div>
          <p className="text-[#524E46] text-xs mb-2 leading-relaxed">
            {pkg.coverage} · {pkg.photographers} photographer{pkg.photographers > 1 ? 's' : ''} · {pkg.editedImages} images
          </p>
          <p className="text-[#706860] text-xs italic leading-relaxed">{pkg.highlight}</p>
        </button>
      ))}
    </div>
  );
}

interface TermsBoxProps {
  onAccept: () => void;
  onDecline: () => void;
  disabled: boolean;
}

export function TermsBox({ onAccept, onDecline, disabled }: TermsBoxProps) {
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) setScrolledToBottom(true);
    };
    el.addEventListener('scroll', handler);
    return () => el.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="w-full mt-3 animate-fade-in">
      <div
        ref={scrollRef}
        className="h-48 overflow-y-auto rounded-xl border border-[#252218] bg-[#0C0B09] p-4
                   text-xs text-[#605A50] leading-[1.85] whitespace-pre-wrap"
      >
        {TERMS_AND_CONDITIONS}
      </div>

      {!scrolledToBottom && (
        <p className="text-[10px] text-[#3A3530] mt-1.5 text-center tracking-[0.2em] uppercase">
          Scroll to read all terms before accepting
        </p>
      )}

      <div className="flex gap-3 mt-3">
        <button
          onClick={onAccept}
          disabled={disabled || !scrolledToBottom}
          className="flex-1 py-3 rounded-xl bg-gold text-[#0D0C0B] font-semibold text-sm tracking-wide
                     hover:bg-gold-light hover:shadow-[0_0_20px_rgba(201,168,76,0.28)]
                     transition-all duration-200
                     disabled:opacity-30 disabled:cursor-not-allowed"
        >
          I Accept the Terms & Conditions
        </button>
        <button
          onClick={onDecline}
          disabled={disabled}
          className="px-5 py-3 rounded-xl border border-[#252218] text-[#504A42] text-sm
                     hover:border-red-900/70 hover:text-red-500/60
                     transition-all duration-200
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Decline
        </button>
      </div>
    </div>
  );
}

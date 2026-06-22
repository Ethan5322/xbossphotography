'use client';

import { PACKAGES } from '@/lib/packages';
import { TERMS_AND_CONDITIONS } from '@/lib/terms';

const EVENT_TYPES = ['Wedding', 'Birthday', 'Graduation', 'Anniversary', 'Custom'];

interface EventOptionsProps {
  onSelect: (value: string) => void;
  disabled: boolean;
}

export function EventTypeOptions({ onSelect, disabled }: EventOptionsProps) {
  return (
    <div className="flex flex-wrap gap-2.5 mt-3 animate-fade-in">
      {EVENT_TYPES.map((type) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          disabled={disabled}
          className="px-5 py-2.5 rounded-[4px] text-[14px] tracking-wide
                     border border-gold/50 text-warmwhite bg-transparent
                     hover:bg-gold hover:text-obsidian hover:font-semibold hover:border-gold
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
          className="text-left p-4 rounded-[4px] border border-gold/[0.18] bg-[#1A1A1A]
                     hover:border-gold/60 hover:bg-elevated
                     transition-all duration-200
                     disabled:opacity-40 disabled:cursor-not-allowed group"
        >
          <div className="flex items-start justify-between mb-2">
            <span className="font-playfair text-warmwhite text-[15px] group-hover:text-gold transition-colors duration-200">
              {pkg.name}
            </span>
            <span className="text-gold font-semibold text-sm ml-3 shrink-0">{pkg.priceFormatted}</span>
          </div>
          <p className="text-mutedgray text-xs mb-2 leading-relaxed">
            {pkg.coverage} · {pkg.photographers} photographer{pkg.photographers > 1 ? 's' : ''} · {pkg.editedImages} images
          </p>
          <p className="text-mutedgray/80 text-xs italic leading-relaxed">{pkg.highlight}</p>
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
  return (
    <div className="w-full mt-3 animate-fade-in">
      <div
        className="h-48 overflow-y-auto rounded-[4px] border border-gold/[0.18] bg-surface p-4
                   text-xs text-mutedgray leading-[1.85] whitespace-pre-wrap"
      >
        {TERMS_AND_CONDITIONS}
      </div>

      <p className="text-[10px] text-mutedgray/60 mt-2 text-center tracking-[0.2em] uppercase">
        Please read the terms above
      </p>

      <div className="flex gap-3 mt-3">
        <button
          onClick={onAccept}
          disabled={disabled}
          className="flex-1 py-3 rounded-[4px] bg-gold text-obsidian font-semibold text-sm tracking-wide
                     hover:bg-gold-light transition-all duration-200
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          I Accept the Terms &amp; Conditions
        </button>
        <button
          onClick={onDecline}
          disabled={disabled}
          className="px-5 py-3 rounded-[4px] border border-gold/30 text-mutedgray text-sm
                     hover:border-red-900/70 hover:text-red-500/70
                     transition-all duration-200
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Decline
        </button>
      </div>
    </div>
  );
}

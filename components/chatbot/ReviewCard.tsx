'use client';

import { Pencil, ShieldCheck } from 'lucide-react';
import { getPackageById } from '@/lib/packages';
import type { BookingStep, CollectedData } from '@/types/booking';

interface ReviewCardProps {
  data: CollectedData;
  onConfirm: () => void;
  onEdit: (step: BookingStep) => void;
  disabled: boolean;
}

function formatDate(iso?: string): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return iso;
  }
}

function formatTime(t?: string): string {
  if (!t) return '—';
  const [h, m] = t.split(/[:h]/).map(Number);
  if (isNaN(h)) return t;
  const period = h < 12 ? 'AM' : 'PM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m || 0).padStart(2, '0')} ${period}`;
}

export function ReviewCard({ data, onConfirm, onEdit, disabled }: ReviewCardProps) {
  const pkg = getPackageById(data.package ?? '');

  const rows: { label: string; value: string; step: BookingStep }[] = [
    { label: 'Full Name', value: data.full_name ?? '—', step: 'name' },
    { label: 'Phone',     value: data.phone ?? '—',     step: 'phone' },
    { label: 'Email',     value: data.email ?? '—',     step: 'email' },
    { label: 'Location',  value: [data.area, data.province, data.country].filter(Boolean).join(', ') || '—', step: 'country' },
    { label: 'Event',     value: data.event_type ?? '—', step: 'event_type' },
    { label: 'Date',      value: formatDate(data.event_date), step: 'event_date' },
    { label: 'Arrival',   value: formatTime(data.event_time), step: 'event_time' },
  ];

  return (
    <div className="w-full mt-3 animate-fade-in">
      <div className="rounded-[4px] border border-gold/[0.18] bg-[#1A1A1A] overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gold/[0.18] bg-surface">
          <ShieldCheck className="w-4 h-4 text-gold" strokeWidth={1.5} />
          <span className="font-playfair text-gold text-[13px] tracking-wide">
            Review Your Booking
          </span>
        </div>

        {/* Detail rows */}
        <div className="divide-y divide-white/[0.04]">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between gap-3 px-5 py-3 group">
              <div className="min-w-0">
                <p className="text-[9px] text-mutedgray/70 tracking-[0.22em] uppercase mb-0.5">{r.label}</p>
                <p className="text-[14px] text-warmwhite truncate">{r.value}</p>
              </div>
              <button
                type="button"
                onClick={() => onEdit(r.step)}
                disabled={disabled}
                className="flex items-center gap-1 shrink-0 text-[10px] text-mutedgray/70 tracking-wide uppercase
                           hover:text-gold transition-colors duration-200 disabled:opacity-40"
              >
                <Pencil className="w-3 h-3" strokeWidth={1.8} />
                Edit
              </button>
            </div>
          ))}

          {/* Package row — highlighted */}
          <div className="flex items-center justify-between gap-3 px-5 py-4 bg-surface">
            <div className="min-w-0">
              <p className="text-[9px] text-mutedgray/70 tracking-[0.22em] uppercase mb-1">Package</p>
              <p className="text-[15px] text-warmwhite font-playfair truncate">
                {pkg?.name ?? data.package ?? '—'}
                {pkg && <span className="text-gold"> · {pkg.priceFormatted}</span>}
              </p>
              {pkg && (
                <p className="text-[11px] text-mutedgray mt-0.5">
                  {pkg.coverage} · {pkg.photographers} photographer{pkg.photographers > 1 ? 's' : ''} · {pkg.editedImages} images
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onEdit('package')}
              disabled={disabled}
              className="flex items-center gap-1 shrink-0 text-[10px] text-mutedgray/70 tracking-wide uppercase
                         hover:text-gold transition-colors duration-200 disabled:opacity-40"
            >
              <Pencil className="w-3 h-3" strokeWidth={1.8} />
              Edit
            </button>
          </div>
        </div>

        {/* Confirm */}
        <div className="p-4 border-t border-gold/[0.18]">
          <button
            type="button"
            onClick={onConfirm}
            disabled={disabled}
            className="w-full py-3.5 rounded-[4px] bg-gold text-obsidian font-semibold text-sm tracking-wide
                       hover:bg-gold-light transition-all duration-200
                       disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Confirm &amp; Continue to Terms
          </button>
          <p className="text-center text-[10px] text-mutedgray/60 tracking-[0.18em] uppercase mt-3">
            Please verify all details are correct
          </p>
        </div>

      </div>
    </div>
  );
}

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
      <div className="rounded-2xl border border-[#252218] bg-[#0F0E0C] overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-2 px-5 py-4 border-b border-[#1C1914] bg-[#0C0B09]">
          <ShieldCheck className="w-4 h-4 text-gold" strokeWidth={1.5} />
          <span className="text-gold text-[11px] font-semibold tracking-[0.2em] uppercase">
            Review Your Booking
          </span>
        </div>

        {/* Detail rows */}
        <div className="divide-y divide-[#161410]">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between gap-3 px-5 py-3 group">
              <div className="min-w-0">
                <p className="text-[9px] text-[#4A4540] tracking-[0.22em] uppercase mb-0.5">{r.label}</p>
                <p className="text-[13px] text-[#C8C0B0] truncate">{r.value}</p>
              </div>
              <button
                onClick={() => onEdit(r.step)}
                disabled={disabled}
                className="flex items-center gap-1 shrink-0 text-[10px] text-[#504A42] tracking-wide uppercase
                           hover:text-gold transition-colors duration-200 disabled:opacity-40"
              >
                <Pencil className="w-3 h-3" strokeWidth={1.8} />
                Edit
              </button>
            </div>
          ))}

          {/* Package row — highlighted */}
          <div className="flex items-center justify-between gap-3 px-5 py-4 bg-[#0C0B09]">
            <div className="min-w-0">
              <p className="text-[9px] text-[#4A4540] tracking-[0.22em] uppercase mb-1">Package</p>
              <p className="text-[14px] text-[#C8C0B0] font-medium truncate">
                {pkg?.name ?? data.package ?? '—'}
                {pkg && <span className="text-gold font-semibold"> · {pkg.priceFormatted}</span>}
              </p>
              {pkg && (
                <p className="text-[11px] text-[#524E46] mt-0.5">
                  {pkg.coverage} · {pkg.photographers} photographer{pkg.photographers > 1 ? 's' : ''} · {pkg.editedImages} images
                </p>
              )}
            </div>
            <button
              onClick={() => onEdit('package')}
              disabled={disabled}
              className="flex items-center gap-1 shrink-0 text-[10px] text-[#504A42] tracking-wide uppercase
                         hover:text-gold transition-colors duration-200 disabled:opacity-40"
            >
              <Pencil className="w-3 h-3" strokeWidth={1.8} />
              Edit
            </button>
          </div>
        </div>

        {/* Confirm */}
        <div className="p-4 border-t border-[#1C1914]">
          <button
            onClick={onConfirm}
            disabled={disabled}
            className="w-full py-3.5 rounded-xl bg-gold text-[#0D0C0B] font-semibold text-sm tracking-wide
                       hover:bg-gold-light hover:shadow-[0_0_20px_rgba(201,168,76,0.3)]
                       transition-all duration-200
                       disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Confirm &amp; Continue to Terms
          </button>
          <p className="text-center text-[10px] text-[#3A3530] tracking-[0.18em] uppercase mt-3">
            Please verify all details are correct
          </p>
        </div>

      </div>
    </div>
  );
}

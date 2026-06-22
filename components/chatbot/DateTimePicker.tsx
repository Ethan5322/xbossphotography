'use client';

import { useState } from 'react';
import { Calendar, Clock, Check } from 'lucide-react';

// ── Date picker ────────────────────────────────────────────────────────────────
interface DatePickerProps {
  onSelect: (isoDate: string, display: string) => void;
  disabled: boolean;
}

export function DatePicker({ onSelect, disabled }: DatePickerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDate = today.toISOString().split('T')[0];

  const [value, setValue] = useState('');

  const confirm = () => {
    if (!value) return;
    const d = new Date(value);
    const display = d.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    onSelect(value, display);
  };

  return (
    <div className="w-full mt-3 animate-fade-in">
      <div className="rounded-[4px] border border-gold/[0.18] bg-[#1A1A1A] p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-gold" strokeWidth={1.5} />
          <span className="text-[11px] text-mutedgray tracking-[0.18em] uppercase">Select your event date</span>
        </div>

        <input
          type="date"
          title="Event date"
          aria-label="Event date"
          min={minDate}
          value={value}
          disabled={disabled}
          onChange={(e) => setValue(e.target.value)}
          className="w-full bg-surface border border-gold/20 rounded-[4px]
                     px-4 py-3 text-sm text-warmwhite
                     focus:outline-none focus:border-gold/60
                     transition-all duration-200 [color-scheme:dark]
                     disabled:opacity-40"
        />

        <button
          type="button"
          onClick={confirm}
          disabled={disabled || !value}
          className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-[4px]
                     bg-gold text-obsidian font-semibold text-sm tracking-wide
                     hover:bg-gold-light transition-all duration-200
                     disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Check className="w-4 h-4" strokeWidth={2.5} />
          Confirm Date
        </button>
      </div>
    </div>
  );
}

// ── Time picker ────────────────────────────────────────────────────────────────
const PRESET_TIMES = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

interface TimePickerProps {
  onSelect: (time: string, display: string) => void;
  disabled: boolean;
}

function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const period = h < 12 ? 'AM' : 'PM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

export function TimePicker({ onSelect, disabled }: TimePickerProps) {
  const [custom, setCustom] = useState('');

  return (
    <div className="w-full mt-3 animate-fade-in">
      <div className="rounded-[4px] border border-gold/[0.18] bg-[#1A1A1A] p-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-gold" strokeWidth={1.5} />
          <span className="text-[11px] text-mutedgray tracking-[0.18em] uppercase">Choose an arrival time</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {PRESET_TIMES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onSelect(t, formatTime(t))}
              disabled={disabled}
              className="py-2.5 rounded-[4px] text-[13px]
                         border border-gold/40 text-warmwhite bg-transparent
                         hover:bg-gold hover:text-obsidian hover:font-semibold hover:border-gold
                         transition-all duration-200
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {formatTime(t)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gold/10">
          <span className="text-[10px] text-mutedgray/70 tracking-[0.18em] uppercase shrink-0">Or custom</span>
          <input
            type="time"
            title="Custom arrival time"
            aria-label="Custom arrival time"
            value={custom}
            disabled={disabled}
            onChange={(e) => setCustom(e.target.value)}
            className="flex-1 bg-surface border border-gold/20 rounded-[4px]
                       px-3 py-2 text-sm text-warmwhite
                       focus:outline-none focus:border-gold/60
                       transition-all duration-200 [color-scheme:dark]
                       disabled:opacity-40"
          />
          <button
            type="button"
            onClick={() => custom && onSelect(custom, formatTime(custom))}
            disabled={disabled || !custom}
            className="px-4 py-2 rounded-[4px] bg-gold text-obsidian font-semibold text-sm
                       hover:bg-gold-light transition-all duration-200
                       disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Set
          </button>
        </div>
      </div>
    </div>
  );
}

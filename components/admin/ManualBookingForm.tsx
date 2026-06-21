'use client';

import { useState } from 'react';
import { PACKAGES } from '@/lib/packages';
import { CheckCircle, Loader } from 'lucide-react';

const EVENT_TYPES = ['Wedding', 'Birthday', 'Graduation', 'Anniversary', 'Custom'];

interface FormData {
  full_name: string;
  phone: string;
  email: string;
  country: string;
  province: string;
  area: string;
  event_type: string;
  custom_event_type: string;
  event_date: string;
  event_time: string;
  package: string;
  notes: string;
}

const EMPTY: FormData = {
  full_name: '', phone: '', email: '',
  country: 'South Africa', province: '', area: '',
  event_type: '', custom_event_type: '',
  event_date: '', event_time: '',
  package: '', notes: '',
};

interface ManualBookingFormProps {
  onSuccess: (code: string) => void;
}

export function ManualBookingForm({ onSuccess }: ManualBookingFormProps) {
  const [form, setForm] = useState<FormData>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const eventType = form.event_type === 'Custom' ? form.custom_event_type.trim() : form.event_type;

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.full_name,
          phone: form.phone,
          email: form.email,
          country: form.country,
          province: form.province,
          area: form.area,
          event_type: eventType,
          event_date: form.event_date,
          event_time: form.event_time,
          package: form.package,
          terms_accepted: true,
          source: 'admin',
          notes: form.notes || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Failed to create booking');
      }

      const data = await res.json();
      setForm(EMPTY);
      onSuccess(data.verification_code);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 transition-colors';
  const labelCls = 'block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Client info row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Full Name *</label>
          <input required value={form.full_name} onChange={set('full_name')} placeholder="Jane Smith" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Phone (intl. code) *</label>
          <input required value={form.phone} onChange={set('phone')} placeholder="+27 82 123 4567" className={inputCls} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Email Address *</label>
        <input required type="email" value={form.email} onChange={set('email')} placeholder="jane@email.com" className={inputCls} />
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>Country *</label>
          <input required value={form.country} onChange={set('country')} placeholder="South Africa" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Province / Region *</label>
          <input required value={form.province} onChange={set('province')} placeholder="Western Cape" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Area / Postal Code *</label>
          <input required value={form.area} onChange={set('area')} placeholder="Cape Town / 8001" className={inputCls} />
        </div>
      </div>

      {/* Event */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>Event Type *</label>
          <select required value={form.event_type} onChange={set('event_type')} className={inputCls}>
            <option value="">Select event type</option>
            {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        {form.event_type === 'Custom' && (
          <div>
            <label className={labelCls}>Describe Event *</label>
            <input required value={form.custom_event_type} onChange={set('custom_event_type')} placeholder="e.g. Product launch" className={inputCls} />
          </div>
        )}
        <div>
          <label className={labelCls}>Event Date *</label>
          <input required type="date" value={form.event_date} onChange={set('event_date')} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Arrival Time *</label>
          <input required type="time" value={form.event_time} onChange={set('event_time')} className={inputCls} />
        </div>
      </div>

      {/* Package */}
      <div>
        <label className={labelCls}>Package *</label>
        <select required value={form.package} onChange={set('package')} className={inputCls}>
          <option value="">Select a package</option>
          {PACKAGES.map((p) => (
            <option key={p.id} value={p.id}>{p.name} — {p.priceFormatted}</option>
          ))}
        </select>
      </div>

      {/* Notes */}
      <div>
        <label className={labelCls}>Admin Notes (optional)</label>
        <textarea value={form.notes} onChange={set('notes')} placeholder="Any additional notes for this booking…" rows={3} className={`${inputCls} resize-none`} />
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-yellow-500 text-gray-900 font-bold text-sm
                   hover:bg-yellow-400 transition-all duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? <><Loader className="w-4 h-4 animate-spin" /> Creating Booking…</> : 'Create Manual Booking'}
      </button>
    </form>
  );
}

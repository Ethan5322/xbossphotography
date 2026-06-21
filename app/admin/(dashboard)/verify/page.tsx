'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShieldCheck, Search, AlertTriangle, CheckCircle, User, Phone, Mail, MapPin, CalendarDays, Package, Hash } from 'lucide-react';
import type { Booking } from '@/types/booking';
import { getPackageById } from '@/lib/packages';
import { format } from 'date-fns';

function VerifyContent() {
  const searchParams = useSearchParams();
  const [code, setCode] = useState(searchParams.get('code') ?? '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ found: boolean; booking?: Booking } | null>(null);

  useEffect(() => {
    const preCode = searchParams.get('code');
    if (preCode) {
      setCode(preCode);
      doVerify(preCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doVerify = async (verifyCode: string) => {
    if (!verifyCode.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/bookings/verify?code=${encodeURIComponent(verifyCode.trim().toUpperCase())}`);
      if (res.status === 404) { setResult({ found: false }); return; }
      if (!res.ok) throw new Error('Server error');
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ found: false });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doVerify(code);
  };

  const booking = result?.booking;
  const pkg = booking ? getPackageById(booking.package) : null;

  return (
    <div className="max-w-2xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-yellow-500" />
        </div>
        <div>
          <h1 className="text-white text-xl font-bold">Verify Booking</h1>
          <p className="text-gray-500 text-sm">Enter a client verification code to view their booking details</p>
        </div>
      </div>

      {/* Search form */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          value={code}
          onChange={(e) => { setCode(e.target.value.toUpperCase()); setResult(null); }}
          placeholder="e.g. XBOSS-A7K3M2"
          className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3
                     text-white font-mono text-sm placeholder-gray-600
                     focus:outline-none focus:border-yellow-500 transition-colors uppercase tracking-widest"
        />
        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-gray-900 font-semibold
                     text-sm rounded-xl hover:bg-yellow-400 transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Search className="w-4 h-4" />
          {loading ? 'Searching…' : 'Verify'}
        </button>
      </form>

      {/* Result: NOT FOUND */}
      {result && !result.found && (
        <div className="flex items-start gap-4 bg-red-900/15 border border-red-800 rounded-2xl p-6">
          <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-red-400 font-semibold">Invalid Verification Code</h3>
            <p className="text-gray-500 text-sm mt-1">
              No booking was found for this code. Please check the code and try again.
            </p>
          </div>
        </div>
      )}

      {/* Result: FOUND */}
      {result?.found && booking && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden animate-fade-in">

          {/* Found header */}
          <div className="bg-green-900/20 border-b border-green-800/40 px-6 py-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-green-400 font-semibold text-sm">Booking Verified</p>
              <p className="text-gray-500 text-xs font-mono">{booking.verification_code}</p>
            </div>
            <span className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold capitalize ${
              booking.status === 'confirmed' ? 'bg-green-900/50 text-green-400 border border-green-800' :
              booking.status === 'pending' ? 'bg-amber-900/50 text-amber-400 border border-amber-800' :
              'bg-gray-800 text-gray-400 border border-gray-700'
            }`}>
              {booking.status}
            </span>
          </div>

          {/* Details grid */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">

            <Section title="Client Information" icon={User}>
              <Field label="Full Name" value={booking.full_name} />
              <Field label="Phone" value={booking.phone} icon={<Phone className="w-3 h-3" />} />
              <Field label="Email" value={booking.email} icon={<Mail className="w-3 h-3" />} />
              <Field label="Location" value={`${booking.area}, ${booking.province}, ${booking.country}`} icon={<MapPin className="w-3 h-3" />} />
            </Section>

            <Section title="Event Details" icon={CalendarDays}>
              <Field label="Event Type" value={booking.event_type} />
              <Field label="Date" value={format(new Date(booking.event_date), 'dd MMMM yyyy')} />
              <Field label="Arrival Time" value={booking.event_time} />
              <Field label="Booked Via" value={booking.source === 'admin' ? 'Admin (manual)' : 'Chatbot'} />
            </Section>

            <Section title="Selected Package" icon={Package} className="sm:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">{pkg?.name ?? booking.package} Package</p>
                  <p className="text-gray-500 text-xs mt-0.5">{pkg?.coverage} · {pkg?.photographers} photographer{(pkg?.photographers ?? 1) > 1 ? 's' : ''} · {pkg?.editedImages} images</p>
                </div>
                <span className="text-yellow-500 font-bold text-lg">{pkg?.priceFormatted}</span>
              </div>
              {booking.notes && (
                <div className="mt-3 bg-gray-800 rounded-lg px-3 py-2">
                  <p className="text-xs text-gray-500 mb-0.5 font-semibold uppercase tracking-wider">Admin Notes</p>
                  <p className="text-gray-300 text-sm">{booking.notes}</p>
                </div>
              )}
            </Section>

          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, icon: Icon, children, className = '' }: { title: string; icon: React.ElementType; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <div className="flex items-center gap-1.5 mb-3">
        <Icon className="w-3.5 h-3.5 text-yellow-500" />
        <h3 className="text-yellow-500 text-xs font-bold uppercase tracking-widest">{title}</h3>
      </div>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function Field({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      {icon && <span className="text-gray-600 mt-0.5 flex-shrink-0">{icon}</span>}
      <div>
        <p className="text-gray-600 text-xs">{label}</p>
        <p className="text-gray-200 text-sm">{value}</p>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyContent />
    </Suspense>
  );
}

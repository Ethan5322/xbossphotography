'use client';

import { useState, useEffect, useCallback } from 'react';
import { Clock, Plus, CheckCircle, X, Download } from 'lucide-react';
import { BookingTable } from '@/components/admin/BookingTable';
import { ManualBookingForm } from '@/components/admin/ManualBookingForm';
import type { Booking } from '@/types/booking';
import { format } from 'date-fns';

interface SuccessBooking {
  id: string;
  verification_code: string;
}

export default function TodayPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState<SuccessBooking | null>(null);

  const fetchToday = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings/today');
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchToday(); }, [fetchToday]);

  const handleSuccess = (booking: SuccessBooking) => {
    setSuccess(booking);
    setShowForm(false);
    fetchToday();
  };

  const todayStr = format(new Date(), 'EEEE, dd MMMM yyyy');

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
            <Clock className="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <h1 className="text-white text-xl font-bold">Today&apos;s Bookings</h1>
            <p className="text-gray-500 text-sm">{todayStr}</p>
          </div>
        </div>

        <button
          onClick={() => { setShowForm((v) => !v); setSuccess(null); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-500 text-gray-900 font-semibold text-sm hover:bg-yellow-400 transition-all"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Manual Booking'}
        </button>
      </div>

      {/* Success card — verification code + downloadable PDF (same as public site) */}
      {success && (
        <div className="bg-gray-900 border border-green-800/60 rounded-2xl p-5 animate-slide-up">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-green-400 font-semibold text-sm">Manual booking created successfully</p>
              <p className="text-gray-500 text-xs mt-0.5">The confirmation PDF is ready to download.</p>
            </div>
            <button onClick={() => setSuccess(null)} className="text-gray-600 hover:text-gray-400">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4">
            <div className="flex-1 border border-yellow-500/20 bg-yellow-500/5 rounded-xl px-4 py-3">
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-1">Verification Code</p>
              <p className="font-mono text-yellow-500 text-lg font-bold tracking-[0.15em]">{success.verification_code}</p>
            </div>

            <a
              href={`/api/pdf?id=${success.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-yellow-500 text-gray-900
                         font-bold text-sm hover:bg-yellow-400 transition-all"
            >
              <Download className="w-4 h-4" strokeWidth={2.5} />
              Download Confirmation PDF
            </a>
          </div>
        </div>
      )}

      {/* Manual booking form */}
      {showForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 animate-slide-up">
          <h2 className="text-white font-semibold mb-5 flex items-center gap-2">
            <Plus className="w-4 h-4 text-yellow-500" />
            New Manual Booking
          </h2>
          <ManualBookingForm onSuccess={handleSuccess} />
        </div>
      )}

      {/* Today's bookings table */}
      <div className="flex items-center justify-between">
        <h2 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">
          {loading ? 'Loading…' : `${bookings.length} booking${bookings.length !== 1 ? 's' : ''} today`}
        </h2>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-700 text-sm">Loading today&apos;s bookings…</div>
      ) : (
        <BookingTable bookings={bookings} emptyMessage="No bookings scheduled for today." showDate={false} />
      )}
    </div>
  );
}

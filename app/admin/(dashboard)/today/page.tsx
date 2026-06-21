'use client';

import { useState, useEffect, useCallback } from 'react';
import { Clock, Plus, CheckCircle, X } from 'lucide-react';
import { BookingTable } from '@/components/admin/BookingTable';
import { ManualBookingForm } from '@/components/admin/ManualBookingForm';
import type { Booking } from '@/types/booking';
import { format } from 'date-fns';

export default function TodayPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [successCode, setSuccessCode] = useState<string | null>(null);

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

  const handleSuccess = (code: string) => {
    setSuccessCode(code);
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
          onClick={() => { setShowForm((v) => !v); setSuccessCode(null); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-500 text-gray-900 font-semibold text-sm hover:bg-yellow-400 transition-all"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Manual Booking'}
        </button>
      </div>

      {/* Success banner */}
      {successCode && (
        <div className="flex items-center gap-3 bg-green-900/20 border border-green-800 rounded-xl px-4 py-3 animate-fade-in">
          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
          <div>
            <p className="text-green-400 font-semibold text-sm">Manual booking created successfully</p>
            <p className="text-gray-500 text-xs">Verification code: <span className="font-mono text-gray-300">{successCode}</span></p>
          </div>
          <button onClick={() => setSuccessCode(null)} className="ml-auto text-gray-600 hover:text-gray-400">
            <X className="w-4 h-4" />
          </button>
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

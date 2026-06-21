import { Calendar, CalendarDays } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { BookingTable } from '@/components/admin/BookingTable';
import type { Booking } from '@/types/booking';
import { format } from 'date-fns';

async function getUpcomingBookings(): Promise<Booking[]> {
  const today = new Date().toISOString().split('T')[0];
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('photographer_bookings')
    .select('*')
    .gte('event_date', today)
    .neq('status', 'cancelled')
    .order('event_date', { ascending: true })
    .order('event_time', { ascending: true });
  return (data ?? []) as Booking[];
}

export default async function UpcomingPage() {
  const bookings = await getUpcomingBookings();
  const todayStr = format(new Date(), 'EEEE, dd MMMM yyyy');

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <h1 className="text-white text-xl font-bold">Upcoming Events</h1>
            <p className="text-gray-500 text-sm">Today is {todayStr}</p>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-center">
          <p className="text-yellow-500 text-2xl font-bold">{bookings.length}</p>
          <p className="text-gray-600 text-xs">upcoming</p>
        </div>
      </div>

      {/* Summary cards for next 3 events */}
      {bookings.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {bookings.slice(0, 3).map((b) => (
            <div key={b.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <span className="text-yellow-500 font-semibold text-xs uppercase tracking-wider">{b.event_type}</span>
                <CalendarDays className="w-4 h-4 text-gray-600" />
              </div>
              <p className="text-white font-bold">{b.full_name}</p>
              <p className="text-gray-500 text-xs mt-1">
                {format(new Date(b.event_date), 'dd MMM yyyy')} · {b.event_time}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Full table */}
      <BookingTable bookings={bookings} emptyMessage="No upcoming events scheduled." showDate />
    </div>
  );
}

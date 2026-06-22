'use client';

import { format } from 'date-fns';
import type { Booking } from '@/types/booking';
import { getPackageDisplayName } from '@/lib/packages';
import { User, Phone, Mail, MapPin, Package, Clock, Download } from 'lucide-react';

interface BookingTableProps {
  bookings: Booking[];
  emptyMessage?: string;
  showDate?: boolean;
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-900/30 text-amber-400 border-amber-800',
  confirmed: 'bg-green-900/30 text-green-400 border-green-800',
  cancelled: 'bg-red-900/30 text-red-400 border-red-800',
  completed: 'bg-blue-900/30 text-blue-400 border-blue-800',
};

function BookingRow({ booking, showDate }: { booking: Booking; showDate: boolean }) {
  const eventDate = format(new Date(booking.event_date), 'dd MMM yyyy');
  const packageName = getPackageDisplayName(booking.package);
  const statusStyle = STATUS_STYLES[booking.status] ?? STATUS_STYLES.pending;

  return (
    <tr className="border-b border-gray-800 hover:bg-gray-800/40 transition-colors">
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-gray-400" />
          </div>
          <div>
            <p className="text-white text-sm font-medium">{booking.full_name}</p>
            <p className="text-gray-500 text-xs font-mono">{booking.verification_code}</p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4 hidden sm:table-cell">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Phone className="w-3 h-3" />{booking.phone}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Mail className="w-3 h-3" />{booking.email}
          </div>
        </div>
      </td>

      <td className="px-4 py-4 hidden md:table-cell">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span>{booking.area}, {booking.province}</span>
        </div>
      </td>

      <td className="px-4 py-4">
        <div>
          <p className="text-white text-sm">{booking.event_type}</p>
          {showDate && (
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
              <Clock className="w-3 h-3" />{eventDate} · {booking.event_time}
            </div>
          )}
          {!showDate && (
            <p className="text-xs text-gray-500 mt-0.5">{booking.event_time}</p>
          )}
        </div>
      </td>

      <td className="px-4 py-4 hidden lg:table-cell">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Package className="w-3 h-3" />{packageName}
        </div>
      </td>

      <td className="px-4 py-4">
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs border capitalize ${statusStyle}`}>
          {booking.status}
        </span>
      </td>

      <td className="px-4 py-4">
        <a
          href={`/api/pdf?id=${booking.id}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Download confirmation PDF"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-700
                     text-xs text-gray-300 hover:border-yellow-500/50 hover:text-yellow-500
                     transition-colors whitespace-nowrap"
        >
          <Download className="w-3.5 h-3.5" />
          PDF
        </a>
      </td>
    </tr>
  );
}

export function BookingTable({ bookings, emptyMessage = 'No bookings found.', showDate = true }: BookingTableProps) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-16 text-gray-600">
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-800">
      <table className="w-full text-left bg-gray-900/50">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Contact</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Location</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Event</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Package</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">PDF</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <BookingRow key={b.id} booking={b} showDate={showDate} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { History, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { BookingTable } from '@/components/admin/BookingTable';
import type { Booking } from '@/types/booking';

export default function HistoryPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const perPage = 20;

  const fetchHistory = useCallback(async (p: number, s: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), ...(s ? { search: s } : {}) });
      const res = await fetch(`/api/bookings/history?${params}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings);
        setTotal(data.total);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchHistory(page, search); }, [fetchHistory, page, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(inputValue);
  };

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
            <History className="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <h1 className="text-white text-xl font-bold">Booking History</h1>
            <p className="text-gray-500 text-sm">
              {loading ? 'Loading…' : `${total.toLocaleString()} total booking${total !== 1 ? 's' : ''} on record`}
            </p>
          </div>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search name, email, code…"
            className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white
                       placeholder-gray-600 focus:outline-none focus:border-yellow-500 transition-colors w-64"
          />
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2.5 bg-yellow-500 text-gray-900 font-semibold text-sm rounded-xl hover:bg-yellow-400 transition-all"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
          {search && (
            <button
              type="button"
              onClick={() => { setInputValue(''); setSearch(''); setPage(1); }}
              className="px-3 py-2.5 text-gray-500 hover:text-gray-300 border border-gray-700 rounded-xl text-sm transition-colors"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-16 text-gray-700 text-sm">Loading booking history…</div>
      ) : (
        <BookingTable bookings={bookings} emptyMessage={search ? `No bookings found for "${search}".` : 'No bookings recorded yet.'} showDate />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-gray-600 text-sm">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-800 text-gray-400
                         hover:border-gray-700 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-800 text-gray-400
                         hover:border-gray-700 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

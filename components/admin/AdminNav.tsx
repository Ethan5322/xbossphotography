'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldCheck, Calendar, CalendarDays, Clock, History, LogOut, Camera } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin/verify', label: 'Verify Booking', icon: ShieldCheck, description: 'Check a client verification code' },
  { href: '/admin/upcoming', label: 'Upcoming Events', icon: Calendar, description: 'All future bookings' },
  { href: '/admin/today', label: "Today's Bookings", icon: Clock, description: 'Today + manual booking' },
  { href: '/admin/history', label: 'Booking History', icon: History, description: 'Complete archive' },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <Link href="/admin/upcoming" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gold flex items-center justify-center">
              <Camera className="w-5 h-5 text-gray-900" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">X-BOSS</p>
              <p className="text-gray-500 text-xs">Admin Panel</p>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-150
                    ${active
                      ? 'bg-gold text-gray-900 font-semibold'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-500 hover:text-red-400 text-sm transition-colors duration-150 px-3 py-2 rounded-lg hover:bg-gray-800"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

        {/* Mobile nav */}
        <nav className="md:hidden flex items-center gap-1 pb-3 overflow-x-auto">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all
                  ${active ? 'bg-gold text-gray-900 font-semibold' : 'text-gray-400 hover:text-white hover:bg-gray-800'}
                `}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export { NAV_ITEMS };

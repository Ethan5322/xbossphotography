import Link from 'next/link';

export const metadata = { title: 'Page Not Found' };

export default function NotFound() {
  return (
    <div className="page-bg flex flex-col items-center justify-center h-screen px-6 text-center">
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-14 h-14 rounded-full border border-gold/60 bg-elevated flex items-center justify-center mb-7">
          <span className="font-playfair text-gold text-base font-bold">XB</span>
        </div>

        <p className="font-playfair text-gold text-5xl font-bold mb-3">404</p>
        <h1 className="text-warmwhite text-lg font-medium mb-2">This page could not be found</h1>
        <p className="text-mutedgray text-sm max-w-sm leading-relaxed mb-8">
          The page you are looking for may have moved or no longer exists.
        </p>

        <Link
          href="/"
          className="px-6 py-3 rounded-[4px] bg-gold text-obsidian font-semibold text-sm tracking-wide
                     hover:bg-gold-light transition-all duration-200"
        >
          Back to Booking
        </Link>
      </div>
    </div>
  );
}

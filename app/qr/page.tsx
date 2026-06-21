import { Aperture, Download } from 'lucide-react';
import { PrintButton } from './PrintButton';

export const metadata = { title: 'X-BOSS Photography — Company QR Code' };

export default function QRPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

  return (
    <div className="page-bg min-h-screen flex flex-col items-center justify-center px-6 py-12">

      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl border border-gold/30 bg-gold/10 flex items-center justify-center">
            <Aperture className="w-5 h-5 text-gold" strokeWidth={1.5} />
          </div>
          <h1 className="font-playfair text-gold font-semibold text-lg tracking-wide">
            X-BOSS Photography Studio
          </h1>
        </div>
        <p className="text-[10px] text-gray-600 tracking-[0.32em] uppercase">
          Official Booking QR Code
        </p>
      </div>

      {/* QR Card */}
      <div className="bg-white rounded-2xl p-8 shadow-[0_8px_48px_rgba(0,0,0,0.35)] flex flex-col items-center max-w-xs w-full">

        {/* QR image — served from the API route */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/api/qr"
          alt="X-BOSS Photography Studio booking QR code"
          className="w-64 h-64 block [image-rendering:pixelated]"
        />

        {/* Gold divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent my-5" />

        {/* Label */}
        <p className="font-playfair text-[#0D0C0B] font-semibold text-base tracking-wide text-center mb-1">
          X-BOSS Photography Studio
        </p>
        <p className="text-[11px] text-gray-400 tracking-[0.2em] uppercase text-center mb-1">
          Scan to Book Your Session
        </p>
        <p className="text-[10px] text-gray-300 tracking-wide text-center break-all">
          {baseUrl}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mt-8">
        <a
          href="/api/qr"
          download="XBOSS-QR-Code.png"
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-gold text-[#0D0C0B]
                     font-semibold text-sm tracking-wide
                     hover:bg-gold-light hover:shadow-[0_0_20px_rgba(201,168,76,0.4)]
                     transition-all duration-200"
        >
          <Download className="w-4 h-4" strokeWidth={2} />
          Download PNG
        </a>

        <PrintButton />
      </div>

      {/* Instructions */}
      <div className="mt-10 max-w-sm text-center space-y-2">
        <p className="text-[11px] text-gray-600 leading-relaxed">
          Place this QR code on business cards, flyers, banners, or social media.
          When clients scan it, they are taken directly to the booking chatbot.
        </p>
        <p className="text-[10px] text-gray-700 tracking-widest uppercase mt-4">
          High-resolution · 1000 × 1000 px · Print ready
        </p>
      </div>

    </div>
  );
}

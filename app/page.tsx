import { ChatInterface } from '@/components/chatbot/ChatInterface';
import { Aperture } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="page-bg flex flex-col h-screen overflow-hidden">

      {/* ── Header ───────────────────────────────────────────────── */}
      <header className="flex-shrink-0 px-5 pt-5 pb-0">
        <div className="max-w-3xl mx-auto">

          <div className="flex items-center gap-4">

            {/* Logo mark */}
            <div className="flex-shrink-0 w-11 h-11 rounded-xl border border-gold/30 bg-gold/10
                            flex items-center justify-center">
              <Aperture className="w-5 h-5 text-gold" strokeWidth={1.5} />
            </div>

            {/* Studio name */}
            <div className="flex-1 min-w-0">
              <h1 className="font-playfair text-gold font-semibold tracking-wide leading-none
                             text-[15px] sm:text-base">
                X-BOSS Photography Studio
              </h1>
              <p className="text-[9px] text-gray-600 tracking-[0.32em] uppercase mt-1.5 font-light">
                Premium Booking Experience
              </p>
            </div>

            {/* Online indicator */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <span className="relative flex h-[7px] w-[7px]">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-[7px] w-[7px] bg-emerald-500" />
              </span>
              <span className="text-[10px] text-gray-600 tracking-[0.18em] uppercase">Available</span>
            </div>
          </div>

          {/* Gradient rule */}
          <div className="mt-5 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        </div>
      </header>

      {/* ── Chat area ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden max-w-3xl w-full mx-auto flex flex-col">
        <ChatInterface />
      </div>

    </div>
  );
}

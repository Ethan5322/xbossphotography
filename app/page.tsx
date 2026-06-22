import { ChatInterface } from '@/components/chatbot/ChatInterface';

export default function HomePage() {
  return (
    <div className="page-bg flex flex-col h-screen overflow-hidden">

      {/* ── Top bar ───────────────────────────────────────────────── */}
      <header className="relative z-10 flex-shrink-0 bg-surface border-b border-gold/25">
        <div className="max-w-3xl mx-auto px-5 py-3.5 flex items-center gap-3.5">

          {/* XB monogram */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-elevated border border-gold/60
                          flex items-center justify-center">
            <span className="font-playfair text-gold text-[13px] font-bold leading-none">XB</span>
          </div>

          {/* Branding */}
          <div className="flex-1 min-w-0">
            <h1 className="font-playfair text-gold font-bold uppercase leading-none text-[15px] sm:text-[18px]"
                style={{ letterSpacing: '0.08em' }}>
              X-BOSS Photography Studio
            </h1>
            <p className="text-[10px] text-mutedgray uppercase mt-[6px]"
               style={{ letterSpacing: '0.18em' }}>
              Booking Assistant
            </p>
          </div>

          {/* Online status */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <span className="block h-2 w-2 rounded-full bg-gold animate-status-pulse" />
            <span className="text-[10px] text-mutedgray uppercase" style={{ letterSpacing: '0.18em' }}>
              Online
            </span>
          </div>
        </div>
      </header>

      {/* ── Chat area ────────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 overflow-hidden max-w-3xl w-full mx-auto flex flex-col">
        <ChatInterface />
      </div>

    </div>
  );
}

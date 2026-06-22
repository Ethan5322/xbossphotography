'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Surface the error for monitoring (replace with Sentry capture later if added)
    console.error(error);
  }, [error]);

  return (
    <div className="page-bg flex flex-col items-center justify-center h-screen px-6 text-center">
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-14 h-14 rounded-full border border-gold/60 bg-elevated flex items-center justify-center mb-7">
          <span className="font-playfair text-gold text-base font-bold">XB</span>
        </div>

        <h1 className="font-playfair text-gold text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-mutedgray text-sm max-w-sm leading-relaxed mb-8">
          We hit an unexpected error. Please try again — your details have not been lost.
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={reset}
            className="px-6 py-3 rounded-[4px] bg-gold text-obsidian font-semibold text-sm tracking-wide
                       hover:bg-gold-light transition-all duration-200"
          >
            Try Again
          </button>
          <a
            href="/"
            className="px-6 py-3 rounded-[4px] border border-gold/30 text-mutedgray font-medium text-sm tracking-wide
                       hover:border-gold/60 hover:text-gold transition-all duration-200"
          >
            Start Over
          </a>
        </div>
      </div>
    </div>
  );
}

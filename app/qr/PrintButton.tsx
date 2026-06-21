'use client';
import { Printer } from 'lucide-react';

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="flex items-center gap-2 px-5 py-3 rounded-full
                 border border-[#2C2820] text-[#9A9488] text-sm tracking-wide
                 hover:border-gold/50 hover:text-gold
                 transition-all duration-200"
    >
      <Printer className="w-4 h-4" />
      Print
    </button>
  );
}

'use client';

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-[5px] px-5 py-4 rounded-2xl rounded-tl-sm
                    bg-[#141210] border border-[#252218] shadow-[0_1px_6px_rgba(0,0,0,0.5)] w-fit">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="block w-[5px] h-[5px] rounded-full bg-gold"
          style={{ animation: `pulseDot 1.6s ease-in-out ${i * 0.22}s infinite` }}
        />
      ))}
    </div>
  );
}

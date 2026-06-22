'use client';

export function TypingIndicator() {
  return (
    <div
      className="flex items-center gap-[5px] px-5 py-4 bg-[#1A1A1A] border border-gold/[0.18] w-fit"
      style={{ borderRadius: '4px 18px 18px 18px' }}
    >
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

'use client';

import { Aperture } from 'lucide-react';
import type { ChatMessage } from '@/types/booking';

interface MessageBubbleProps {
  message: ChatMessage;
}

// Render **bold** segments as bright, prominent text so the client
// instantly sees the key thing they need to provide.
function renderRich(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full animate-slide-up gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>

      {/* Studio avatar — assistant only */}
      {!isUser && (
        <div className="flex-shrink-0 w-7 h-7 mt-0.5 rounded-lg border border-gold/25 bg-gold/10
                        flex items-center justify-center self-start">
          <Aperture className="w-3.5 h-3.5 text-gold" strokeWidth={1.5} />
        </div>
      )}

      {/* Bubble */}
      <div
        className={[
          'max-w-[78%] text-sm leading-[1.75]',
          isUser
            ? 'bg-[#A87D32] text-[#FAF8F4] font-medium px-4 py-3 rounded-2xl rounded-tr-sm shadow-[0_2px_16px_rgba(168,125,50,0.22)]'
            : 'bg-[#141210] text-[#CEC8B8] border border-[#252218] px-5 py-4 rounded-2xl rounded-tl-sm shadow-[0_1px_6px_rgba(0,0,0,0.5)]',
        ].join(' ')}
      >
        <p className="whitespace-pre-wrap">
          {isUser ? message.content : renderRich(message.content)}
        </p>
      </div>

    </div>
  );
}

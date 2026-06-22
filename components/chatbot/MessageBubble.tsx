'use client';

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
    <div className={`flex w-full animate-message-in gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>

      {/* Studio monogram avatar — assistant only */}
      {!isUser && (
        <div className="flex-shrink-0 w-[34px] h-[34px] rounded-full bg-elevated border border-gold/60
                        flex items-center justify-center self-start">
          <span className="font-playfair text-gold text-[12px] font-bold leading-none">XB</span>
        </div>
      )}

      {/* Bubble */}
      <div
        className={
          isUser
            ? 'max-w-[78%] text-[15px] leading-[1.75] px-4 py-3 text-obsidian font-medium'
            : 'max-w-[78%] text-[15px] leading-[1.75] px-5 py-4 bg-[#1A1A1A] border border-gold/[0.18] text-warmwhite'
        }
        style={
          isUser
            ? { background: 'linear-gradient(135deg, #C8922A 0%, #A67820 100%)', borderRadius: '18px 4px 18px 18px' }
            : { borderRadius: '4px 18px 18px 18px' }
        }
      >
        <p className="whitespace-pre-wrap">
          {isUser ? message.content : renderRich(message.content)}
        </p>
      </div>

    </div>
  );
}

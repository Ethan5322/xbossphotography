import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

// Apple touch icon — gold "XB" monogram on obsidian with a hairline ring
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0A0A0A',
        }}
      >
        <div
          style={{
            width: 128,
            height: 128,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            border: '3px solid #C8922A',
            color: '#C8922A',
            fontSize: 60,
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          XB
        </div>
      </div>
    ),
    { ...size },
  );
}

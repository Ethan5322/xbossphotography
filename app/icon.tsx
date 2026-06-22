import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

// Dynamically generated favicon — gold "XB" monogram on obsidian
export default function Icon() {
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
          color: '#C8922A',
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: 1,
        }}
      >
        XB
      </div>
    ),
    { ...size },
  );
}

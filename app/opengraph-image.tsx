import { ImageResponse } from 'next/og';

export const alt = 'X-BOSS Photography Studio — Book Your Session';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Social share preview (WhatsApp / Twitter / Facebook) in the studio's dark-luxury brand
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(ellipse at 50% 38%, #1A1408 0%, #0A0A0A 62%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Monogram */}
        <div
          style={{
            display: 'flex',
            width: 104,
            height: 104,
            borderRadius: '50%',
            border: '3px solid #C8922A',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#C8922A',
            fontSize: 46,
            fontWeight: 700,
            letterSpacing: 2,
            marginBottom: 40,
          }}
        >
          XB
        </div>

        {/* Studio name */}
        <div
          style={{
            display: 'flex',
            fontSize: 48,
            fontWeight: 700,
            color: '#C8922A',
            letterSpacing: 4,
          }}
        >
          X-BOSS PHOTOGRAPHY STUDIO
        </div>

        {/* Gold divider */}
        <div style={{ display: 'flex', width: 360, height: 1, background: '#C8922A', opacity: 0.5, margin: '30px 0' }} />

        {/* Subtitle */}
        <div style={{ display: 'flex', fontSize: 24, color: '#9A9590', letterSpacing: 8 }}>
          PREMIUM BOOKING ASSISTANT
        </div>

        {/* Tagline */}
        <div style={{ display: 'flex', fontSize: 20, color: '#9A9590', marginTop: 28 }}>
          Professional Event Photography · South Africa
        </div>
      </div>
    ),
    { ...size },
  );
}

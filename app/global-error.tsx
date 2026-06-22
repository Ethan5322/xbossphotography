'use client';

// Catches errors in the root layout itself — must render its own <html>/<body>
// and cannot rely on global CSS, so styles are inline.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          background: '#0A0A0A',
          color: '#F5F0E8',
          fontFamily: 'system-ui, sans-serif',
          padding: '0 24px',
        }}
      >
        <div
          style={{
            width: 56, height: 56, borderRadius: '50%', border: '1px solid #C8922A',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#C8922A', fontSize: 18, fontWeight: 700, marginBottom: 28,
          }}
        >
          XB
        </div>
        <h1 style={{ color: '#C8922A', fontSize: 24, fontWeight: 700, margin: '0 0 8px' }}>
          Something went wrong
        </h1>
        <p style={{ color: '#9A9590', fontSize: 14, maxWidth: 360, lineHeight: 1.6, margin: '0 0 32px' }}>
          The application encountered a problem. Please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            padding: '12px 24px', borderRadius: 4, border: 'none', cursor: 'pointer',
            background: '#C8922A', color: '#0A0A0A', fontWeight: 600, fontSize: 14, letterSpacing: 0.5,
          }}
        >
          Try Again
        </button>
      </body>
    </html>
  );
}

import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

  // High-resolution PNG for print use (1000×1000px, quiet zone, dark gold on black)
  const buffer = await QRCode.toBuffer(baseUrl, {
    type: 'png',
    width: 1000,
    margin: 4,
    color: {
      dark: '#0D0C0B',
      light: '#FFFFFF',
    },
    errorCorrectionLevel: 'H', // highest — survives logos/damage on print
  });

  return new NextResponse(buffer.buffer as ArrayBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': 'attachment; filename="XBOSS-QR-Code.png"',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}

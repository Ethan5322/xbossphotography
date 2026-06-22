import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-playfair',
  display: 'swap',
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://xbossphotography.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'X-BOSS Photography Studio — Book Your Session',
    template: '%s · X-BOSS Photography Studio',
  },
  description:
    'Book a professional photography session with X-BOSS Photography Studio — premium wedding and event photography across South Africa. Confirm your booking in minutes.',
  applicationName: 'X-BOSS Photography Studio',
  keywords: [
    'X-BOSS Photography',
    'photographer South Africa',
    'wedding photographer',
    'event photography',
    'book a photographer',
    'photography studio',
  ],
  authors: [{ name: 'X-BOSS Photography Studio' }],
  creator: 'X-BOSS Photography Studio',
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: baseUrl,
    siteName: 'X-BOSS Photography Studio',
    title: 'X-BOSS Photography Studio — Book Your Session',
    description:
      'Premium wedding and event photography across South Africa. Book your session in minutes.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'X-BOSS Photography Studio — Book Your Session',
    description: 'Premium wedding and event photography across South Africa.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A0A0A',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full ${inter.variable} ${playfair.variable}`}>
      <body className="h-full antialiased font-sans">{children}</body>
    </html>
  );
}

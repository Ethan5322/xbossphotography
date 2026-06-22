# X-BOSS Photography Studio — Booking System

A premium, dark-luxury booking application for X-BOSS Photography Studio: an AI-style booking assistant for clients, a secure admin dashboard for the studio, and automatic branded PDF confirmations.

Built by **MuleSoo Digital Solutions**.

---

## ✨ Features

- **Booking assistant** — guided, conversational booking flow (date/time pickers, live review & edit, terms acceptance) with instant client-side responses.
- **Admin dashboard** — view today / upcoming / history bookings, verify codes, and create manual bookings. Protected by a JWT session.
- **Branded PDF confirmation** — a two-page, signable "Dark Luxury" PDF with the studio QR code, generated on demand for both client and admin.
- **Company QR code** — a print-ready QR page (`/qr`) that links straight to the booking assistant.
- **WhatsApp notifications** — new bookings notify the studio via CallMeBot.
- **Production polish** — dynamic favicon / Open Graph image, branded 404 & error pages, SEO metadata, sitemap, robots, PWA manifest, security headers, and rate limiting.

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (Postgres) |
| Auth | `jose` JWT session cookie |
| PDF | `@react-pdf/renderer` |
| QR | `qrcode` |
| Notifications | CallMeBot (WhatsApp) |
| Hosting | Vercel |

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 🔑 Environment Variables

Create `.env.local` (and set the same in Vercel → Project → Settings → Environment Variables):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>   # server-only, keep secret

# Admin panel
ADMIN_PASSWORD=<strong password>
ADMIN_JWT_SECRET=<random 32+ char secret>

# WhatsApp notifications (CallMeBot)
CALLMEBOT_PHONE=<number, e.g. 27759440377>
CALLMEBOT_APIKEY=<callmebot api key>

# Public base URL (used for QR codes, OG tags, sitemap)
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

Missing critical variables are reported at server startup (see `instrumentation.ts`).

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint the project |

## 📁 Structure

```
app/
  page.tsx              # Booking assistant (public)
  admin/                # Admin login + dashboard (protected)
  api/                  # Bookings, chat, PDF, QR, admin auth
  icon / opengraph-image / manifest / robots / sitemap
components/
  chatbot/              # Chat UI
  admin/                # Dashboard UI
  pdf/                  # PDF document
lib/                    # Packages, terms, auth, validation, rate-limit, chat script
proxy.ts                # Route protection for /admin/*
instrumentation.ts      # Env-var validation on boot
```

## 🔐 Admin

Visit `/admin` and sign in with `ADMIN_PASSWORD`. Sessions last 8 hours. Login is rate-limited (5 attempts / 15 min) with a timing-safe password check.

## 🛡️ Notes

- The booking API is rate-limited and validated server-side.
- Rate limiting is in-memory (per serverless instance). For strict global limits, swap to Upstash Redis.
- Never commit `.env.local`.

---

© X-BOSS Photography Studio. Built by MuleSoo Digital Solutions.

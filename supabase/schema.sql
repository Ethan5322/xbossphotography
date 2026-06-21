-- ============================================================
-- X-BOSS Photography Studio — Supabase Schema
-- Safe to run inside an EXISTING Supabase project (tsedi-bookings)
-- Table: photographer_bookings (prefixed to avoid clashing with
--        any existing "bookings" table in this project)
-- ============================================================

-- Drop and recreate (safe to re-run)
DROP TABLE IF EXISTS photographer_bookings;

CREATE TABLE photographer_bookings (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name         TEXT        NOT NULL,
  phone             TEXT        NOT NULL,
  email             TEXT        NOT NULL,
  country           TEXT        NOT NULL,
  province          TEXT        NOT NULL,
  area              TEXT        NOT NULL,
  event_type        TEXT        NOT NULL,
  event_date        DATE        NOT NULL,
  event_time        TIME        NOT NULL,
  package           TEXT        NOT NULL
                    CHECK (package IN ('standard', 'medium', 'premium', 'super_premium')),
  terms_accepted    BOOLEAN     NOT NULL DEFAULT FALSE,
  verification_code TEXT        NOT NULL UNIQUE,
  status            TEXT        NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  source            TEXT        NOT NULL DEFAULT 'chatbot'
                    CHECK (source IN ('chatbot', 'admin')),
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes (prefixed names so they don't clash) ──────────────
CREATE INDEX idx_photo_bookings_verification_code
  ON photographer_bookings (verification_code);

CREATE INDEX idx_photo_bookings_event_date
  ON photographer_bookings (event_date);

CREATE INDEX idx_photo_bookings_created_at
  ON photographer_bookings (created_at DESC);

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE photographer_bookings ENABLE ROW LEVEL SECURITY;

-- The service role key used by your Next.js API routes bypasses
-- RLS automatically, but these policies make intent explicit.

CREATE POLICY "photo_allow_insert"
  ON photographer_bookings FOR INSERT
  TO service_role
  WITH CHECK (TRUE);

CREATE POLICY "photo_allow_select"
  ON photographer_bookings FOR SELECT
  TO service_role
  USING (TRUE);

CREATE POLICY "photo_allow_update"
  ON photographer_bookings FOR UPDATE
  TO service_role
  USING (TRUE);

import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';
import type { Booking } from '@/types/booking';
import { getPackageById } from '@/lib/packages';
import { format } from 'date-fns';

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  black:      '#0D0C0B',
  charcoal:   '#141210',
  white:      '#FFFFFF',
  pageBg:     '#F9F7F4',   // warm stationery off-white
  lightBg:    '#F0EDE8',   // slightly darker off-white for terms
  gold:       '#C9A84C',
  bodyText:   '#1C1A17',   // very dark warm — primary text
  subText:    '#6A6458',   // secondary/muted text
  labelText:  '#A09888',   // field labels
  cardBorder: '#DDD8CE',   // warm light border
};

const H = 48; // horizontal page padding

// ── Styles ────────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  page: {
    backgroundColor: C.pageBg,
    fontFamily: 'Helvetica',
    paddingBottom: 78,   // space for absolute footer
  },

  // ── Header (black) ──────────────────────────────────────────────────────────
  header: {
    backgroundColor: C.black,
    paddingHorizontal: H,
    paddingTop: 28,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  studioName: {
    color: C.gold,
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  studioTagline: {
    color: '#525048',
    fontSize: 7.5,
    marginTop: 4,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  headerBadge: {
    borderWidth: 1,
    borderColor: '#C9A84C40',
    paddingHorizontal: 9,
    paddingVertical: 4,
    alignSelf: 'flex-end',
    marginBottom: 2,
  },
  headerBadgeText: {
    color: C.gold,
    fontSize: 6.5,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontFamily: 'Helvetica-Bold',
  },
  headerRule: {
    height: 0.75,
    backgroundColor: C.gold,
    marginTop: 18,
    opacity: 0.22,
  },
  headerDocTitle: {
    color: C.white,
    fontSize: 9.5,
    letterSpacing: 4.5,
    textTransform: 'uppercase',
    marginTop: 14,
    fontFamily: 'Helvetica-Bold',
    opacity: 0.88,
  },

  // ── Body ────────────────────────────────────────────────────────────────────
  body: {
    paddingHorizontal: H,
    paddingTop: 28,
  },

  // ── Section label ────────────────────────────────────────────────────────────
  sectionLabel: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: C.gold,
    marginBottom: 10,
    opacity: 0.9,
  },

  // ── Gold rule between sections ───────────────────────────────────────────────
  goldRule: {
    height: 0.5,
    backgroundColor: C.gold,
    opacity: 0.28,
  },

  // ── Two-column grid ──────────────────────────────────────────────────────────
  grid: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 22,
  },
  gridCol: {
    flex: 1,
  },

  // ── Info card (composite: gold accent bar + content) ─────────────────────────
  infoCard: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: C.cardBorder,
    borderRightColor: C.cardBorder,
    borderBottomColor: C.cardBorder,
    backgroundColor: C.white,
  },
  infoAccent: {
    width: 3,
    backgroundColor: C.gold,
    opacity: 0.85,
  },
  infoContent: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 13,
  },

  // ── Field rows ───────────────────────────────────────────────────────────────
  row: {
    flexDirection: 'row',
    marginBottom: 9,
    alignItems: 'flex-start',
  },
  rowLast: {
    flexDirection: 'row',
    marginBottom: 0,
    alignItems: 'flex-start',
  },
  label: {
    width: 65,
    fontSize: 7,
    color: C.labelText,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    paddingTop: 1.5,
    flexShrink: 0,
  },
  value: {
    flex: 1,
    fontSize: 9,
    color: C.bodyText,
    lineHeight: 1.6,
  },

  // ── Package card (dark charcoal) ─────────────────────────────────────────────
  packageCard: {
    backgroundColor: C.charcoal,
    padding: 18,
    marginBottom: 22,
  },
  pkgTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  pkgName: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: C.white,
    flex: 1,
    letterSpacing: 0.2,
  },
  pkgPrice: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: C.gold,
    marginLeft: 10,
  },
  pkgSub: {
    fontSize: 7.5,
    color: '#504C44',
    marginBottom: 14,
    letterSpacing: 0.2,
  },
  pkgRule: {
    height: 0.5,
    backgroundColor: C.gold,
    opacity: 0.15,
    marginBottom: 13,
  },
  pkgGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pkgItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '50%',
    marginBottom: 5,
    paddingRight: 6,
  },
  pkgBullet: {
    width: 10,
    fontSize: 8,
    color: C.gold,
    paddingTop: 1,
    opacity: 0.75,
  },
  pkgItemText: {
    flex: 1,
    fontSize: 7.5,
    color: '#787060',
    lineHeight: 1.55,
  },

  // ── Verification block ───────────────────────────────────────────────────────
  verificationBlock: {
    backgroundColor: C.black,
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  verLeft: {
    flex: 1,
    paddingRight: 20,
  },
  verLabel: {
    fontSize: 6.5,
    color: '#484440',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: 11,
  },
  verCode: {
    fontSize: 30,
    fontFamily: 'Helvetica-Bold',
    color: C.gold,
    letterSpacing: 4,
    marginBottom: 13,
  },
  verInstruction: {
    fontSize: 7.5,
    color: '#5A5448',
    lineHeight: 1.7,
    letterSpacing: 0.2,
  },
  verDivider: {
    width: 0.5,
    alignSelf: 'stretch',
    backgroundColor: '#282420',
    marginRight: 22,
  },
  qrWrapper: {
    alignItems: 'center',
  },
  qrImage: {
    width: 92,
    height: 92,
  },
  qrLabel: {
    fontSize: 6,
    color: '#484440',
    textAlign: 'center',
    marginTop: 7,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  // ── Terms note (composite: gold bar + content) ────────────────────────────────
  termsOuter: {
    flexDirection: 'row',
    backgroundColor: C.lightBg,
  },
  termsAccent: {
    width: 2.5,
    backgroundColor: C.gold,
    opacity: 0.7,
  },
  termsContent: {
    flex: 1,
    paddingVertical: 11,
    paddingHorizontal: 12,
  },
  termsText: {
    fontSize: 7,
    color: '#7A7268',
    lineHeight: 1.8,
  },

  // ── Footer ───────────────────────────────────────────────────────────────────
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: C.black,
    paddingHorizontal: H,
    paddingTop: 12,
    paddingBottom: 14,
  },
  footerRule: {
    height: 0.5,
    backgroundColor: C.gold,
    opacity: 0.18,
    marginBottom: 10,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  footerLeft: {
    flex: 1,
  },
  footerContact: {
    fontSize: 7,
    color: '#484440',
    letterSpacing: 0.3,
    marginBottom: 3,
  },
  footerClosing: {
    fontSize: 6.5,
    color: '#383430',
    letterSpacing: 0.2,
  },
  footerRight: {
    alignItems: 'flex-end',
  },
  footerBrand: {
    fontSize: 7,
    color: C.gold,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  footerRef: {
    fontSize: 6.5,
    color: '#383430',
    letterSpacing: 0.4,
  },
});

// ── Component ─────────────────────────────────────────────────────────────────
interface BookingDocumentProps {
  booking: Booking;
  qrDataUrl: string;
}

export function BookingDocument({ booking, qrDataUrl }: BookingDocumentProps) {
  const pkg       = getPackageById(booking.package);
  const eventDate = format(new Date(booking.event_date), 'dd MMMM yyyy');
  const bookedOn  = format(new Date(booking.created_at), 'dd MMMM yyyy');
  const plural    = (pkg?.photographers ?? 1) > 1 ? 's' : '';

  return (
    <Document
      title={`X-BOSS Booking — ${booking.verification_code}`}
      author="X-BOSS Photography Studio"
      subject="Booking Confirmation"
    >
      <Page size="A4" style={S.page}>

        {/* ══ HEADER ════════════════════════════════════════════════════ */}
        <View style={S.header}>
          <View style={S.headerRow}>
            <View>
              <Text style={S.studioName}>X-BOSS Photography Studio</Text>
              <Text style={S.studioTagline}>Professional Photography  ·  South Africa</Text>
            </View>
            <View style={S.headerBadge}>
              <Text style={S.headerBadgeText}>Confirmed</Text>
            </View>
          </View>
          <View style={S.headerRule} />
          <Text style={S.headerDocTitle}>Booking Confirmation</Text>
        </View>

        {/* ══ BODY ══════════════════════════════════════════════════════ */}
        <View style={S.body}>

          {/* ── CLIENT INFORMATION  +  EVENT DETAILS ── */}
          <View style={S.grid}>

            {/* Left column: Client */}
            <View style={S.gridCol}>
              <Text style={S.sectionLabel}>Client Information</Text>
              <View style={S.infoCard}>
                <View style={S.infoAccent} />
                <View style={S.infoContent}>
                  <View style={S.row}>
                    <Text style={S.label}>Name</Text>
                    <Text style={S.value}>{booking.full_name}</Text>
                  </View>
                  <View style={S.row}>
                    <Text style={S.label}>Phone</Text>
                    <Text style={S.value}>{booking.phone}</Text>
                  </View>
                  <View style={S.row}>
                    <Text style={S.label}>Email</Text>
                    <Text style={S.value}>{booking.email}</Text>
                  </View>
                  <View style={S.rowLast}>
                    <Text style={S.label}>Location</Text>
                    <Text style={S.value}>
                      {booking.area}{'\n'}{booking.province}{'\n'}{booking.country}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Right column: Event */}
            <View style={S.gridCol}>
              <Text style={S.sectionLabel}>Event Details</Text>
              <View style={S.infoCard}>
                <View style={S.infoAccent} />
                <View style={S.infoContent}>
                  <View style={S.row}>
                    <Text style={S.label}>Event</Text>
                    <Text style={S.value}>{booking.event_type}</Text>
                  </View>
                  <View style={S.row}>
                    <Text style={S.label}>Date</Text>
                    <Text style={S.value}>{eventDate}</Text>
                  </View>
                  <View style={S.row}>
                    <Text style={S.label}>Arrival</Text>
                    <Text style={S.value}>{booking.event_time}</Text>
                  </View>
                  <View style={S.rowLast}>
                    <Text style={S.label}>Booked On</Text>
                    <Text style={S.value}>{bookedOn}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* ── GOLD DIVIDER ── */}
          <View style={S.goldRule} />

          {/* ── SELECTED PACKAGE ── */}
          <View style={{ marginTop: 22 }}>
            <Text style={S.sectionLabel}>Selected Package</Text>
            <View style={S.packageCard}>
              <View style={S.pkgTopRow}>
                <Text style={S.pkgName}>{pkg?.name ?? booking.package} Package</Text>
                <Text style={S.pkgPrice}>{pkg?.priceFormatted ?? ''}</Text>
              </View>
              <Text style={S.pkgSub}>
                {pkg?.coverage ?? ''}  ·  {pkg?.photographers ?? 1} photographer{plural}  ·  {pkg?.editedImages ?? ''} edited images
              </Text>
              <View style={S.pkgRule} />
              <View style={S.pkgGrid}>
                {(pkg?.includes ?? []).map((item, i) => (
                  <View key={i} style={S.pkgItem}>
                    <Text style={S.pkgBullet}>›</Text>
                    <Text style={S.pkgItemText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* ── GOLD DIVIDER ── */}
          <View style={S.goldRule} />

          {/* ── BOOKING VERIFICATION ── */}
          <View style={{ marginTop: 22 }}>
            <Text style={S.sectionLabel}>Booking Verification</Text>
            <View style={S.verificationBlock}>

              {/* Left: code + instructions */}
              <View style={S.verLeft}>
                <Text style={S.verLabel}>Verification Code</Text>
                <Text style={S.verCode}>{booking.verification_code}</Text>
                <Text style={S.verInstruction}>
                  Present this code at your event check-in.{'\n'}
                  Scan the QR code to verify this booking online.{'\n'}
                  Please keep this document in a safe place.
                </Text>
              </View>

              {/* Vertical divider */}
              <View style={S.verDivider} />

              {/* Right: QR code */}
              <View style={S.qrWrapper}>
                <Image src={qrDataUrl} style={S.qrImage} />
                <Text style={S.qrLabel}>Scan to verify</Text>
              </View>

            </View>
          </View>

          {/* ── GOLD DIVIDER ── */}
          <View style={S.goldRule} />

          {/* ── TERMS NOTE ── */}
          <View style={{ marginTop: 22 }}>
            <View style={S.termsOuter}>
              <View style={S.termsAccent} />
              <View style={S.termsContent}>
                <Text style={S.termsText}>
                  By proceeding with this booking you confirmed your acceptance of the X-BOSS Photography Studio Terms and Conditions on {bookedOn}, including the cancellation and rescheduling policy, copyright and image licensing terms, POPIA data protection compliance, and all clauses therein. A copy of the full Terms and Conditions is available on request.
                </Text>
              </View>
            </View>
          </View>

        </View>

        {/* ══ FOOTER (absolute, fixed) ═══════════════════════════════════ */}
        <View style={S.footer} fixed>
          <View style={S.footerRule} />
          <View style={S.footerRow}>
            <View style={S.footerLeft}>
              <Text style={S.footerContact}>
                Tel: +27 75 944 0377  ·  info@xbossphotography.co.za
              </Text>
              <Text style={S.footerClosing}>
                Thank you for choosing X-BOSS Photography Studio
              </Text>
            </View>
            <View style={S.footerRight}>
              <Text style={S.footerBrand}>X-BOSS Photography</Text>
              <Text style={S.footerRef}>
                Ref: {booking.verification_code}  ·  {bookedOn}
              </Text>
            </View>
          </View>
        </View>

      </Page>
    </Document>
  );
}

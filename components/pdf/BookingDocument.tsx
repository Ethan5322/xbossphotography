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
import { TERMS_AND_CONDITIONS } from '@/lib/terms';
import { format } from 'date-fns';

// ── Palette ────────────────────────────────────────────────────────────────────
const C = {
  black:      '#0D0C0B',
  charcoal:   '#141210',
  white:      '#FFFFFF',
  pageBg:     '#F9F7F4',
  lightBg:    '#F0EDE8',
  qrBg:       '#1A1816',
  gold:       '#C9A84C',
  bodyText:   '#1C1A17',
  subText:    '#6A6458',
  labelText:  '#A09888',
  cardBorder: '#DDD8CE',
};

const H = 48; // horizontal page padding

// ── Shared styles ──────────────────────────────────────────────────────────────
const shared = StyleSheet.create({
  page: {
    backgroundColor: C.pageBg,
    fontFamily: 'Helvetica',
    paddingBottom: 70, // reserves space so content never overlaps the fixed footer
  },
  // Page 1 header — full size
  header: {
    backgroundColor: C.black,
    paddingHorizontal: H,
    paddingTop: 22,
    paddingBottom: 16,
  },
  // Page 2 header — compact (saves ~45 pt of vertical space)
  header2: {
    backgroundColor: C.black,
    paddingHorizontal: H,
    paddingTop: 11,
    paddingBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerLeft: {
    flex: 1,
    paddingRight: 16,
  },
  studioName: {
    color: C.gold,
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  studioName2: {
    color: C.gold,
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  studioTagline: {
    color: '#525048',
    fontSize: 7.5,
    marginTop: 4,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  studioTagline2: {
    color: '#525048',
    fontSize: 6.5,
    marginTop: 3,
    letterSpacing: 1.4,
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
  // Single QR in the top-right corner of page 1
  headerQRWrap: {
    flexShrink: 0,
    alignItems: 'center',
  },
  headerQR: {
    width: 48,
    height: 48,
    padding: 4,
    backgroundColor: C.white,
  },
  headerQRCaption: {
    color: C.gold,
    fontSize: 5,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginTop: 4,
    fontFamily: 'Helvetica-Bold',
  },
  headerRule: {
    height: 0.75,
    backgroundColor: C.gold,
    marginTop: 14,
    opacity: 0.22,
  },
  headerRule2: {
    height: 0.75,
    backgroundColor: C.gold,
    marginTop: 10,
    opacity: 0.22,
  },
  headerDocTitle: {
    color: C.white,
    fontSize: 9.5,
    letterSpacing: 4.5,
    textTransform: 'uppercase',
    marginTop: 10,
    fontFamily: 'Helvetica-Bold',
    opacity: 0.88,
  },
  body: {
    paddingHorizontal: H,
    paddingTop: 18,
  },
  body2: {
    paddingHorizontal: H,
    paddingTop: 18,
  },
  sectionLabel: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: C.gold,
    marginBottom: 10,
    opacity: 0.9,
  },
  goldRule: {
    height: 0.5,
    backgroundColor: C.gold,
    opacity: 0.28,
  },
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

// ── Page 1 — confirmation styles ───────────────────────────────────────────────
const P1 = StyleSheet.create({
  // Consistent vertical rhythm between sections
  section: { marginTop: 16 },

  grid: { flexDirection: 'row', gap: 14 },
  gridCol: { flex: 1 },

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
  infoAccent: { width: 3, backgroundColor: C.gold, opacity: 0.85 },
  infoContent: { flex: 1, paddingVertical: 12, paddingHorizontal: 12 },

  row: { flexDirection: 'row', marginBottom: 7, alignItems: 'flex-start' },
  rowLast: { flexDirection: 'row', marginBottom: 0, alignItems: 'flex-start' },
  label: {
    width: 58,
    fontSize: 6.5,
    color: C.labelText,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    paddingTop: 1.5,
    flexShrink: 0,
  },
  value: { flex: 1, fontSize: 8.5, color: C.bodyText, lineHeight: 1.55 },

  packageCard: { backgroundColor: C.charcoal, padding: 14 },
  pkgTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  pkgName: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: C.white, flex: 1, letterSpacing: 0.2 },
  pkgPrice: { fontSize: 15, fontFamily: 'Helvetica-Bold', color: C.gold, marginLeft: 10 },
  pkgSub: { fontSize: 7.5, color: '#7A7060', marginBottom: 9, letterSpacing: 0.2, lineHeight: 1.4 },
  pkgRule: { height: 0.5, backgroundColor: C.gold, opacity: 0.15, marginBottom: 10 },
  pkgGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  pkgItem: { flexDirection: 'row', alignItems: 'flex-start', width: '50%', marginBottom: 3.5, paddingRight: 6 },
  pkgBullet: { width: 9, fontSize: 7.5, color: C.gold, paddingTop: 0.5, opacity: 0.75 },
  pkgItemText: { flex: 1, fontSize: 7.5, color: '#9A9080', lineHeight: 1.45 },

  verRow: { flexDirection: 'row', gap: 14, alignItems: 'stretch' },
  verCard: { flex: 1, backgroundColor: C.black, paddingVertical: 14, paddingHorizontal: 16, justifyContent: 'center' },
  verLabel: { fontSize: 6.5, color: '#807868', letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 6 },
  verCode: { fontSize: 24, fontFamily: 'Helvetica-Bold', color: C.gold, letterSpacing: 3, marginBottom: 8 },
  verInstruction: { fontSize: 7.5, color: '#8A8270', lineHeight: 1.6, letterSpacing: 0.2 },

  // ── Acceptance & signature ──
  signLead: { fontSize: 7.5, color: C.subText, lineHeight: 1.6, marginBottom: 16 },
  signRow: { flexDirection: 'row', gap: 32 },
  signRowSpacer: { marginTop: 18 },
  signCol: { flex: 1 },
  signLine: { borderBottomWidth: 0.75, borderBottomColor: '#A8A294', height: 24 },
  signPrinted: { fontSize: 8.5, color: C.bodyText, marginBottom: 2, paddingHorizontal: 2 },
  signMeta: { fontSize: 6.5, color: C.labelText, letterSpacing: 1, textTransform: 'uppercase', marginTop: 5, fontFamily: 'Helvetica-Bold' },
});

// ── Page 2 — T&C styles (two-column layout to fit on one page) ─────────────────
const P2 = StyleSheet.create({
  tcTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: C.gold,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  tcSubtitle: {
    fontSize: 7.5,
    color: C.subText,
    letterSpacing: 0.4,
    marginBottom: 7,
  },
  tcRule: {
    height: 0.5,
    backgroundColor: C.gold,
    opacity: 0.22,
    marginBottom: 7,
  },
  tcIntro: {
    fontSize: 7,
    color: C.subText,
    lineHeight: 1.6,
    fontFamily: 'Helvetica-Oblique',
    marginBottom: 7,
  },
  // Two equal columns
  tcCols: {
    flexDirection: 'row',
    gap: 13,
  },
  tcCol: { flex: 1 },

  // Each clause
  tcClause: { marginTop: 6 },
  tcHeading: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: C.gold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  tcBody: {
    fontSize: 6.5,
    color: '#4A4640',
    lineHeight: 1.5,
  },
  tcBulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 2.5,
    paddingLeft: 4,
  },
  tcBulletMark: { width: 9, fontSize: 6.5, color: C.gold, paddingTop: 0.5, opacity: 0.8 },
  tcBulletText: { flex: 1, fontSize: 6.5, color: '#4A4640', lineHeight: 1.5 },

  tcClosing: {
    fontSize: 6.5,
    color: '#5A5448',
    lineHeight: 1.55,
    fontFamily: 'Helvetica-Oblique',
    marginTop: 10,
  },
});

// ── T&C parser — returns structured clause objects ─────────────────────────────
interface Clause { heading: string; body: string; bullets: string[] }
interface ParsedTerms { intro: string; clauses: Clause[]; closing: string }

function parseClauses(): ParsedTerms {
  const lines = TERMS_AND_CONDITIONS.split('\n');
  let intro = '';
  let closing = '';
  const clauses: Clause[] = [];
  let current: Clause | null = null;
  let seenFirst = false;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    if (/^\d{1,2}\.\s+[A-Z]/.test(line)) {
      seenFirst = true;
      if (current) clauses.push(current);
      current = { heading: line, body: '', bullets: [] };
    } else if (!seenFirst) {
      // Pre-clause lines: skip the title and subtitle, capture the intro paragraph
      if (!line.startsWith('BOOKING TERMS') && !line.startsWith('X-BOSS Photography Studio —')) {
        intro = line;
      }
    } else if (line.startsWith('By accepting')) {
      if (current) { clauses.push(current); current = null; }
      closing = line;
    } else if (current && line.startsWith('•')) {
      current.bullets.push(line.replace(/^•\s*/, ''));
    } else if (current) {
      current.body = current.body ? `${current.body} ${line}` : line;
    }
  }
  if (current) clauses.push(current);

  return { intro, clauses, closing };
}

// ── Component ──────────────────────────────────────────────────────────────────
interface BookingDocumentProps { booking: Booking; qrDataUrl: string }

export function BookingDocument({ booking, qrDataUrl }: BookingDocumentProps) {
  const pkg       = getPackageById(booking.package);
  const eventDate = format(new Date(booking.event_date), 'dd MMMM yyyy');
  const bookedOn  = format(new Date(booking.created_at), 'dd MMMM yyyy');
  const plural    = (pkg?.photographers ?? 1) > 1 ? 's' : '';
  const { intro, clauses, closing } = parseClauses();

  // Render a single T&C clause (used in both columns)
  const renderClause = (clause: Clause, key: number, first: boolean) => (
    <View key={key} style={first ? {} : P2.tcClause}>
      <Text style={P2.tcHeading}>{clause.heading}</Text>
      {clause.body ? <Text style={P2.tcBody}>{clause.body}</Text> : null}
      {clause.bullets.map((b, j) => (
        <View key={j} style={P2.tcBulletRow}>
          <Text style={P2.tcBulletMark}>›</Text>
          <Text style={P2.tcBulletText}>{b}</Text>
        </View>
      ))}
    </View>
  );

  // ── Shared footer ─────────────────────────────────────────────────────────
  const renderFooter = () => (
    <View style={shared.footer} fixed>
      <View style={shared.footerRule} />
      <View style={shared.footerRow}>
        <View>
          <Text style={shared.footerContact}>Tel: +27 75 944 0377  ·  info@xbossphotography.co.za</Text>
          <Text style={shared.footerClosing}>Thank you for choosing X-BOSS Photography Studio</Text>
        </View>
        <View>
          <Text style={[shared.footerBrand, { textAlign: 'right' }]}>X-BOSS Photography</Text>
          <Text style={[shared.footerRef, { textAlign: 'right' }]}>
            Ref: {booking.verification_code}  ·  {bookedOn}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <Document
      title={`X-BOSS Booking — ${booking.verification_code}`}
      author="X-BOSS Photography Studio"
      subject="Booking Confirmation"
    >

      {/* ════════════════════════════════════════════════════════════════
          PAGE 1 — BOOKING CONFIRMATION
      ════════════════════════════════════════════════════════════════ */}
      <Page size="A4" style={shared.page}>

        {/* Header — single QR code in the top-right corner */}
        <View style={shared.header}>
          <View style={[shared.headerRow, { alignItems: 'flex-start' }]}>
            <View style={shared.headerLeft}>
              <Text style={shared.studioName}>X-BOSS Photography Studio</Text>
              <Text style={shared.studioTagline}>Professional Photography  ·  South Africa</Text>
            </View>
            <View style={shared.headerQRWrap}>
              <Image src={qrDataUrl} style={shared.headerQR} />
              <Text style={shared.headerQRCaption}>Scan to Book</Text>
            </View>
          </View>
          <View style={shared.headerRule} />
          <Text style={shared.headerDocTitle}>Booking Confirmation</Text>
        </View>

        <View style={shared.body}>

          {/* ── Client Info + Event Details ── */}
          <View style={[P1.grid]}>

            <View style={P1.gridCol}>
              <Text style={shared.sectionLabel}>Client Information</Text>
              <View style={P1.infoCard}>
                <View style={P1.infoAccent} />
                <View style={P1.infoContent}>
                  <View style={P1.row}>
                    <Text style={P1.label}>Name</Text>
                    <Text style={P1.value}>{booking.full_name}</Text>
                  </View>
                  <View style={P1.row}>
                    <Text style={P1.label}>Phone</Text>
                    <Text style={P1.value}>{booking.phone}</Text>
                  </View>
                  <View style={P1.row}>
                    <Text style={P1.label}>Email</Text>
                    <Text style={P1.value}>{booking.email}</Text>
                  </View>
                  <View style={P1.rowLast}>
                    <Text style={P1.label}>Location</Text>
                    <Text style={P1.value}>{booking.area}, {booking.province}{'\n'}{booking.country}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={P1.gridCol}>
              <Text style={shared.sectionLabel}>Event Details</Text>
              <View style={P1.infoCard}>
                <View style={P1.infoAccent} />
                <View style={P1.infoContent}>
                  <View style={P1.row}>
                    <Text style={P1.label}>Event</Text>
                    <Text style={P1.value}>{booking.event_type}</Text>
                  </View>
                  <View style={P1.row}>
                    <Text style={P1.label}>Date</Text>
                    <Text style={P1.value}>{eventDate}</Text>
                  </View>
                  <View style={P1.row}>
                    <Text style={P1.label}>Arrival</Text>
                    <Text style={P1.value}>{booking.event_time}</Text>
                  </View>
                  <View style={P1.rowLast}>
                    <Text style={P1.label}>Booked On</Text>
                    <Text style={P1.value}>{bookedOn}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* ── Selected Package ── */}
          <View style={P1.section}>
            <Text style={shared.sectionLabel}>Selected Package</Text>
            <View style={P1.packageCard}>
              <View style={P1.pkgTopRow}>
                <Text style={P1.pkgName}>{pkg?.name ?? booking.package} Package</Text>
                <Text style={P1.pkgPrice}>{pkg?.priceFormatted ?? ''}</Text>
              </View>
              <Text style={P1.pkgSub}>
                {pkg?.coverage ?? ''}  ·  {pkg?.photographers ?? 1} photographer{plural}  ·  {pkg?.editedImages ?? ''} edited images
              </Text>
              <View style={P1.pkgRule} />
              <View style={P1.pkgGrid}>
                {(pkg?.includes ?? []).map((item, i) => (
                  <View key={i} style={P1.pkgItem}>
                    <Text style={P1.pkgBullet}>›</Text>
                    <Text style={P1.pkgItemText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* ── Booking Verification + Acceptance ── */}
          <View style={P1.section}>
            <View style={P1.verRow}>
              <View style={P1.verCard}>
                <Text style={P1.verLabel}>Your Unique Code</Text>
                <Text style={P1.verCode}>{booking.verification_code}</Text>
                <Text style={P1.verInstruction}>
                  Please present this code at your event check-in. Keep this document safe.
                </Text>
              </View>
            </View>
          </View>

          {/* ── Acceptance & Signature ── */}
          <View style={P1.section}>
            <Text style={shared.sectionLabel}>Acceptance &amp; Signature</Text>
            <Text style={P1.signLead}>
              The client confirms acceptance of the X-BOSS Photography Studio Terms &amp; Conditions (printed on page 2),
              accepted electronically on {bookedOn}. Please sign below to confirm this booking agreement.
            </Text>

            <View style={P1.signRow}>
              <View style={P1.signCol}>
                <Text style={P1.signPrinted}>{booking.full_name}</Text>
                <View style={P1.signLine} />
                <Text style={P1.signMeta}>Client Signature</Text>
              </View>
              <View style={P1.signCol}>
                <Text style={P1.signPrinted}> </Text>
                <View style={P1.signLine} />
                <Text style={P1.signMeta}>Date</Text>
              </View>
              <View style={P1.signCol}>
                <Text style={P1.signPrinted}> </Text>
                <View style={P1.signLine} />
                <Text style={P1.signMeta}>For X-BOSS Studio</Text>
              </View>
            </View>
          </View>

        </View>

        {renderFooter()}
      </Page>

      {/* ════════════════════════════════════════════════════════════════
          PAGE 2 — TERMS & CONDITIONS (two-column layout, one page)
      ════════════════════════════════════════════════════════════════ */}
      <Page size="A4" style={shared.page}>

        {/* Compact header — saves ~45 pt vs page 1 header */}
        <View style={shared.header2}>
          <View style={shared.headerRow}>
            <View>
              <Text style={shared.studioName2}>X-BOSS Photography Studio</Text>
              <Text style={shared.studioTagline2}>Professional Photography  ·  South Africa</Text>
            </View>
            <View style={shared.headerBadge}>
              <Text style={shared.headerBadgeText}>Page 2 of 2</Text>
            </View>
          </View>
          <View style={shared.headerRule2} />
        </View>

        <View style={shared.body2}>

          {/* T&C title block */}
          <Text style={P2.tcTitle}>Booking Terms & Conditions</Text>
          <Text style={P2.tcSubtitle}>X-BOSS Photography Studio  ·  Professional Photography Services</Text>
          <View style={P2.tcRule} />
          <Text style={P2.tcIntro}>{intro}</Text>
          <View style={P2.tcRule} />

          {/* Two-column clause layout: clauses 1-7 left, 8-13 right */}
          <View style={P2.tcCols}>

            {/* LEFT column — clauses 1–7 */}
            <View style={P2.tcCol}>
              {clauses.slice(0, 7).map((c, i) => renderClause(c, i, i === 0))}
            </View>

            {/* RIGHT column — clauses 8–13 + closing */}
            <View style={P2.tcCol}>
              {clauses.slice(7).map((c, i) => renderClause(c, i + 7, i === 0))}
              <Text style={P2.tcClosing}>{closing}</Text>
            </View>

          </View>

        </View>

        {renderFooter()}
      </Page>

    </Document>
  );
}

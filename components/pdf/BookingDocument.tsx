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

/*
 * X-BOSS Photography Studio — "Dark Luxury" booking confirmation.
 * Built-in PDF fonts are used as premium substitutes for reliability:
 *   Times  → Playfair Display (editorial serif)
 *   Helvetica → Inter (clean sans)
 *   Courier → premium monospace (verification code)
 */

// ── Palette ────────────────────────────────────────────────────────────────────
const C = {
  bg:        '#0A0A0A', // pure deep black
  hero:      '#1A1A1A', // lighter charcoal (package box)
  verifyBg:  '#1C1C1C', // deep charcoal (verification box)
  gold:      '#C8922A',
  goldSoft:  '#8A6B25', // dimmer gold for fine rules
  warmWhite: '#F5F0E8',
  muted:     '#97928A', // ~60% warm white for labels
  mutedGold: '#A98C52',
};

// ── Shared styles ──────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    backgroundColor: C.bg,
    fontFamily: 'Helvetica',
    position: 'relative',
  },

  // Decorative stitched frame (repeats on every page)
  frameOuter: {
    position: 'absolute',
    top: 40, left: 40, right: 40, bottom: 40,
    borderWidth: 1,
    borderColor: C.gold,
    borderStyle: 'dashed',
  },
  frameInner: {
    position: 'absolute',
    top: 45, left: 45, right: 45, bottom: 45,
    borderWidth: 0.5,
    borderColor: C.goldSoft,
    borderStyle: 'solid',
  },
  corner: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: C.gold,
    transform: 'rotate(45deg)',
  },

  // Content sits inside the frame
  content: {
    paddingTop: 46,
    paddingHorizontal: 56,
    paddingBottom: 70,
  },
  content2: {
    paddingTop: 40,
    paddingHorizontal: 56,
    paddingBottom: 70,
  },

  // Header
  studioName: {
    fontFamily: 'Times-Bold',
    fontSize: 23,
    color: C.gold,
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  studioNameSm: {
    fontFamily: 'Times-Bold',
    fontSize: 16,
    color: C.gold,
    textAlign: 'center',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  headerLine: {
    height: 1,
    backgroundColor: C.gold,
    marginTop: 9,
    marginBottom: 9,
  },
  docTitle: {
    fontFamily: 'Helvetica',
    fontSize: 8.5,
    color: C.warmWhite,
    textAlign: 'center',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },

  // Ornamental divider  ———— ◆ ————
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 9 },
  dividerLine: { flex: 1, height: 0.75, backgroundColor: C.goldSoft },
  dividerDot: { width: 5, height: 5, backgroundColor: C.gold, transform: 'rotate(45deg)', marginHorizontal: 7 },

  // Section header (centered, editorial serif)
  sectionHeader: {
    fontFamily: 'Times-Bold',
    fontSize: 11,
    color: C.gold,
    textAlign: 'center',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 9,
  },
  colHeader: {
    fontFamily: 'Times-Bold',
    fontSize: 9.5,
    color: C.gold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 9,
  },

  // Two-column information grid
  grid: { flexDirection: 'row', gap: 28 },
  col: { flex: 1 },
  row: { flexDirection: 'row', marginBottom: 8, alignItems: 'flex-start' },
  rowLast: { flexDirection: 'row', marginBottom: 0, alignItems: 'flex-start' },
  label: {
    width: 56,
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: C.muted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    paddingTop: 1.5,
    flexShrink: 0,
  },
  value: { flex: 1, fontSize: 9.5, color: C.warmWhite, lineHeight: 1.5 },

  // Hero package box
  heroBox: { backgroundColor: C.hero, padding: 16 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  heroName: { fontFamily: 'Times-Bold', fontSize: 17, color: C.gold, flex: 1, letterSpacing: 0.5 },
  heroPrice: { fontFamily: 'Times-Bold', fontSize: 17, color: C.gold, marginLeft: 12 },
  heroSub: { fontSize: 8, color: C.muted, marginTop: 5, marginBottom: 11, letterSpacing: 0.3, lineHeight: 1.4 },
  heroRule: { height: 0.5, backgroundColor: C.goldSoft, marginBottom: 11 },
  heroGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  heroItem: { flexDirection: 'row', alignItems: 'flex-start', width: '50%', marginBottom: 4, paddingRight: 8 },
  heroBullet: { width: 9, fontSize: 7.5, color: C.gold, paddingTop: 0.5 },
  heroItemText: { flex: 1, fontSize: 7.5, color: C.warmWhite, lineHeight: 1.45, opacity: 0.85 },

  // Verification box (dashed stitch border)
  verBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.verifyBg,
    borderWidth: 1,
    borderColor: C.gold,
    borderStyle: 'dashed',
    padding: 16,
  },
  verMain: { flex: 1, alignItems: 'center' },
  verLabel: { fontSize: 8, color: C.gold, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 8, fontFamily: 'Helvetica-Bold' },
  verCode: { fontFamily: 'Courier-Bold', fontSize: 26, color: C.warmWhite, letterSpacing: 2, marginBottom: 9, textAlign: 'center' },
  verInstruction: { fontSize: 7.5, color: C.mutedGold, textAlign: 'center', lineHeight: 1.5, letterSpacing: 0.2 },
  verQrWrap: { alignItems: 'center', marginLeft: 18, paddingLeft: 18, borderLeftWidth: 0.5, borderLeftColor: C.goldSoft },
  verQr: { width: 56, height: 56, padding: 4, backgroundColor: C.warmWhite },
  verQrCaption: { fontSize: 5.5, color: C.gold, letterSpacing: 1, textTransform: 'uppercase', marginTop: 5, fontFamily: 'Helvetica-Bold' },

  // Acceptance & signature
  signLead: { fontSize: 8, color: C.muted, lineHeight: 1.6, marginBottom: 10, textAlign: 'center' },
  signRow: { flexDirection: 'row', gap: 26 },
  signCol: { flex: 1 },
  signPrinted: { fontSize: 8.5, color: C.warmWhite, marginBottom: 3, paddingHorizontal: 2 },
  signLine: { borderBottomWidth: 0.75, borderBottomColor: C.gold, height: 22 },
  signMeta: { fontSize: 6.5, color: C.muted, letterSpacing: 1, textTransform: 'uppercase', marginTop: 5, fontFamily: 'Helvetica-Bold' },

  // Footer (fixed, inside frame)
  footer: {
    position: 'absolute',
    left: 56, right: 56, bottom: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: C.goldSoft,
  },
  footerText: { fontSize: 6.5, color: C.muted, letterSpacing: 0.3, lineHeight: 1.5 },
  footerBrand: { fontSize: 6.5, color: C.gold, fontFamily: 'Helvetica-Bold', letterSpacing: 1, textTransform: 'uppercase' },

  // Page 2 — Terms
  tcIntro: { fontSize: 7.5, color: C.muted, lineHeight: 1.6, fontFamily: 'Helvetica-Oblique', textAlign: 'center', marginBottom: 4 },
  tcCols: { flexDirection: 'row', gap: 24 },
  tcCol: { flex: 1 },
  tcClause: { marginTop: 8 },
  tcHeading: { fontSize: 7.5, fontFamily: 'Times-Bold', color: C.gold, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 3 },
  tcBody: { fontSize: 6.5, color: C.warmWhite, lineHeight: 1.55, opacity: 0.82 },
  tcBulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 2.5, paddingLeft: 4 },
  tcBulletMark: { width: 9, fontSize: 6.5, color: C.gold, paddingTop: 0.5 },
  tcBulletText: { flex: 1, fontSize: 6.5, color: C.warmWhite, lineHeight: 1.55, opacity: 0.82 },
  tcClosing: { fontSize: 6.5, color: C.mutedGold, lineHeight: 1.6, fontFamily: 'Helvetica-Oblique', marginTop: 10 },
});

// ── T&C parser ─────────────────────────────────────────────────────────────────
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

// ── Reusable pieces ──────────────────────────────────────────────────────────
const Frame = () => (
  <>
    <View style={s.frameOuter} fixed />
    <View style={s.frameInner} fixed />
    <View style={[s.corner, { top: 37, left: 37 }]} fixed />
    <View style={[s.corner, { top: 37, right: 37 }]} fixed />
    <View style={[s.corner, { bottom: 37, left: 37 }]} fixed />
    <View style={[s.corner, { bottom: 37, right: 37 }]} fixed />
  </>
);

const Divider = () => (
  <View style={s.divider}>
    <View style={s.dividerLine} />
    <View style={s.dividerDot} />
    <View style={s.dividerLine} />
  </View>
);

// ── Component ──────────────────────────────────────────────────────────────────
interface BookingDocumentProps { booking: Booking; qrDataUrl: string }

export function BookingDocument({ booking, qrDataUrl }: BookingDocumentProps) {
  const pkg       = getPackageById(booking.package);
  const eventDate = format(new Date(booking.event_date), 'dd MMMM yyyy');
  const bookedOn  = format(new Date(booking.created_at), 'dd MMMM yyyy');
  const plural    = (pkg?.photographers ?? 1) > 1 ? 's' : '';
  const { intro, clauses, closing } = parseClauses();

  const renderClause = (clause: Clause, key: number, first: boolean) => (
    <View key={key} style={first ? {} : s.tcClause}>
      <Text style={s.tcHeading}>{clause.heading}</Text>
      {clause.body ? <Text style={s.tcBody}>{clause.body}</Text> : null}
      {clause.bullets.map((b, j) => (
        <View key={j} style={s.tcBulletRow}>
          <Text style={s.tcBulletMark}>›</Text>
          <Text style={s.tcBulletText}>{b}</Text>
        </View>
      ))}
    </View>
  );

  const Footer = () => (
    <View style={s.footer} fixed>
      <View>
        <Text style={s.footerText}>Tel: +27 75 944 0377  ·  info@xbossphotography.co.za</Text>
        <Text style={s.footerText}>Thank you for choosing X-BOSS Photography Studio</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={s.footerBrand}>X-BOSS Photography</Text>
        <Text style={s.footerText}>Ref: {booking.verification_code}  ·  {bookedOn}</Text>
      </View>
    </View>
  );

  return (
    <Document
      title={`X-BOSS Booking — ${booking.verification_code}`}
      author="X-BOSS Photography Studio"
      subject="Booking Confirmation"
    >

      {/* ═══════════ PAGE 1 — BOOKING CONFIRMATION ═══════════ */}
      <Page size="A4" style={s.page}>
        <Frame />

        <View style={s.content}>

          {/* Header */}
          <Text style={s.studioName}>X-BOSS Photography Studio</Text>
          <View style={s.headerLine} />
          <Text style={s.docTitle}>Booking Confirmation</Text>

          <View style={{ marginTop: 16 }} />

          {/* Information grid */}
          <View style={s.grid}>
            <View style={s.col}>
              <Text style={s.colHeader}>Client Information</Text>
              <View style={s.row}><Text style={s.label}>Name</Text><Text style={s.value}>{booking.full_name}</Text></View>
              <View style={s.row}><Text style={s.label}>Phone</Text><Text style={s.value}>{booking.phone}</Text></View>
              <View style={s.row}><Text style={s.label}>Email</Text><Text style={s.value}>{booking.email}</Text></View>
              <View style={s.rowLast}><Text style={s.label}>Location</Text><Text style={s.value}>{booking.area}, {booking.province}{'\n'}{booking.country}</Text></View>
            </View>
            <View style={s.col}>
              <Text style={s.colHeader}>Event Details</Text>
              <View style={s.row}><Text style={s.label}>Event</Text><Text style={s.value}>{booking.event_type}</Text></View>
              <View style={s.row}><Text style={s.label}>Date</Text><Text style={s.value}>{eventDate}</Text></View>
              <View style={s.row}><Text style={s.label}>Arrival</Text><Text style={s.value}>{booking.event_time}</Text></View>
              <View style={s.rowLast}><Text style={s.label}>Booked On</Text><Text style={s.value}>{bookedOn}</Text></View>
            </View>
          </View>

          <Divider />

          {/* Hero package box */}
          <Text style={s.sectionHeader}>Selected Package</Text>
          <View style={s.heroBox}>
            <View style={s.heroTop}>
              <Text style={s.heroName}>{pkg?.name ?? booking.package} Package</Text>
              <Text style={s.heroPrice}>{pkg?.priceFormatted ?? ''}</Text>
            </View>
            <Text style={s.heroSub}>
              {pkg?.coverage ?? ''}  ·  {pkg?.photographers ?? 1} photographer{plural}  ·  {pkg?.editedImages ?? ''} edited images
            </Text>
            <View style={s.heroRule} />
            <View style={s.heroGrid}>
              {(pkg?.includes ?? []).map((item, i) => (
                <View key={i} style={s.heroItem}>
                  <Text style={s.heroBullet}>›</Text>
                  <Text style={s.heroItemText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          <Divider />

          {/* Verification box */}
          <Text style={s.sectionHeader}>Booking Verification</Text>
          <View style={s.verBox}>
            <View style={s.verMain}>
              <Text style={s.verLabel}>Verification Code</Text>
              <Text style={s.verCode}>{booking.verification_code}</Text>
              <Text style={s.verInstruction}>
                Present this code at your session for check-in verification. Please keep this document safe.
              </Text>
            </View>
            <View style={s.verQrWrap}>
              <Image src={qrDataUrl} style={s.verQr} />
              <Text style={s.verQrCaption}>Scan to Book</Text>
            </View>
          </View>

          <Divider />

          {/* Acceptance & signature */}
          <Text style={s.sectionHeader}>Acceptance &amp; Signature</Text>
          <Text style={s.signLead}>
            The client confirms acceptance of the X-BOSS Photography Studio Terms &amp; Conditions (printed on page 2),
            accepted electronically on {bookedOn}. Please sign below to confirm this booking agreement.
          </Text>
          <View style={s.signRow}>
            <View style={s.signCol}>
              <Text style={s.signPrinted}>{booking.full_name}</Text>
              <View style={s.signLine} />
              <Text style={s.signMeta}>Client Signature</Text>
            </View>
            <View style={s.signCol}>
              <Text style={s.signPrinted}> </Text>
              <View style={s.signLine} />
              <Text style={s.signMeta}>Date</Text>
            </View>
            <View style={s.signCol}>
              <Text style={s.signPrinted}> </Text>
              <View style={s.signLine} />
              <Text style={s.signMeta}>For X-BOSS Studio</Text>
            </View>
          </View>

        </View>

        <Footer />
      </Page>

      {/* ═══════════ PAGE 2 — TERMS & CONDITIONS ═══════════ */}
      <Page size="A4" style={s.page}>
        <Frame />

        <View style={s.content2}>

          {/* Header */}
          <Text style={s.studioNameSm}>X-BOSS Photography Studio</Text>
          <View style={s.headerLine} />
          <Text style={s.docTitle}>Terms &amp; Conditions</Text>

          <Divider />

          <Text style={s.tcIntro}>{intro}</Text>

          <Divider />

          <View style={s.tcCols}>
            <View style={s.tcCol}>
              {clauses.slice(0, 7).map((c, i) => renderClause(c, i, i === 0))}
            </View>
            <View style={s.tcCol}>
              {clauses.slice(7).map((c, i) => renderClause(c, i + 7, i === 0))}
              <Text style={s.tcClosing}>{closing}</Text>
            </View>
          </View>

        </View>

        <Footer />
      </Page>

    </Document>
  );
}

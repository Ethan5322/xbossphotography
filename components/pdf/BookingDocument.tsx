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
  black:     '#0D0C0B',
  charcoal:  '#141210',
  white:     '#FFFFFF',
  pageBg:    '#F9F7F4',
  lightBg:   '#F0EDE8',
  qrBg:      '#1A1816',
  gold:      '#C9A84C',
  bodyText:  '#1C1A17',
  subText:   '#6A6458',
  labelText: '#A09888',
  cardBorder:'#DDD8CE',
  mutedBg:   '#EDEAE4',
};

const H = 48; // horizontal page padding

// ── Shared styles ──────────────────────────────────────────────────────────────
const shared = StyleSheet.create({
  page: {
    backgroundColor: C.pageBg,
    fontFamily: 'Helvetica',
    paddingBottom: 76,
  },
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
  body: {
    paddingHorizontal: H,
    paddingTop: 26,
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
  grid: { flexDirection: 'row', gap: 14, marginBottom: 22 },
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
  infoContent: { flex: 1, paddingVertical: 14, paddingHorizontal: 13 },

  row: { flexDirection: 'row', marginBottom: 9, alignItems: 'flex-start' },
  rowLast: { flexDirection: 'row', marginBottom: 0, alignItems: 'flex-start' },
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
  value: { flex: 1, fontSize: 9, color: C.bodyText, lineHeight: 1.6 },

  // Package dark card
  packageCard: { backgroundColor: C.charcoal, padding: 18, marginBottom: 22 },
  pkgTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  pkgName: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: C.white, flex: 1, letterSpacing: 0.2 },
  pkgPrice: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: C.gold, marginLeft: 10 },
  pkgSub: { fontSize: 7.5, color: '#504C44', marginBottom: 14, letterSpacing: 0.2 },
  pkgRule: { height: 0.5, backgroundColor: C.gold, opacity: 0.15, marginBottom: 13 },
  pkgGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  pkgItem: { flexDirection: 'row', alignItems: 'flex-start', width: '50%', marginBottom: 5, paddingRight: 6 },
  pkgBullet: { width: 10, fontSize: 8, color: C.gold, paddingTop: 1, opacity: 0.75 },
  pkgItemText: { flex: 1, fontSize: 7.5, color: '#787060', lineHeight: 1.55 },

  // Verification + Company QR — side-by-side in one row
  verRow: { flexDirection: 'row', gap: 14, marginBottom: 22 },

  // Left: Verification code (dark card)
  verCard: { flex: 3, backgroundColor: C.black, padding: 20 },
  verLabel: { fontSize: 6.5, color: '#484440', letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 10 },
  verCode: { fontSize: 28, fontFamily: 'Helvetica-Bold', color: C.gold, letterSpacing: 3.5, marginBottom: 12 },
  verInstruction: { fontSize: 7.5, color: '#5A5448', lineHeight: 1.7, letterSpacing: 0.2 },

  // Right: Company QR (dark-warm card, branded)
  qrCard: { flex: 2, backgroundColor: C.qrBg, padding: 16, alignItems: 'center', justifyContent: 'center' },
  qrImage: { width: 90, height: 90, marginBottom: 10 },
  qrStudioName: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: C.gold, letterSpacing: 1.2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 3 },
  qrInstruction: { fontSize: 6.5, color: '#5A5448', textAlign: 'center', letterSpacing: 0.5, lineHeight: 1.5 },

  // Terms note
  termsOuter: { flexDirection: 'row', backgroundColor: C.lightBg },
  termsAccent: { width: 2.5, backgroundColor: C.gold, opacity: 0.7 },
  termsContent: { flex: 1, paddingVertical: 11, paddingHorizontal: 12 },
  termsText: { fontSize: 7, color: '#7A7268', lineHeight: 1.8 },
});

// ── Page 2 — T&C styles ────────────────────────────────────────────────────────
const P2 = StyleSheet.create({
  tcTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: C.gold,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  tcSubtitle: {
    fontSize: 8,
    color: C.subText,
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  tcIntro: {
    fontSize: 7.5,
    color: C.subText,
    lineHeight: 1.75,
    fontFamily: 'Helvetica-Oblique',
    marginBottom: 16,
  },
  tcClauseWrap: { marginBottom: 11 },
  tcClauseHeading: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: C.gold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  tcBody: {
    fontSize: 7,
    color: '#4A4640',
    lineHeight: 1.7,
  },
  tcBulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 3, paddingLeft: 4 },
  tcBulletMark: { width: 10, fontSize: 7, color: C.gold, paddingTop: 1, opacity: 0.8 },
  tcBulletText: { flex: 1, fontSize: 7, color: '#4A4640', lineHeight: 1.7 },
  tcClosing: {
    fontSize: 7,
    color: '#5A5448',
    lineHeight: 1.75,
    fontFamily: 'Helvetica-Oblique',
    marginTop: 14,
    marginBottom: 4,
  },
});

// ── Terms parser ───────────────────────────────────────────────────────────────
interface TermsLine { type: string; text: string }

function parseTerms(): TermsLine[] {
  const lines = TERMS_AND_CONDITIONS.split('\n');
  const result: TermsLine[] = [];
  let lineIndex = 0;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    lineIndex++;

    if (lineIndex === 1) {
      result.push({ type: 'title', text: line });
    } else if (lineIndex === 2) {
      result.push({ type: 'subtitle', text: line });
    } else if (/^\d{1,2}\.\s+[A-Z]/.test(line)) {
      result.push({ type: 'heading', text: line });
    } else if (line.startsWith('•')) {
      result.push({ type: 'bullet', text: line.replace(/^•\s*/, '') });
    } else if (lineIndex === 3) {
      result.push({ type: 'intro', text: line });
    } else {
      result.push({ type: 'body', text: line });
    }
  }
  return result;
}

// ── Component ──────────────────────────────────────────────────────────────────
interface BookingDocumentProps { booking: Booking; qrDataUrl: string }

export function BookingDocument({ booking, qrDataUrl }: BookingDocumentProps) {
  const pkg      = getPackageById(booking.package);
  const eventDate = format(new Date(booking.event_date), 'dd MMMM yyyy');
  const bookedOn  = format(new Date(booking.created_at), 'dd MMMM yyyy');
  const plural    = (pkg?.photographers ?? 1) > 1 ? 's' : '';
  const termsLines = parseTerms();

  // ── Shared header renderer ─────────────────────────────────────────────────
  const renderHeader = (docTitle: string, badgeText: string) => (
    <View style={shared.header}>
      <View style={shared.headerRow}>
        <View>
          <Text style={shared.studioName}>X-BOSS Photography Studio</Text>
          <Text style={shared.studioTagline}>Professional Photography  ·  South Africa</Text>
        </View>
        <View style={shared.headerBadge}>
          <Text style={shared.headerBadgeText}>{badgeText}</Text>
        </View>
      </View>
      <View style={shared.headerRule} />
      <Text style={shared.headerDocTitle}>{docTitle}</Text>
    </View>
  );

  // ── Shared footer renderer ─────────────────────────────────────────────────
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

        {renderHeader('Booking Confirmation', 'Confirmed')}

        <View style={shared.body}>

          {/* ── Client Info + Event Details ── */}
          <View style={P1.grid}>

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
                    <Text style={P1.value}>{booking.area}{'\n'}{booking.province}{'\n'}{booking.country}</Text>
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

          {/* ── Gold divider ── */}
          <View style={shared.goldRule} />

          {/* ── Selected Package ── */}
          <View style={{ marginTop: 20 }}>
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

          {/* ── Gold divider ── */}
          <View style={shared.goldRule} />

          {/* ── Verification Code (left) + Company QR (right) ── */}
          <View style={{ marginTop: 20 }}>
            <Text style={shared.sectionLabel}>Booking Verification</Text>
            <View style={P1.verRow}>

              {/* LEFT — verification code */}
              <View style={P1.verCard}>
                <Text style={P1.verLabel}>Your Unique Code</Text>
                <Text style={P1.verCode}>{booking.verification_code}</Text>
                <Text style={P1.verInstruction}>
                  Present this code at your event check-in.{'\n'}
                  Required for booking verification.{'\n'}
                  Keep this document in a safe place.
                </Text>
              </View>

              {/* RIGHT — company QR */}
              <View style={P1.qrCard}>
                <Image src={qrDataUrl} style={P1.qrImage} />
                <Text style={P1.qrStudioName}>X-BOSS Photography</Text>
                <Text style={P1.qrInstruction}>
                  Scan to start your booking{'\n'}or refer a friend
                </Text>
              </View>

            </View>
          </View>

          {/* ── Gold divider ── */}
          <View style={shared.goldRule} />

          {/* ── Terms note ── */}
          <View style={{ marginTop: 20 }}>
            <View style={P1.termsOuter}>
              <View style={P1.termsAccent} />
              <View style={P1.termsContent}>
                <Text style={P1.termsText}>
                  By completing this booking you confirmed acceptance of the X-BOSS Photography Studio Terms and Conditions on {bookedOn} — including the cancellation policy, copyright terms, POPIA compliance, and all clauses therein. The full Terms and Conditions are printed on page 2 of this document.
                </Text>
              </View>
            </View>
          </View>

        </View>

        {renderFooter()}
      </Page>

      {/* ════════════════════════════════════════════════════════════════
          PAGE 2 — TERMS & CONDITIONS
          (react-pdf auto-paginates overflow onto page 3 if needed)
      ════════════════════════════════════════════════════════════════ */}
      <Page size="A4" style={shared.page}>

        {renderHeader('Terms & Conditions', 'Page 2')}

        <View style={shared.body}>

          {/* Parse and render each line */}
          {termsLines.map((item, i) => {
            if (item.type === 'title') {
              return <Text key={i} style={P2.tcTitle}>{item.text}</Text>;
            }
            if (item.type === 'subtitle') {
              return <Text key={i} style={P2.tcSubtitle}>{item.text}</Text>;
            }
            if (item.type === 'intro') {
              return (
                <View key={i}>
                  <View style={shared.goldRule} />
                  <Text style={[P2.tcIntro, { marginTop: 12 }]}>{item.text}</Text>
                  <View style={shared.goldRule} />
                  <View style={{ marginBottom: 14 }} />
                </View>
              );
            }
            if (item.type === 'heading') {
              return (
                <View key={i} style={P2.tcClauseWrap} wrap={false}>
                  <Text style={P2.tcClauseHeading}>{item.text}</Text>
                </View>
              );
            }
            if (item.type === 'bullet') {
              return (
                <View key={i} style={P2.tcBulletRow}>
                  <Text style={P2.tcBulletMark}>›</Text>
                  <Text style={P2.tcBulletText}>{item.text}</Text>
                </View>
              );
            }
            // body / closing
            return (
              <Text key={i} style={
                i === termsLines.length - 1 ? P2.tcClosing : P2.tcBody
              }>
                {item.text}
              </Text>
            );
          })}

        </View>

        {renderFooter()}
      </Page>

    </Document>
  );
}

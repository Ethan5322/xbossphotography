# Photographer AI Booking System — Project Specification

## Overview
Build a complete AI-powered booking system for a photography 
business. Clients scan a QR code, chat with an AI assistant to 
book a session, receive a verification code, and the owner 
manages everything through a secure admin panel.

---

## 1. CLIENT-FACING CHATBOT FLOW

### Entry point
- Client scans a QR code → opens the chatbot interface directly 
  (no separate website needed)

### Conversation flow (in this exact order)
The AI assistant should greet the client warmly and 
professionally, then collect the following information 
step by step, one question at a time:

1. **Full name**
2. **Phone number** — must include international dialing code 
   (e.g. +251, +27)
3. **Email address**
4. **Location** — country, province/region, area name or postal 
   code
5. **Event type** — client selects one of:
   - Wedding
   - Birthday
   - Graduation
   - Anniversary
   - Custom event (client can type their own event type if none 
     of the above match)
6. **Event date and time**
7. **Package selection** — client selects one of:
   - Standard
   - Medium
   - Premium
   - Super Premium
8. **Terms and conditions** — client must read and accept before 
   continuing

### After booking is completed
- Generate a **unique verification code** for this booking
- Generate a **downloadable PDF** containing:
  - All client information collected above
  - The event details and selected package
  - The verification code (clearly visible)
- Save the complete booking record to the database
- Send the owner an instant **WhatsApp notification** containing 
  the full booking details and verification code

### Tone and style requirements
- The AI should sound warm, friendly, and professional — like a 
  helpful human assistant, not a robotic form
- Ask one question at a time, do not overwhelm the client with 
  multiple questions at once
- Confirm each answer briefly before moving to the next question

---

## 2. ADMIN PANEL

### Access control
- Protected by a password — only the owner/admin can log in
- No public access to any admin features

### Required features — 4 main sections/buttons:

**A. Verify Booking**
- Admin enters a verification code (the one sent to the client 
  during booking)
- If the code is correct → display the full client and booking 
  details
- If the code is incorrect or not found → do NOT display any 
  client details, show an error/invalid message only

**B. Upcoming Events**
- Displays all upcoming bookings sorted in chronological order 
  by event date
- Should clearly show event date, client name, event type, and 
  package at a glance

**C. Today's Bookings + Manual Booking**
- Shows all bookings scheduled for today's date
- Includes a "Manual Booking" option allowing the admin to 
  create a booking directly through the admin panel (for phone 
  call or walk-in clients)
- Bookings made today (whether by client via chatbot or by 
  admin manually) should also be reflected on the public-facing 
  site/availability view

**D. Booking History**
- A complete archive of all past and current bookings
- Acts as permanent storage — nothing is deleted, this is the 
  full historical record

---

## 3. TECHNICAL REQUIREMENTS

- Database: Supabase (confirm table structure before creating 
  new tables)
- WhatsApp notifications: CallMeBot
- PDF generation: client-side or server-side, must include all 
  booking fields plus the verification code
- Verification codes must be unique per booking and stored 
  securely in the database
- Admin panel authentication: simple password protection is 
  sufficient for v1

---

## 4. BUILD APPROACH

Please build this step by step:
1. First, confirm or set up the Supabase database schema for 
   bookings (fields needed: full_name, phone, email, country, 
   province, area, event_type, event_date, event_time, package, 
   terms_accepted, verification_code, created_at, status)
2. Build the AI chatbot conversation flow
3. Build the PDF generation with verification code
4. Build the WhatsApp notification trigger
5. Build the admin panel login
6. Build each of the 4 admin panel sections one at a time, 
   testing each before moving to the next

Show me the database schema first before writing any chatbot 
or admin panel code.

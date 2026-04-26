# Indian wedding platform — Claude Code project spec

## Product vision

A full-stack wedding planning platform built natively for the complexity of Indian weddings. Think Zola / The Knot, but designed from the ground up for multi-day, multi-ceremony Indian weddings across all traditions.

The core insight: Indian weddings are not one wedding — they are a series of events coordinated across hundreds of guests, dozens of vendors, and multiple families. No existing platform is built for that data model.

---

## Primary user

The couple — bride-focused. Planning is overwhelming, especially for a first-time bride navigating a multi-day Indian wedding. The platform's job is to replace "where do I begin?" with "just follow this."

---

## Core pillars

### 1. Wedding website
- Personalised site at a URL like `shaadi.com/priya-arjun`
- Indian-aesthetic templates: Mughal, Dravidian, Minimalist Contemporary, Vibrant Maximalist
- Templates filtered by tradition (Hindu, Sikh, Muslim, Christian, Jain)
- Couple's names pre-populated in template preview during onboarding

### 2. Multi-event management
Each ceremony gets its own page with date, venue, dress code, and guest list:
- Chunni / Kurmai (Sikh engagement)
- Mehndi
- Haldi / Vatna
- Sangeet
- Baraat
- Anand Karaj / Nikah / Wedding ceremony
- Reception
- Custom ceremonies (regional additions)

### 3. Smart RSVP
- Guests RSVP per event, not just the wedding
- Couple sees per-ceremony confirmation counts on dashboard
- Automatic reminder scheduling for non-responders
- CSV guest list import with column auto-mapping

### 4. Vendor marketplace
- 10 Indian-wedding-specific categories: Photography & film, Catering, Decor & florals, Hair & makeup, Mehndi artist, Pandit & officiant, Music & entertainment (DJ / Dhol / live band), Invitations & stationery, Attire & jewellery, Transportation
- Open but verified — vendors self-onboard, platform approves
- Vendor subscription model (free listing / standard / premium tiers)
- Couple actions: browse & save, request a quote, book & pay on platform, message directly
- Search filters: category, location, travel radius, verified status, tradition specialisation
- Vendor profiles show: services & pricing, availability against couple's event dates, reviews tagged to specific ceremonies

### 5. Budget tracker
- Overall budget with paid / committed / unallocated breakdown
- Category-level tracking (linked to booked vendors)
- Per-event budget breakdown (Mehndi has its own budget, Sangeet has its own, etc.)
- Payments tab: upcoming payments with countdown + payment history
- Budget auto-populates when vendor booked through marketplace

### 6. Tradition-specific templates
Introduced on the dashboard as the first step after onboarding. Includes:
- Planning checklist with phased timeline (right now / coming up / later)
- Each checklist item has a reason — teaches the bride what she doesn't know
- Budget template by wedding size (Intimate / Traditional / Grand / Luxury)
- Vendor shortlist by ceremony with urgency flags (book now / book in 1–2 months / flexible)
- Guest list templates per tradition (full guest list / ceremony-specific lists / RSVP tracker)

Traditions supported at launch: Sikh, Hindu, Muslim, South Indian, Christian, Jain

---

## Onboarding flow (4 steps)

### Step 1 — The basics
- Partner 1 & Partner 2 names
- Wedding date (with TBD option)
- City / region
- Tradition selector (Hindu / Muslim / Sikh / Christian / Jain)

### Step 2 — Select ceremonies
- Visual card grid of ceremonies, tap to select
- Pre-selected based on tradition chosen in Step 1
- "Add custom ceremony" option for regional variations
- Button updates: "Continue with N events"

### Step 3 — Pick a template
- 3–5 templates shown with couple's real names pre-populated
- Filtered to Indian aesthetics — not generic western styles
- Mughal, Dravidian, Minimalist, Vibrant Maximalist

### Step 4 — Wedding URL
- Instant URL: `shaadi.com/firstname-lastname`
- Summary of what's been created (N event pages, RSVP, guest dashboard)
- Shareable immediately — the dopamine hit that drives early word of mouth

---

## Dashboard layout

### Stat cards (top)
- Days to wedding
- Guests invited
- RSVPs received (% responded)
- Vendors booked (X of Y)

### Event cards
- One card per ceremony, colour-coded consistently across the whole platform
- RSVP progress bar per event
- Click through to event detail page

### Panels
- Vendors (recent, with confirmed / pending status)
- Checklist (next 5 tasks with due dates)
- Budget (overall progress bar)
- Wedding site (URL + quick share)

### Navigation
Overview · Guests · Vendors · Budget · Your site

---

## Tech stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Shared component library between web and mobile

### Mobile
- React Native with Expo
- Shares same Supabase backend
- Guest-facing view first (RSVP from mobile link)
- Couple dashboard view second

### API layer
- Next.js API routes
- tRPC for type-safe client-server communication

### Database & storage
- Supabase (Postgres)
- Supabase Storage for vendor portfolio images and wedding photos
- Row-level security for multi-tenant data isolation

### Auth
- Clerk or NextAuth
- Email + Google OAuth
- Two user types: couples and vendors

### Payments
- Stripe
- Vendor subscription tiers (monthly and annual)
- Stripe Customer Portal for vendor self-service billing

### Email & SMS
- Resend for transactional email (RSVP invites, reminders, confirmations)
- Twilio for SMS reminders

### Hosting
- Vercel (web)
- CDN for images and assets

### Analytics
- PostHog or Mixpanel
- Track: onboarding completion rate, RSVP send rate, vendor quote requests, template adoption

---

## Core data models

```
Wedding
  id, couple_user_id, partner_1_name, partner_2_name,
  date, city, tradition, template_id, url_slug, created_at

Event
  id, wedding_id, name, date, time, venue, dress_code,
  ceremony_type (enum), created_at

Guest
  id, wedding_id, first_name, last_name, email, phone,
  family_side (bride/groom), relationship, created_at

GuestEventRSVP
  id, guest_id, event_id, status (confirmed/declined/pending),
  responded_at, dietary_notes

Vendor
  id, user_id, name, category, location, travel_radius_miles,
  tradition_specialisations[], subscription_tier, verified, bio,
  created_at

VendorService
  id, vendor_id, name, description, price_from, price_unit

VendorBooking
  id, wedding_id, vendor_id, event_id, status, total_amount,
  deposit_paid, deposit_amount, final_payment_due_date

Budget
  id, wedding_id, total_amount

BudgetCategory
  id, budget_id, name, allocated_amount, vendor_booking_id (nullable)

BudgetPayment
  id, budget_category_id, amount, paid_at, status

Template
  id, tradition, wedding_size, name

ChecklistItem
  id, template_id, title, description, phase (now/soon/later),
  months_before_wedding, ceremony_tag

VendorShortlistItem
  id, template_id, vendor_category, urgency, note, ceremony_tag
```

---

## Build order (recommended)

1. Supabase schema and migrations
2. Auth flow (email + Google OAuth) — couple and vendor sign-up
3. Onboarding wizard (4 steps)
4. Main dashboard layout and navigation
5. Event setup and management
6. Guest list import and management
7. Per-event RSVP system
8. Tradition-specific templates (checklist + budget + vendor shortlist)
9. Budget tracker (overview + by event + payments)
10. Vendor marketplace (browse + profile + quote request)
11. Wedding website builder and preview
12. Stripe vendor subscription billing
13. Email / SMS (RSVP invites and reminders)
14. Mobile app (Expo) — guest RSVP view first, couple dashboard second

---

## Claude Code kick-off prompt

Paste this to scaffold the project:

```
Build a Next.js 14 web app for an Indian wedding planning platform.

Tech stack:
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase for database and auth
- Stripe for vendor subscriptions
- Resend for transactional email

Core data models to create:
- Users (couples and vendors)
- Weddings (with tradition, date, location, url_slug)
- Events (ceremony types linked to a wedding)
- Guests (with per-event RSVP status via GuestEventRSVP junction table)
- Vendors (category, location, travel radius, subscription tier, verified flag)
- VendorBookings (linked to wedding, vendor, and event)
- BudgetCategories (linked to wedding, with optional vendor booking)
- BudgetPayments (deposit and final payment tracking)
- Templates (checklist items and vendor shortlists by tradition)

Start with:
1. Supabase schema and all migrations
2. Auth flow — email + Google OAuth, two user types (couple / vendor)
3. Onboarding wizard — 4 steps: basics, ceremony selection, template picker, URL reveal
4. Main dashboard layout with sidebar nav: Overview, Guests, Vendors, Budget, Your site
```

---

## Feature prompts for Claude Code

Use these one at a time after the scaffold is in place:

**RSVP system**
```
Build the multi-event RSVP system. Each guest has a status 
(confirmed / declined / pending) per event stored in a 
GuestEventRSVP table. The dashboard shows RSVP counts and 
a progress bar per ceremony. Guests receive a unique link 
to RSVP for all their assigned events in one flow.
```

**Vendor marketplace**
```
Build the vendor marketplace browse page. Vendors are filtered 
by category (10 Indian-wedding-specific categories), location, 
travel radius, and verified status. Each vendor card shows 
rating, starting price, and travel radius. Clicking through 
shows a full profile with services, availability against the 
couple's event dates, and reviews tagged to specific ceremonies.
Include a quote request form pre-populated with the couple's 
event dates and guest counts.
```

**Budget tracker**
```
Build the budget tracker with three views: overview (stat cards + 
stacked progress bar showing paid / committed / unallocated + 
category table with mini progress bars), by event (spend card 
per ceremony), and payments (upcoming payments with countdown 
+ payment history). Budget categories auto-populate when a 
vendor is booked through the marketplace.
```

**Templates system**
```
Build the tradition-specific template system. When a couple 
completes onboarding, their dashboard shows a template pack 
based on their tradition (Sikh / Hindu / Muslim etc.). The pack 
includes: a phased planning checklist (each item has a title, 
reason, due timing, and ceremony tag), a budget template by 
wedding size (Intimate / Traditional / Grand / Luxury), a vendor 
shortlist by ceremony with urgency flags, and guest list templates.
Templates are pre-loaded into the couple's account on first login.
```

---

## Monetisation

- Vendor subscriptions via Stripe: free listing / standard / premium tiers
- Free tier: basic profile, no quote requests
- Standard tier: full profile, quote requests, reviews
- Premium tier: featured placement, analytics dashboard, booking management
- Couples always free

---

## Key differentiators vs Zola / The Knot

- Data model built around multiple ceremonies from day one
- Per-event RSVP (not just one wedding-wide RSVP)
- Tradition-aware templates that teach as well as guide
- Vendor categories that match Indian wedding reality (Ragis, Granthi, Dhol, Pandit)
- Budget broken down by event, not just by category
- Guest list structured by event attendance, not just headcount
- Templates know that Gurudwara Langar is separate from Reception catering
- Templates flag Ragi booking as critical 12–18 months in advance

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Project Gobi is an Indian wedding planning platform — a Zola/The Knot alternative built natively for multi-day, multi-ceremony Indian weddings. The project has a **complete UI shell** built with Next.js 14 (App Router), TypeScript, and Tailwind CSS. All pages use mock data — no Supabase connection yet.

## Application Routes

### Couple dashboard (`/dashboard/*`) — 7-tab nav
- `/dashboard` — Overview with event cards (click → event detail)
- `/dashboard/guests` — Full guest management with per-event RSVP status + guest detail panel
- `/dashboard/vendors` — Vendor marketplace browse/search
- `/dashboard/budget` — 3-tab budget tracker
- `/dashboard/timeline` — Day-of timeline (weekend overview, hour-by-hour, vendor call sheet)
- `/dashboard/registry` — Registry links + photo gallery + guest preview
- `/dashboard/site` — Website builder (template gallery, editor, mobile preview)
- `/dashboard/events/[eventId]` — Event detail (4 tabs: overview, guests, vendors, timeline)
- `/dashboard/templates` — Tradition-specific template packs

### Vendor portal (`/vendor/*`)
- `/vendor/onboarding` — 4-step vendor onboarding (basics → profile → verify → done)
- `/vendor/dashboard` — Vendor dashboard (stats, quote requests, bookings, subscription plan)

### Admin (`/admin`)
- `/admin` — Platform admin (overview, vendor verification queue, users, revenue)

### Public pages
- `/` — Landing page
- `/login`, `/signup` — Auth UI (mock, no real auth yet)
- `/onboarding` — Couple 4-step onboarding
- `/vendors/[id]` — Vendor public profile + quote request
- `/rsvp/[token]` — Guest-facing per-event RSVP form

## Key Source Files

- `src/lib/types.ts` — All TypeScript interfaces
- `src/lib/mock-data.ts` — All mock data (wedding, events, guests, RSVPs, vendors, budget, timeline, registry, albums)
- `src/lib/constants.ts` — DASHBOARD_TABS, CEREMONY_COLORS, VENDOR_CATEGORIES, TRADITIONS, TEMPLATE_THEMES
- `src/lib/utils.ts` — formatCurrency, formatDate, daysUntil, getInitials, generateSlug
- `src/lib/cn.ts` — Tailwind class merging utility
- `src/components/ui/` — Shared UI: Card, Button, TabBar, StatusBadge, StatCard, EventDot, ProgressBar, etc.
- `supabase/migrations/001_initial_schema.sql` — Full Postgres schema (not connected yet)

## Design System

Colors: `#534AB7` primary purple · `#1D9E75` teal/success · `#EF9F27` orange/warning · `#3B6D11` green · `#D4537E` mehndi pink · `#D85A30` reception orange

Tailwind custom tokens: `text-primary`, `bg-primary-pale`, `text-neutral-secondary`, `bg-neutral-bg`, `text-success`, `bg-success-bg`, `text-warning-text`, `bg-warning-bg`, `text-danger`, `bg-danger-bg`

## Current Repository Contents

- `indian-wedding-platform.md` — Full product specification (data models, tech stack, build order, monetization)

All wireframes live in the `wireframes/` directory and are static HTML+CSS with no JavaScript. They use a consistent color scheme: `#534AB7` (purple), `#1D9E75` (teal), `#854F0B` (orange), `#3B6D11` (green).

### Wireframes

- `wireframes/dashboard-wireframe.html` — Couple dashboard UI mockup
- `wireframes/budget-tracker.html` — Budget tracking UI mockup (Overview/By Event/Payments tabs)
- `wireframes/sikh-wedding-templates.html` — Sikh tradition template pack UI mockup
- `wireframes/onboarding-wireframe.html` — 4-step couple onboarding flow mockup
- `wireframes/vendor-marketplace.html` — Vendor browse/search UI mockup
- `wireframes/guest-management-rsvp.html` — Guest list management (search/filter/bulk actions, per-event RSVP status per guest, guest detail panel) + guest-facing RSVP page
- `wireframes/wedding-website-builder.html` — Website builder with template gallery (free/paid, tradition-filtered), drag-and-drop section editor, and live site preview
- `wireframes/day-of-timeline.html` — Day-of timeline (weekend overview by day, per-event hour-by-hour timeline, vendor call sheet with arrival times and contacts)
- `wireframes/event-detail-page.html` — Individual ceremony detail page (stats, RSVP breakdown bar, dress code, vendor bookings panel, guest list panel, event timeline)
- `wireframes/platform-admin-dashboard.html` — Internal admin dashboard (platform metrics, vendor verification queue with approve/reject, user management table, revenue breakdown)
- `wireframes/registry-photo-gallery.html` — Registry management (link external registries like Zola/Amazon) and photo gallery (upload, album tabs, guest-view toggle)
- `wireframes/vendor-onboarding-dashboard.html` — Vendor multi-step onboarding flow (business info → services → media → verification) and post-approval vendor dashboard (leads, bookings, profile stats)

## Planned Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Mobile:** React Native with Expo (shared Supabase backend)
- **API:** Next.js API routes + tRPC
- **Database:** Supabase (Postgres) with row-level security
- **Auth:** Clerk or NextAuth (email + Google OAuth, two user types: couples and vendors)
- **Payments:** Stripe (vendor subscriptions with free/standard/premium tiers)
- **Email/SMS:** Resend (transactional email), Twilio (SMS reminders)
- **Hosting:** Vercel
- **Analytics:** PostHog or Mixpanel

## Key Architectural Concepts

**Multi-ceremony data model:** Unlike single-event wedding platforms, the core data model is built around a Wedding having many Events (Mehndi, Sangeet, Baraat, Ceremony, Reception, etc.). This is the foundational design decision — nearly everything branches from it.

**Per-event RSVP:** Guests RSVP to individual ceremonies, not the wedding as a whole. The `GuestEventRSVP` join table links guests to specific events with per-event status tracking.

**Tradition-aware templates:** On first dashboard visit, tradition-specific template packs (checklist, budget, vendor shortlist, guest list) are offered based on the couple's selected tradition (Sikh, Hindu, Muslim, South Indian, Christian, Jain). Templates encode domain knowledge like "book Ragi 12-18 months in advance" or "Gurudwara Langar is separate from Reception catering."

**Vendor marketplace:** Open but verified model. Vendors self-onboard, platform approves. 10 Indian-wedding-specific categories including Mehndi artist, Pandit/officiant, and Dhol/live band. Vendors have tradition specializations.

## Core Data Model Relationships

```
Wedding → has many → Event (ceremonies)
Wedding → has many → Guest
Guest + Event → GuestEventRSVP (per-ceremony RSVP)
Wedding → has one → Budget → has many → BudgetCategory
Vendor → has many → VendorService
Wedding + Vendor + Event → VendorBooking
BudgetCategory → optionally linked to → VendorBooking
Template → has many → ChecklistItem, VendorShortlistItem
```

## Planned Build Order

1. Supabase schema and migrations
2. Auth flow (couple and vendor sign-up)
3. Onboarding wizard (4 steps)
4. Dashboard layout and navigation
5. Event setup and management
6. Guest list import and management
7. Per-event RSVP system
8. Tradition-specific templates
9. Budget tracker
10. Vendor marketplace
11. Wedding website builder
12. Stripe vendor subscription billing
13. Email/SMS (RSVP invites and reminders)
14. Mobile app (guest RSVP view first, couple dashboard second)

## Monetization

Couples are always free. Vendors pay via Stripe subscription tiers (free/standard/premium) for increasing levels of visibility and features.

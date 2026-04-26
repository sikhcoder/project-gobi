-- Project Gobi: Database Setup
-- Run this in the Supabase SQL editor for project mnznkyhunmnyslnktfdl

-- ── Enums ──────────────────────────────────────────────

CREATE TYPE tradition AS ENUM ('hindu', 'muslim', 'sikh', 'christian', 'jain', 'south-indian');
CREATE TYPE ceremony_type AS ENUM ('mehndi', 'haldi', 'sangeet', 'baraat', 'wedding', 'reception', 'chunni', 'vatna', 'anand-karaj', 'nikah', 'custom');
CREATE TYPE rsvp_status AS ENUM ('confirmed', 'declined', 'pending');
CREATE TYPE vendor_category AS ENUM ('photography', 'catering', 'decor', 'hair-makeup', 'mehndi-artist', 'pandit-officiant', 'music-entertainment', 'invitations', 'attire-jewellery', 'transportation');
CREATE TYPE booking_status AS ENUM ('confirmed', 'pending', 'cancelled');
CREATE TYPE payment_status AS ENUM ('paid', 'partial', 'unpaid', 'pending');
CREATE TYPE checklist_phase AS ENUM ('now', 'soon', 'later');
CREATE TYPE vendor_urgency AS ENUM ('book-now', 'book-soon', 'flexible');
CREATE TYPE wedding_size AS ENUM ('intimate', 'traditional', 'grand', 'luxury');
CREATE TYPE subscription_tier AS ENUM ('free', 'standard', 'premium');
CREATE TYPE user_type AS ENUM ('couple', 'vendor');
CREATE TYPE family_side AS ENUM ('bride', 'groom');

-- ── Helper: updated_at trigger ─────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ── Users (mirrors auth.users) ─────────────────────────
-- id matches auth.users(id) — created automatically on signup via trigger

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  user_type user_type NOT NULL DEFAULT 'couple',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create public.users row when auth.users row is inserted
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'user_type')::user_type, 'couple')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── Weddings ───────────────────────────────────────────

CREATE TABLE weddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  partner_1_name TEXT NOT NULL DEFAULT '',
  partner_2_name TEXT NOT NULL DEFAULT '',
  date DATE,
  city TEXT,
  tradition tradition,
  template_id TEXT,
  url_slug TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_weddings_user ON weddings(couple_user_id);
CREATE INDEX idx_weddings_slug ON weddings(url_slug);

CREATE TRIGGER weddings_updated_at BEFORE UPDATE ON weddings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Events ─────────────────────────────────────────────

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date DATE,
  time TEXT,
  venue TEXT,
  dress_code TEXT,
  ceremony_type ceremony_type NOT NULL DEFAULT 'custom',
  display_color TEXT NOT NULL DEFAULT '#534AB7',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_wedding ON events(wedding_id);

CREATE TRIGGER events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Guests ─────────────────────────────────────────────

CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  family_side family_side,
  relationship TEXT,
  dietary_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_guests_wedding ON guests(wedding_id);

CREATE TRIGGER guests_updated_at BEFORE UPDATE ON guests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Guest Event RSVPs ──────────────────────────────────

CREATE TABLE guest_event_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  status rsvp_status NOT NULL DEFAULT 'pending',
  responded_at TIMESTAMPTZ,
  dietary_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(guest_id, event_id)
);

CREATE INDEX idx_rsvps_guest ON guest_event_rsvps(guest_id);
CREATE INDEX idx_rsvps_event ON guest_event_rsvps(event_id);

-- ── Vendors ────────────────────────────────────────────

CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category vendor_category NOT NULL,
  location TEXT,
  travel_radius_miles INTEGER DEFAULT 0,
  tradition_specialisations tradition[] DEFAULT '{}',
  subscription_tier subscription_tier NOT NULL DEFAULT 'free',
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  bio TEXT,
  website TEXT,
  instagram TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vendors_user ON vendors(user_id);
CREATE INDEX idx_vendors_category ON vendors(category);

CREATE TRIGGER vendors_updated_at BEFORE UPDATE ON vendors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Vendor Services ────────────────────────────────────

CREATE TABLE vendor_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price_from NUMERIC(10, 2),
  price_unit TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vendor_services_vendor ON vendor_services(vendor_id);

-- ── Vendor Bookings ────────────────────────────────────

CREATE TABLE vendor_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vendors(id),
  event_id UUID REFERENCES events(id),
  vendor_name TEXT NOT NULL DEFAULT '',
  vendor_category vendor_category,
  status booking_status NOT NULL DEFAULT 'pending',
  total_amount NUMERIC(10, 2),
  deposit_paid BOOLEAN NOT NULL DEFAULT FALSE,
  deposit_amount NUMERIC(10, 2),
  final_payment_due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_wedding ON vendor_bookings(wedding_id);
CREATE INDEX idx_bookings_vendor ON vendor_bookings(vendor_id);

CREATE TRIGGER vendor_bookings_updated_at BEFORE UPDATE ON vendor_bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Budgets ────────────────────────────────────────────

CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE UNIQUE,
  total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER budgets_updated_at BEFORE UPDATE ON budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Budget Categories ──────────────────────────────────

CREATE TABLE budget_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id),
  name TEXT NOT NULL,
  allocated_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  vendor_booking_id UUID REFERENCES vendor_bookings(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_budget_categories_budget ON budget_categories(budget_id);

CREATE TRIGGER budget_categories_updated_at BEFORE UPDATE ON budget_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Budget Payments ────────────────────────────────────

CREATE TABLE budget_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_category_id UUID NOT NULL REFERENCES budget_categories(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  paid_at TIMESTAMPTZ,
  due_date DATE,
  status payment_status NOT NULL DEFAULT 'pending',
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_budget_payments_category ON budget_payments(budget_category_id);

-- ── Timeline Items ─────────────────────────────────────

CREATE TABLE timeline_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  detail TEXT,
  time TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  vendor_name TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_timeline_event ON timeline_items(event_id);

CREATE TRIGGER timeline_items_updated_at BEFORE UPDATE ON timeline_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Registry Links ─────────────────────────────────────

CREATE TABLE registry_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  logo_color TEXT NOT NULL DEFAULT '#534AB7',
  logo_initial TEXT NOT NULL DEFAULT 'R',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_registry_wedding ON registry_links(wedding_id);

-- ── Photo Albums ───────────────────────────────────────

CREATE TABLE photo_albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id),
  name TEXT NOT NULL,
  cover_color TEXT NOT NULL DEFAULT '#534AB7',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_albums_wedding ON photo_albums(wedding_id);

-- ── Templates ──────────────────────────────────────────

CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tradition tradition NOT NULL,
  wedding_size wedding_size NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Checklist Items ────────────────────────────────────

CREATE TABLE checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  phase checklist_phase NOT NULL DEFAULT 'later',
  months_before_wedding INTEGER,
  ceremony_tag TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_checklist_template ON checklist_items(template_id);

-- ── Vendor Shortlist Items ─────────────────────────────

CREATE TABLE vendor_shortlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  vendor_category TEXT NOT NULL,
  urgency vendor_urgency NOT NULL DEFAULT 'flexible',
  note TEXT,
  ceremony_tag TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_shortlist_template ON vendor_shortlist_items(template_id);

-- ── Row Level Security ─────────────────────────────────

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE weddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE registry_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_shortlist_items ENABLE ROW LEVEL SECURITY;

-- Users: read own row; insert own row on signup
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Weddings: couple manages their own
CREATE POLICY "Couples can manage own weddings" ON weddings
  FOR ALL USING (auth.uid() = couple_user_id);

-- Events
CREATE POLICY "Couples can manage own events" ON events
  FOR ALL USING (
    wedding_id IN (SELECT id FROM weddings WHERE couple_user_id = auth.uid())
  );

-- Guests
CREATE POLICY "Couples can manage own guests" ON guests
  FOR ALL USING (
    wedding_id IN (SELECT id FROM weddings WHERE couple_user_id = auth.uid())
  );

-- Guest RSVPs — couples manage; also allow public insert for RSVP form
CREATE POLICY "Couples can manage rsvps" ON guest_event_rsvps
  FOR ALL USING (
    guest_id IN (
      SELECT g.id FROM guests g
      JOIN weddings w ON g.wedding_id = w.id
      WHERE w.couple_user_id = auth.uid()
    )
  );

CREATE POLICY "Public RSVP submission" ON guest_event_rsvps
  FOR INSERT WITH CHECK (true);

-- Vendors — manage own profile; anyone can browse
CREATE POLICY "Vendors can manage own profile" ON vendors
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can browse vendors" ON vendors
  FOR SELECT USING (true);

CREATE POLICY "Vendors can manage own services" ON vendor_services
  FOR ALL USING (
    vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
  );

CREATE POLICY "Anyone can browse vendor services" ON vendor_services
  FOR SELECT USING (true);

-- Vendor bookings
CREATE POLICY "Couples can manage own bookings" ON vendor_bookings
  FOR ALL USING (
    wedding_id IN (SELECT id FROM weddings WHERE couple_user_id = auth.uid())
  );

CREATE POLICY "Vendors can view their bookings" ON vendor_bookings
  FOR SELECT USING (
    vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
  );

-- Budget
CREATE POLICY "Couples can manage own budget" ON budgets
  FOR ALL USING (
    wedding_id IN (SELECT id FROM weddings WHERE couple_user_id = auth.uid())
  );

CREATE POLICY "Couples can manage budget categories" ON budget_categories
  FOR ALL USING (
    budget_id IN (
      SELECT b.id FROM budgets b
      JOIN weddings w ON b.wedding_id = w.id
      WHERE w.couple_user_id = auth.uid()
    )
  );

CREATE POLICY "Couples can manage budget payments" ON budget_payments
  FOR ALL USING (
    budget_category_id IN (
      SELECT bc.id FROM budget_categories bc
      JOIN budgets b ON bc.budget_id = b.id
      JOIN weddings w ON b.wedding_id = w.id
      WHERE w.couple_user_id = auth.uid()
    )
  );

-- Timeline items
CREATE POLICY "Couples can manage timeline items" ON timeline_items
  FOR ALL USING (
    event_id IN (
      SELECT e.id FROM events e
      JOIN weddings w ON e.wedding_id = w.id
      WHERE w.couple_user_id = auth.uid()
    )
  );

-- Registry & photos
CREATE POLICY "Couples can manage registry" ON registry_links
  FOR ALL USING (
    wedding_id IN (SELECT id FROM weddings WHERE couple_user_id = auth.uid())
  );

CREATE POLICY "Couples can manage photo albums" ON photo_albums
  FOR ALL USING (
    wedding_id IN (SELECT id FROM weddings WHERE couple_user_id = auth.uid())
  );

-- Templates: public read
CREATE POLICY "Templates are public" ON templates
  FOR SELECT USING (true);

CREATE POLICY "Checklist items are public" ON checklist_items
  FOR SELECT USING (true);

CREATE POLICY "Shortlist items are public" ON vendor_shortlist_items
  FOR SELECT USING (true);

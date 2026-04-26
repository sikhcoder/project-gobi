"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { TabBar } from "@/components/ui/tab-bar";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";
import { SearchInput } from "@/components/ui/search-input";
import { CategoryPills } from "@/components/vendors/category-pills";
import { VendorCard } from "@/components/vendors/vendor-card";
import { VENDOR_CATEGORIES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { useWedding } from "@/lib/context/wedding-context";
import { formatCurrency, getInitials } from "@/lib/utils";
import type { Vendor, VendorBooking, WeddingEvent, VendorCategory } from "@/lib/types";

const AVATAR_COLORS = ["#534AB7", "#1D9E75", "#854F0B", "#3B6D11", "#7C3AED", "#DB2777"];

const TABS = [
  { label: "Your vendors", value: "bookings" },
  { label: "Browse marketplace", value: "browse" },
];

export default function VendorsPage() {
  const { weddingId } = useWedding();
  const [activeTab, setActiveTab] = useState("bookings");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [bookings, setBookings] = useState<VendorBooking[]>([]);
  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Add booking modal
  const [showAddBooking, setShowAddBooking] = useState(false);
  const [newBooking, setNewBooking] = useState({ vendorName: "", category: "photography" as VendorCategory, eventId: "", amount: "", status: "pending" as "confirmed" | "pending" });
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    const supabase = createClient();
    const [{ data: dbVendors }, { data: dbBookings }, { data: dbEvents }] = await Promise.all([
      supabase.from("vendors").select("*, vendor_services(price_from, price_unit)"),
      supabase.from("vendor_bookings").select("*").eq("wedding_id", weddingId),
      supabase.from("events").select("*").eq("wedding_id", weddingId).order("date"),
    ]);

    setVendors((dbVendors ?? []).map((v, i) => {
      const services = v.vendor_services ?? [];
      const minPrice = services.length > 0 ? Math.min(...services.map((s: { price_from: number }) => Number(s.price_from ?? 0))) : 0;
      return {
        id: v.id, userId: v.user_id, name: v.name, category: v.category,
        location: v.location ?? "", travelRadiusMiles: v.travel_radius_miles ?? 0,
        traditionSpecialisations: v.tradition_specialisations ?? [], subscriptionTier: v.subscription_tier,
        verified: v.verified, bio: v.bio ?? "", rating: 5.0, reviewCount: 0,
        startingPrice: minPrice, priceUnit: services[0]?.price_unit ?? "package",
        avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length], createdAt: v.created_at,
      };
    }));

    setBookings((dbBookings ?? []).map((b) => ({
      id: b.id, weddingId: b.wedding_id, vendorId: b.vendor_id, vendorName: b.vendor_name,
      vendorCategory: b.vendor_category ?? "photography", eventId: b.event_id ?? "",
      status: b.status, totalAmount: Number(b.total_amount ?? 0), depositPaid: b.deposit_paid,
      depositAmount: Number(b.deposit_amount ?? 0), finalPaymentDueDate: b.final_payment_due_date ?? "",
    })));

    setEvents((dbEvents ?? []).map((e) => ({
      id: e.id, weddingId: e.wedding_id, name: e.name, date: e.date ?? "", time: e.time ?? "",
      venue: e.venue ?? "", dressCode: e.dress_code ?? "", ceremonyType: e.ceremony_type,
      displayColor: e.display_color ?? "#534AB7", sortOrder: e.sort_order ?? 0,
      guestsInvited: 0, rsvpConfirmed: 0, createdAt: e.created_at,
    })));

    setLoading(false);
  }, [weddingId]);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleAddBooking(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();

    // We need a vendor_id — for manual bookings, create a placeholder vendor or use a dummy
    // For now, use the first vendor or create a booking with a null-safe approach
    // The vendor_bookings table requires vendor_id, so let's handle this
    const { data: { user } } = await supabase.auth.getUser();

    // Check if a placeholder vendor exists for this user, if not create one
    let { data: placeholderVendor } = await supabase.from("vendors")
      .select("id").eq("user_id", user!.id).limit(1).single();

    if (!placeholderVendor) {
      const { data: newVendor } = await supabase.from("vendors").insert({
        user_id: user!.id, name: "Manual bookings", category: "photography", verified: false,
      }).select("id").single();
      placeholderVendor = newVendor;
    }

    if (placeholderVendor) {
      await supabase.from("vendor_bookings").insert({
        wedding_id: weddingId,
        vendor_id: placeholderVendor.id,
        vendor_name: newBooking.vendorName,
        vendor_category: newBooking.category,
        event_id: newBooking.eventId || null,
        total_amount: parseFloat(newBooking.amount) || 0,
        status: newBooking.status,
      });
    }

    setSaving(false);
    setShowAddBooking(false);
    setNewBooking({ vendorName: "", category: "photography", eventId: "", amount: "", status: "pending" });
    await loadData();
  }

  async function handleRemoveBooking(id: string) {
    const supabase = createClient();
    await supabase.from("vendor_bookings").delete().eq("id", id);
    await loadData();
  }

  const filteredVendors = vendors.filter((v) => {
    if (activeCategory && v.category !== activeCategory) return false;
    if (search && !v.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return <div className="mt-10 text-center text-[13px] text-neutral-secondary">Loading vendors…</div>;
  }

  function getCategoryLabel(cat: string) {
    return VENDOR_CATEGORIES.find((c) => c.value === cat)?.label ?? cat;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Vendors</h2>
        <Button variant="primary" onClick={() => setShowAddBooking(true)}>+ Add vendor</Button>
      </div>

      <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {/* YOUR VENDORS (bookings) */}
      {activeTab === "bookings" && (
        <div className="mt-5">
          {bookings.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-black/15 rounded-xl">
              <div className="text-[15px] font-medium mb-1">No vendors booked yet</div>
              <p className="text-[13px] text-neutral-secondary mb-4">Track your vendor bookings and payments in one place.</p>
              <Button variant="primary" onClick={() => setShowAddBooking(true)}>+ Add your first vendor</Button>
            </div>
          ) : (
            <div className="space-y-2">
              {bookings.map((b) => {
                const evt = events.find((e) => e.id === b.eventId);
                return (
                  <div key={b.id} className="flex items-center gap-3 px-4 py-3 border border-black/10 rounded-xl">
                    <div className="w-9 h-9 rounded-full bg-primary-pale flex items-center justify-center text-[12px] font-medium text-primary shrink-0">
                      {getInitials(b.vendorName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium">{b.vendorName}</div>
                      <div className="text-[11px] text-neutral-secondary">
                        {getCategoryLabel(b.vendorCategory)}{evt ? ` · ${evt.name}` : ""}
                      </div>
                    </div>
                    <div className="text-right mr-2">
                      <div className="text-[13px] font-medium">{formatCurrency(b.totalAmount)}</div>
                      <StatusBadge status={b.status === "confirmed" ? "confirmed" : "pending"} />
                    </div>
                    <button onClick={() => handleRemoveBooking(b.id)}
                      className="text-[11px] text-neutral-secondary hover:text-danger cursor-pointer">×</button>
                  </div>
                );
              })}
              <div className="pt-2 text-right text-[13px] font-medium">
                Total: {formatCurrency(bookings.reduce((s, b) => s + b.totalAmount, 0))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* BROWSE MARKETPLACE */}
      {activeTab === "browse" && (
        <div className="mt-5">
          <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} containerClassName="mb-3" />
          <CategoryPills categories={VENDOR_CATEGORIES} active={activeCategory} onChange={setActiveCategory} />

          <div className="flex items-center gap-2 mt-4 mb-4">
            <span className="text-[11px] text-neutral-secondary uppercase tracking-wider">
              {filteredVendors.length} results
            </span>
            {filteredVendors.filter((v) => v.verified).length > 0 && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-success-bg text-success-text">
                {filteredVendors.filter((v) => v.verified).length} verified
              </span>
            )}
          </div>

          {filteredVendors.length === 0 ? (
            <div className="text-center py-12 text-[13px] text-neutral-secondary">
              {vendors.length === 0
                ? "No vendors have joined the platform yet. You can manually add vendor bookings from the \"Your vendors\" tab."
                : "No vendors match your search."}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredVendors.map((vendor) => <VendorCard key={vendor.id} vendor={vendor} />)}
            </div>
          )}
        </div>
      )}

      {/* Add Vendor Booking Modal */}
      <Modal open={showAddBooking} onClose={() => setShowAddBooking(false)} title="Add vendor booking">
        <form onSubmit={handleAddBooking}>
          <div className="mb-3">
            <label className="block text-[12px] text-neutral-secondary mb-1">Vendor name *</label>
            <input required value={newBooking.vendorName} onChange={(e) => setNewBooking({ ...newBooking, vendorName: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-black/15 bg-neutral-bg text-[14px] focus:outline-none focus:border-primary"
              placeholder="e.g. Sharma Photography" />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-[12px] text-neutral-secondary mb-1">Category</label>
              <select value={newBooking.category} onChange={(e) => setNewBooking({ ...newBooking, category: e.target.value as VendorCategory })}
                className="w-full px-3 py-2 rounded-lg border border-black/15 bg-neutral-bg text-[14px] focus:outline-none focus:border-primary">
                {VENDOR_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12px] text-neutral-secondary mb-1">Status</label>
              <select value={newBooking.status} onChange={(e) => setNewBooking({ ...newBooking, status: e.target.value as "confirmed" | "pending" })}
                className="w-full px-3 py-2 rounded-lg border border-black/15 bg-neutral-bg text-[14px] focus:outline-none focus:border-primary">
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-[12px] text-neutral-secondary mb-1">Total amount ($)</label>
              <input type="number" min="0" value={newBooking.amount} onChange={(e) => setNewBooking({ ...newBooking, amount: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-black/15 bg-neutral-bg text-[14px] focus:outline-none focus:border-primary"
                placeholder="e.g. 3500" />
            </div>
            <div>
              <label className="block text-[12px] text-neutral-secondary mb-1">Event</label>
              <select value={newBooking.eventId} onChange={(e) => setNewBooking({ ...newBooking, eventId: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-black/15 bg-neutral-bg text-[14px] focus:outline-none focus:border-primary">
                <option value="">All events</option>
                {events.map((evt) => <option key={evt.id} value={evt.id}>{evt.name}</option>)}
              </select>
            </div>
          </div>
          <Button type="submit" variant="primary" className="w-full" disabled={saving}>
            {saving ? "Adding…" : "Add vendor"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { TabBar } from "@/components/ui/tab-bar";
import { Modal } from "@/components/ui/modal";
import { EventFilterPills } from "@/components/guests/event-filter-pills";
import { GuestTable } from "@/components/guests/guest-table";
import { GuestDetailPanel } from "@/components/guests/guest-detail-panel";
import { createClient } from "@/lib/supabase/client";
import { useWedding } from "@/lib/context/wedding-context";
import type { Guest, WeddingEvent, GuestEventRSVP } from "@/lib/types";

const TABS = [
  { label: "Guest list", value: "list" },
  { label: "RSVP invite", value: "rsvp" },
];

export default function GuestsPage() {
  const { weddingId } = useWedding();
  const [activeTab, setActiveTab] = useState("list");
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [search, setSearch] = useState("");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [rsvps, setRsvps] = useState<GuestEventRSVP[]>([]);
  const [loading, setLoading] = useState(true);

  // Add guest modal
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [newGuest, setNewGuest] = useState({ firstName: "", lastName: "", email: "", phone: "", familySide: "bride" as "bride" | "groom", relationship: "" });
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    const supabase = createClient();
    const [{ data: dbGuests }, { data: dbEvents }] = await Promise.all([
      supabase.from("guests").select("*").eq("wedding_id", weddingId).order("last_name"),
      supabase.from("events").select("*").eq("wedding_id", weddingId).order("date"),
    ]);

    const guestIds = (dbGuests ?? []).map((g) => g.id);
    const { data: dbRsvps } = guestIds.length > 0
      ? await supabase.from("guest_event_rsvps").select("*").in("guest_id", guestIds)
      : { data: [] };

    setGuests((dbGuests ?? []).map((g) => ({
      id: g.id, weddingId: g.wedding_id, firstName: g.first_name, lastName: g.last_name,
      email: g.email ?? "", phone: g.phone ?? "", familySide: g.family_side ?? "bride",
      relationship: g.relationship ?? "", createdAt: g.created_at,
    })));
    setEvents((dbEvents ?? []).map((e) => ({
      id: e.id, weddingId: e.wedding_id, name: e.name, date: e.date ?? "", time: e.time ?? "",
      venue: e.venue ?? "", dressCode: e.dress_code ?? "", ceremonyType: e.ceremony_type,
      displayColor: e.display_color ?? "#534AB7", sortOrder: e.sort_order ?? 0,
      guestsInvited: 0, rsvpConfirmed: 0, createdAt: e.created_at,
    })));
    setRsvps((dbRsvps ?? []).map((r) => ({
      id: r.id, guestId: r.guest_id, eventId: r.event_id, status: r.status,
      respondedAt: r.responded_at ?? null, dietaryNotes: r.dietary_notes ?? "",
    })));
    setLoading(false);
  }, [weddingId]);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleAddGuest(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("guests").insert({
      wedding_id: weddingId,
      first_name: newGuest.firstName,
      last_name: newGuest.lastName,
      email: newGuest.email || null,
      phone: newGuest.phone || null,
      family_side: newGuest.familySide,
      relationship: newGuest.relationship || null,
    });
    if (!error) {
      setShowAddGuest(false);
      setNewGuest({ firstName: "", lastName: "", email: "", phone: "", familySide: "bride", relationship: "" });
      await loadData();
    }
    setSaving(false);
  }

  async function handleDeleteGuest(guestId: string) {
    const supabase = createClient();
    await supabase.from("guests").delete().eq("id", guestId);
    setSelectedGuest(null);
    await loadData();
  }

  const filteredGuests = guests.filter((g) => {
    const name = `${g.firstName} ${g.lastName}`.toLowerCase();
    const matchesSearch = name.includes(search.toLowerCase()) || g.email.toLowerCase().includes(search.toLowerCase());
    const matchesEvent = !activeEventId || rsvps.some((r) => r.guestId === g.id && r.eventId === activeEventId);
    return matchesSearch && matchesEvent;
  });

  const confirmed = rsvps.filter((r) => r.status === "confirmed").length;
  const pending = rsvps.filter((r) => r.status === "pending").length;
  const declined = rsvps.filter((r) => r.status === "declined").length;

  if (loading) {
    return <div className="mt-10 text-center text-[13px] text-neutral-secondary">Loading guests…</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-medium">Guests</h2>
        <div className="flex gap-2">
          <Button variant="primary" onClick={() => setShowAddGuest(true)}>+ Add guest</Button>
        </div>
      </div>

      <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "list" && (
        <div className="mt-5">
          <div className="grid grid-cols-4 gap-3 mb-5">
            {[
              { label: "Total guests", value: guests.length },
              { label: "Confirmed", value: confirmed },
              { label: "Pending", value: pending },
              { label: "Declined", value: declined },
            ].map(({ label, value }) => (
              <div key={label} className="bg-neutral-bg rounded-xl px-4 py-3">
                <div className="text-[22px] font-medium">{value}</div>
                <div className="text-[11px] text-neutral-secondary">{label}</div>
              </div>
            ))}
          </div>

          <EventFilterPills events={events} activeEventId={activeEventId} onChange={setActiveEventId} />

          <div className="flex gap-2 mb-4 mt-3">
            <input
              type="text"
              placeholder="Search guests…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-3 py-2 text-[13px] rounded-lg border border-black/15 bg-neutral-bg outline-none focus:border-primary-light"
            />
          </div>

          {guests.length === 0 ? (
            <div className="text-center py-12 text-[13px] text-neutral-secondary">
              No guests yet. Add your first guest to get started.
            </div>
          ) : (
            <div className="flex gap-4">
              <div className="flex-1 min-w-0">
                <GuestTable
                  guests={filteredGuests} events={events} rsvps={rsvps}
                  activeEventId={activeEventId} selectedGuestId={selectedGuest?.id ?? null}
                  onSelectGuest={(g) => setSelectedGuest(selectedGuest?.id === g.id ? null : g)}
                />
              </div>
              {selectedGuest && (
                <div className="w-64 shrink-0">
                  <GuestDetailPanel
                    guest={selectedGuest} events={events}
                    rsvps={rsvps.filter((r) => r.guestId === selectedGuest.id)}
                    onClose={() => setSelectedGuest(null)}
                    onDelete={() => handleDeleteGuest(selectedGuest.id)}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === "rsvp" && (
        <div className="mt-5">
          <div className="bg-neutral-bg rounded-xl px-5 py-4 mb-5">
            <div className="text-[13px] font-medium mb-1">RSVP link</div>
            <div className="text-[12px] text-neutral-secondary mb-3">
              Share this link with guests so they can RSVP to your events.
            </div>
            <div className="flex gap-2">
              <div className="flex-1 px-3 py-2 bg-white border border-black/10 rounded-lg text-[12px] text-neutral-secondary truncate">
                {typeof window !== "undefined" ? window.location.origin : ""}/rsvp/invite
              </div>
              <Button variant="outline" onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/rsvp/invite`);
              }}>Copy link</Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Guest Modal */}
      <Modal open={showAddGuest} onClose={() => setShowAddGuest(false)} title="Add guest">
        <form onSubmit={handleAddGuest}>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-[12px] text-neutral-secondary mb-1">First name *</label>
              <input required value={newGuest.firstName} onChange={(e) => setNewGuest({ ...newGuest, firstName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-black/15 bg-neutral-bg text-[14px] focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-[12px] text-neutral-secondary mb-1">Last name *</label>
              <input required value={newGuest.lastName} onChange={(e) => setNewGuest({ ...newGuest, lastName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-black/15 bg-neutral-bg text-[14px] focus:outline-none focus:border-primary" />
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-[12px] text-neutral-secondary mb-1">Email</label>
            <input type="email" value={newGuest.email} onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-black/15 bg-neutral-bg text-[14px] focus:outline-none focus:border-primary" placeholder="guest@example.com" />
          </div>
          <div className="mb-3">
            <label className="block text-[12px] text-neutral-secondary mb-1">Phone</label>
            <input value={newGuest.phone} onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-black/15 bg-neutral-bg text-[14px] focus:outline-none focus:border-primary" placeholder="(312) 555-1234" />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-[12px] text-neutral-secondary mb-1">Side</label>
              <select value={newGuest.familySide} onChange={(e) => setNewGuest({ ...newGuest, familySide: e.target.value as "bride" | "groom" })}
                className="w-full px-3 py-2 rounded-lg border border-black/15 bg-neutral-bg text-[14px] focus:outline-none focus:border-primary">
                <option value="bride">Bride&apos;s side</option>
                <option value="groom">Groom&apos;s side</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] text-neutral-secondary mb-1">Relationship</label>
              <input value={newGuest.relationship} onChange={(e) => setNewGuest({ ...newGuest, relationship: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-black/15 bg-neutral-bg text-[14px] focus:outline-none focus:border-primary" placeholder="e.g. Cousin" />
            </div>
          </div>
          <Button type="submit" variant="primary" className="w-full" disabled={saving}>
            {saving ? "Adding…" : "Add guest"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}

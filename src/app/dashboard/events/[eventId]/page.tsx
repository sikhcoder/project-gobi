"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TabBar } from "@/components/ui/tab-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { EventHeaderBand } from "@/components/events/event-header-band";
import { RsvpStackedBar } from "@/components/events/rsvp-stacked-bar";
import { createClient } from "@/lib/supabase/client";
import { formatDate, formatCurrency, getInitials } from "@/lib/utils";
import { VENDOR_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/cn";
import type { WeddingEvent, Guest, GuestEventRSVP, VendorBooking, TimelineItem, RSVPStatus } from "@/lib/types";

const TABS = [
  { label: "Overview", value: "overview" },
  { label: "Guests & RSVP", value: "guests" },
  { label: "Vendors", value: "vendors" },
  { label: "Timeline", value: "timeline" },
];

const rsvpPillStyles: Record<RSVPStatus, string> = {
  confirmed: "bg-success-bg text-success-text",
  declined: "bg-danger-bg text-danger",
  pending: "bg-warning-bg text-warning-text",
};

interface PageProps {
  params: { eventId: string };
}

export default function EventDetailPage({ params }: PageProps) {
  const { eventId } = params;
  const [activeTab, setActiveTab] = useState("overview");
  const [rsvpFilter, setRsvpFilter] = useState<string>("all");
  const [event, setEvent] = useState<WeddingEvent | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [rsvps, setRsvps] = useState<GuestEventRSVP[]>([]);
  const [bookings, setBookings] = useState<VendorBooking[]>([]);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: e, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

      if (error || !e) {
        setNotFoundState(true);
        setLoading(false);
        return;
      }

      const mappedEvent: WeddingEvent = {
        id: e.id,
        weddingId: e.wedding_id,
        name: e.name,
        date: e.date ?? "",
        time: e.time ?? "",
        venue: e.venue ?? "",
        dressCode: e.dress_code ?? "",
        ceremonyType: e.ceremony_type,
        displayColor: e.display_color ?? "#534AB7",
        sortOrder: e.sort_order ?? 0,
        guestsInvited: 0,
        rsvpConfirmed: 0,
        createdAt: e.created_at,
      };
      setEvent(mappedEvent);

      const [
        { data: dbRsvps },
        { data: dbBookings },
        { data: dbTimeline },
      ] = await Promise.all([
        supabase
          .from("guest_event_rsvps")
          .select("*, guests(*)")
          .eq("event_id", eventId),
        supabase
          .from("vendor_bookings")
          .select("*")
          .eq("event_id", eventId),
        supabase
          .from("timeline_items")
          .select("*")
          .eq("event_id", eventId)
          .order("sort_order"),
      ]);

      // Extract guests from RSVPs
      const guestMap: Record<string, Guest> = {};
      (dbRsvps ?? []).forEach((r) => {
        if (r.guests) {
          const g = r.guests as Record<string, unknown>;
          guestMap[g.id as string] = {
            id: g.id as string,
            weddingId: g.wedding_id as string,
            firstName: g.first_name as string,
            lastName: g.last_name as string,
            email: (g.email as string) ?? "",
            phone: (g.phone as string) ?? "",
            familySide: (g.family_side as "bride" | "groom") ?? "bride",
            relationship: (g.relationship as string) ?? "",
            createdAt: g.created_at as string,
          };
        }
      });
      setGuests(Object.values(guestMap));

      setRsvps(
        (dbRsvps ?? []).map((r) => ({
          id: r.id,
          guestId: r.guest_id,
          eventId: r.event_id,
          status: r.status,
          respondedAt: r.responded_at ?? null,
          dietaryNotes: r.dietary_notes ?? "",
        }))
      );

      setBookings(
        (dbBookings ?? []).map((b) => ({
          id: b.id,
          weddingId: b.wedding_id,
          vendorId: b.vendor_id,
          vendorName: b.vendor_name,
          vendorCategory: b.vendor_category ?? "photography",
          eventId: b.event_id ?? "",
          status: b.status,
          totalAmount: Number(b.total_amount ?? 0),
          depositPaid: b.deposit_paid,
          depositAmount: Number(b.deposit_amount ?? 0),
          finalPaymentDueDate: b.final_payment_due_date ?? "",
        }))
      );

      setTimelineItems(
        (dbTimeline ?? []).map((t) => ({
          id: t.id,
          eventId: t.event_id,
          time: t.time,
          name: t.name,
          detail: t.detail ?? "",
          tags: t.tags ?? [],
          vendorName: t.vendor_name ?? undefined,
        }))
      );

      setLoading(false);
    }
    load();
  }, [eventId]);

  if (loading) {
    return (
      <div className="mt-10 text-center text-[13px] text-neutral-secondary">Loading event…</div>
    );
  }

  if (notFoundState || !event) return notFound();

  const confirmed = rsvps.filter((r) => r.status === "confirmed").length;
  const pending = rsvps.filter((r) => r.status === "pending").length;
  const declined = rsvps.filter((r) => r.status === "declined").length;
  const total = rsvps.length;
  const confirmedPct = total > 0 ? Math.round((confirmed / total) * 100) : 0;
  const pendingPct = total > 0 ? Math.round((pending / total) * 100) : 0;
  const declinedPct = total > 0 ? Math.round((declined / total) * 100) : 0;

  const filteredRsvpGuests = rsvpFilter === "all"
    ? rsvps
    : rsvps.filter((r) => r.status === rsvpFilter);

  function getCategoryLabel(cat: string) {
    return VENDOR_CATEGORIES.find((c) => c.value === cat)?.label ?? cat;
  }

  return (
    <div>
      <EventHeaderBand event={event} />
      <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {/* OVERVIEW */}
      {activeTab === "overview" && (
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Guests invited", value: total },
              { label: "Confirmed", value: `${confirmedPct}%` },
              { label: "Pending", value: `${pendingPct}%` },
              { label: "Vendors booked", value: bookings.length },
            ].map(({ label, value }) => (
              <div key={label} className="bg-neutral-bg rounded-xl px-4 py-3">
                <div className="text-[22px] font-medium">{value}</div>
                <div className="text-[11px] text-neutral-secondary">{label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="border border-black/10 rounded-xl p-4">
              <div className="text-[12px] font-medium text-neutral-secondary mb-3 uppercase tracking-wider">Event details</div>
              {[
                { label: "Date", value: event.date ? formatDate(event.date) : "TBD" },
                { label: "Time", value: event.time || "TBD" },
                { label: "Venue", value: event.venue || "TBD" },
                { label: "Dress code", value: event.dressCode || "—" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-2 border-b border-black/[0.06] last:border-0">
                  <span className="text-[12px] text-neutral-secondary">{label}</span>
                  <span className="text-[13px] font-medium">{value}</span>
                </div>
              ))}
            </div>

            <div className="border border-black/10 rounded-xl p-4">
              <div className="text-[12px] font-medium text-neutral-secondary mb-3 uppercase tracking-wider">RSVP breakdown</div>
              <RsvpStackedBar confirmed={confirmedPct} pending={pendingPct} declined={declinedPct} />
              <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                {[
                  { label: "Confirmed", value: confirmed, color: "text-success-text" },
                  { label: "Pending", value: pending, color: "text-warning-text" },
                  { label: "Declined", value: declined, color: "text-danger" },
                ].map(({ label, value, color }) => (
                  <div key={label}>
                    <div className={cn("text-[18px] font-medium", color)}>{value}</div>
                    <div className="text-[10px] text-neutral-secondary">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {bookings.length > 0 && (
            <div className="border border-black/10 rounded-xl p-4">
              <div className="text-[12px] font-medium text-neutral-secondary mb-3 uppercase tracking-wider">Vendors</div>
              <div className="space-y-2">
                {bookings.map((b) => (
                  <div key={b.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-pale flex items-center justify-center text-[11px] font-medium text-primary">
                      {getInitials(b.vendorName)}
                    </div>
                    <div className="flex-1">
                      <div className="text-[13px] font-medium">{b.vendorName}</div>
                      <div className="text-[11px] text-neutral-secondary">{getCategoryLabel(b.vendorCategory)}</div>
                    </div>
                    <StatusBadge status={b.status} />
                    <div className="text-[13px] font-medium">{formatCurrency(b.totalAmount)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* GUESTS & RSVP */}
      {activeTab === "guests" && (
        <div className="mt-5">
          <div className="flex gap-2 mb-4">
            {["all", "confirmed", "pending", "declined"].map((f) => (
              <button
                key={f}
                onClick={() => setRsvpFilter(f)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[12px] font-medium capitalize cursor-pointer transition-colors",
                  rsvpFilter === f
                    ? "bg-primary text-white"
                    : "bg-neutral-bg text-neutral-secondary hover:bg-black/10"
                )}
              >
                {f}
              </button>
            ))}
          </div>

          {filteredRsvpGuests.length === 0 ? (
            <div className="text-[13px] text-neutral-secondary text-center py-8">No guests yet.</div>
          ) : (
            <div className="space-y-2">
              {filteredRsvpGuests.map((rsvp) => {
                const guest = guests.find((g) => g.id === rsvp.guestId);
                if (!guest) return null;
                return (
                  <div key={rsvp.id} className="flex items-center gap-3 px-4 py-3 border border-black/10 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-primary-pale flex items-center justify-center text-[11px] font-medium text-primary">
                      {getInitials(`${guest.firstName} ${guest.lastName}`)}
                    </div>
                    <div className="flex-1">
                      <div className="text-[13px] font-medium">{guest.firstName} {guest.lastName}</div>
                      <div className="text-[11px] text-neutral-secondary">{guest.email}</div>
                    </div>
                    <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-md capitalize", rsvpPillStyles[rsvp.status])}>
                      {rsvp.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VENDORS */}
      {activeTab === "vendors" && (
        <div className="mt-5">
          {bookings.length === 0 ? (
            <div className="text-[13px] text-neutral-secondary text-center py-8">
              No vendors booked for this event yet.
            </div>
          ) : (
            <div className="space-y-2">
              {bookings.map((b) => (
                <div key={b.id} className="flex items-center gap-3 px-4 py-3 border border-black/10 rounded-xl">
                  <div className="w-9 h-9 rounded-full bg-primary-pale flex items-center justify-center text-[12px] font-medium text-primary shrink-0">
                    {getInitials(b.vendorName)}
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-medium">{b.vendorName}</div>
                    <div className="text-[11px] text-neutral-secondary">{getCategoryLabel(b.vendorCategory)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[13px] font-medium">{formatCurrency(b.totalAmount)}</div>
                    <StatusBadge status={b.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4">
            <Button variant="primary">+ Book vendor</Button>
          </div>
        </div>
      )}

      {/* TIMELINE */}
      {activeTab === "timeline" && (
        <div className="mt-5">
          {timelineItems.length === 0 ? (
            <div className="text-[13px] text-neutral-secondary text-center py-8">
              No timeline items for this event yet.
            </div>
          ) : (
            <div className="relative pl-8">
              {timelineItems.map((item, i) => (
                <div key={item.id} className="relative mb-4">
                  <div
                    className="absolute left-[-28px] w-4 h-4 rounded-full border-2 border-white"
                    style={{ backgroundColor: event.displayColor, top: 2 }}
                  />
                  {i < timelineItems.length - 1 && (
                    <div
                      className="absolute left-[-21px] top-4 bottom-[-16px] w-px"
                      style={{ backgroundColor: `${event.displayColor}40` }}
                    />
                  )}
                  <div className="text-[11px] text-neutral-secondary mb-0.5">{item.time}</div>
                  <div className="text-[13px] font-medium">{item.name}</div>
                  {item.detail && (
                    <div className="text-[12px] text-neutral-secondary">{item.detail}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

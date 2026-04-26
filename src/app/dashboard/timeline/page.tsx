"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TabBar } from "@/components/ui/tab-bar";
import { DayTabs } from "@/components/timeline/day-tabs";
import { EventBand } from "@/components/timeline/event-band";
import { createClient } from "@/lib/supabase/client";
import { useWedding } from "@/lib/context/wedding-context";
import type { WeddingEvent, VendorBooking, TimelineItem } from "@/lib/types";

const TABS = [
  { label: "Weekend overview", value: "weekend" },
  { label: "Timeline", value: "timeline" },
  { label: "Vendor call sheet", value: "callsheet" },
];

const HOURS = ["4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"];

export default function TimelinePage() {
  const { weddingId, partner1Name, partner2Name, city } = useWedding();
  const [activeTab, setActiveTab] = useState("weekend");
  const [activeDate, setActiveDate] = useState<string>("");
  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [bookings, setBookings] = useState<VendorBooking[]>([]);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [{ data: dbEvents }, { data: dbBookings }] = await Promise.all([
        supabase
          .from("events")
          .select("*")
          .eq("wedding_id", weddingId)
          .order("date")
          .order("sort_order"),
        supabase
          .from("vendor_bookings")
          .select("*")
          .eq("wedding_id", weddingId),
      ]);

      const mappedEvents: WeddingEvent[] = (dbEvents ?? []).map((e) => ({
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
      }));

      setEvents(mappedEvents);
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

      if (dbEvents && dbEvents.length > 0) {
        setActiveDate(dbEvents[0].date ?? "");

        // Load timeline items for all events
        const eventIds = dbEvents.map((e) => e.id);
        const { data: dbItems } = await supabase
          .from("timeline_items")
          .select("*")
          .in("event_id", eventIds)
          .order("sort_order");

        setTimelineItems(
          (dbItems ?? []).map((t) => ({
            id: t.id,
            eventId: t.event_id,
            time: t.time,
            name: t.name,
            detail: t.detail ?? "",
            tags: t.tags ?? [],
            vendorName: t.vendor_name ?? undefined,
          }))
        );
      }

      setLoading(false);
    }
    load();
  }, [weddingId]);

  const uniqueDates = Array.from(new Set(events.map((e) => e.date).filter(Boolean))).sort();

  const dayLabels: Record<string, string> = {};
  uniqueDates.forEach((d) => {
    const dt = new Date(d + "T00:00:00");
    dayLabels[d] = dt.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  });

  const days = uniqueDates.map((d) => ({
    date: dayLabels[d] ?? d,
    rawDate: d,
    label: d,
    eventCount: events.filter((e) => e.date === d).length,
  }));

  const activeDayObj = days.find((d) => d.rawDate === activeDate) ?? days[0];
  const eventsForDay = events.filter((e) => e.date === activeDayObj?.rawDate);

  // For the detailed timeline tab, show items for events on the active date
  const activeEventIds = eventsForDay.map((e) => e.id);
  const activeTimelineItems = timelineItems.filter((t) => activeEventIds.includes(t.eventId));

  const dateRange = uniqueDates.length >= 2
    ? `${dayLabels[uniqueDates[0]]} – ${dayLabels[uniqueDates[uniqueDates.length - 1]]}`
    : uniqueDates.length === 1
    ? dayLabels[uniqueDates[0]]
    : "No dates yet";

  if (loading) {
    return (
      <div className="mt-10 text-center text-[13px] text-neutral-secondary">Loading timeline…</div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-medium">Wedding weekend timeline</h2>
          <div className="text-[12px] text-neutral-secondary">
            {dateRange} · {events.length} events{city ? ` · ${city}` : ""}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Share with vendors</Button>
          <Button variant="primary">Export PDF</Button>
        </div>
      </div>

      <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {/* WEEKEND OVERVIEW */}
      {activeTab === "weekend" && (
        <div className="mt-5">
          {days.length > 0 ? (
            <>
              <DayTabs
                days={days.map((d) => ({ date: d.date, label: d.rawDate, eventCount: d.eventCount }))}
                activeDate={activeDate}
                onChange={setActiveDate}
              />
              <div>
                {eventsForDay.map((event) => (
                  <EventBand
                    key={event.id}
                    event={event}
                    tags={bookings
                      .filter((b) => b.eventId === event.id)
                      .map((b) => b.vendorName)}
                  />
                ))}
                {eventsForDay.length === 0 && (
                  <div className="text-[13px] text-neutral-secondary py-8 text-center">
                    No events on this day.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-[13px] text-neutral-secondary py-12 text-center">
              No events added yet. Add ceremonies on the overview page.
            </div>
          )}
        </div>
      )}

      {/* DETAILED TIMELINE */}
      {activeTab === "timeline" && (
        <div className="mt-5">
          {days.length > 0 && (
            <div className="mb-4">
              <DayTabs
                days={days.map((d) => ({ date: d.date, label: d.rawDate, eventCount: d.eventCount }))}
                activeDate={activeDate}
                onChange={setActiveDate}
              />
            </div>
          )}

          {activeTimelineItems.length === 0 ? (
            <div className="text-[13px] text-neutral-secondary py-12 text-center">
              No timeline items for this day. Add items to build your detailed schedule.
            </div>
          ) : (
            <div className="grid gap-0" style={{ gridTemplateColumns: "64px 1fr" }}>
              <div className="flex flex-col">
                {HOURS.map((h) => (
                  <div key={h} className="flex items-start pt-1" style={{ height: 64 }}>
                    <span className="text-[11px] text-neutral-secondary whitespace-nowrap">{h}</span>
                  </div>
                ))}
              </div>
              <div className="border-l border-black/10 pl-3">
                {HOURS.map((h) => {
                  const hourItems = activeTimelineItems.filter((t) => {
                    const tHour = parseInt(t.time.split(":")[0]);
                    const tMerid = t.time.includes("PM") && tHour !== 12 ? tHour + 12 : tHour;
                    const hHour = parseInt(h.split(" ")[0]);
                    const hMerid = h.includes("PM") && hHour !== 12 ? hHour + 12 : hHour;
                    return tMerid === hMerid;
                  });
                  return (
                    <div key={h} className="border-t border-black/[0.04]" style={{ height: 64 }}>
                      {hourItems.map((item) => {
                        const evt = events.find((e) => e.id === item.eventId);
                        return (
                          <div
                            key={item.id}
                            className="rounded-lg px-2.5 py-1.5 mr-2 cursor-pointer hover:opacity-90"
                            style={{ backgroundColor: `${evt?.displayColor ?? "#534AB7"}20` }}
                          >
                            <div className="text-[13px] font-medium">{item.name}</div>
                            <div className="text-[11px] text-neutral-secondary">{item.detail}</div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VENDOR CALL SHEET */}
      {activeTab === "callsheet" && (
        <div className="mt-5">
          {uniqueDates.length === 0 ? (
            <div className="text-[13px] text-neutral-secondary py-12 text-center">
              No events yet. Add events and vendor bookings to generate a call sheet.
            </div>
          ) : (
            uniqueDates.map((date) => {
              const dayBookings = bookings.filter((b) =>
                events.find((e) => e.id === b.eventId && e.date === date)
              );
              if (dayBookings.length === 0) return null;
              return (
                <div key={date} className="mb-6">
                  <div className="text-[11px] font-medium text-neutral-secondary uppercase tracking-wider mb-3">
                    {dayLabels[date] ?? date}
                  </div>
                  <div className="border border-black/10 rounded-xl overflow-hidden">
                    <div
                      className="grid gap-2 px-4 py-2.5 bg-neutral-bg"
                      style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}
                    >
                      {["Vendor", "Arrive", "Contact", "Event"].map((h) => (
                        <span
                          key={h}
                          className="text-[11px] font-medium text-neutral-secondary uppercase tracking-wider"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                    {dayBookings.map((booking) => {
                      const evt = events.find((e) => e.id === booking.eventId);
                      return (
                        <div
                          key={booking.id}
                          className="grid gap-2 px-4 py-3 border-t border-black/[0.06] items-center"
                          style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}
                        >
                          <div>
                            <div className="text-[13px] font-medium">{booking.vendorName}</div>
                            <div className="text-[11px] text-neutral-secondary capitalize">
                              {booking.vendorCategory.replace("-", " ")}
                            </div>
                          </div>
                          <div className="text-[13px]">{evt?.time ?? "—"}</div>
                          <div className="text-[12px] text-neutral-secondary">On file</div>
                          {evt && (
                            <span
                              className="text-[10px] font-medium px-2 py-0.5 rounded-md inline-block w-fit"
                              style={{
                                backgroundColor: `${evt.displayColor}20`,
                                color: evt.displayColor,
                              }}
                            >
                              {evt.name}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

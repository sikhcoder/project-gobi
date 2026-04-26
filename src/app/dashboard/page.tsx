import { createClient } from "@/lib/supabase/server";
import { StatGrid } from "@/components/ui/stat-grid";
import { StatCard } from "@/components/ui/stat-card";
import { EventsSection } from "@/components/dashboard/events-section";
import { VendorsPanel } from "@/components/dashboard/vendors-panel";
import { ChecklistPanel } from "@/components/dashboard/checklist-panel";
import { BudgetPanel } from "@/components/dashboard/budget-panel";
import { SitePanel } from "@/components/dashboard/site-panel";
import { daysUntil } from "@/lib/utils";
import type { WeddingEvent, VendorBooking, ChecklistItem } from "@/lib/types";

export default async function DashboardOverview() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: wedding } = await supabase
    .from("weddings")
    .select("id, date, url_slug, total_amount")
    .eq("couple_user_id", user!.id)
    .single();

  if (!wedding) return null;

  const { data: dbEvents } = await supabase
    .from("events")
    .select("*")
    .eq("wedding_id", wedding.id)
    .order("date", { ascending: true })
    .order("sort_order", { ascending: true });

  const { data: dbBookings } = await supabase
    .from("vendor_bookings")
    .select("*")
    .eq("wedding_id", wedding.id);

  const { data: dbBudget } = await supabase
    .from("budgets")
    .select("total_amount, budget_categories(allocated_amount)")
    .eq("wedding_id", wedding.id)
    .single();

  const eventIds = (dbEvents ?? []).map((e) => e.id);
  const { data: dbRsvps } = eventIds.length > 0
    ? await supabase
        .from("guest_event_rsvps")
        .select("event_id, status")
        .in("event_id", eventIds)
    : { data: [] };

  const events = dbEvents ?? [];
  const bookings = dbBookings ?? [];
  const rsvps = dbRsvps ?? [];

  const mappedEvents: WeddingEvent[] = events.map((e) => ({
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
    guestsInvited: rsvps.filter((r) => r.event_id === e.id).length,
    rsvpConfirmed: rsvps.filter((r) => r.event_id === e.id && r.status === "confirmed").length,
    createdAt: e.created_at,
  }));

  const mappedBookings: VendorBooking[] = bookings.map((b) => ({
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
  }));

  const totalRsvps = rsvps.filter((r) => r.status === "confirmed").length;
  const totalRsvpCount = rsvps.length;
  const totalBudget = Number(dbBudget?.total_amount ?? 0);
  const totalAllocated = (dbBudget?.budget_categories ?? []).reduce(
    (sum: number, bc: { allocated_amount: unknown }) => sum + Number(bc.allocated_amount ?? 0),
    0
  );

  const checklist: ChecklistItem[] = [];

  return (
    <div>
      <StatGrid>
        <StatCard
          label="Days to wedding"
          value={wedding.date ? daysUntil(wedding.date) : "—"}
          subtext={wedding.date ?? "Date TBD"}
        />
        <StatCard
          label="Events planned"
          value={events.length}
          subtext={`${bookings.length} vendor booking${bookings.length !== 1 ? "s" : ""}`}
        />
        <StatCard
          label="RSVPs confirmed"
          value={totalRsvps}
          subtext={
            totalRsvpCount > 0
              ? `${Math.round((totalRsvps / totalRsvpCount) * 100)}% responded`
              : "No RSVPs yet"
          }
        />
        <StatCard
          label="Vendors booked"
          value={bookings.length}
          subtext={`${bookings.filter((b) => b.status === "confirmed").length} confirmed`}
        />
      </StatGrid>

      <div className="mt-6 mb-2">
        <span className="text-[11px] font-medium text-neutral-secondary uppercase tracking-wider">
          Your events
        </span>
      </div>

      <EventsSection events={mappedEvents} />

      <div className="grid grid-cols-2 gap-3 mt-6">
        <VendorsPanel bookings={mappedBookings} />
        <ChecklistPanel items={checklist} />
      </div>

      <div className="grid grid-cols-2 gap-3 mt-3">
        <BudgetPanel spent={totalAllocated} total={totalBudget} />
        <SitePanel slug={wedding.url_slug ?? ""} />
      </div>
    </div>
  );
}

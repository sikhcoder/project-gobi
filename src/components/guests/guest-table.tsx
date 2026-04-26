"use client";

import { cn } from "@/lib/cn";
import { getInitials } from "@/lib/utils";
import type { Guest, GuestEventRSVP, WeddingEvent, RSVPStatus } from "@/lib/types";

const rsvpPillStyles: Record<RSVPStatus, string> = {
  confirmed: "bg-success-bg text-success-text",
  declined: "bg-danger-bg text-danger",
  pending: "bg-warning-bg text-warning-text",
};

interface GuestTableProps {
  guests: Guest[];
  events: WeddingEvent[];
  rsvps: GuestEventRSVP[];
  activeEventId: string | null;
  onSelectGuest: (guest: Guest) => void;
  selectedGuestId: string | null;
}

export function GuestTable({
  guests,
  events,
  rsvps,
  activeEventId,
  onSelectGuest,
  selectedGuestId,
}: GuestTableProps) {
  const filteredGuests = activeEventId
    ? guests.filter((g) => rsvps.some((r) => r.guestId === g.id && r.eventId === activeEventId))
    : guests;

  function getRsvpForGuestEvent(guestId: string, eventId: string): GuestEventRSVP | undefined {
    return rsvps.find((r) => r.guestId === guestId && r.eventId === eventId);
  }

  return (
    <div className="border border-black/10 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="grid gap-2 px-4 py-2.5 bg-neutral-bg" style={{ gridTemplateColumns: "2fr 1fr 80px 1fr 60px" }}>
        <span className="text-[11px] font-medium text-neutral-secondary uppercase tracking-wider">Name</span>
        <span className="text-[11px] font-medium text-neutral-secondary uppercase tracking-wider">Side</span>
        <span className="text-[11px] font-medium text-neutral-secondary uppercase tracking-wider">Events</span>
        <span className="text-[11px] font-medium text-neutral-secondary uppercase tracking-wider">RSVP status</span>
        <span />
      </div>

      {filteredGuests.map((guest) => {
        const overallRsvp = getRsvpForGuestEvent(guest.id, "evt-4"); // use wedding ceremony as overall indicator
        const status: RSVPStatus = overallRsvp?.status ?? "pending";

        return (
          <div
            key={guest.id}
            onClick={() => onSelectGuest(guest)}
            className={cn(
              "grid gap-2 px-4 py-3 items-center border-t border-black/[0.06] cursor-pointer transition-colors",
              selectedGuestId === guest.id ? "bg-primary-pale" : "hover:bg-neutral-bg"
            )}
            style={{ gridTemplateColumns: "2fr 1fr 80px 1fr 60px" }}
          >
            {/* Name + email */}
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium flex-shrink-0"
                style={{ backgroundColor: "#EEEDFE", color: "#3C3489" }}
              >
                {getInitials(`${guest.firstName} ${guest.lastName}`)}
              </div>
              <div>
                <div className="text-[13px] font-medium">{guest.firstName} {guest.lastName}</div>
                <div className="text-[11px] text-neutral-secondary">{guest.email}</div>
              </div>
            </div>

            {/* Side */}
            <span className="text-[12px] text-neutral-secondary capitalize">{guest.familySide}</span>

            {/* Event color dots */}
            <div className="flex gap-1.5 flex-wrap">
              {events.map((evt) => {
                const rsvp = getRsvpForGuestEvent(guest.id, evt.id);
                if (!rsvp) return null;
                return (
                  <span
                    key={evt.id}
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: rsvp.status === "declined" ? "#ccc" : evt.displayColor }}
                    title={`${evt.name}: ${rsvp.status}`}
                  />
                );
              })}
            </div>

            {/* RSVP status pill */}
            <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-md self-start mt-0.5 capitalize", rsvpPillStyles[status])}>
              {status}
            </span>

            {/* Action */}
            <span className="text-[12px] text-primary font-medium cursor-pointer hover:underline">View</span>
          </div>
        );
      })}
    </div>
  );
}

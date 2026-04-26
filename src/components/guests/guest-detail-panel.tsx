import { cn } from "@/lib/cn";
import { getInitials, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Guest, GuestEventRSVP, WeddingEvent, RSVPStatus } from "@/lib/types";

const rsvpPillStyles: Record<RSVPStatus, string> = {
  confirmed: "bg-success-bg text-success-text",
  declined: "bg-danger-bg text-danger",
  pending: "bg-warning-bg text-warning-text",
};

interface GuestDetailPanelProps {
  guest: Guest;
  events: WeddingEvent[];
  rsvps: GuestEventRSVP[];
  onClose: () => void;
  onDelete?: () => void;
}

export function GuestDetailPanel({ guest, events, rsvps, onClose, onDelete }: GuestDetailPanelProps) {
  const guestRsvps = rsvps.filter((r) => r.guestId === guest.id);
  const dietaryNotes = guestRsvps.find((r) => r.dietaryNotes)?.dietaryNotes ?? "";

  return (
    <div className="border border-black/10 rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-black/[0.08]">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-[15px] font-medium flex-shrink-0"
          style={{ backgroundColor: "#EEEDFE", color: "#3C3489" }}
        >
          {getInitials(`${guest.firstName} ${guest.lastName}`)}
        </div>
        <div className="flex-1">
          <div className="text-[16px] font-medium mb-0.5">{guest.firstName} {guest.lastName}</div>
          <div className="text-[12px] text-neutral-secondary capitalize">{guest.familySide}&apos;s side · {guest.relationship}</div>
          <div className="text-[11px] text-neutral-secondary">{guest.email} · {guest.phone}</div>
        </div>
        <button onClick={onClose} className="text-neutral-secondary text-[18px] leading-none cursor-pointer hover:text-neutral-text">×</button>
      </div>

      {/* Per-event RSVP */}
      <div className="text-[11px] font-medium text-neutral-secondary uppercase tracking-wider mb-3">RSVP by event</div>
      <div className="mb-4">
        {events.map((event) => {
          const rsvp = guestRsvps.find((r) => r.eventId === event.id);
          const status: RSVPStatus = rsvp?.status ?? "pending";
          return (
            <div key={event.id} className="flex items-center justify-between py-2.5 border-b border-black/[0.06] last:border-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: event.displayColor }} />
                <div>
                  <div className="text-[13px] font-medium">{event.name}</div>
                  <div className="text-[11px] text-neutral-secondary">{formatDate(event.date)} · {event.time}</div>
                </div>
              </div>
              <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-md capitalize", rsvpPillStyles[status])}>
                {status}
              </span>
            </div>
          );
        })}
      </div>

      {/* Dietary notes */}
      {dietaryNotes && (
        <div className="bg-neutral-bg rounded-lg p-3 mb-4 text-[12px] text-neutral-secondary">
          <span className="font-medium text-neutral-text">Dietary notes: </span>{dietaryNotes}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {onDelete && (
          <Button variant="outline" size="sm" className="flex-1" onClick={onDelete}>Remove</Button>
        )}
      </div>
    </div>
  );
}

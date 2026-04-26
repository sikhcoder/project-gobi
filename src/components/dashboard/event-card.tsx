import Link from "next/link";
import { Card } from "@/components/ui/card";
import { EventDot } from "@/components/ui/event-dot";
import { formatDate } from "@/lib/utils";
import type { WeddingEvent } from "@/lib/types";

export function EventCard({ event }: { event: WeddingEvent }) {
  const pct =
    event.guestsInvited > 0
      ? Math.round((event.rsvpConfirmed / event.guestsInvited) * 100)
      : 0;

  return (
    <Link href={`/dashboard/events/${event.id}`}>
      <Card padding="p-3.5" className="hover:border-black/20 transition-colors cursor-pointer">
        <div className="flex items-center gap-2 mb-2">
          <EventDot color={event.displayColor} />
          <span className="text-[13px] font-medium">{event.name}</span>
        </div>
        <div className="text-[11px] text-neutral-secondary mb-3">
          {formatDate(event.date)} · {event.time}
        </div>
        <div className="w-full rounded-full bg-black/[0.06]" style={{ height: 3 }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${pct}%`, backgroundColor: event.displayColor }}
          />
        </div>
        <div className="text-[11px] text-neutral-secondary mt-2">
          {event.rsvpConfirmed} of {event.guestsInvited} RSVPs
        </div>
      </Card>
    </Link>
  );
}

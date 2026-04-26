import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { WeddingEvent } from "@/lib/types";

export function EventHeaderBand({ event }: { event: WeddingEvent }) {
  return (
    <div
      className="rounded-xl p-6 mb-6 flex items-start justify-between gap-4"
      style={{ backgroundColor: "#1A0F38" }}
    >
      <div className="flex items-center gap-3.5">
        <span
          className="w-3.5 h-3.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: event.displayColor }}
        />
        <div>
          <div className="text-[22px] font-medium mb-1" style={{ color: "#EDD9FF" }}>{event.name}</div>
          <div className="text-[13px]" style={{ color: "#C9A8F0" }}>
            {formatDate(event.date)} · {event.time} · {event.venue}
          </div>
        </div>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button
          className="px-3.5 py-1.5 rounded-lg text-[12px] cursor-pointer border border-white/20 transition-colors hover:bg-white/10"
          style={{ color: "#EDD9FF" }}
        >
          Edit event
        </button>
        <Button variant="primary" size="sm">Send RSVPs</Button>
      </div>
    </div>
  );
}

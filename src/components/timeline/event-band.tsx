import type { WeddingEvent } from "@/lib/types";

interface EventBandProps {
  event: WeddingEvent;
  tags?: string[];
}

export function EventBand({ event, tags = [] }: EventBandProps) {
  return (
    <div
      className="rounded-r-xl p-3.5 mb-3"
      style={{ borderLeft: `4px solid ${event.displayColor}`, backgroundColor: `${event.displayColor}12` }}
    >
      <div className="text-[14px] font-medium mb-1">{event.name}</div>
      <div className="text-[12px] text-neutral-secondary mb-2">
        {event.time} · {event.venue} · {event.guestsInvited} guests
      </div>
      {tags.length > 0 && (
        <div className="flex gap-1.5 flex-wrap">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-md"
              style={{ backgroundColor: `${event.displayColor}20`, color: event.displayColor }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { cn } from "@/lib/cn";
import type { WeddingEvent } from "@/lib/types";

interface EventFilterPillsProps {
  events: WeddingEvent[];
  activeEventId: string | null;
  onChange: (eventId: string | null) => void;
}

export function EventFilterPills({ events, activeEventId, onChange }: EventFilterPillsProps) {
  return (
    <div className="flex gap-2 flex-wrap mb-4">
      <button
        onClick={() => onChange(null)}
        className={cn(
          "px-3 py-1 rounded-full text-[12px] border transition-colors cursor-pointer",
          activeEventId === null
            ? "bg-primary border-primary text-white font-medium"
            : "bg-white border-black/15 text-neutral-secondary hover:border-black/30"
        )}
      >
        All events
      </button>
      {events.map((event) => (
        <button
          key={event.id}
          onClick={() => onChange(event.id)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] border transition-colors cursor-pointer",
            activeEventId === event.id
              ? "border-black/30 font-medium text-neutral-text"
              : "bg-white border-black/15 text-neutral-secondary hover:border-black/30"
          )}
        >
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: event.displayColor }}
          />
          {event.name}
        </button>
      ))}
    </div>
  );
}

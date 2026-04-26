import { EventCard } from "./event-card";
import type { WeddingEvent } from "@/lib/types";

interface EventsGridProps {
  events: WeddingEvent[];
  onAddEvent?: () => void;
}

export function EventsGrid({ events, onAddEvent }: EventsGridProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
      <button
        type="button"
        onClick={onAddEvent}
        className="flex items-center justify-center border-2 border-dashed border-black/15 rounded-xl text-sm text-neutral-secondary hover:border-primary-light hover:text-primary transition-colors cursor-pointer min-h-[120px]"
      >
        + Add ceremony
      </button>
    </div>
  );
}

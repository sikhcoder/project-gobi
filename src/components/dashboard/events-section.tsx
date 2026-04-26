"use client";

import { useState } from "react";
import { EventsGrid } from "./events-grid";
import { AddEventModal } from "./add-event-modal";
import type { WeddingEvent } from "@/lib/types";

export function EventsSection({ events }: { events: WeddingEvent[] }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {events.length > 0 ? (
        <EventsGrid events={events} onAddEvent={() => setShowModal(true)} />
      ) : (
        <button
          onClick={() => setShowModal(true)}
          className="w-full border-2 border-dashed border-black/15 rounded-xl flex items-center justify-center py-10 text-[13px] text-neutral-secondary hover:border-primary-light hover:text-primary transition-colors cursor-pointer"
        >
          No events yet — click to add your first ceremony
        </button>
      )}
      <AddEventModal open={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}

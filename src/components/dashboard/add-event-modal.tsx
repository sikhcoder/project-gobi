"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useWedding } from "@/lib/context/wedding-context";
import { CEREMONY_COLORS } from "@/lib/constants";
import { cn } from "@/lib/cn";
import type { CeremonyType } from "@/lib/types";

const CEREMONY_OPTIONS: { value: CeremonyType; label: string }[] = [
  { value: "mehndi", label: "Mehndi" },
  { value: "haldi", label: "Haldi" },
  { value: "sangeet", label: "Sangeet" },
  { value: "baraat", label: "Baraat" },
  { value: "wedding", label: "Wedding Ceremony" },
  { value: "reception", label: "Reception" },
  { value: "anand-karaj", label: "Anand Karaj" },
  { value: "nikah", label: "Nikah" },
  { value: "custom", label: "Custom" },
];

export function AddEventModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { weddingId } = useWedding();
  const router = useRouter();
  const [name, setName] = useState("");
  const [ceremonyType, setCeremonyType] = useState<CeremonyType>("custom");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const displayColor = CEREMONY_COLORS[ceremonyType] ?? "#534AB7";
    const eventName = name || CEREMONY_OPTIONS.find((c) => c.value === ceremonyType)?.label || "Event";

    await supabase.from("events").insert({
      wedding_id: weddingId,
      name: eventName,
      ceremony_type: ceremonyType,
      display_color: displayColor,
      date: date || null,
      time: time || null,
      venue: venue || null,
    });

    setSaving(false);
    onClose();
    setName(""); setDate(""); setTime(""); setVenue(""); setCeremonyType("custom");
    router.refresh();
  }

  return (
    <Modal open={open} onClose={onClose} title="Add ceremony">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block text-[12px] text-neutral-secondary mb-1">Ceremony type</label>
          <div className="flex flex-wrap gap-2">
            {CEREMONY_OPTIONS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => { setCeremonyType(c.value); if (!name) setName(c.label); }}
                className={cn(
                  "px-3 py-1.5 rounded-full text-[12px] border transition-colors cursor-pointer",
                  ceremonyType === c.value
                    ? "bg-primary border-primary text-white font-medium"
                    : "bg-white border-black/15 text-neutral-secondary hover:border-black/30"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-3">
          <label className="block text-[12px] text-neutral-secondary mb-1">Event name</label>
          <input value={name} onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-black/15 bg-neutral-bg text-[14px] focus:outline-none focus:border-primary"
            placeholder="e.g. Sangeet Night" />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-[12px] text-neutral-secondary mb-1">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-black/15 bg-neutral-bg text-[14px] focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-[12px] text-neutral-secondary mb-1">Time</label>
            <input value={time} onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-black/15 bg-neutral-bg text-[14px] focus:outline-none focus:border-primary"
              placeholder="7:00 PM" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-[12px] text-neutral-secondary mb-1">Venue</label>
          <input value={venue} onChange={(e) => setVenue(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-black/15 bg-neutral-bg text-[14px] focus:outline-none focus:border-primary"
            placeholder="e.g. Grand Ballroom, Palmer House" />
        </div>
        <Button type="submit" variant="primary" className="w-full" disabled={saving}>
          {saving ? "Adding…" : "Add ceremony"}
        </Button>
      </form>
    </Modal>
  );
}

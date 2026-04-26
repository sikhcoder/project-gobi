"use client";

import { useState } from "react";
import Link from "next/link";
import { mockWedding, mockEvents } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/cn";

export default function RsvpPage() {
  const [responses, setResponses] = useState<Record<string, "yes" | "no" | null>>(
    Object.fromEntries(mockEvents.map((e) => [e.id, null]))
  );
  const [dietary, setDietary] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function toggleResponse(eventId: string, val: "yes" | "no") {
    setResponses((prev) => ({ ...prev, [eventId]: val }));
  }

  if (submitted) {
    const attending = mockEvents.filter((e) => responses[e.id] === "yes");
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#f5f4f0" }}>
        <div className="max-w-sm w-full text-center">
          <div className="w-14 h-14 rounded-full bg-success-bg flex items-center justify-center text-[24px] mx-auto mb-4">✓</div>
          <h2 className="text-[20px] font-medium mb-1.5">RSVP received!</h2>
          <p className="text-[13px] text-neutral-secondary mb-6 leading-relaxed">
            Thank you for responding. We can&apos;t wait to celebrate with you.
          </p>

          {attending.length > 0 && (
            <div className="bg-white border border-black/10 rounded-xl p-4 mb-5 text-left">
              <div className="text-[11px] font-medium text-neutral-secondary uppercase tracking-wider mb-3">You&apos;re attending</div>
              {attending.map((evt) => (
                <div key={evt.id} className="flex items-center gap-2 py-2 border-b border-black/[0.06] last:border-0">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: evt.displayColor }} />
                  <div>
                    <div className="text-[13px] font-medium">{evt.name}</div>
                    <div className="text-[11px] text-neutral-secondary">{formatDate(evt.date)} · {evt.time}</div>
                  </div>
                  <span className="ml-auto text-[10px] font-medium px-2 py-0.5 rounded-md bg-success-bg text-success-text">Confirmed</span>
                </div>
              ))}
            </div>
          )}

          <Link href="/" className="text-[13px] text-primary hover:underline">Change your response</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f4f0" }}>
      <div className="max-w-sm mx-auto px-4 py-8">
        {/* Dark hero */}
        <div className="rounded-xl p-7 text-center mb-5" style={{ backgroundColor: "#2C1A4E" }}>
          <div className="text-[11px] font-medium tracking-widest mb-2" style={{ color: "#C9A8F0" }}>
            YOU&apos;RE INVITED
          </div>
          <div className="text-[20px] font-medium mb-1.5 tracking-wider" style={{ color: "#EDD9FF" }}>
            {mockWedding.partner1Name} &amp; {mockWedding.partner2Name}
          </div>
          <div className="flex items-center gap-2 justify-center mb-2">
            <div className="h-px w-10" style={{ backgroundColor: "#7F57B8" }} />
            <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: "#C9A8F0" }} />
            <div className="h-px w-10" style={{ backgroundColor: "#7F57B8" }} />
          </div>
          <div className="text-[12px]" style={{ color: "#C9A8F0" }}>
            {formatDate(mockWedding.date)} · {mockWedding.city}
          </div>
        </div>

        <p className="text-[13px] text-neutral-secondary text-center mb-5 leading-relaxed">
          Please let us know which events you&apos;ll be joining. RSVP by October 1, 2025.
        </p>

        {/* Event cards */}
        <div className="space-y-3 mb-5">
          {mockEvents.map((event) => (
            <div key={event.id} className="bg-white border border-black/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: event.displayColor }} />
                <span className="text-[14px] font-medium">{event.name}</span>
              </div>
              <div className="text-[12px] text-neutral-secondary mb-1 ml-4">
                {formatDate(event.date)} · {event.time}
              </div>
              <div className="text-[12px] text-neutral-secondary mb-4 ml-4">{event.venue}</div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleResponse(event.id, "yes")}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-[13px] font-medium border transition-colors cursor-pointer",
                    responses[event.id] === "yes"
                      ? "bg-success-bg border-success text-success-text"
                      : "bg-white border-black/15 text-neutral-secondary hover:border-black/30"
                  )}
                >
                  Yes, I&apos;ll be there
                </button>
                <button
                  onClick={() => toggleResponse(event.id, "no")}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-[13px] font-medium border transition-colors cursor-pointer",
                    responses[event.id] === "no"
                      ? "bg-danger-bg border-danger/40 text-danger"
                      : "bg-white border-black/15 text-neutral-secondary hover:border-black/30"
                  )}
                >
                  Can&apos;t make it
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Dietary notes */}
        <div className="mb-5">
          <label className="block text-[12px] font-medium text-neutral-secondary mb-1.5">
            Dietary requirements (optional)
          </label>
          <textarea
            value={dietary}
            onChange={(e) => setDietary(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-black/15 bg-white text-[14px] resize-none focus:outline-none focus:border-primary"
            rows={3}
            placeholder="e.g. Vegetarian, gluten-free, nut allergy…"
          />
        </div>

        <button
          onClick={() => setSubmitted(true)}
          className="w-full py-3 rounded-xl bg-primary text-white text-[14px] font-medium cursor-pointer hover:bg-primary-dark transition-colors"
        >
          Submit RSVP
        </button>
      </div>
    </div>
  );
}

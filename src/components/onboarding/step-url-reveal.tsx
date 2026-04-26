"use client";

import { Button } from "@/components/ui/button";
import { generateSlug } from "@/lib/utils";

interface StepUrlRevealProps {
  partner1: string;
  partner2: string;
  eventCount: number;
  onFinish: () => void;
  saving?: boolean;
}

export function StepUrlReveal({
  partner1,
  partner2,
  eventCount,
  onFinish,
  saving = false,
}: StepUrlRevealProps) {
  const slug = generateSlug(partner1 || "your", partner2 || "names");
  const features = [
    `${eventCount} event pages created`,
    "RSVP system ready",
    "Guest dashboard set up",
    "Budget tracker active",
  ];

  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-neutral-secondary mb-2">
        Step 4
      </div>
      <h2 className="text-xl font-medium mb-1">Your wedding site is live!</h2>
      <p className="text-[13px] text-neutral-secondary mb-5">
        Share it with your guests
      </p>

      <div className="flex items-center justify-between bg-neutral-bg rounded-lg px-4 py-3 mb-4">
        <span className="text-[13px]">
          shaadi.com/<span className="text-primary font-medium">{slug}</span>
        </span>
        <button
          type="button"
          className="text-xs text-primary font-medium cursor-pointer hover:text-primary-dark"
        >
          Copy
        </button>
      </div>

      <div className="border border-black/10 rounded-[10px] p-3.5 mb-5">
        <div className="text-xs font-medium mb-2">What we set up for you:</div>
        <ul className="space-y-1.5">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-[13px]">
              <span className="w-2 h-2 rounded-full bg-success shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <Button size="full" onClick={onFinish} disabled={saving}>
        {saving ? "Setting up your dashboard…" : "Go to my dashboard"}
      </Button>
    </div>
  );
}

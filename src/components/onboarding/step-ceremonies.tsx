"use client";

import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { CEREMONY_LABELS, CEREMONY_COLORS } from "@/lib/constants";
import type { CeremonyType } from "@/lib/types";

const ALL_CEREMONIES: CeremonyType[] = [
  "mehndi",
  "haldi",
  "sangeet",
  "baraat",
  "wedding",
  "reception",
];

interface StepCeremoniesProps {
  selected: CeremonyType[];
  onToggle: (c: CeremonyType) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function StepCeremonies({
  selected,
  onToggle,
  onContinue,
  onBack,
}: StepCeremoniesProps) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-neutral-secondary mb-2">
        Step 2
      </div>
      <h2 className="text-xl font-medium mb-1">Select ceremonies</h2>
      <p className="text-[13px] text-neutral-secondary mb-5">
        Choose the events for your wedding
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {ALL_CEREMONIES.map((c) => {
          const isSelected = selected.includes(c);
          return (
            <button
              key={c}
              type="button"
              onClick={() => onToggle(c)}
              className={cn(
                "flex items-center gap-2.5 p-3 rounded-[10px] border text-left transition-colors cursor-pointer",
                isSelected
                  ? "border-primary-light bg-primary-pale"
                  : "border-black/10 bg-white hover:border-black/20"
              )}
            >
              <span
                className="w-7 h-7 rounded-md shrink-0"
                style={{ backgroundColor: CEREMONY_COLORS[c] }}
              />
              <div>
                <div className="text-[13px] font-medium">
                  {CEREMONY_LABELS[c]}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        <Button size="full" onClick={onContinue}>
          Continue with {selected.length} events
        </Button>
        <Button size="full" variant="ghost" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
}

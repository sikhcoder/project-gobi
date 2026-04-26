"use client";

import { InputField } from "@/components/ui/input-field";
import { SelectionPill } from "@/components/ui/selection-pill";
import { Button } from "@/components/ui/button";
import { TRADITIONS } from "@/lib/constants";
import type { Tradition } from "@/lib/types";

interface StepBasicsProps {
  partner1: string;
  partner2: string;
  date: string;
  city: string;
  tradition: Tradition | null;
  onPartner1Change: (v: string) => void;
  onPartner2Change: (v: string) => void;
  onDateChange: (v: string) => void;
  onCityChange: (v: string) => void;
  onTraditionChange: (v: Tradition) => void;
  onContinue: () => void;
}

export function StepBasics({
  partner1,
  partner2,
  date,
  city,
  tradition,
  onPartner1Change,
  onPartner2Change,
  onDateChange,
  onCityChange,
  onTraditionChange,
  onContinue,
}: StepBasicsProps) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-neutral-secondary mb-2">
        Step 1
      </div>
      <h2 className="text-xl font-medium mb-1">The basics</h2>
      <p className="text-[13px] text-neutral-secondary mb-5">
        Tell us about you and your partner
      </p>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <InputField
          label="Partner 1"
          placeholder="Priya"
          value={partner1}
          onChange={(e) => onPartner1Change(e.target.value)}
        />
        <InputField
          label="Partner 2"
          placeholder="Arjun"
          value={partner2}
          onChange={(e) => onPartner2Change(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-3 mb-5">
        <InputField
          label="Wedding date"
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
        />
        <InputField
          label="City"
          placeholder="Chicago, IL"
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
        />
      </div>

      <div className="mb-5">
        <div className="text-xs text-neutral-secondary mb-2">Tradition</div>
        <div className="flex flex-wrap gap-2">
          {TRADITIONS.map((t) => (
            <SelectionPill
              key={t.value}
              selected={tradition === t.value}
              onClick={() => onTraditionChange(t.value)}
            >
              {t.label}
            </SelectionPill>
          ))}
        </div>
      </div>

      <Button size="full" onClick={onContinue}>
        Continue
      </Button>
    </div>
  );
}

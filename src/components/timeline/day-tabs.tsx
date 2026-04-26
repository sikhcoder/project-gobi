"use client";

import { cn } from "@/lib/cn";

interface DayTab {
  date: string;
  label: string;
  eventCount: number;
}

interface DayTabsProps {
  days: DayTab[];
  activeDate: string;
  onChange: (date: string) => void;
}

export function DayTabs({ days, activeDate, onChange }: DayTabsProps) {
  return (
    <div className="flex gap-2 mb-6 flex-wrap">
      {days.map((day) => (
        <button
          key={day.date}
          onClick={() => onChange(day.date)}
          className={cn(
            "px-4 py-2.5 rounded-xl border text-left transition-colors cursor-pointer",
            activeDate === day.date
              ? "bg-primary border-primary text-white"
              : "bg-white border-black/12 hover:border-black/25"
          )}
        >
          <div className={cn("text-[11px] mb-0.5", activeDate === day.date ? "text-white/70" : "text-neutral-secondary")}>
            {day.label}
          </div>
          <div className={cn("text-[13px] font-medium", activeDate === day.date ? "text-white" : "text-neutral-text")}>
            {day.date}
          </div>
          <div className={cn("text-[10px] mt-0.5", activeDate === day.date ? "text-white/60" : "text-neutral-secondary")}>
            {day.eventCount} event{day.eventCount !== 1 ? "s" : ""}
          </div>
        </button>
      ))}
    </div>
  );
}

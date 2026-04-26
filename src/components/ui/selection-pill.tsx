"use client";

import { cn } from "@/lib/cn";

interface SelectionPillProps {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export function SelectionPill({ selected, onClick, children }: SelectionPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3.5 py-1.5 rounded-full text-xs border transition-colors cursor-pointer",
        selected
          ? "bg-primary-pale border-primary-light text-primary-dark font-medium"
          : "bg-white border-black/15 text-neutral-secondary hover:border-black/30"
      )}
    >
      {children}
    </button>
  );
}

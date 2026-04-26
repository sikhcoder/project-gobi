"use client";

import { cn } from "@/lib/cn";

interface CategoryPillsProps {
  categories: { value: string; label: string }[];
  active: string | null;
  onChange: (value: string | null) => void;
}

export function CategoryPills({ categories, active, onChange }: CategoryPillsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      <button
        type="button"
        onClick={() => onChange(null)}
        className={cn(
          "px-3.5 py-1.5 rounded-full text-xs border whitespace-nowrap transition-colors cursor-pointer",
          active === null
            ? "bg-primary text-white font-medium border-primary"
            : "bg-white border-black/15 text-neutral-secondary hover:border-black/30"
        )}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.value}
          type="button"
          onClick={() => onChange(cat.value)}
          className={cn(
            "px-3.5 py-1.5 rounded-full text-xs border whitespace-nowrap transition-colors cursor-pointer",
            active === cat.value
              ? "bg-primary text-white font-medium border-primary"
              : "bg-white border-black/15 text-neutral-secondary hover:border-black/30"
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}

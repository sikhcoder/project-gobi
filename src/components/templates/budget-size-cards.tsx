"use client";

import { cn } from "@/lib/cn";
import type { BudgetTemplate } from "@/lib/types";

interface BudgetSizeCardsProps {
  templates: BudgetTemplate[];
  selected: string;
  onSelect: (size: string) => void;
}

export function BudgetSizeCards({ templates, selected, onSelect }: BudgetSizeCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {templates.map((t) => (
        <button
          key={t.size}
          type="button"
          onClick={() => onSelect(t.size)}
          className={cn(
            "text-left rounded-xl border p-4 transition-all cursor-pointer",
            selected === t.size
              ? "border-2 border-primary-light bg-primary-pale"
              : "border-black/10 hover:border-black/20"
          )}
        >
          <h3 className="text-[14px] font-medium mb-0.5">{t.label}</h3>
          <p className="text-[11px] text-neutral-secondary mb-2">{t.description}</p>
          <div className="text-[18px] font-medium mb-2">{t.totalRange}</div>
          <div className="space-y-1">
            {t.breakdown.map((item) => (
              <div key={item.name} className="flex justify-between text-[11px]">
                <span className="text-neutral-secondary">{item.name}</span>
                <span>{item.amount}</span>
              </div>
            ))}
          </div>
        </button>
      ))}
    </div>
  );
}

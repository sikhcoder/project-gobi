import { EventDot } from "@/components/ui/event-dot";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency } from "@/lib/utils";
import type { BudgetCategory } from "@/lib/types";

export function CategoryTable({ categories }: { categories: BudgetCategory[] }) {
  return (
    <div>
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] gap-2 px-3 py-2 bg-neutral-bg rounded-lg mb-1">
        <span className="text-[11px] font-medium text-neutral-secondary uppercase tracking-wider">Category</span>
        <span className="text-[11px] font-medium text-neutral-secondary uppercase tracking-wider">Budget</span>
        <span className="text-[11px] font-medium text-neutral-secondary uppercase tracking-wider">Spent</span>
        <span className="text-[11px] font-medium text-neutral-secondary uppercase tracking-wider">Progress</span>
        <span className="text-[11px] font-medium text-neutral-secondary uppercase tracking-wider">Status</span>
      </div>
      {categories.map((cat) => {
        const pct = cat.allocatedAmount > 0 ? Math.round((cat.spentAmount / cat.allocatedAmount) * 100) : 0;
        return (
          <div
            key={cat.id}
            className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] gap-2 px-3 py-2.5 items-center border-b border-black/5 last:border-0"
          >
            <div className="flex items-center gap-2">
              <EventDot color={cat.color} />
              <div>
                <div className="text-[13px]">{cat.name}</div>
                {cat.vendorName && (
                  <div className="text-[11px] text-neutral-secondary">{cat.vendorName}</div>
                )}
              </div>
            </div>
            <span className="text-[13px]">{formatCurrency(cat.allocatedAmount)}</span>
            <span className="text-[13px]">{formatCurrency(cat.spentAmount)}</span>
            <div className="w-full rounded-full bg-black/[0.06]" style={{ height: 4 }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, backgroundColor: cat.color }}
              />
            </div>
            <StatusBadge status={cat.status as "paid" | "partial" | "unpaid"} />
          </div>
        );
      })}
    </div>
  );
}

import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface BudgetPanelProps {
  spent: number;
  total: number;
}

export function BudgetPanel({ spent, total }: BudgetPanelProps) {
  const pct = total > 0 ? Math.round((spent / total) * 100) : 0;

  return (
    <Card>
      <h3 className="text-sm font-medium mb-1">Budget</h3>
      <div className="text-[13px] text-neutral-secondary mb-3">
        Spent so far {formatCurrency(spent)}
      </div>
      <div className="w-full rounded-full bg-black/[0.06]" style={{ height: 6 }}>
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${pct}%` }}
        />
      </div>
    </Card>
  );
}

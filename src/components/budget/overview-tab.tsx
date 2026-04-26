import { StatGrid } from "@/components/ui/stat-grid";
import { StatCard } from "@/components/ui/stat-card";
import { StackedBar } from "./stacked-bar";
import { CategoryTable } from "./category-table";
import { formatCurrency } from "@/lib/utils";
import type { Budget, BudgetCategory } from "@/lib/types";

interface OverviewTabProps {
  budget: Budget;
  categories: BudgetCategory[];
}

export function OverviewTab({ budget, categories }: OverviewTabProps) {
  const spent = categories.reduce((s, c) => s + c.spentAmount, 0);
  const committed = categories.reduce((s, c) => s + c.allocatedAmount, 0) - spent;
  const remaining = budget.totalAmount - spent - committed;

  return (
    <div>
      <StatGrid>
        <StatCard label="Total budget" value={formatCurrency(budget.totalAmount)} />
        <StatCard label="Committed" value={formatCurrency(committed + spent)} />
        <StatCard label="Paid so far" value={formatCurrency(spent)} valueColor="text-success-text" />
        <StatCard label="Remaining" value={formatCurrency(remaining)} valueColor="text-primary" />
      </StatGrid>

      <div className="mt-6 mb-6">
        <div className="text-[11px] font-medium text-neutral-secondary uppercase tracking-wider mb-3">
          Budget breakdown
        </div>
        <StackedBar paid={spent} committed={committed} total={budget.totalAmount} />
      </div>

      <CategoryTable categories={categories} />
    </div>
  );
}

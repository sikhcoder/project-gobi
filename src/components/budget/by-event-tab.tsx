import { Card } from "@/components/ui/card";
import { EventDot } from "@/components/ui/event-dot";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { WeddingEvent } from "@/lib/types";

export interface EventBudgetData {
  budget: number;
  spent: number;
  categories: string[];
}

interface ByEventTabProps {
  events: WeddingEvent[];
  eventBudgets?: Record<string, EventBudgetData>;
}

export function ByEventTab({ events, eventBudgets = {} }: ByEventTabProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {events.map((event) => {
        const data = eventBudgets[event.id] ?? { budget: 0, spent: 0, categories: [] };
        const pct = data.budget > 0 ? Math.round((data.spent / data.budget) * 100) : 0;
        return (
          <Card key={event.id}>
            <div className="flex items-center gap-2 mb-1">
              <EventDot color={event.displayColor} />
              <span className="text-[13px] font-medium">{event.name}</span>
            </div>
            <div className="text-[11px] text-neutral-secondary mb-3">
              {formatDate(event.date)}
            </div>
            <div className="flex justify-between text-[13px] mb-2">
              <span>Budget: {formatCurrency(data.budget)}</span>
              <span>Spent: {formatCurrency(data.spent)}</span>
            </div>
            <div className="w-full rounded-full bg-black/[0.06]" style={{ height: 4 }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, backgroundColor: event.displayColor }}
              />
            </div>
            <div className="text-[11px] text-neutral-secondary mt-2">
              {data.categories.join(" · ")}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

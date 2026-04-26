import { Card } from "@/components/ui/card";
import type { ChecklistItem } from "@/lib/types";

export function ChecklistPanel({ items }: { items: ChecklistItem[] }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">Checklist</h3>
        <span className="text-[11px] text-primary cursor-pointer hover:underline">
          View all &rarr;
        </span>
      </div>
      <div className="space-y-2.5">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-2.5">
            <input
              type="checkbox"
              defaultChecked={item.completed}
              className="mt-0.5 w-4 h-4 rounded accent-primary cursor-pointer"
            />
            <div className="flex-1 min-w-0">
              <div className="text-[13px]">{item.title}</div>
            </div>
            {item.dueDate && (
              <span className="text-[11px] text-neutral-secondary shrink-0">
                {item.dueDate}
              </span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

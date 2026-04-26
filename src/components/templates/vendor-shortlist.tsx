import { cn } from "@/lib/cn";
import type { VendorShortlistItem, VendorUrgency } from "@/lib/types";

const urgencyStyles: Record<VendorUrgency, string> = {
  "book-now": "bg-danger-bg text-danger",
  "book-soon": "bg-warning-bg text-warning-text",
  flexible: "bg-success-bg text-success-text",
};

const urgencyLabels: Record<VendorUrgency, string> = {
  "book-now": "Book now",
  "book-soon": "Book soon",
  flexible: "Flexible",
};

export function VendorShortlist({ items }: { items: VendorShortlistItem[] }) {
  const grouped = items.reduce<Record<string, VendorShortlistItem[]>>((acc, item) => {
    const key = item.ceremonyTag;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      {Object.entries(grouped).map(([ceremony, vendors]) => (
        <div key={ceremony}>
          <h3 className="text-sm font-medium mb-3">{ceremony}</h3>
          <div className="space-y-2">
            {vendors.map((v) => (
              <div key={v.id} className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center text-white text-[10px] font-medium shrink-0"
                  style={{ backgroundColor: v.iconColor }}
                >
                  {v.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium">{v.name}</div>
                  <div className="text-[11px] text-neutral-secondary">{v.note}</div>
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium px-2 py-0.5 rounded-md shrink-0",
                    urgencyStyles[v.urgency]
                  )}
                >
                  {urgencyLabels[v.urgency]}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

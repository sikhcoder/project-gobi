import { cn } from "@/lib/cn";
import type { ChecklistItem, ChecklistPhase } from "@/lib/types";

const phaseConfig: Record<ChecklistPhase, { label: string; badgeClass: string; subtitle: string }> = {
  now: { label: "Right now", badgeClass: "bg-warning-bg text-warning-text", subtitle: "Priority tasks to do immediately" },
  soon: { label: "Coming up", badgeClass: "bg-success-bg text-success-text", subtitle: "Plan for the next few months" },
  later: { label: "Later", badgeClass: "bg-neutral-bg text-neutral-secondary", subtitle: "These can wait a while" },
};

const ceremonyTagClass = (tag: string) => {
  if (tag.toLowerCase().includes("planning")) return "bg-neutral-bg text-neutral-secondary";
  if (tag.toLowerCase().includes("reception")) return "bg-[#E6F1FB] text-[#0C447C]";
  return "bg-primary-pale text-primary-dark";
};

interface PhaseBlockProps {
  phase: ChecklistPhase;
  items: ChecklistItem[];
}

export function PhaseBlock({ phase, items }: PhaseBlockProps) {
  const config = phaseConfig[phase];
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-sm font-medium">{config.label}</h3>
        <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-md", config.badgeClass)}>
          {items.length} tasks
        </span>
      </div>
      <p className="text-[11px] text-neutral-secondary mb-3">{config.subtitle}</p>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3 py-2">
            <input
              type="checkbox"
              defaultChecked={item.completed}
              className="mt-0.5 w-[18px] h-[18px] rounded-[5px] accent-primary cursor-pointer shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium">{item.title}</div>
              <div className="text-[11px] text-neutral-secondary mt-0.5">{item.description}</div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              {item.monthsBeforeWedding && (
                <span className="text-[11px] text-neutral-secondary">
                  {item.monthsBeforeWedding}mo before
                </span>
              )}
              <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-md", ceremonyTagClass(item.ceremonyTag))}>
                {item.ceremonyTag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

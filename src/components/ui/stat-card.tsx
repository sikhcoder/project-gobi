import { cn } from "@/lib/cn";

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  valueColor?: string;
}

export function StatCard({ label, value, subtext, valueColor }: StatCardProps) {
  return (
    <div className="bg-neutral-bg rounded-[10px] p-3.5">
      <div className="text-[11px] text-neutral-secondary mb-1">{label}</div>
      <div
        className={cn("text-[22px] font-medium leading-tight", valueColor)}
      >
        {value}
      </div>
      {subtext && (
        <div className="text-[11px] text-neutral-secondary mt-0.5">{subtext}</div>
      )}
    </div>
  );
}

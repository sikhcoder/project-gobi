import { cn } from "@/lib/cn";

interface ProgressBarProps {
  value: number;
  color?: string;
  height?: number;
  trackClassName?: string;
}

export function ProgressBar({
  value,
  color = "bg-primary",
  height = 3,
  trackClassName,
}: ProgressBarProps) {
  return (
    <div
      className={cn("w-full rounded-full bg-black/[0.06]", trackClassName)}
      style={{ height }}
    >
      <div
        className={cn("h-full rounded-full transition-all", color)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

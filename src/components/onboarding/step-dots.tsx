import { cn } from "@/lib/cn";

interface StepDotsProps {
  total: number;
  current: number;
}

export function StepDots({ total, current }: StepDotsProps) {
  return (
    <div className="flex justify-center gap-1.5 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-2 rounded-full transition-all",
            i === current
              ? "w-[22px] bg-primary-light"
              : "w-2 bg-black/15"
          )}
        />
      ))}
    </div>
  );
}

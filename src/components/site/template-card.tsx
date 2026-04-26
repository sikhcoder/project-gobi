import { cn } from "@/lib/cn";

interface TemplateCardProps {
  id: string;
  name: string;
  description: string;
  bgColor: string;
  textColor: string;
  isPaid?: boolean;
  isSelected?: boolean;
  partner1: string;
  partner2: string;
  onClick: () => void;
}

export function TemplateCard({
  name,
  description,
  bgColor,
  textColor,
  isPaid,
  isSelected,
  partner1,
  partner2,
  onClick,
}: TemplateCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "border rounded-xl overflow-hidden cursor-pointer transition-all",
        isSelected ? "border-2 border-primary shadow-sm" : "border-black/10 hover:border-black/25"
      )}
    >
      {/* Preview */}
      <div
        className="h-32 flex flex-col items-center justify-center px-3"
        style={{ backgroundColor: bgColor }}
      >
        <div className="text-[15px] font-medium mb-1" style={{ color: textColor }}>
          {partner1} &amp; {partner2}
        </div>
        <div className="flex items-center gap-2">
          <div className="h-px w-8" style={{ backgroundColor: textColor, opacity: 0.4 }} />
          <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: textColor, opacity: 0.6 }} />
          <div className="h-px w-8" style={{ backgroundColor: textColor, opacity: 0.4 }} />
        </div>
      </div>
      {/* Footer */}
      <div className="px-3 py-2.5 flex items-start justify-between bg-white border-t border-black/[0.06]">
        <div>
          <div className="text-[13px] font-medium mb-0.5">{name}</div>
          <div className="text-[11px] text-neutral-secondary">{description}</div>
        </div>
        <span
          className={cn(
            "text-[10px] font-medium px-1.5 py-0.5 rounded-md flex-shrink-0 mt-0.5",
            isPaid ? "bg-warning-bg text-warning-text" : "bg-success-bg text-success-text"
          )}
        >
          {isPaid ? "Premium" : "Free"}
        </span>
      </div>
    </div>
  );
}

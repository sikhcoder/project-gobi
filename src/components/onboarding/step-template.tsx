"use client";

import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { TEMPLATE_THEMES } from "@/lib/constants";

interface StepTemplateProps {
  partner1: string;
  partner2: string;
  selectedTemplate: string | null;
  onSelect: (id: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function StepTemplate({
  partner1,
  partner2,
  selectedTemplate,
  onSelect,
  onContinue,
  onBack,
}: StepTemplateProps) {
  const displayNames =
    partner1 && partner2
      ? `${partner1} & ${partner2}`
      : "Your Names";

  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-neutral-secondary mb-2">
        Step 3
      </div>
      <h2 className="text-xl font-medium mb-1">Pick a template</h2>
      <p className="text-[13px] text-neutral-secondary mb-5">
        Choose a style for your wedding site
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {TEMPLATE_THEMES.map((theme) => (
          <button
            key={theme.id}
            type="button"
            onClick={() => onSelect(theme.id)}
            className={cn(
              "rounded-[10px] border overflow-hidden text-left transition-all cursor-pointer",
              selectedTemplate === theme.id
                ? "border-2 border-primary-light"
                : "border-black/10 hover:border-black/20"
            )}
          >
            <div
              className="h-[72px] flex items-center justify-center"
              style={{ backgroundColor: theme.bgColor }}
            >
              <span
                className="text-sm font-medium"
                style={{ color: theme.textColor }}
              >
                {displayNames}
              </span>
            </div>
            <div className="px-3 py-2">
              <span className="text-xs font-medium">{theme.name}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <Button size="full" onClick={onContinue}>
          Continue
        </Button>
        <Button size="full" variant="ghost" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
}

import { Card } from "@/components/ui/card";

interface GuestTemplate {
  id: string;
  title: string;
  description: string;
  iconColor: string;
}

export function GuestTemplateCards({ templates }: { templates: GuestTemplate[] }) {
  return (
    <div className="space-y-2">
      {templates.map((t) => (
        <Card key={t.id} padding="p-3.5" className="hover:border-black/20 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-medium shrink-0"
              style={{ backgroundColor: t.iconColor }}
            >
              {t.title[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium">{t.title}</div>
              <div className="text-[11px] text-neutral-secondary">{t.description}</div>
            </div>
            <span className="text-[11px] text-primary font-medium shrink-0 cursor-pointer">
              Use &rarr;
            </span>
          </div>
        </Card>
      ))}

      <div className="bg-neutral-bg rounded-[10px] p-3.5 mt-4">
        <p className="text-[13px] text-neutral-secondary leading-relaxed">
          Guest templates auto-generate ceremony-specific lists based on your selected events.
          Import your existing guest list via CSV and we&apos;ll map columns automatically.
        </p>
      </div>
    </div>
  );
}

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SitePanelProps {
  slug: string;
}

export function SitePanel({ slug }: SitePanelProps) {
  return (
    <Card>
      <h3 className="text-sm font-medium mb-1">Your Wedding Site</h3>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-success" />
        <span className="text-[13px] text-primary">shaadi.com/{slug}</span>
      </div>
      <Button variant="outline" size="sm">
        Share
      </Button>
    </Card>
  );
}

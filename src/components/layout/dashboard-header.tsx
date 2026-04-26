import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  partner1: string;
  partner2: string;
  date: string;
  city: string;
  eventCount: number;
}

export function DashboardHeader({
  partner1,
  partner2,
  date,
  city,
  eventCount,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-1">
      <div>
        <h1 className="text-xl font-medium">
          {partner1} & {partner2}
        </h1>
        <p className="text-[13px] text-neutral-secondary">
          {date} · {city} · {eventCount} events
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline">Edit site</Button>
        <Button variant="primary">Send RSVPs</Button>
      </div>
    </div>
  );
}

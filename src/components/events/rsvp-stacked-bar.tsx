interface RsvpStackedBarProps {
  confirmed: number;
  pending: number;
  declined: number;
}

export function RsvpStackedBar({ confirmed, pending, declined }: RsvpStackedBarProps) {
  const total = confirmed + pending + declined;
  if (total === 0) return null;

  const confirmedPct = Math.round((confirmed / total) * 100);
  const pendingPct = Math.round((pending / total) * 100);
  const declinedPct = 100 - confirmedPct - pendingPct;

  return (
    <div>
      <div className="flex h-2 rounded-full overflow-hidden mb-3" style={{ backgroundColor: "rgba(0,0,0,0.08)" }}>
        <div className="h-full" style={{ width: `${confirmedPct}%`, backgroundColor: "#1D9E75" }} />
        <div className="h-full" style={{ width: `${pendingPct}%`, backgroundColor: "#EF9F27" }} />
        <div className="h-full" style={{ width: `${declinedPct}%`, backgroundColor: "#A32D2D" }} />
      </div>
      <div className="flex gap-4 flex-wrap">
        {[
          { label: "Confirmed", count: confirmed, color: "#1D9E75" },
          { label: "Pending", count: pending, color: "#EF9F27" },
          { label: "Declined", count: declined, color: "#A32D2D" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[11px] text-neutral-secondary">
              {item.label} <span className="font-medium text-neutral-text">{item.count}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

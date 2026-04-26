interface StackedBarProps {
  paid: number;
  committed: number;
  total: number;
}

export function StackedBar({ paid, committed, total }: StackedBarProps) {
  const paidPct = total > 0 ? (paid / total) * 100 : 0;
  const committedPct = total > 0 ? (committed / total) * 100 : 0;

  return (
    <div>
      <div className="w-full rounded-full bg-black/[0.06] flex overflow-hidden" style={{ height: 10 }}>
        <div
          className="h-full bg-success"
          style={{ width: `${paidPct}%` }}
        />
        <div
          className="h-full bg-primary/40"
          style={{ width: `${committedPct}%` }}
        />
      </div>
      <div className="flex gap-4 mt-2">
        <div className="flex items-center gap-1.5 text-[11px] text-neutral-secondary">
          <span className="w-2 h-2 rounded-full bg-success" />
          Paid ({Math.round(paidPct)}%)
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-neutral-secondary">
          <span className="w-2 h-2 rounded-full bg-primary/40" />
          Committed ({Math.round(committedPct)}%)
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-neutral-secondary">
          <span className="w-2 h-2 rounded-full bg-black/[0.06]" />
          Unallocated ({Math.round(100 - paidPct - committedPct)}%)
        </div>
      </div>
    </div>
  );
}

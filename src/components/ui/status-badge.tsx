import { cn } from "@/lib/cn";

type BadgeStatus = "confirmed" | "pending" | "paid" | "partial" | "unpaid" | "unbooked" | "cancelled";

const statusStyles: Record<BadgeStatus, string> = {
  confirmed: "bg-success-bg text-success-text",
  paid: "bg-success-bg text-success-text",
  pending: "bg-warning-bg text-warning-text",
  partial: "bg-warning-bg text-warning-text",
  unpaid: "bg-neutral-bg text-neutral-secondary",
  unbooked: "bg-neutral-bg text-neutral-secondary",
  cancelled: "bg-danger-bg text-danger",
};

const statusLabels: Record<BadgeStatus, string> = {
  confirmed: "Confirmed",
  paid: "Paid",
  pending: "Pending",
  partial: "Partial",
  unpaid: "Unpaid",
  unbooked: "Unbooked",
  cancelled: "Cancelled",
};

interface StatusBadgeProps {
  status: BadgeStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-block text-[10px] font-medium px-2 py-0.5 rounded-md",
        statusStyles[status],
        className
      )}
    >
      {statusLabels[status]}
    </span>
  );
}

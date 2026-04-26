import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency } from "@/lib/utils";
import type { BudgetPayment } from "@/lib/types";

interface PaymentsTabProps {
  upcoming: BudgetPayment[];
  history: BudgetPayment[];
}

function PaymentTable({
  title,
  badge,
  payments,
}: {
  title: string;
  badge?: string;
  payments: BudgetPayment[];
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[11px] font-medium text-neutral-secondary uppercase tracking-wider">
          {title}
        </span>
        {badge && (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-warning-bg text-warning-text">
            {badge}
          </span>
        )}
      </div>

      <div className="grid grid-cols-[1fr_80px_90px_80px] gap-2 px-3 py-2 bg-neutral-bg rounded-lg mb-1">
        <span className="text-[11px] font-medium text-neutral-secondary uppercase tracking-wider">Vendor</span>
        <span className="text-[11px] font-medium text-neutral-secondary uppercase tracking-wider">Amount</span>
        <span className="text-[11px] font-medium text-neutral-secondary uppercase tracking-wider">
          {title === "Upcoming" ? "Due date" : "Paid"}
        </span>
        <span className="text-[11px] font-medium text-neutral-secondary uppercase tracking-wider">Status</span>
      </div>
      {payments.map((p) => (
        <div
          key={p.id}
          className="grid grid-cols-[1fr_80px_90px_80px] gap-2 px-3 py-2.5 items-center border-b border-black/5 last:border-0"
        >
          <div>
            <div className="text-[13px]">{p.vendorName}</div>
            <div className="text-[11px] text-neutral-secondary">{p.category}</div>
          </div>
          <span className="text-[13px] font-medium">{formatCurrency(p.amount)}</span>
          <span className={`text-[13px] ${p.dueDate ? "text-warning-text font-medium" : "text-neutral-secondary"}`}>
            {p.dueDate || p.paidAt || "—"}
          </span>
          <StatusBadge status={p.status as "paid" | "pending"} />
        </div>
      ))}
    </div>
  );
}

export function PaymentsTab({ upcoming, history }: PaymentsTabProps) {
  return (
    <div>
      <PaymentTable
        title="Upcoming"
        badge={`${upcoming.length} due soon`}
        payments={upcoming}
      />
      <PaymentTable title="Payment history" payments={history} />
    </div>
  );
}

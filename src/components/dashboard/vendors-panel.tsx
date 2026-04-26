import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getInitials } from "@/lib/utils";
import type { VendorBooking } from "@/lib/types";
import { VENDOR_CATEGORIES } from "@/lib/constants";

function getCategoryLabel(cat: string) {
  return VENDOR_CATEGORIES.find((c) => c.value === cat)?.label || cat;
}

export function VendorsPanel({ bookings }: { bookings: VendorBooking[] }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">Vendors</h3>
        <span className="text-[11px] text-primary cursor-pointer hover:underline">
          View all &rarr;
        </span>
      </div>
      <div className="space-y-3">
        {bookings.map((b) => (
          <div key={b.id} className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-medium shrink-0"
              style={{ backgroundColor: "#534AB7" }}
            >
              {getInitials(b.vendorName)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium truncate">{b.vendorName}</div>
              <div className="text-[11px] text-neutral-secondary">
                {getCategoryLabel(b.vendorCategory)}
              </div>
            </div>
            <StatusBadge status={b.status === "confirmed" ? "confirmed" : "pending"} />
          </div>
        ))}
      </div>
    </Card>
  );
}

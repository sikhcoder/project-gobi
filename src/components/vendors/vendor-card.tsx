import Link from "next/link";
import { Card } from "@/components/ui/card";
import { getInitials, formatCurrency } from "@/lib/utils";
import { VENDOR_CATEGORIES } from "@/lib/constants";
import type { Vendor } from "@/lib/types";

export function VendorCard({ vendor }: { vendor: Vendor }) {
  const categoryLabel =
    VENDOR_CATEGORIES.find((c) => c.value === vendor.category)?.label || vendor.category;

  return (
    <Link href={`/vendors/${vendor.id}`}>
      <Card padding="p-0" className="overflow-hidden hover:border-black/20 transition-colors">
        <div
          className="h-[110px] flex flex-col items-center justify-center"
          style={{ backgroundColor: vendor.avatarColor + "18" }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-medium"
            style={{ backgroundColor: vendor.avatarColor }}
          >
            {getInitials(vendor.name)}
          </div>
          <div className="text-[11px] mt-1.5 font-medium" style={{ color: vendor.avatarColor }}>
            {vendor.name}
          </div>
        </div>
        <div className="p-3">
          <div className="text-[14px] font-medium mb-0.5">{vendor.name}</div>
          <div className="text-[11px] text-neutral-secondary mb-2">{categoryLabel}</div>
          <div className="flex items-center gap-2 text-[11px] text-neutral-secondary mb-1">
            <span className="text-warning">★</span>
            <span>{vendor.rating}</span>
            <span>({vendor.reviewCount} reviews)</span>
            {vendor.verified && (
              <span className="text-success-text font-medium">✓ Verified</span>
            )}
          </div>
          <div className="text-[12px]">
            From {formatCurrency(vendor.startingPrice)} · {vendor.priceUnit}
          </div>
          <div className="text-[11px] text-neutral-secondary mt-1">
            {vendor.location}
            {vendor.travelRadiusMiles > 0 && ` · Travels ${vendor.travelRadiusMiles}mi`}
          </div>
        </div>
      </Card>
    </Link>
  );
}

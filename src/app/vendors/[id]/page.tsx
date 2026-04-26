import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatGrid } from "@/components/ui/stat-grid";
import { StatCard } from "@/components/ui/stat-card";
import { getInitials, formatCurrency } from "@/lib/utils";
import { VENDOR_CATEGORIES } from "@/lib/constants";
import {
  mockMarketplaceVendors,
  mockVendorServices,
  mockReviews,
  mockEvents,
} from "@/lib/mock-data";

export default async function VendorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vendor = mockMarketplaceVendors.find((v) => v.id === id);
  if (!vendor) {
    return (
      <div className="max-w-3xl mx-auto bg-white min-h-screen px-7 py-6">
        <p>Vendor not found</p>
      </div>
    );
  }

  const categoryLabel =
    VENDOR_CATEGORIES.find((c) => c.value === vendor.category)?.label || vendor.category;
  const services = mockVendorServices[vendor.id] || [];
  const reviews = mockReviews.filter((r) => r.vendorId === vendor.id);

  return (
    <div className="max-w-3xl mx-auto bg-white min-h-screen px-7 py-6">
      <Link
        href="/dashboard/vendors"
        className="inline-block text-[13px] text-primary mb-4 hover:underline"
      >
        ← Back to vendors
      </Link>

      {/* Hero */}
      <div
        className="h-[140px] rounded-xl flex flex-col items-center justify-center mb-5"
        style={{ backgroundColor: vendor.avatarColor + "18" }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-medium"
          style={{ backgroundColor: vendor.avatarColor }}
        >
          {getInitials(vendor.name)}
        </div>
        <div className="text-[11px] mt-2 font-medium" style={{ color: vendor.avatarColor }}>
          {categoryLabel}
        </div>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-xl font-medium">{vendor.name}</h2>
          <p className="text-[13px] text-neutral-secondary">
            {categoryLabel} · {vendor.location}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Message</Button>
          <Link href={`/vendors/${vendor.id}/quote`}>
            <Button variant="primary">Request quote</Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2.5 mb-6">
        <StatCard label="Rating" value={`${vendor.rating} ★`} subtext={`${vendor.reviewCount} reviews`} />
        <StatCard label="Starting from" value={formatCurrency(vendor.startingPrice)} subtext={vendor.priceUnit} />
        <StatCard label="Travel radius" value={`${vendor.travelRadiusMiles} mi`} subtext={vendor.location} />
      </div>

      {/* Bio */}
      <p className="text-[13px] text-neutral-secondary mb-6 leading-relaxed">{vendor.bio}</p>

      {/* Services */}
      {services.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium pb-2 border-b border-black/10 mb-3">
            Services & Pricing
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {services.map((s) => (
              <div key={s.id} className="flex justify-between bg-neutral-bg rounded-lg px-3 py-2.5">
                <div>
                  <div className="text-[13px]">{s.name}</div>
                  <div className="text-[11px] text-neutral-secondary">{s.description}</div>
                </div>
                <span className="text-[13px] font-medium shrink-0 ml-2">
                  {formatCurrency(s.priceFrom)}/{s.priceUnit}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Availability */}
      <div className="mb-6">
        <h3 className="text-sm font-medium pb-2 border-b border-black/10 mb-3">
          Availability & Events Covered
        </h3>
        <div className="flex flex-wrap gap-2">
          {mockEvents.map((e) => (
            <span
              key={e.id}
              className="text-[11px] px-2.5 py-1 rounded-md bg-primary-pale text-primary-dark font-medium"
            >
              {e.name}
            </span>
          ))}
          <span className="text-[11px] px-2.5 py-1 rounded-md bg-success-bg text-success-text font-medium">
            Available Nov 2025
          </span>
        </div>
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <div>
          <h3 className="text-sm font-medium pb-2 border-b border-black/10 mb-3">
            Reviews
          </h3>
          <div className="space-y-3">
            {reviews.map((r) => (
              <Card key={r.id} padding="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-medium"
                    style={{ backgroundColor: r.avatarColor }}
                  >
                    {r.reviewerInitials}
                  </div>
                  <span className="text-[13px] font-medium">{r.reviewerName}</span>
                  <span className="text-warning text-[11px]">
                    {"★".repeat(r.rating)}
                  </span>
                  <span className="text-[11px] text-neutral-secondary ml-auto">
                    {r.date}
                  </span>
                </div>
                <p className="text-[13px] text-neutral-secondary leading-relaxed">
                  {r.text}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

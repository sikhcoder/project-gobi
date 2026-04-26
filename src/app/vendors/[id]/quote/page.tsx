"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { InputField } from "@/components/ui/input-field";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";
import { VENDOR_CATEGORIES } from "@/lib/constants";
import { mockMarketplaceVendors, mockEvents } from "@/lib/mock-data";

export default function QuoteRequestPage() {
  const router = useRouter();
  const params = useParams();
  const vendor = mockMarketplaceVendors.find((v) => v.id === params.id);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [guestCount, setGuestCount] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [message, setMessage] = useState("");

  if (!vendor) {
    return (
      <div className="max-w-3xl mx-auto bg-white min-h-screen px-7 py-6">
        <p>Vendor not found</p>
      </div>
    );
  }

  const categoryLabel =
    VENDOR_CATEGORIES.find((c) => c.value === vendor.category)?.label || vendor.category;

  function toggleEvent(eventId: string) {
    setSelectedEvents((prev) =>
      prev.includes(eventId) ? prev.filter((e) => e !== eventId) : [...prev, eventId]
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white min-h-screen px-7 py-6 flex justify-center">
      <Card padding="p-5" className="w-full max-w-[440px]">
        <h3 className="text-base font-medium mb-1">Request a Quote</h3>
        <p className="text-[13px] text-neutral-secondary mb-4">
          Tell the vendor about your event
        </p>

        {/* Vendor preview */}
        <div className="flex items-center gap-3 bg-neutral-bg rounded-lg p-3 mb-5">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-medium shrink-0"
            style={{ backgroundColor: vendor.avatarColor }}
          >
            {getInitials(vendor.name)}
          </div>
          <div>
            <div className="text-[13px] font-medium">{vendor.name}</div>
            <div className="text-[11px] text-neutral-secondary">
              {categoryLabel}
              {vendor.verified && " · ✓ Verified"}
            </div>
          </div>
        </div>

        {/* Events */}
        <div className="mb-4">
          <label className="block text-xs text-neutral-secondary mb-2">
            Which events?
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {mockEvents.map((event) => (
              <label
                key={event.id}
                className="flex items-center gap-2 bg-neutral-bg/50 rounded-lg px-2.5 py-2 text-xs cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedEvents.includes(event.id)}
                  onChange={() => toggleEvent(event.id)}
                  className="w-3.5 accent-primary"
                />
                {event.name}
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <InputField
            label="Guest count"
            placeholder="e.g. 200"
            value={guestCount}
            onChange={(e) => setGuestCount(e.target.value)}
          />
          <div>
            <label className="block text-xs text-neutral-secondary mb-1.5">
              Budget range
            </label>
            <select
              value={budgetRange}
              onChange={(e) => setBudgetRange(e.target.value)}
              className="w-full bg-neutral-bg rounded-lg border border-black/15 px-3 py-2.5 text-sm outline-none focus:border-primary-light transition-colors"
            >
              <option value="">Select...</option>
              <option value="under-1k">Under $1,000</option>
              <option value="1k-3k">$1,000 – $3,000</option>
              <option value="3k-5k">$3,000 – $5,000</option>
              <option value="5k-10k">$5,000 – $10,000</option>
              <option value="10k+">$10,000+</option>
            </select>
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-xs text-neutral-secondary mb-1.5">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell the vendor about your vision..."
            className="w-full bg-neutral-bg rounded-lg border border-black/15 px-3 py-2.5 text-sm outline-none focus:border-primary-light transition-colors resize-none"
            style={{ height: 80 }}
          />
        </div>

        <Button
          size="full"
          onClick={() => router.push(`/vendors/${vendor.id}`)}
        >
          Send quote request
        </Button>
      </Card>
    </div>
  );
}

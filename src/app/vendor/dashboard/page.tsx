"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TabBar } from "@/components/ui/tab-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency } from "@/lib/utils";
import { VENDOR_CATEGORIES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/cn";

const TABS = [
  { label: "Dashboard", value: "dashboard" },
  { label: "Subscription", value: "subscription" },
];

const PLAN_FEATURES: Record<string, string[]> = {
  free: ["Listed in marketplace", "Basic profile", "Up to 3 portfolio photos"],
  standard: ["Priority placement", "Unlimited photos", "Quote request inbox", "Analytics dashboard"],
  premium: ["Featured badge", "Homepage placement", "Dedicated support", "Premium templates"],
};

interface VendorProfile {
  id: string;
  name: string;
  category: string;
  location: string;
  travelRadiusMiles: number;
  subscriptionTier: string;
  verified: boolean;
  bio: string;
}

interface Booking {
  id: string;
  couple: string;
  event: string;
  date: string;
  amount: number;
  status: string;
}

export default function VendorDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: v } = await supabase
        .from("vendors")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!v) {
        // No vendor profile — redirect to onboarding
        router.push("/vendor/onboarding");
        return;
      }

      setVendor({
        id: v.id,
        name: v.name,
        category: v.category,
        location: v.location ?? "",
        travelRadiusMiles: v.travel_radius_miles ?? 0,
        subscriptionTier: v.subscription_tier,
        verified: v.verified,
        bio: v.bio ?? "",
      });

      const { data: dbBookings } = await supabase
        .from("vendor_bookings")
        .select("*, events(name, date), weddings(partner_1_name, partner_2_name)")
        .eq("vendor_id", v.id)
        .order("created_at", { ascending: false });

      setBookings(
        (dbBookings ?? []).map((b) => {
          const w = b.weddings as { partner_1_name: string; partner_2_name: string } | null;
          const e = b.events as { name: string; date: string } | null;
          return {
            id: b.id,
            couple: w ? `${w.partner_1_name} & ${w.partner_2_name}` : "Unknown couple",
            event: e?.name ?? "Event",
            date: e?.date ?? "",
            amount: Number(b.total_amount ?? 0),
            status: b.status,
          };
        })
      );

      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) {
    return (
      <div className="mt-10 text-center text-[13px] text-neutral-secondary">Loading dashboard…</div>
    );
  }

  if (!vendor) return null;

  const categoryLabel = VENDOR_CATEGORIES.find((c) => c.value === vendor.category)?.label ?? vendor.category;
  const totalRevenue = bookings.filter((b) => b.status === "confirmed").reduce((s, b) => s + b.amount, 0);
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length;

  return (
    <div>
      {/* Vendor header */}
      <div className="flex items-start justify-between mb-6 pb-5 border-b border-black/10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary-pale flex items-center justify-center text-primary text-[20px] font-medium">
            {vendor.name[0]}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-[18px] font-medium">{vendor.name}</h2>
              {vendor.verified && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-success-bg text-success-text">
                  Verified
                </span>
              )}
            </div>
            <div className="text-[13px] text-neutral-secondary">
              {categoryLabel}
              {vendor.location ? ` · ${vendor.location}` : ""}
              {vendor.travelRadiusMiles > 0 ? ` · Travels ${vendor.travelRadiusMiles}mi` : ""}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Edit profile</Button>
          <Button variant="primary">Manage availability</Button>
        </div>
      </div>

      <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {/* DASHBOARD TAB */}
      {activeTab === "dashboard" && (
        <div className="mt-5 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Bookings", value: bookings.length },
              { label: "Confirmed", value: confirmedBookings },
              { label: "Revenue", value: formatCurrency(totalRevenue) },
              { label: "Profile views", value: "—" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-neutral-bg rounded-xl px-4 py-3">
                <div className="text-[22px] font-medium">{value}</div>
                <div className="text-[11px] text-neutral-secondary">{label}</div>
              </div>
            ))}
          </div>

          {/* Bookings */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-medium">Bookings</h3>
            </div>
            {bookings.length === 0 ? (
              <p className="text-[13px] text-neutral-secondary text-center py-6">
                No bookings yet. Complete your profile to start receiving inquiries.
              </p>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <div key={booking.id} className="flex items-center gap-3 py-2.5 border-b border-black/[0.06] last:border-0">
                    <div className="flex-1">
                      <div className="text-[13px] font-medium">{booking.couple}</div>
                      <div className="text-[11px] text-neutral-secondary">{booking.event} · {booking.date}</div>
                    </div>
                    <div className="text-[13px] font-medium">{formatCurrency(booking.amount)}</div>
                    <StatusBadge status={booking.status as "confirmed" | "pending" | "cancelled"} />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* SUBSCRIPTION TAB */}
      {activeTab === "subscription" && (
        <div className="mt-5">
          <div className="bg-neutral-bg rounded-xl px-5 py-4 mb-5 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-neutral-secondary uppercase tracking-wider mb-1">Current plan</div>
              <div className="text-[16px] font-medium capitalize">{vendor.subscriptionTier}</div>
            </div>
            <span className={cn(
              "text-[11px] font-medium px-3 py-1 rounded-full capitalize",
              vendor.subscriptionTier === "premium" ? "bg-warning-bg text-warning-text" :
              vendor.subscriptionTier === "standard" ? "bg-primary-pale text-primary" :
              "bg-neutral-bg text-neutral-secondary border border-black/15"
            )}>
              {vendor.subscriptionTier === "free" ? "Free plan" : "Active"}
            </span>
          </div>

          <div className="text-[12px] font-medium text-neutral-secondary uppercase tracking-wider mb-3">Plan comparison</div>
          <div className="border border-black/10 rounded-xl overflow-hidden">
            <div className="grid gap-2 px-4 py-3 bg-neutral-bg" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
              {["Feature", "Free", "Standard", "Premium"].map((h) => (
                <span key={h} className={cn("text-[11px] font-medium uppercase tracking-wider",
                  h === "Feature" ? "text-neutral-secondary" :
                  h.toLowerCase() === vendor.subscriptionTier ? "text-primary" : "text-neutral-secondary"
                )}>
                  {h}
                </span>
              ))}
            </div>
            {[
              ["Marketplace listing", "✓", "✓", "✓"],
              ["Portfolio photos", "3 max", "Unlimited", "Unlimited"],
              ["Quote requests", "—", "✓", "✓"],
              ["Priority placement", "—", "✓", "✓"],
              ["Analytics", "—", "✓", "✓"],
              ["Featured badge", "—", "—", "✓"],
              ["Homepage placement", "—", "—", "✓"],
              ["Dedicated support", "—", "—", "✓"],
            ].map(([feature, free, standard, premium]) => (
              <div
                key={feature}
                className="grid gap-2 px-4 py-2.5 border-t border-black/[0.06] items-center"
                style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}
              >
                <span className="text-[13px]">{feature}</span>
                {[free, standard, premium].map((val, i) => (
                  <span key={i} className={cn(
                    "text-[13px]",
                    val === "—" ? "text-neutral-secondary/40" : "text-neutral-text"
                  )}>
                    {val}
                  </span>
                ))}
              </div>
            ))}
          </div>

          {vendor.subscriptionTier !== "premium" && (
            <div className="mt-4">
              <Button variant="primary" className="w-full">
                Upgrade to {vendor.subscriptionTier === "free" ? "Standard" : "Premium"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TabBar } from "@/components/ui/tab-bar";
import { cn } from "@/lib/cn";

const TABS = [
  { label: "Overview", value: "overview" },
  { label: "Vendor verification", value: "verify" },
  { label: "Users", value: "users" },
  { label: "Revenue", value: "revenue" },
];

const MOCK_VENDOR_QUEUE = [
  {
    id: "vq-1",
    name: "Elegant Frames Photography",
    submittedAt: "2 hours ago",
    category: "Photography",
    location: "Dallas, TX",
    plan: "Standard",
    bio: "10+ years shooting South Asian weddings across DFW. Specialised in Hindu and Sikh ceremonies.",
    docs: ["Business license", "Portfolio", "Insurance cert"],
  },
  {
    id: "vq-2",
    name: "Spice Route Catering",
    submittedAt: "5 hours ago",
    category: "Catering",
    location: "Houston, TX",
    plan: "Premium",
    bio: "Authentic regional Indian cuisine for weddings up to 1,000 guests. Halal and Jain options available.",
    docs: ["Food handler cert", "Business license", "Portfolio"],
  },
  {
    id: "vq-3",
    name: "Nisha's Mehndi Studio",
    submittedAt: "1 day ago",
    category: "Mehndi artist",
    location: "Chicago, IL",
    plan: "Free",
    bio: "Bridal and party mehndi in traditional Rajasthani and modern Arabic styles.",
    docs: ["Portfolio"],
  },
];

const MOCK_USERS = [
  { id: "u-1", name: "Priya Sharma", email: "priya@example.com", type: "couple", joinDate: "Jun 2025", status: "Active" },
  { id: "u-2", name: "Patel & Co Photography", email: "hello@patelphotos.com", type: "vendor", joinDate: "Jan 2025", status: "Verified" },
  { id: "u-3", name: "Ananya & Rohan", email: "ananya@example.com", type: "couple", joinDate: "Jul 2025", status: "Onboarding" },
  { id: "u-4", name: "Meena's Mehndi", email: "meena@mehndi.com", type: "vendor", joinDate: "Mar 2025", status: "Verified" },
  { id: "u-5", name: "Kiran & Aditya", email: "kiran@example.com", type: "couple", joinDate: "Aug 2025", status: "Active" },
  { id: "u-6", name: "Sharma Kitchen", email: "info@sharmakitchen.com", type: "vendor", joinDate: "Feb 2025", status: "Pending" },
];

const REVENUE_TIERS = [
  { tier: "Standard ($49/mo)", vendors: 124, mrr: 6076, pct: 65 },
  { tier: "Premium ($99/mo)", vendors: 38, mrr: 3762, pct: 20 },
  { tier: "Free", vendors: 156, mrr: 0, pct: 15 },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [userSearch, setUserSearch] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState<"all" | "couple" | "vendor">("all");

  const filteredUsers = MOCK_USERS.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchType = userTypeFilter === "all" || u.type === userTypeFilter;
    return matchSearch && matchType;
  });

  return (
    <div>
      <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {/* OVERVIEW */}
      {activeTab === "overview" && (
        <div className="mt-5">
          {/* Alert */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-[18px] font-medium mb-0.5">Platform admin</h2>
              <div className="text-[13px] text-neutral-secondary">All systems operational</div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning-bg text-warning-text text-[12px] font-medium whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-warning" />
              {MOCK_VENDOR_QUEUE.length} vendors awaiting verification
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: "Couples", value: "1,284", sub: "+34 this week" },
              { label: "Active vendors", value: "318", sub: "+12 this week" },
              { label: "MRR", value: "$18,400", sub: "+8% MoM" },
              { label: "Quote requests", value: "847", sub: "this month" },
            ].map((s) => (
              <Card key={s.label} padding="p-3.5">
                <div className="text-[11px] text-neutral-secondary mb-1">{s.label}</div>
                <div className="text-[20px] font-medium mb-0.5">{s.value}</div>
                <div className="text-[11px] text-success">{s.sub}</div>
              </Card>
            ))}
          </div>

          {/* Two columns */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Vendor queue preview */}
            <Card>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[14px] font-medium">Pending verification</span>
                <button onClick={() => setActiveTab("verify")} className="text-[12px] text-primary cursor-pointer hover:underline">
                  View all
                </button>
              </div>
              {MOCK_VENDOR_QUEUE.slice(0, 2).map((v) => (
                <div key={v.id} className="py-3 border-b border-black/[0.06] last:border-0">
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-[13px] font-medium">{v.name}</div>
                    <span className="text-[11px] text-neutral-secondary ml-2 flex-shrink-0">{v.submittedAt}</span>
                  </div>
                  <div className="text-[12px] text-neutral-secondary mb-2">{v.category} · {v.location} · {v.plan}</div>
                  <div className="flex gap-1.5">
                    <button className="text-[11px] px-2.5 py-1 rounded-md font-medium bg-success-bg text-success-text border border-success/30 cursor-pointer">Approve</button>
                    <button className="text-[11px] px-2.5 py-1 rounded-md font-medium bg-danger-bg text-danger border border-danger/30 cursor-pointer">Reject</button>
                    <button className="text-[11px] px-2.5 py-1 rounded-md bg-primary-pale text-primary-dark border border-primary-light cursor-pointer">Review</button>
                  </div>
                </div>
              ))}
            </Card>

            {/* Platform health */}
            <Card>
              <div className="text-[14px] font-medium mb-3">Platform health</div>
              {[
                { label: "Uptime", value: "99.8%", ok: true },
                { label: "Avg load time", value: "1.2s", ok: true },
                { label: "RSVPs sent (month)", value: "4,821", ok: true },
                { label: "Email delivery rate", value: "94.1%", ok: true },
              ].map((h) => (
                <div key={h.label} className="flex items-center justify-between py-2 border-b border-black/[0.06] last:border-0">
                  <span className="text-[12px] text-neutral-secondary">{h.label}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" />
                    <span className="text-[13px] font-medium">{h.value}</span>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}

      {/* VENDOR VERIFICATION */}
      {activeTab === "verify" && (
        <div className="mt-5">
          <div className="text-[14px] font-medium mb-4">{MOCK_VENDOR_QUEUE.length} vendors awaiting review</div>
          {MOCK_VENDOR_QUEUE.map((v) => (
            <Card key={v.id} className="mb-3">
              <div className="flex items-start justify-between mb-1">
                <div className="text-[14px] font-medium">{v.name}</div>
                <span className="text-[11px] text-neutral-secondary flex-shrink-0 ml-2">{v.submittedAt}</span>
              </div>
              <div className="text-[12px] text-neutral-secondary mb-2">{v.category} · {v.location} · {v.plan} plan</div>
              <div className="text-[13px] text-neutral-secondary mb-3 leading-relaxed">{v.bio}</div>
              <div className="flex gap-1.5 mb-3 flex-wrap">
                {v.docs.map((doc) => (
                  <span key={doc} className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-bg text-neutral-secondary cursor-pointer hover:bg-neutral-bg/80">{doc}</span>
                ))}
              </div>
              <div className="flex gap-2">
                <button className="text-[12px] px-3 py-1.5 rounded-lg font-medium bg-success-bg text-success-text border border-success/30 cursor-pointer hover:bg-success-bg/80">✓ Approve</button>
                <button className="text-[12px] px-3 py-1.5 rounded-lg font-medium bg-danger-bg text-danger border border-danger/30 cursor-pointer hover:bg-danger-bg/80">✕ Reject</button>
                <button className="text-[12px] px-3 py-1.5 rounded-lg bg-primary-pale text-primary-dark border border-primary-light cursor-pointer">Request more info</button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* USERS */}
      {activeTab === "users" && (
        <div className="mt-5">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Search users…"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="flex-1 text-[13px] px-3 py-2 rounded-lg border border-black/15 bg-neutral-bg focus:outline-none focus:border-primary"
            />
            {(["all", "couple", "vendor"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setUserTypeFilter(f)}
                className={cn(
                  "px-3.5 py-2 rounded-lg text-[12px] border transition-colors cursor-pointer capitalize",
                  userTypeFilter === f
                    ? "bg-primary border-primary text-white font-medium"
                    : "bg-white border-black/15 text-neutral-secondary hover:border-black/30"
                )}
              >
                {f === "all" ? "All users" : f + "s"}
              </button>
            ))}
          </div>

          <div className="border border-black/10 rounded-xl overflow-hidden">
            <div className="grid gap-2 px-4 py-2.5 bg-neutral-bg" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 80px" }}>
              {["Name", "Type", "Joined", "Status", ""].map((h) => (
                <span key={h} className="text-[11px] font-medium text-neutral-secondary uppercase tracking-wider">{h}</span>
              ))}
            </div>
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="grid gap-2 px-4 py-3 border-t border-black/[0.06] items-center hover:bg-neutral-bg"
                style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 80px" }}
              >
                <div>
                  <div className="text-[13px] font-medium">{user.name}</div>
                  <div className="text-[11px] text-neutral-secondary">{user.email}</div>
                </div>
                <span
                  className={cn(
                    "text-[11px] font-medium px-2 py-0.5 rounded-md inline-block w-fit capitalize",
                    user.type === "couple" ? "bg-primary-pale text-primary-dark" : "bg-success-bg text-success-text"
                  )}
                >
                  {user.type}
                </span>
                <span className="text-[12px] text-neutral-secondary">{user.joinDate}</span>
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      user.status === "Active" || user.status === "Verified" ? "bg-success" :
                      user.status === "Pending" ? "bg-warning" : "bg-neutral-secondary"
                    )}
                  />
                  <span className="text-[12px] text-neutral-secondary">{user.status}</span>
                </div>
                <button className="text-[12px] text-primary cursor-pointer hover:underline">View</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REVENUE */}
      {activeTab === "revenue" && (
        <div className="mt-5">
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: "MRR", value: "$18,400" },
              { label: "ARR", value: "$220,800" },
              { label: "Paid vendors", value: "162" },
              { label: "Avg revenue / vendor", value: "$113" },
            ].map((s) => (
              <Card key={s.label} padding="p-3.5">
                <div className="text-[11px] text-neutral-secondary mb-1">{s.label}</div>
                <div className="text-[20px] font-medium">{s.value}</div>
              </Card>
            ))}
          </div>

          <Card>
            <div className="text-[14px] font-medium mb-4">Revenue by tier</div>
            {REVENUE_TIERS.map((tier) => (
              <div key={tier.tier} className="flex items-center gap-4 py-3 border-b border-black/[0.06] last:border-0">
                <span className="text-[13px] w-40 flex-shrink-0">{tier.tier}</span>
                <div className="flex-1 h-1 bg-black/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${tier.pct}%` }}
                  />
                </div>
                <span className="text-[13px] font-medium w-16 text-right">
                  {tier.mrr > 0 ? `$${tier.mrr.toLocaleString()}` : "—"}
                </span>
                <span className="text-[12px] text-neutral-secondary w-16 text-right">{tier.vendors} vendors</span>
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
}

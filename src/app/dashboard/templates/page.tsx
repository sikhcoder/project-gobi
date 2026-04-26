"use client";

import { useState } from "react";
import { TabBar } from "@/components/ui/tab-bar";
import { StatGrid } from "@/components/ui/stat-grid";
import { StatCard } from "@/components/ui/stat-card";
import { WelcomeBanner } from "@/components/templates/welcome-banner";
import { PhaseBlock } from "@/components/templates/phase-block";
import { BudgetSizeCards } from "@/components/templates/budget-size-cards";
import { VendorShortlist } from "@/components/templates/vendor-shortlist";
import { GuestTemplateCards } from "@/components/templates/guest-template-cards";
import {
  mockSikhChecklist,
  mockBudgetTemplates,
  mockVendorShortlist,
  mockGuestTemplates,
} from "@/lib/mock-data";

const tabs = [
  { label: "Planning checklist", value: "checklist" },
  { label: "Budget template", value: "budget" },
  { label: "Vendor shortlist", value: "vendors" },
  { label: "Guest templates", value: "guests" },
];

export default function TemplatesPage() {
  const [activeTab, setActiveTab] = useState("checklist");
  const [budgetSize, setBudgetSize] = useState("traditional");

  const completedCount = mockSikhChecklist.filter((i) => i.completed).length;
  const nowItems = mockSikhChecklist.filter((i) => i.phase === "now");
  const soonItems = mockSikhChecklist.filter((i) => i.phase === "soon");
  const laterItems = mockSikhChecklist.filter((i) => i.phase === "later");

  return (
    <div>
      <WelcomeBanner tradition="Sikh" />
      <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-5">
        {activeTab === "checklist" && (
          <div>
            <StatGrid>
              <StatCard label="Tasks complete" value={`${completedCount}/${mockSikhChecklist.length}`} />
              <StatCard label="Due this month" value="7 tasks" />
              <StatCard label="Vendors booked" value="3/11" />
              <StatCard label="Budget allocated" value="38%" />
            </StatGrid>
            <div className="mt-6">
              <PhaseBlock phase="now" items={nowItems} />
              <PhaseBlock phase="soon" items={soonItems} />
              <PhaseBlock phase="later" items={laterItems} />
            </div>
          </div>
        )}

        {activeTab === "budget" && (
          <BudgetSizeCards
            templates={mockBudgetTemplates}
            selected={budgetSize}
            onSelect={setBudgetSize}
          />
        )}

        {activeTab === "vendors" && (
          <VendorShortlist items={mockVendorShortlist} />
        )}

        {activeTab === "guests" && (
          <GuestTemplateCards templates={mockGuestTemplates} />
        )}
      </div>
    </div>
  );
}

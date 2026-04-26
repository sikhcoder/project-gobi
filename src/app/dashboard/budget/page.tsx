"use client";

import { useState, useEffect, useCallback } from "react";
import { TabBar } from "@/components/ui/tab-bar";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { OverviewTab } from "@/components/budget/overview-tab";
import { ByEventTab } from "@/components/budget/by-event-tab";
import { PaymentsTab } from "@/components/budget/payments-tab";
import { createClient } from "@/lib/supabase/client";
import { useWedding } from "@/lib/context/wedding-context";
import type { Budget, BudgetCategory, BudgetPayment, WeddingEvent } from "@/lib/types";
import type { EventBudgetData } from "@/components/budget/by-event-tab";

const CATEGORY_COLORS = ["#534AB7", "#1D9E75", "#854F0B", "#3B6D11", "#7C3AED", "#DB2777", "#0EA5E9", "#F59E0B"];

const tabs = [
  { label: "Overview", value: "overview" },
  { label: "By Event", value: "by-event" },
  { label: "Payments", value: "payments" },
];

export default function BudgetPage() {
  const { weddingId } = useWedding();
  const [activeTab, setActiveTab] = useState("overview");
  const [budget, setBudget] = useState<Budget | null>(null);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [upcoming, setUpcoming] = useState<BudgetPayment[]>([]);
  const [history, setHistory] = useState<BudgetPayment[]>([]);
  const [eventBudgets, setEventBudgets] = useState<Record<string, EventBudgetData>>({});
  const [loading, setLoading] = useState(true);

  // Modals
  const [showSetBudget, setShowSetBudget] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState("");
  const [newCat, setNewCat] = useState({ name: "", amount: "", eventId: "" });
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    const supabase = createClient();
    const [{ data: dbBudget }, { data: dbEvents }] = await Promise.all([
      supabase.from("budgets").select("*, budget_categories(*, budget_payments(*))").eq("wedding_id", weddingId).single(),
      supabase.from("events").select("*").eq("wedding_id", weddingId).order("date"),
    ]);

    if (dbBudget) {
      setBudget({ id: dbBudget.id, weddingId: dbBudget.wedding_id, totalAmount: Number(dbBudget.total_amount ?? 0) });
      setBudgetAmount(String(Number(dbBudget.total_amount ?? 0)));

      const rawCats = dbBudget.budget_categories ?? [];
      setCategories(rawCats.map((bc: Record<string, unknown>, i: number) => {
        const payments = (bc.budget_payments as Record<string, unknown>[] ?? []);
        const paid = payments.filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.amount ?? 0), 0);
        const paymentStatus = paid >= Number(bc.allocated_amount ?? 0) ? "paid" : paid > 0 ? "partial" : "unpaid";
        return {
          id: bc.id as string, budgetId: bc.budget_id as string, name: bc.name as string,
          allocatedAmount: Number(bc.allocated_amount ?? 0), spentAmount: paid,
          vendorBookingId: (bc.vendor_booking_id as string) ?? null, vendorName: null,
          status: paymentStatus as BudgetCategory["status"], color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
        };
      }));

      const allPayments: BudgetPayment[] = [];
      rawCats.forEach((bc: Record<string, unknown>) => {
        (bc.budget_payments as Record<string, unknown>[] ?? []).forEach((p) => {
          allPayments.push({
            id: p.id as string, budgetCategoryId: bc.id as string, vendorName: bc.name as string,
            category: bc.name as string, amount: Number(p.amount ?? 0),
            paidAt: (p.paid_at as string) ?? null, dueDate: (p.due_date as string) ?? null,
            status: p.status as BudgetPayment["status"],
          });
        });
      });
      setUpcoming(allPayments.filter((p) => p.status !== "paid" && p.dueDate));
      setHistory(allPayments.filter((p) => p.status === "paid"));

      const evtBudgets: Record<string, EventBudgetData> = {};
      rawCats.forEach((bc: Record<string, unknown>) => {
        const eventId = bc.event_id as string | undefined;
        if (eventId) {
          if (!evtBudgets[eventId]) evtBudgets[eventId] = { budget: 0, spent: 0, categories: [] };
          evtBudgets[eventId].budget += Number(bc.allocated_amount ?? 0);
          const payments = (bc.budget_payments as Record<string, unknown>[] ?? []);
          evtBudgets[eventId].spent += payments.filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.amount ?? 0), 0);
          evtBudgets[eventId].categories.push(bc.name as string);
        }
      });
      setEventBudgets(evtBudgets);
    } else {
      setBudget(null);
    }

    setEvents((dbEvents ?? []).map((e) => ({
      id: e.id, weddingId: e.wedding_id, name: e.name, date: e.date ?? "", time: e.time ?? "",
      venue: e.venue ?? "", dressCode: e.dress_code ?? "", ceremonyType: e.ceremony_type,
      displayColor: e.display_color ?? "#534AB7", sortOrder: e.sort_order ?? 0,
      guestsInvited: 0, rsvpConfirmed: 0, createdAt: e.created_at,
    })));
    setLoading(false);
  }, [weddingId]);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleSetBudget(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const amount = parseFloat(budgetAmount) || 0;

    if (budget) {
      await supabase.from("budgets").update({ total_amount: amount }).eq("id", budget.id);
    } else {
      await supabase.from("budgets").insert({ wedding_id: weddingId, total_amount: amount });
    }
    setSaving(false);
    setShowSetBudget(false);
    await loadData();
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!budget) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from("budget_categories").insert({
      budget_id: budget.id,
      name: newCat.name,
      allocated_amount: parseFloat(newCat.amount) || 0,
      event_id: newCat.eventId || null,
    });
    setSaving(false);
    setShowAddCategory(false);
    setNewCat({ name: "", amount: "", eventId: "" });
    await loadData();
  }

  if (loading) {
    return <div className="mt-10 text-center text-[13px] text-neutral-secondary">Loading budget…</div>;
  }

  const emptyBudget: Budget = { id: "", weddingId, totalAmount: 0 };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Budget</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowSetBudget(true)}>
            {budget ? "Edit budget" : "Set budget"}
          </Button>
          {budget && (
            <Button variant="primary" onClick={() => setShowAddCategory(true)}>+ Add category</Button>
          )}
        </div>
      </div>

      {!budget ? (
        <div className="text-center py-16 border-2 border-dashed border-black/15 rounded-xl">
          <div className="text-[15px] font-medium mb-1">No budget set yet</div>
          <p className="text-[13px] text-neutral-secondary mb-4">Set your total wedding budget to start tracking expenses.</p>
          <Button variant="primary" onClick={() => setShowSetBudget(true)}>Set budget</Button>
        </div>
      ) : (
        <>
          <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          <div className="mt-5">
            {activeTab === "overview" && <OverviewTab budget={budget ?? emptyBudget} categories={categories} />}
            {activeTab === "by-event" && <ByEventTab events={events} eventBudgets={eventBudgets} />}
            {activeTab === "payments" && <PaymentsTab upcoming={upcoming} history={history} />}
          </div>
        </>
      )}

      {/* Set Budget Modal */}
      <Modal open={showSetBudget} onClose={() => setShowSetBudget(false)} title={budget ? "Edit budget" : "Set budget"}>
        <form onSubmit={handleSetBudget}>
          <div className="mb-4">
            <label className="block text-[12px] text-neutral-secondary mb-1">Total wedding budget ($)</label>
            <input required type="number" min="0" step="100" value={budgetAmount}
              onChange={(e) => setBudgetAmount(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-black/15 bg-neutral-bg text-[14px] focus:outline-none focus:border-primary"
              placeholder="e.g. 50000" />
          </div>
          <Button type="submit" variant="primary" className="w-full" disabled={saving}>
            {saving ? "Saving…" : "Save budget"}
          </Button>
        </form>
      </Modal>

      {/* Add Category Modal */}
      <Modal open={showAddCategory} onClose={() => setShowAddCategory(false)} title="Add budget category">
        <form onSubmit={handleAddCategory}>
          <div className="mb-3">
            <label className="block text-[12px] text-neutral-secondary mb-1">Category name *</label>
            <input required value={newCat.name} onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-black/15 bg-neutral-bg text-[14px] focus:outline-none focus:border-primary"
              placeholder="e.g. Photography, Catering" />
          </div>
          <div className="mb-3">
            <label className="block text-[12px] text-neutral-secondary mb-1">Allocated amount ($)</label>
            <input type="number" min="0" step="50" value={newCat.amount}
              onChange={(e) => setNewCat({ ...newCat, amount: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-black/15 bg-neutral-bg text-[14px] focus:outline-none focus:border-primary"
              placeholder="e.g. 5000" />
          </div>
          {events.length > 0 && (
            <div className="mb-4">
              <label className="block text-[12px] text-neutral-secondary mb-1">Event (optional)</label>
              <select value={newCat.eventId} onChange={(e) => setNewCat({ ...newCat, eventId: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-black/15 bg-neutral-bg text-[14px] focus:outline-none focus:border-primary">
                <option value="">General / all events</option>
                {events.map((evt) => <option key={evt.id} value={evt.id}>{evt.name}</option>)}
              </select>
            </div>
          )}
          <Button type="submit" variant="primary" className="w-full" disabled={saving}>
            {saving ? "Adding…" : "Add category"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}

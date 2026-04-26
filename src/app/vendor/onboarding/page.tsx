"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { VENDOR_CATEGORIES, TRADITIONS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import type { VendorCategory } from "@/lib/types";

const STEPS = ["Basics", "Profile", "Verify", "Done"];

const PLAN_OPTIONS = [
  {
    id: "free",
    name: "Free",
    price: "$0/mo",
    features: ["Listed in marketplace", "Up to 3 portfolio photos", "Basic profile"],
  },
  {
    id: "standard",
    name: "Standard",
    price: "$49/mo",
    features: ["Everything in Free", "Priority placement", "Unlimited photos", "Quote request inbox", "Analytics"],
  },
  {
    id: "premium",
    name: "Premium",
    price: "$99/mo",
    features: ["Everything in Standard", "Featured badge", "Homepage placement", "Dedicated support", "Premium templates"],
  },
];

export default function VendorOnboardingPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1
  const [businessName, setBusinessName] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [city, setCity] = useState("");
  const [radius, setRadius] = useState("");
  const [selectedTraditions, setSelectedTraditions] = useState<string[]>([]);

  // Step 2
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");

  // Step 3
  const [selectedPlan, setSelectedPlan] = useState("standard");

  function toggleCategory(val: string) {
    setSelectedCategories((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  }

  function toggleTradition(val: string) {
    setSelectedTraditions((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("You must be signed in.");
      setSubmitting(false);
      return;
    }

    const category = (selectedCategories[0] ?? "photography") as VendorCategory;
    const { error: err } = await supabase.from("vendors").insert({
      user_id: user.id,
      name: businessName || "My Business",
      category,
      location: city,
      travel_radius_miles: parseInt(radius) || 0,
      tradition_specialisations: selectedTraditions,
      subscription_tier: selectedPlan,
      verified: false,
      bio,
      website: website || null,
      instagram: instagram || null,
    });

    if (err) {
      setError(err.message);
      setSubmitting(false);
    } else {
      setStep(4);
    }
  }

  return (
    <div>
      {/* Step progress */}
      {step < 4 && (
        <div className="flex items-center mb-8">
          {STEPS.slice(0, 3).map((label, idx) => {
            const stepNum = idx + 1;
            const isDone = stepNum < step;
            const isActive = stepNum === step;
            return (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-medium flex-shrink-0",
                      isDone ? "bg-success text-white" : isActive ? "bg-primary text-white" : "bg-neutral-bg text-neutral-secondary border border-black/15"
                    )}
                  >
                    {isDone ? "✓" : stepNum}
                  </div>
                  <span className={cn("text-[12px]", isActive ? "font-medium text-primary" : "text-neutral-secondary")}>
                    {label}
                  </span>
                </div>
                {idx < 2 && (
                  <div className={cn("flex-1 h-px mx-3", isDone ? "bg-success" : "bg-black/15")} />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Step 1: Basics */}
      {step === 1 && (
        <Card className="max-w-lg mx-auto">
          <h2 className="text-[18px] font-medium mb-1.5">Tell us about your business</h2>
          <p className="text-[13px] text-neutral-secondary mb-5 leading-relaxed">
            This information helps couples find you and understand your specialisations.
          </p>

          <div className="mb-4">
            <label className="block text-[12px] text-neutral-secondary mb-1.5">Business name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-black/15 bg-neutral-bg text-[14px] focus:outline-none focus:border-primary"
              placeholder="e.g. Meena's Mehndi Studio"
            />
          </div>

          <div className="mb-4">
            <label className="block text-[12px] text-neutral-secondary mb-2">Category</label>
            <div className="flex gap-2 flex-wrap">
              {VENDOR_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => toggleCategory(cat.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[12px] border transition-colors cursor-pointer",
                    selectedCategories.includes(cat.value)
                      ? "bg-primary border-primary text-white font-medium"
                      : "bg-white border-black/15 text-neutral-secondary hover:border-black/30"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-[12px] text-neutral-secondary mb-1.5">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-black/15 bg-neutral-bg text-[14px] focus:outline-none focus:border-primary"
                placeholder="Chicago, IL"
              />
            </div>
            <div>
              <label className="block text-[12px] text-neutral-secondary mb-1.5">Travel radius (miles)</label>
              <input
                type="number"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-black/15 bg-neutral-bg text-[14px] focus:outline-none focus:border-primary"
                placeholder="50"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-[12px] text-neutral-secondary mb-2">Tradition specialisations</label>
            <div className="flex gap-2 flex-wrap">
              {TRADITIONS.map((trad) => (
                <button
                  key={trad.value}
                  onClick={() => toggleTradition(trad.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[12px] border transition-colors cursor-pointer",
                    selectedTraditions.includes(trad.value)
                      ? "bg-primary border-primary text-white font-medium"
                      : "bg-white border-black/15 text-neutral-secondary hover:border-black/30"
                  )}
                >
                  {trad.label}
                </button>
              ))}
            </div>
          </div>

          <Button variant="primary" className="w-full" onClick={() => setStep(2)}>Continue</Button>
        </Card>
      )}

      {/* Step 2: Profile */}
      {step === 2 && (
        <Card className="max-w-lg mx-auto">
          <h2 className="text-[18px] font-medium mb-1.5">Build your profile</h2>
          <p className="text-[13px] text-neutral-secondary mb-5 leading-relaxed">
            A strong bio and portfolio gets you more quote requests.
          </p>

          <div className="mb-4">
            <label className="block text-[12px] text-neutral-secondary mb-1.5">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-black/15 bg-neutral-bg text-[14px] resize-none focus:outline-none focus:border-primary"
              rows={4}
              placeholder="Describe your style, experience, and what makes you special for Indian weddings…"
            />
          </div>

          <div className="mb-4">
            <label className="block text-[12px] text-neutral-secondary mb-1.5">Portfolio photos</label>
            <div className="border-2 border-dashed border-black/15 rounded-xl p-6 text-center cursor-pointer hover:border-primary/40 transition-colors mb-2">
              <div className="text-[13px] text-neutral-secondary mb-1">Drop photos here</div>
              <div className="text-[12px] text-primary">or click to browse</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div>
              <label className="block text-[12px] text-neutral-secondary mb-1.5">Website (optional)</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-black/15 bg-neutral-bg text-[14px] focus:outline-none focus:border-primary"
                placeholder="yoursite.com"
              />
            </div>
            <div>
              <label className="block text-[12px] text-neutral-secondary mb-1.5">Instagram (optional)</label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-black/15 bg-neutral-bg text-[14px] focus:outline-none focus:border-primary"
                placeholder="@handle"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
            <Button variant="primary" className="flex-1" onClick={() => setStep(3)}>Continue</Button>
          </div>
        </Card>
      )}

      {/* Step 3: Verify */}
      {step === 3 && (
        <Card className="max-w-lg mx-auto">
          <h2 className="text-[18px] font-medium mb-1.5">Verify your business</h2>
          <p className="text-[13px] text-neutral-secondary mb-5 leading-relaxed">
            Verification builds trust with couples. Our team reviews submissions within 48 hours.
          </p>

          <div className="flex items-start gap-2.5 p-3 bg-warning-bg rounded-xl mb-4">
            <div className="w-7 h-7 rounded-full bg-warning flex items-center justify-center text-[12px] text-white flex-shrink-0">!</div>
            <div className="text-[12px] text-warning-text leading-relaxed">
              A verified badge significantly increases quote requests. Most verified vendors receive 3× more inquiries.
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-[12px] text-neutral-secondary mb-1.5">Business registration / Tax ID</label>
            <input
              type="text"
              className="w-full px-3 py-2.5 rounded-lg border border-black/15 bg-neutral-bg text-[14px] focus:outline-none focus:border-primary"
              placeholder="EIN or registration number"
            />
          </div>

          <div className="mb-5">
            <label className="block text-[12px] text-neutral-secondary mb-1.5">Supporting documents</label>
            <div className="border-2 border-dashed border-black/15 rounded-xl p-5 text-center cursor-pointer hover:border-primary/40 transition-colors">
              <div className="text-[13px] text-neutral-secondary mb-1">Business license, insurance cert, or portfolio</div>
              <div className="text-[12px] text-primary cursor-pointer">Click to upload</div>
            </div>
          </div>

          {/* Plan selection */}
          <div className="text-[12px] font-medium text-neutral-secondary uppercase tracking-wider mb-3">Choose your plan</div>
          <div className="flex flex-col gap-2.5 mb-5">
            {PLAN_OPTIONS.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={cn(
                  "border rounded-xl p-3.5 cursor-pointer transition-colors",
                  selectedPlan === plan.id ? "border-primary bg-primary-pale" : "border-black/10 hover:border-black/25"
                )}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[14px] font-medium">{plan.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium">{plan.price}</span>
                    <div className={cn("w-4 h-4 rounded-full border-2 flex-shrink-0", selectedPlan === plan.id ? "border-primary bg-primary" : "border-black/20")} />
                  </div>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {plan.features.slice(0, 3).map((f) => (
                    <span key={f} className="text-[11px] text-neutral-secondary">{f}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {error && <p className="text-[12px] text-danger mb-3">{error}</p>}

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>Back</Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Submitting…" : "Submit for review"}
            </Button>
          </div>
        </Card>
      )}

      {/* Step 4: Done */}
      {step === 4 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-success-bg flex items-center justify-center text-[28px] mx-auto mb-4">✓</div>
          <h2 className="text-[22px] font-medium mb-2">Application submitted!</h2>
          <p className="text-[14px] text-neutral-secondary mb-2 max-w-sm mx-auto leading-relaxed">
            Our team will review your application within 48 hours. You&apos;ll receive an email once you&apos;re approved.
          </p>
          <p className="text-[13px] text-neutral-secondary mb-8">
            In the meantime, you can set up your vendor dashboard.
          </p>
          <Link href="/vendor/dashboard">
            <Button variant="primary">Go to your dashboard</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

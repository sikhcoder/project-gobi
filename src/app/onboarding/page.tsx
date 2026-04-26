"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepDots } from "@/components/onboarding/step-dots";
import { StepBasics } from "@/components/onboarding/step-basics";
import { StepCeremonies } from "@/components/onboarding/step-ceremonies";
import { StepTemplate } from "@/components/onboarding/step-template";
import { StepUrlReveal } from "@/components/onboarding/step-url-reveal";
import { CEREMONY_PRESETS, CEREMONY_COLORS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import type { Tradition, CeremonyType } from "@/lib/types";

const CEREMONY_DISPLAY_NAMES: Record<string, string> = {
  mehndi: "Mehndi",
  haldi: "Haldi",
  sangeet: "Sangeet",
  baraat: "Baraat",
  wedding: "Wedding Ceremony",
  reception: "Reception",
  chunni: "Chunni",
  vatna: "Vatna",
  "anand-karaj": "Anand Karaj",
  nikah: "Nikah",
  custom: "Custom",
};

function generateSlug(p1: string, p2: string): string {
  const clean = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "").slice(0, 8);
  return `${clean(p1)}-and-${clean(p2)}-${Date.now().toString(36).slice(-4)}`;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const [partner1, setPartner1] = useState("");
  const [partner2, setPartner2] = useState("");
  const [date, setDate] = useState("");
  const [city, setCity] = useState("");
  const [tradition, setTradition] = useState<Tradition | null>(null);
  const [ceremonies, setCeremonies] = useState<CeremonyType[]>([]);
  const [template, setTemplate] = useState<string | null>(null);

  function handleTraditionChange(t: Tradition) {
    setTradition(t);
    setCeremonies(CEREMONY_PRESETS[t] || []);
  }

  function toggleCeremony(c: CeremonyType) {
    setCeremonies((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }

  async function handleFinish() {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const slug = generateSlug(partner1, partner2);

    // Create wedding
    const { data: wedding, error: weddingError } = await supabase
      .from("weddings")
      .insert({
        couple_user_id: user.id,
        partner_1_name: partner1,
        partner_2_name: partner2,
        date: date || null,
        city: city || null,
        tradition: tradition || null,
        template_id: template || null,
        url_slug: slug,
      })
      .select("id")
      .single();

    if (weddingError || !wedding) {
      console.error("Failed to create wedding:", weddingError);
      setSaving(false);
      return;
    }

    // Create events for selected ceremonies
    if (ceremonies.length > 0) {
      const eventRows = ceremonies.map((c, i) => ({
        wedding_id: wedding.id,
        name: CEREMONY_DISPLAY_NAMES[c] ?? c,
        ceremony_type: c,
        display_color: CEREMONY_COLORS[c] ?? "#534AB7",
        sort_order: i,
      }));

      await supabase.from("events").insert(eventRows);
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[520px]">
        <div className="bg-[#e8e6e0] p-4 rounded-2xl">
          <div className="bg-white rounded-xl border border-black/10 px-7 py-7">
            <StepDots total={4} current={step} />

            {step === 0 && (
              <StepBasics
                partner1={partner1}
                partner2={partner2}
                date={date}
                city={city}
                tradition={tradition}
                onPartner1Change={setPartner1}
                onPartner2Change={setPartner2}
                onDateChange={setDate}
                onCityChange={setCity}
                onTraditionChange={handleTraditionChange}
                onContinue={() => setStep(1)}
              />
            )}

            {step === 1 && (
              <StepCeremonies
                selected={ceremonies}
                onToggle={toggleCeremony}
                onContinue={() => setStep(2)}
                onBack={() => setStep(0)}
              />
            )}

            {step === 2 && (
              <StepTemplate
                partner1={partner1}
                partner2={partner2}
                selectedTemplate={template}
                onSelect={setTemplate}
                onContinue={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            )}

            {step === 3 && (
              <StepUrlReveal
                partner1={partner1}
                partner2={partner2}
                eventCount={ceremonies.length}
                onFinish={handleFinish}
                saving={saving}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

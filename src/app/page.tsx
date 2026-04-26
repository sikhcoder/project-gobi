import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Multi-ceremony planning",
    description: "Manage Mehndi, Sangeet, Wedding, Reception and more — each with its own page, guest list, and budget.",
    color: "#D4537E",
  },
  {
    title: "Per-event RSVP",
    description: "Guests RSVP to each ceremony individually. Track confirmations per event, not just the wedding.",
    color: "#1D9E75",
  },
  {
    title: "Tradition-aware templates",
    description: "Sikh, Hindu, Muslim, and more. Checklists that know when to book the Ragi or schedule the Haldi.",
    color: "#534AB7",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="max-w-4xl mx-auto flex items-center justify-between px-6 py-4">
        <span className="text-lg font-medium text-primary">shaadi</span>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-neutral-secondary hover:text-neutral-text">
            Sign in
          </Link>
          <Link href="/signup">
            <Button variant="primary" size="sm">Get started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-2xl mx-auto text-center px-6 pt-16 pb-12">
        <h1 className="text-3xl font-medium mb-3 leading-tight">
          Planning your Indian wedding
          <br />
          just got easier
        </h1>
        <p className="text-base text-neutral-secondary mb-6 max-w-md mx-auto">
          The only platform built for multi-day, multi-ceremony Indian weddings.
          Manage every event, every guest, every vendor — in one place.
        </p>
        <Link href="/signup">
          <Button variant="primary" size="md">
            Start planning for free
          </Button>
        </Link>
      </section>

      {/* Features */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-xl border border-black/10 p-5">
              <div
                className="w-8 h-8 rounded-lg mb-3"
                style={{ backgroundColor: f.color + "20" }}
              />
              <h3 className="text-sm font-medium mb-1">{f.title}</h3>
              <p className="text-[13px] text-neutral-secondary leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-[11px] text-neutral-secondary">
        Built for Indian weddings, with love.
      </footer>
    </div>
  );
}

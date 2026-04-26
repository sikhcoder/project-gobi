import Link from "next/link";
import { mockWedding } from "@/lib/mock-data";

export default function RsvpConfirmationPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#f5f4f0" }}>
      <div className="max-w-sm w-full text-center">
        <div className="w-14 h-14 rounded-full bg-success-bg flex items-center justify-center text-[24px] mx-auto mb-4">✓</div>
        <h2 className="text-[20px] font-medium mb-1.5">RSVP received!</h2>
        <p className="text-[13px] text-neutral-secondary mb-2 leading-relaxed">
          Thank you for responding to {mockWedding.partner1Name} &amp; {mockWedding.partner2Name}&apos;s wedding.
        </p>
        <p className="text-[13px] text-neutral-secondary mb-8">
          You&apos;ll receive a confirmation email shortly.
        </p>
        <Link
          href={`/rsvp/token`}
          className="text-[13px] text-primary hover:underline"
        >
          Change your response
        </Link>
      </div>
    </div>
  );
}

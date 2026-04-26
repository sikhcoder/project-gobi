"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface DashboardHeaderProps {
  partner1: string;
  partner2: string;
  date: string;
  city: string;
  eventCount: number;
  userEmail?: string;
}

export function DashboardHeader({
  partner1,
  partner2,
  date,
  city,
  eventCount,
  userEmail,
}: DashboardHeaderProps) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="mb-1">
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-black/[0.06]">
        <Link href="/dashboard" className="text-[15px] font-medium text-primary hover:text-primary-dark">
          shaadi.com
        </Link>
        <div className="flex items-center gap-3">
          {userEmail && (
            <span className="text-[12px] text-neutral-secondary">{userEmail}</span>
          )}
          <button
            onClick={handleSignOut}
            className="text-[12px] text-neutral-secondary hover:text-danger cursor-pointer transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium">
            {partner1} & {partner2}
          </h1>
          <p className="text-[13px] text-neutral-secondary">
            {date} · {city} · {eventCount} events
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/site">
            <Button variant="outline">Edit site</Button>
          </Link>
          <Link href="/dashboard/guests?tab=rsvp">
            <Button variant="primary">Send RSVPs</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { WeddingProvider } from "@/lib/context/wedding-context";
import { formatDate } from "@/lib/utils";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: wedding } = await supabase
    .from("weddings")
    .select("*, events(id)")
    .eq("couple_user_id", user.id)
    .single();

  if (!wedding) redirect("/onboarding");

  const eventCount = Array.isArray(wedding.events) ? wedding.events.length : 0;

  const weddingCtx = {
    weddingId: wedding.id,
    partner1Name: wedding.partner_1_name,
    partner2Name: wedding.partner_2_name,
    date: wedding.date,
    city: wedding.city,
    tradition: wedding.tradition,
    urlSlug: wedding.url_slug,
    eventCount,
  };

  return (
    <WeddingProvider value={weddingCtx}>
      <div className="max-w-3xl mx-auto bg-white min-h-screen px-7 py-6">
        <DashboardHeader
          partner1={wedding.partner_1_name}
          partner2={wedding.partner_2_name}
          date={wedding.date ? formatDate(wedding.date) : "Date TBD"}
          city={wedding.city ?? ""}
          eventCount={eventCount}
          userEmail={user.email ?? ""}
        />
        <DashboardNav />
        {children}
      </div>
    </WeddingProvider>
  );
}

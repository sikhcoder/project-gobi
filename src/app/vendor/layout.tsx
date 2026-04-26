import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function VendorLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="max-w-3xl mx-auto bg-white min-h-screen px-7 py-6">
      <div className="flex items-center justify-between mb-6">
        <Link href="/" className="text-[15px] font-medium text-primary hover:text-primary-dark">
          shaadi.com
        </Link>
        <span className="text-[12px] text-neutral-secondary">Vendor portal</span>
      </div>
      {children}
    </div>
  );
}

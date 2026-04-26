import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // In production: check user is in an admin list/role
  // For now, any authenticated user can access admin for development

  return (
    <div className="max-w-4xl mx-auto bg-white min-h-screen px-7 py-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-[15px] font-medium">Platform admin</span>
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-warning-bg text-warning-text uppercase tracking-wider">Admin</span>
      </div>
      {children}
    </div>
  );
}

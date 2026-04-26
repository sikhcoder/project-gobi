import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  console.log("[auth/callback] code:", code ? `${code.slice(0, 8)}...` : "MISSING");
  console.log("[auth/callback] origin:", origin);

  if (code) {
    const cookieStore = await cookies();

    const pendingCookies: Array<{ name: string; value: string; options: CookieOptions }> = [];

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              pendingCookies.push({ name, value, options });
            });
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    console.log("[auth/callback] exchange error:", error?.message ?? "none");
    console.log("[auth/callback] user:", data?.user?.id ?? "null");
    console.log("[auth/callback] pendingCookies count:", pendingCookies.length);
    pendingCookies.forEach((c) => console.log("  cookie:", c.name, "options:", JSON.stringify(c.options)));

    if (!error) {
      const response = NextResponse.redirect(`${origin}${next}`);
      pendingCookies.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options);
      });
      return response;
    }
  }

  console.log("[auth/callback] falling through to error redirect");
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { InputField } from "@/components/ui/input-field";
import { Button } from "@/components/ui/button";
import { SelectionPill } from "@/components/ui/selection-pill";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<"couple" | "vendor">("couple");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { user_type: userType },
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Redirect couples to onboarding, vendors to their onboarding
      router.push(userType === "couple" ? "/onboarding" : "/vendor/onboarding");
      router.refresh();
    }
  }

  async function handleGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          // Pass user_type in state so we can read it post-OAuth if needed
          // For Google OAuth the user_type defaults to 'couple' via the DB trigger
        },
      },
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-xl border border-black/10 px-7 py-7">
          <h1 className="text-xl font-medium mb-1 text-center">Create your account</h1>
          <p className="text-[13px] text-neutral-secondary text-center mb-5">
            Start planning your dream wedding
          </p>

          <div className="flex justify-center gap-2 mb-5">
            <SelectionPill selected={userType === "couple"} onClick={() => setUserType("couple")}>
              Couple
            </SelectionPill>
            <SelectionPill selected={userType === "vendor"} onClick={() => setUserType("vendor")}>
              Vendor
            </SelectionPill>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-3 mb-4">
              <InputField
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <InputField
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            {error && (
              <p className="text-[12px] text-danger mb-3">{error}</p>
            )}

            <Button size="full" type="submit" disabled={loading}>
              {loading ? "Creating account…" : "Create account"}
            </Button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-[11px] text-neutral-secondary">or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            className="w-full py-2.5 text-sm font-medium border border-black/15 rounded-lg cursor-pointer hover:bg-neutral-bg transition-colors flex items-center justify-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-[13px] text-neutral-secondary text-center mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

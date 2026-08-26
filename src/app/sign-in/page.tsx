"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Wordmark } from "@/components/wordmark";

function SignInContent() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError(null);
    setLoading(true);

    const supabase = createSupabaseBrowserClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setLoading(false);
      setError(error.message);
      return;
    }

    if (!data.session) {
      setLoading(false);
      setError("Unable to create a login session. Please try again.");
      return;
    }

    // Force a full reload so the server immediately sees
    // the new Supabase authentication session.
    window.location.href = next;
  }

  return (
    <main className="min-h-screen grid place-items-center px-4 bg-[#FAFAFA]">
      <div className="card p-8 w-full max-w-md">
        <Link href="/" className="text-sm text-[#DB1F26]">
          ← Back
        </Link>

        <div className="mt-4 mb-2">
          <Wordmark size="sm" href={null} />
        </div>

        <h1 className="font-serif text-3xl text-[#0A0D12] mt-2">
          Welcome back.
        </h1>

        <p className="text-sm text-[#6B7280] mt-1">
          Sign in to continue.
        </p>

        <form onSubmit={onSubmit} className="space-y-4 mt-6">
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              required
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="label" htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              required
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-sm text-[#B42318] bg-[#FEF3F2] px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-sm text-[#6B7280] mt-6 text-center">
          New here?{" "}
          <Link
            href="/sign-up"
            className="text-[#DB1F26] font-medium underline-offset-2 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInContent />
    </Suspense>
  );
}


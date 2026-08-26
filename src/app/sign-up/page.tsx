"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Wordmark } from "@/components/wordmark";
import type { UserRole } from "@/lib/types";

const ROLES: { value: UserRole; label: string; desc: string }[] = [
  {
    value: "requestor",
    label: "I'm requesting an interpreter",
    desc: "Deaf community members requesting pro bono interpreting for personal moments.",
  },
  {
    value: "interpreter",
    label: "I'm a volunteer interpreter",
    desc: "Qualified interpreters offering pro bono service close to home.",
  },
  {
    value: "partner_admin",
    label: "I represent a Deaf community organization",
    desc: "Partner organizations that vouch for community members.",
  },
];

export default function SignUpPage() {
  return (
    <Suspense fallback={<AuthLoading />}>
      <SignUpForm />
    </Suspense>
  );
}

function SignUpForm() {
  const params = useSearchParams();

  const roleParam = params.get("role");

  const initialRole: UserRole =
    roleParam === "interpreter" || roleParam === "partner_admin"
      ? roleParam
      : "requestor";

  const [role, setRole] = useState<UserRole>(initialRole);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError(null);
    setLoading(true);

    const supabase = createSupabaseBrowserClient();

    const { data, error: signUpErr } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName.trim(),
          role,
        },
      },
    });

    if (signUpErr) {
      setLoading(false);
      setError(signUpErr.message);
      return;
    }

    if (!data.user) {
      setLoading(false);
      setError("Your account could not be created. Please try again.");
      return;
    }

    /*
      The matching row in public.profiles should now be created
      automatically by the Supabase database trigger.
    */

    if (!data.session) {
      setLoading(false);

      setError(
        "Your account was created, but a login session was not started. Please sign in."
      );

      return;
    }

    setLoading(false);

    if (role === "requestor") {
      window.location.href = "/requestor";
      return;
    }

    window.location.href = "/pending-approval";
  }

  return (
    <main className="min-h-screen grid place-items-center px-4 py-12 bg-[#FAFAFA]">
      <div className="card p-8 w-full max-w-xl">
        <Link href="/" className="text-sm text-[#DB1F26]">
          ← Back
        </Link>

        <div className="mt-4 mb-2">
          <Wordmark size="sm" href={null} />
        </div>

        <h1 className="font-serif text-3xl text-[#0A0D12] mt-2">
          Welcome to the roots.
        </h1>

        <p className="text-sm text-[#6B7280] mt-1">
          Tell us which account you'd like.
        </p>

        <div className="mt-6 space-y-3">
          {ROLES.map((r) => (
            <label
              key={r.value}
              className={`block cursor-pointer rounded-xl border p-4 transition ${
                role === r.value
                  ? "border-[#DB1F26] bg-[#FCEBEC]"
                  : "border-[#E5E7EB] hover:border-[#DB1F26]"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  className="mt-1"
                  name="role"
                  value={r.value}
                  checked={role === r.value}
                  onChange={() => setRole(r.value)}
                />

                <div>
                  <p className="font-medium text-[#0A0D12]">{r.label}</p>

                  <p className="text-sm text-[#6B7280]">{r.desc}</p>
                </div>
              </div>
            </label>
          ))}
        </div>

        <form onSubmit={onSubmit} className="space-y-4 mt-6">
          <div>
            <label className="label" htmlFor="fullName">
              Full name
            </label>

            <input
              id="fullName"
              required
              className="input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
            />
          </div>

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
              minLength={8}
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />

            <p className="text-xs text-[#6B7280] mt-1">
              At least 8 characters.
            </p>
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
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="text-sm text-[#6B7280] mt-6 text-center">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-[#DB1F26] font-medium underline-offset-2 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

function AuthLoading() {
  return (
    <main className="min-h-screen grid place-items-center px-4 bg-[#FAFAFA]">
      <div className="card p-8 w-full max-w-xl">
        <Wordmark size="sm" href={null} />

        <p className="text-sm text-[#6B7280] mt-4">
          Loading sign up…
        </p>
      </div>
    </main>
  );
}

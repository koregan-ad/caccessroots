import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabase/server";
import type { Profile, UserRole } from "./types";

export async function getCurrentUser() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("getCurrentProfile error:", error);

    throw new Error(
      `Profile lookup failed: ${error.message}`
    );
  }

  return (data as Profile) ?? null;
}

export async function requireRole(
  roles: UserRole[]
): Promise<Profile> {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  if (!roles.includes(profile.role)) {
    redirect("/onboarding");
  }

  if (
    profile.status !== "active" &&
    profile.role !== "requestor"
  ) {
    redirect("/pending-approval");
  }

  return profile;
}

export async function requireProfile(): Promise<Profile> {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  return profile;
}

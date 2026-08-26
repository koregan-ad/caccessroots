import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    redirect("/sign-in");
  }

  if (profile.role === "requestor") {
    redirect("/requestor");
  }

  if (
    profile.role === "interpreter" ||
    profile.role === "partner_admin"
  ) {
    if (profile.status === "pending") {
      redirect("/pending-approval");
    }
  }

  if (profile.role === "admin") {
    redirect("/admin");
  }

  redirect("/");
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function addBlockAction(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const interpreter_email = String(formData.get("interpreter_email") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim() || null;

  if (!interpreter_email) {
    redirect("/requestor/blocklist?error=missing_email");
  }

  const { error } = await supabase.rpc("add_requestor_block_by_email", {
    p_interpreter_email: interpreter_email,
    p_reason: reason,
  });

  if (error) {
    console.error("Blocklist add failed:", {
      code: error.code,
      message: error.message,
    });

    redirect(
      error.code === "P0002"
        ? "/requestor/blocklist?error=not_found"
        : "/requestor/blocklist?error=add_failed"
    );
  }

  revalidatePath("/requestor/blocklist");
  redirect("/requestor/blocklist?added=1");
}

export async function removeBlockAction(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const id = String(formData.get("id") ?? "");
  const { error } = await supabase
    .from("coi_blocks")
    .delete()
    .eq("id", id)
    .eq("requestor_id", user.id);
  if (error) {
    console.error("Blocklist remove failed:", {
      code: error.code,
      message: error.message,
    });
    redirect("/requestor/blocklist?error=remove_failed");
  }

  revalidatePath("/requestor/blocklist");
  redirect("/requestor/blocklist?removed=1");
}

"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function acceptAssignmentAction(formData: FormData) {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not signed in");

  const id = String(formData.get("id") ?? "");

  if (!id) throw new Error("Missing assignment");

  const { data: assignment, error } = await supabase
    .from("assignments")
    .update({
      status: "accepted",
      accepted_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("interpreter_id", user.id)
    .eq("status", "released")
    .select("request_id")
    .single();

  if (error) throw new Error(error.message);

  if (assignment?.request_id) {
    // The database trigger updates the request to Assigned.
    revalidatePath(
      `/coordinator/requests/${assignment.request_id}`
    );
  }

  revalidatePath("/interpreter/assignments");
  revalidatePath("/requestor/requests");
  revalidatePath("/coordinator");
}

export async function declineAssignmentAction(formData: FormData) {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not signed in");

  const id = String(formData.get("id") ?? "");

  if (!id) throw new Error("Missing assignment");

  const decline_reason =
    String(formData.get("decline_reason") ?? "").trim() || null;

  const { data: assignment, error } = await supabase
    .from("assignments")
    .update({
      status: "declined",
      declined_at: new Date().toISOString(),
      decline_reason,
    })
    .eq("id", id)
    .eq("interpreter_id", user.id)
    .eq("status", "released")
    .select("request_id")
    .single();

  if (error) throw new Error(error.message);

  if (assignment?.request_id) {
    // The database trigger returns the request to Open.
    revalidatePath(
      `/coordinator/requests/${assignment.request_id}`
    );
  }

  revalidatePath("/interpreter/assignments");
  revalidatePath("/requestor/requests");
  revalidatePath("/coordinator");
}

export async function withdrawAssignmentAction(formData: FormData) {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not signed in");

  const id = String(formData.get("id") ?? "");

  if (!id) throw new Error("Missing assignment");

  const decline_reason =
    String(formData.get("decline_reason") ?? "").trim() || null;

  const { data: assignment, error } = await supabase
    .from("assignments")
    .update({
      status: "declined",
      declined_at: new Date().toISOString(),
      decline_reason,
    })
    .eq("id", id)
    .eq("interpreter_id", user.id)
    .eq("status", "accepted")
    .select("request_id")
    .single();

  if (error) throw new Error(error.message);

  if (assignment?.request_id) {
    // The database trigger returns the request to Open.
    revalidatePath(
      `/coordinator/requests/${assignment.request_id}`
    );
  }

  revalidatePath("/interpreter/assignments");
  revalidatePath("/requestor/requests");
  revalidatePath("/coordinator");
}

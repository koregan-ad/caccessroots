"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function respondToProposalAction(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not signed in");

  const assignmentId = String(formData.get("assignment_id") ?? "");
  const decision = String(formData.get("decision") ?? "");

  if (!assignmentId || !["accept", "decline"].includes(decision)) {
    throw new Error("Invalid proposal response");
  }

  const { data: requestId, error } = await supabase.rpc(
    "respond_to_assignment_proposal",
    {
      p_assignment_id: assignmentId,
      p_accept: decision === "accept",
    }
  );

  if (error) throw new Error(error.message);

  revalidatePath("/requestor");
  revalidatePath("/requestor/requests");
  revalidatePath("/coordinator");

  if (requestId) {
    revalidatePath(`/coordinator/requests/${requestId}`);
  }

  if (decision === "accept") {
    revalidatePath("/interpreter/assignments");
  }
}

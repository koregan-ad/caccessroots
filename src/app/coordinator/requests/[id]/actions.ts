"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function proposeAssignmentAction(formData: FormData) {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not signed in");

  const request_id = String(formData.get("request_id") ?? "");
  const interpreter_id = String(formData.get("interpreter_id") ?? "");

  if (!request_id || !interpreter_id) {
    throw new Error("Missing request or interpreter");
  }

  const { data: req, error: requestLookupError } = await supabase
    .from("requests")
    .select("sensitivity,status")
    .eq("id", request_id)
    .single();

  if (requestLookupError) {
    throw new Error(requestLookupError.message);
  }

  if (req.status !== "open") {
    throw new Error("This request is not open for matching");
  }

  const initialAssignmentStatus =
    req.sensitivity === "sensitive"
      ? "pending_admin_release"
      : "proposed";

  /*
   * Check whether this interpreter already has an assignment
   * record for this request.
   *
   * This can happen when:
   * - the interpreter previously declined
   * - the interpreter previously accepted and later withdrew
   * - the coordinator is trying the same interpreter again
   */
  const { data: existingAssignment, error: existingError } = await supabase
    .from("assignments")
    .select("id,status")
    .eq("request_id", request_id)
    .eq("interpreter_id", interpreter_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingError) {
    throw new Error(existingError.message);
  }

  let assignmentId: string;

  if (existingAssignment) {
    /*
     * Do not create a duplicate assignment.
     * Re-release the existing record instead.
     */
    const { data: updatedAssignment, error: updateError } = await supabase
      .from("assignments")
      .update({
        status: initialAssignmentStatus,
        proposed_by: user.id,

        released_by: null,
        released_at: null,

        accepted_at: null,

        declined_at: null,
        decline_reason: null,
      })
      .eq("id", existingAssignment.id)
      .select("id")
      .single();

    if (updateError) {
      throw new Error(updateError.message);
    }

    assignmentId = updatedAssignment.id;
  } else {
    /*
     * No previous assignment exists for this interpreter/request,
     * so create a new one.
     */
    const { data: newAssignment, error: insertError } = await supabase
      .from("assignments")
      .insert({
        request_id,
        interpreter_id,
        proposed_by: user.id,
        status: initialAssignmentStatus,
      })
      .select("id")
      .single();

    if (insertError) {
      throw new Error(insertError.message);
    }

    assignmentId = newAssignment.id;
  }

  if (req?.sensitivity === "sensitive") {
    /*
     * Sensitive requests go through approval before release.
     */
    const { error: approvalError } = await supabase
      .from("approvals")
      .insert({
        kind: "sensitive_assignment",
        target_table: "assignments",
        target_id: assignmentId,
        requested_by: user.id,
        requires_two_keys: false,
        context: {
          request_id,
          interpreter_id,
          assignment_id: assignmentId,
        },
      });

    if (approvalError) {
      throw new Error(approvalError.message);
    }

    const { error: requestError } = await supabase
      .from("requests")
      .update({ status: "pending_review" })
      .eq("id", request_id);

    if (requestError) {
      throw new Error(requestError.message);
    }
  } else {
    /*
     * Standard request:
     * hold the proposal for the requester to approve. The interpreter cannot
     * see either the assignment or request yet.
     */
    const { error: requestError } = await supabase
      .from("requests")
      .update({ status: "proposed" })
      .eq("id", request_id);

    if (requestError) {
      throw new Error(requestError.message);
    }
  }

  revalidatePath("/coordinator");
  revalidatePath(`/coordinator/requests/${request_id}`);
  revalidatePath("/interpreter/assignments");
  revalidatePath("/interpreter/open-requests");
  revalidatePath("/requestor/requests");

  redirect("/coordinator");
}

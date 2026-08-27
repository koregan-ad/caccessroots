import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatDateTime, relativeFromNow } from "@/lib/utils";
import type { InterpreterRecommendation } from "@/lib/types";
import { proposeAssignmentAction } from "./actions";

export default async function MatchRequestPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createSupabaseServerClient();

  const { data: request, error } = await supabase
    .from("requests")
    .select(
      "id,title,description,event_type,sensitivity,event_address,event_start,event_end,languages_needed,modality,status,requestor(full_name,email)"
    )
    .eq("id", params.id)
    .single();

  if (error || !request) notFound();

  const { data: recs, error: recError } = await supabase.rpc(
    "match_interpreters_for_request",
    {
      p_request_id: params.id,
    }
  );

  if (recError) {
    throw new Error(recError.message);
  }

  /*
   * Get previous/current assignments for this request.
   * This prevents the coordinator from accidentally creating
   * duplicate assignments for the same interpreter.
   */
  const { data: assignmentRows, error: assignmentError } = await supabase
    .from("assignments")
    .select(
      "id,interpreter_id,status,accepted_at,declined_at,decline_reason,created_at"
    )
    .eq("request_id", params.id)
    .order("created_at", { ascending: false });

  if (assignmentError) {
    throw new Error(assignmentError.message);
  }

  const recommendations = (recs ?? []) as InterpreterRecommendation[];

  /*
   * Keep the newest assignment record for each interpreter.
   */
  const assignmentByInterpreter = new Map<string, any>();

  for (const assignment of assignmentRows ?? []) {
    if (!assignmentByInterpreter.has(assignment.interpreter_id)) {
      assignmentByInterpreter.set(
        assignment.interpreter_id,
        assignment
      );
    }
  }

  /*
   * Only allow a new interpreter to be assigned when the
   * request has returned to the open state.
   */
  const canAssignNewInterpreter = request.status === "open";

  return (
    <div>
      <Link href="/coordinator" className="text-sm text-ink-muted">
        ← Back to queue
      </Link>

      <div className="card p-6 mt-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-subtle">
              {(request as any).event_type.replace("_", " ")}
            </p>

            <h1 className="text-2xl font-semibold mt-1">
              {request.title}
            </h1>

            <p className="text-ink-muted mt-1">
              {(request as any).requestor?.full_name} (
              {(request as any).requestor?.email})
            </p>
          </div>

          {request.sensitivity === "sensitive" && (
            <span className="badge bg-terra-100 text-terra-900">
              Sensitive — admin must release the match
            </span>
          )}
        </div>

        <dl className="grid sm:grid-cols-2 gap-4 mt-4 text-sm">
          <div>
            <dt className="text-ink-muted">When</dt>
            <dd>
              {formatDateTime(request.event_start)} (
              {relativeFromNow(request.event_start)})
            </dd>
          </div>

          <div>
            <dt className="text-ink-muted">Where</dt>
            <dd>{request.event_address}</dd>
          </div>

          <div>
            <dt className="text-ink-muted">Modality</dt>
            <dd className="capitalize">
              {(request as any).modality.replace("_", " ")}
            </dd>
          </div>

          <div>
            <dt className="text-ink-muted">Languages</dt>
            <dd>
              {Array.isArray(request.languages_needed)
                ? request.languages_needed.join(", ")
                : ""}
            </dd>
          </div>
        </dl>

        {request.description && (
          <p className="mt-4 text-sm text-ink-muted">
            {request.description}
          </p>
        )}
      </div>

      <h2 className="text-xl font-semibold mt-8">
        Recommended interpreters{" "}
        <span className="text-sm text-ink-muted font-normal">
          ({recommendations.length} eligible after COI / language / radius
          filters)
        </span>
      </h2>

      <p className="text-sm text-ink-muted">
        Ranked by fit. Blocklisted interpreters are excluded by the database —
        they do not appear here.
      </p>

      <div className="space-y-3 mt-4">
        {recommendations.map((r) => {
          const existingAssignment = assignmentByInterpreter.get(
            r.interpreter_id
          );

          const wasWithdrawn =
            existingAssignment?.status === "declined" &&
            Boolean(existingAssignment?.accepted_at);

          return (
            <div
              key={r.interpreter_id}
              className="card p-4 flex items-center justify-between gap-4"
            >
              <div>
                <p className="font-medium">{r.full_name}</p>

                <p className="text-sm text-ink-muted">
                  {r.distance_miles} mi away • radius{" "}
                  {r.service_radius_miles} mi •{" "}
                  {r.within_service_radius ? (
                    <span className="text-emerald-700">
                      within radius
                    </span>
                  ) : (
                    <span className="text-rose-600">
                      outside radius
                    </span>
                  )}{" "}
                  • workload {r.active_workload} • {r.total_completed} pro bono
                  done
                </p>

                <p className="text-xs text-ink-muted mt-1">
                  Languages:{" "}
                  {Array.isArray(r.languages)
                    ? r.languages.join(", ")
                    : ""}{" "}
                  • Modalities:{" "}
                  {Array.isArray(r.modalities)
                    ? r.modalities.join(", ")
                    : ""}
                </p>

                {wasWithdrawn && (
                  <p className="text-xs text-rose-600 mt-2">
                    This interpreter previously accepted and withdrew from this
                    request.
                  </p>
                )}

                {existingAssignment?.status === "declined" &&
                  !wasWithdrawn && (
                    <p className="text-xs text-ink-muted mt-2">
                      This interpreter previously declined this request.
                    </p>
                  )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold">
                  {r.fit_score}{" "}
                  <span className="text-ink-muted text-xs">
                    fit
                  </span>
                </span>

                {existingAssignment?.status === "accepted" && (
                  <span className="badge bg-brand-50 text-brand-700">
                    Accepted
                  </span>
                )}

                {existingAssignment?.status === "released" && (
                  <span className="badge bg-brand-50 text-brand-700">
                    Awaiting response
                  </span>
                )}

                {(existingAssignment?.status === "proposed" ||
                  existingAssignment?.status ===
                    "pending_admin_release") && (
                  <span className="badge bg-brand-50 text-brand-700">
                    Proposed
                  </span>
                )}

                {wasWithdrawn && (
                  <span className="badge bg-terra-100 text-terra-900">
                    Withdrawn
                  </span>
                )}

                {existingAssignment?.status === "declined" &&
                  !wasWithdrawn && (
                    <span className="badge bg-terra-100 text-terra-900">
                      Declined
                    </span>
                  )}

                {!existingAssignment &&
                  canAssignNewInterpreter && (
                    <form action={proposeAssignmentAction}>
                      <input
                        type="hidden"
                        name="request_id"
                        value={request.id}
                      />

                      <input
                        type="hidden"
                        name="interpreter_id"
                        value={r.interpreter_id}
                      />

                      <button className="btn-primary text-sm py-1.5 px-3">
                        {request.sensitivity === "sensitive"
                          ? "Propose to admin"
                          : "Assign"}
                      </button>
                    </form>
                  )}
              </div>
            </div>
          );
        })}

        {recommendations.length === 0 && (
          <div className="card p-6 text-center text-ink-muted">
            No interpreters match this request's filters. Consider widening the
            service radius, contacting partner communities, or flagging this
            for admin attention.
          </div>
        )}
      </div>
    </div>
  );
}

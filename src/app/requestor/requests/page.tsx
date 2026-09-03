import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createInterpreterPhotoUrl } from "@/lib/interpreter-photos";
import { requireProfile } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";
import {
  eventTypeLabel,
  requestStatusLabel,
} from "@/lib/request-workflow";
import { respondToProposalAction } from "./actions";

type ProposalRow = {
  assignment_id: string;
  request_id: string;
  interpreter_name: string;
  interpreter_credentials: string | null;
  interpreter_is_certified: boolean | null;
  interpreter_certifications: string[];
  interpreter_licenses: string[];
  interpreter_specialties: string[];
  interpreter_experience_band: string | null;
  interpreter_profile_photo_path: string | null;
  interpreter_intro_video_url: string | null;
  interpreter_photo_url?: string | null;
};

export default async function MyRequestsPage() {
  const profile = await requireProfile();
  const supabase = createSupabaseServerClient();

  const { data: requests } = await supabase
    .from("requests")
    .select(
      "id,title,event_start,event_address,status,sensitivity,event_type"
    )
    .eq("requestor_id", profile.id)
    .order("event_start", { ascending: false });

  const { data: proposalRows, error: proposalError } =
    await supabase.rpc(
      "requestor_assignment_proposals"
    );

  if (proposalError) {
    console.error(
      "Request proposal load error:",
      proposalError
    );

    throw new Error(
      `Could not load match proposals: ${proposalError.message}`
    );
  }

  const proposals = await Promise.all(
    ((proposalRows ?? []) as ProposalRow[]).map(
      async (proposal) => ({
        ...proposal,
        interpreter_photo_url:
          await createInterpreterPhotoUrl(
            supabase,
            proposal.interpreter_profile_photo_path
          ),
      })
    )
  );

  const proposalsByRequest = new Map(
    proposals.map((proposal) => [
      proposal.request_id,
      proposal,
    ])
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold">
        My requests
      </h1>

      <p className="text-ink-muted mt-1">
        All your requests, past and upcoming.
      </p>

      <div className="card mt-6 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-ink-muted text-left">
            <tr>
              <th className="px-4 py-2">Event</th>
              <th className="px-4 py-2">When</th>
              <th className="px-4 py-2">Where</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">
                Next step
              </th>
            </tr>
          </thead>

          <tbody>
            {requests?.map((r) => (
              <tr
                key={r.id}
                className="border-t border-slate-100"
              >
                <td className="px-4 py-3 font-medium">
                  {r.title}
                </td>

                <td className="px-4 py-3">
                  {formatDateTime(r.event_start)}
                </td>

                <td className="px-4 py-3 text-ink-muted">
                  {r.event_address}
                </td>

                <td className="px-4 py-3 capitalize">
                  {eventTypeLabel(r.event_type)}

                  {r.sensitivity === "sensitive" && (
                    <span className="badge bg-terra-100 text-terra-900 ml-2">
                      Sensitive
                    </span>
                  )}
                </td>

                <td className="px-4 py-3">
                  <span className="badge bg-brand-50 text-brand-700 capitalize">
                    {requestStatusLabel(r.status)}
                  </span>
                </td>

                <td className="px-4 py-3">
                  {proposalsByRequest.has(r.id) ? (
                    <ProposalActions
                      proposal={
                        proposalsByRequest.get(r.id)!
                      }
                    />
                  ) : r.status ===
                    "pending_review" ? (
                    <span className="text-xs leading-relaxed text-ink-muted">
                      A person will review this before
                      matching.
                    </span>
                  ) : (
                    <span className="text-xs text-ink-muted">
                      —
                    </span>
                  )}
                </td>
              </tr>
            ))}

            {(!requests ||
              requests.length === 0) && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-ink-muted"
                >
                  No requests yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProposalActions({
  proposal,
}: {
  proposal: ProposalRow;
}) {
  return (
    <div className="min-w-52">
      <div className="flex items-start gap-3">
        {proposal.interpreter_photo_url ? (
          <img
            src={proposal.interpreter_photo_url}
            alt={`${proposal.interpreter_name} profile`}
            className="h-12 w-12 shrink-0 rounded-full border border-slate-200 object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-ink-muted">
            {proposal.interpreter_name
              ?.charAt(0)
              ?.toUpperCase() ?? "I"}
          </div>
        )}

        <div>
          <p className="text-sm font-medium">
            {proposal.interpreter_name}
          </p>

          <p className="text-xs text-ink-muted">
            {proposal.interpreter_is_certified === true
              ? "Certified"
              : proposal.interpreter_is_certified ===
                  false
                ? "Not certified"
                : "Certification not provided"}

            {proposal.interpreter_experience_band
              ? ` • ${experienceBandLabel(
                  proposal.interpreter_experience_band
                )}`
              : ""}
          </p>
        </div>
      </div>

      {proposal.interpreter_credentials && (
        <p className="mt-2 text-xs text-ink-muted">
          {proposal.interpreter_credentials}
        </p>
      )}

      {proposal.interpreter_certifications?.length >
        0 && (
        <p className="text-xs text-ink-muted">
          Certifications:{" "}
          {proposal.interpreter_certifications.join(
            ", "
          )}
        </p>
      )}

      {proposal.interpreter_specialties?.length >
        0 && (
        <p className="text-xs text-ink-muted">
          Specialties:{" "}
          {proposal.interpreter_specialties.join(", ")}
        </p>
      )}

      {proposal.interpreter_intro_video_url && (
        <a
          href={
            proposal.interpreter_intro_video_url
          }
          target="_blank"
          rel="noreferrer"
          className="mt-1 inline-block text-xs text-brand-700 underline"
        >
          View introduction video
        </a>
      )}

      <p className="mt-1 text-xs text-ink-muted">
        These details are self-disclosed. This
        interpreter has not been contacted yet.
      </p>

      <form
        action={respondToProposalAction}
        className="mt-2 flex flex-wrap gap-2"
      >
        <input
          type="hidden"
          name="assignment_id"
          value={proposal.assignment_id}
        />

        <button
          name="decision"
          value="accept"
          className="btn-primary px-3 py-1.5 text-xs"
        >
          Accept match
        </button>

        <button
          name="decision"
          value="decline"
          className="btn-secondary px-3 py-1.5 text-xs"
        >
          Decline
        </button>
      </form>
    </div>
  );
}

function experienceBandLabel(value: string) {
  const labels: Record<string, string> = {
    less_than_2: "Less than 2 years",
    "2_to_5": "2–5 years",
    "6_to_10": "6–10 years",
    "11_plus": "11+ years",
  };

  return labels[value] ?? value;
}

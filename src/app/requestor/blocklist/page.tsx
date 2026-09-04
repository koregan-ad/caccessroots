import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";
import { addBlockAction, removeBlockAction } from "./actions";

type BlocklistRow = {
  block_id: string;
  interpreter_id: string;
  interpreter_name: string;
  interpreter_email: string;
  reason: string | null;
  created_at: string;
};

const errorMessages: Record<string, string> = {
  missing_email: "Enter an interpreter email address.",
  not_found: "No interpreter account was found with that email address.",
  add_failed: "We could not add that interpreter. Please try again.",
  remove_failed: "We could not remove that interpreter. Please try again.",
};

export default async function BlocklistPage({
  searchParams,
}: {
  searchParams?: {
    added?: string;
    removed?: string;
    error?: string;
  };
}) {
  await requireProfile();
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.rpc("requestor_blocklist");

  if (error) {
    console.error("Blocklist load failed:", {
      code: error.code,
      message: error.message,
    });
    throw new Error("Could not load your blocklist");
  }

  const blocks = (data ?? []) as BlocklistRow[];
  const errorMessage = searchParams?.error
    ? errorMessages[searchParams.error] ?? errorMessages.add_failed
    : null;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold">My blocklist</h1>
      <p className="text-ink-muted mt-1">
        Interpreters on this list will never be matched to your requests, and
        they won't see your requests at all. This list is private to you. An
        admin can only review it with a written reason, and you'll be notified
        if that ever happens.
      </p>

      {searchParams?.added === "1" && (
        <div
          role="status"
          className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
        >
          The interpreter was added to your blocklist.
        </div>
      )}

      {searchParams?.removed === "1" && (
        <div
          role="status"
          className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
        >
          The interpreter was removed from your blocklist.
        </div>
      )}

      {errorMessage && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
        >
          {errorMessage}
        </div>
      )}

      <form action={addBlockAction} className="card p-6 mt-6 space-y-4">
        <div>
          <label className="label" htmlFor="interpreter_email">
            Interpreter's email
          </label>
          <input
            id="interpreter_email"
            name="interpreter_email"
            type="email"
            required
            className="input"
            placeholder="name@example.com"
          />
        </div>
        <div>
          <label className="label" htmlFor="reason">
            Reason (optional, private)
          </label>
          <textarea
            id="reason"
            name="reason"
            className="input min-h-[64px]"
            placeholder="Just for your own records."
          />
        </div>
        <button className="btn-primary">Add to my blocklist</button>
      </form>

      <div className="card mt-8 overflow-hidden">
        <h2 className="px-6 py-4 font-semibold">Current blocklist</h2>
        <ul className="divide-y divide-slate-100">
          {blocks.map((b) => (
            <li
              key={b.block_id}
              className="px-6 py-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{b.interpreter_name}</p>
                <p className="text-sm text-ink-muted">
                  {b.interpreter_email}
                </p>
                {b.reason && (
                  <p className="text-sm text-ink-muted mt-1 italic">"{b.reason}"</p>
                )}
              </div>
              <form action={removeBlockAction}>
                <input type="hidden" name="id" value={b.block_id} />
                <button className="btn-secondary text-sm py-1.5 px-3">Remove</button>
              </form>
            </li>
          ))}
          {blocks.length === 0 && (
            <li className="px-6 py-6 text-sm text-ink-muted text-center">
              No one on your blocklist.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

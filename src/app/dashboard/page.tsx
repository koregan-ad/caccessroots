export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* PAGE HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#0A0D12]">
            Dashboard
          </h1>

          <p className="mt-2 text-[#6B7280]">
            Manage your account and activity.
          </p>
        </div>

        {/* DASHBOARD STATS */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm transition hover:border-[#DB1F26] hover:shadow-md">
            <p className="text-sm text-[#6B7280]">
              Requests
            </p>

            <p className="mt-2 text-3xl font-semibold text-[#0A0D12]">
              0
            </p>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm transition hover:border-[#DB1F26] hover:shadow-md">
            <p className="text-sm text-[#6B7280]">
              Pending
            </p>

            <p className="mt-2 text-3xl font-semibold text-[#DB1F26]">
              0
            </p>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm transition hover:border-[#DB1F26] hover:shadow-md">
            <p className="text-sm text-[#6B7280]">
              Completed
            </p>

            <p className="mt-2 text-3xl font-semibold text-[#0A0D12]">
              0
            </p>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <section className="mt-8 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#0A0D12]">
            Quick actions
          </h2>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-lg bg-[#DB1F26] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#B8171D] focus:outline-none focus:ring-2 focus:ring-[#DB1F26] focus:ring-offset-2"
            >
              Create request
            </button>

            <button
              type="button"
              className="rounded-lg border border-[#DB1F26] bg-white px-4 py-2.5 text-sm font-medium text-[#DB1F26] transition hover:bg-[#FCEBEC] focus:outline-none focus:ring-2 focus:ring-[#DB1F26] focus:ring-offset-2"
            >
              View requests
            </button>
          </div>
        </section>

        {/* RECENT ACTIVITY */}
        <section className="mt-8 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#0A0D12]">
            Recent activity
          </h2>

          <p className="mt-2 text-[#6B7280]">
            Your latest activity will appear here.
          </p>
        </section>
      </div>
    </main>
  );
}

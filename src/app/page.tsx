import Link from "next/link";
import { Wordmark } from "@/components/wordmark";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#FBF9FC]">

      {/* HEADER */}
      <header className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto">
        <Wordmark size="md" showSub />

        <nav className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="px-5 py-2.5 rounded-lg border border-[#501B65] text-[#501B65] font-medium hover:bg-[#F8F3FA] transition"
          >
            Sign in
          </Link>

          <Link
            href="/sign-up"
            className="px-5 py-2.5 rounded-lg bg-[#501B65] text-white font-medium hover:bg-[#48165C] transition"
          >
            Get started
          </Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT SIDE */}
          <div>
            <p className="inline-flex rounded-full bg-[#F1E7F5] text-[#501B65] px-4 py-2 text-sm font-medium mb-4">
              Sponsored by KEO Solutions
            </p>

            <h1 className="font-serif text-5xl md:text-6xl font-medium text-[#501B65] leading-[1.05] tracking-tight">
              Where access
              <br />
              takes{" "}
              <em className="not-italic text-[#568F54]">
                root.
              </em>
            </h1>

            <p className="mt-6 text-lg text-[#514756] max-w-lg leading-relaxed">
              A simple, warm place for Deaf community members to request
              interpreters for the moments that matter, and for volunteer
              interpreters to give back close to home. We're not here for money.
              We're here to provide access in spaces that laws and contracts
              don't reach.
            </p>

            {/* BUTTONS */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/sign-up"
                className="px-6 py-3 rounded-lg bg-[#501B65] text-white font-medium hover:bg-[#48165C] transition"
              >
                Request an interpreter
              </Link>

              <Link
                href="/sign-up?role=interpreter"
                className="px-6 py-3 rounded-lg border border-[#501B65] text-[#501B65] font-medium hover:bg-[#F1E7F5] transition"
              >
                Volunteer as an interpreter
              </Link>
            </div>

            <p className="mt-6 text-sm italic font-medium text-[#7D3EA2]">
              Communication. Access. Roots.
            </p>
          </div>

          {/* RIGHT CARD */}
          <div className="bg-white rounded-2xl border border-[#EADCEF] shadow-sm p-8">
            <h3 className="font-serif text-2xl text-[#501B65] mb-6">
              Why CAccessRoots
            </h3>

            <ul className="space-y-5 text-sm">

              <Feature
                title="Local geo intelligence"
                desc="Distance, travel time, and service radius. Interpreters see the work that's actually a fit for where they live."
              />

              <Feature
                title="Your conflicts, respected"
                desc="Requestors list people they shouldn't be paired with. Those interpreters never see the request. Period."
              />

              <Feature
                title="Admin oversight"
                desc="Sensitive assignments (medical, family, funerals) route through admin approval before anyone is matched."
              />

              <Feature
                title="Built for community"
                desc="Partner Deaf community organizations can vouch for members and see their community's activity."
              />

            </ul>
          </div>
        </div>
      </section>

      {/* SECOND SECTION */}
      <section className="bg-[#F8F3FA] py-16 border-y border-[#EADCEF]">
        <div className="max-w-4xl mx-auto px-6 text-center">

          <h2 className="font-serif text-3xl md:text-4xl text-[#501B65]">
            For the moments that matter.
          </h2>

          <div className="w-12 h-1 bg-[#68AB64] rounded-full mx-auto mt-5" />

          <p className="mt-5 text-[#514756] leading-relaxed max-w-2xl mx-auto">
            Funerals. Weddings. Parent–teacher nights. A grandparent's birthday
            dinner. The conversations where being understood isn't a luxury,
            it's a quiet kind of belonging. CAccessRoots is built to honor
            those moments.
          </p>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-sm text-[#665C6B]">
        <Wordmark size="sm" href={null} />

        <p className="mt-2 italic">
          A pro bono initiative of KEO Solutions. Not a paid service.
        </p>
      </footer>

    </main>
  );
}


function Feature({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <li>
      <div className="flex gap-4">

        {/* GREEN ACCENT DOT */}
        <div className="mt-1.5 h-2.5 w-2.5 rounded-full bg-[#68AB64] shrink-0" />

        <div>
          <p className="font-semibold text-[#501B65]">
            {title}
          </p>

          <p className="text-[#514756] mt-1 leading-relaxed">
            {desc}
          </p>
        </div>

      </div>
    </li>
  );
}

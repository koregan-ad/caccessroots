import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#FBF9FC]">
      {/* HEADER */}
      <header className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          {/* KEO LOGO */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/keo-logo.png"
              alt="KEO Solutions"
              width={220}
              height={90}
              className="h-12 sm:h-14 md:h-16 w-auto object-contain"
              priority
            />
          </Link>

          {/* NAVIGATION */}
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/sign-in"
              className="px-3 sm:px-5 py-2.5 rounded-lg border border-[#501B65] text-[#501B65] text-sm sm:text-base font-medium hover:bg-[#F8F3FA] transition focus:outline-none focus:ring-2 focus:ring-[#8D4BAE] focus:ring-offset-2"
            >
              Sign in
            </Link>

            <Link
              href="/sign-up"
              className="px-3 sm:px-5 py-2.5 rounded-lg bg-[#501B65] text-white text-sm sm:text-base font-medium hover:bg-[#48165C] transition focus:outline-none focus:ring-2 focus:ring-[#8D4BAE] focus:ring-offset-2"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-12 md:pt-16 pb-20 md:pb-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* LEFT SIDE */}
          <div>
            <p className="inline-flex rounded-full bg-[#F1E7F5] text-[#501B65] px-4 py-2 text-sm font-medium mb-5">
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
              Some of life's most important gatherings do not come with a clear path
              to communication access. These are the moments where access matters deeply,
              and where there may be no organization responsible for arranging it.

              CAccessRoots connects Deaf people with nationally certified interpreters
              who volunteer their time for those moments. No agency, no invoice, no contract.
              Just people showing up for each other, the way this work started.
            </p>

            {/* BUTTONS */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/sign-up"
                className="px-6 py-3 rounded-lg bg-[#501B65] text-white font-medium hover:bg-[#48165C] transition focus:outline-none focus:ring-2 focus:ring-[#8D4BAE] focus:ring-offset-2"
              >
                Request an interpreter
              </Link>

              <Link
                href="/sign-up?role=interpreter"
                className="px-6 py-3 rounded-lg border border-[#501B65] text-[#501B65] font-medium hover:bg-[#F1E7F5] transition focus:outline-none focus:ring-2 focus:ring-[#8D4BAE] focus:ring-offset-2"
              >
                Volunteer as an interpreter
              </Link>
            </div>

            <p className="mt-6 text-sm italic font-medium text-[#7D3EA2]">
              Communication. Access. Roots.
            </p>
          </div>

          {/* RIGHT CARD */}
          <div className="bg-white rounded-2xl border border-[#EADCEF] shadow-sm p-6 md:p-8">
            <h2 className="font-serif text-2xl text-[#501B65] mb-6">
              Why CAccessRoots
            </h2>

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
                desc="Sensitive assignments such as medical, family, and funeral requests route through admin approval before anyone is matched."
              />

              <Feature
                title="Built for community"
                desc="Partner Deaf community organizations can vouch for members and see their community's activity."
              />
            </ul>
          </div>
        </div>
      </section>

      {/* COMMUNITY SECTION */}
      <section className="bg-[#F8F3FA] py-16 border-y border-[#EADCEF]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-[#501B65]">
            For the moments that matter.
          </h2>

          <div
            className="w-12 h-1 bg-[#68AB64] rounded-full mx-auto mt-5"
            aria-hidden="true"
          />

          <p className="mt-5 text-[#514756] leading-relaxed max-w-2xl mx-auto">
            Funerals. Weddings. Parent–teacher nights. A grandparent&apos;s
            birthday dinner. The conversations where being understood
            isn&apos;t a luxury, it&apos;s a quiet kind of belonging.
            CAccessRoots is built to honor those moments.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-6 text-center text-sm text-[#665C6B]">
        <Link
          href="/"
          className="inline-flex items-center justify-center"
          aria-label="KEO Solutions home"
        >
          <Image
            src="/keo-logo.png"
            alt="KEO Solutions"
            width={180}
            height={75}
            className="h-12 md:h-14 w-auto object-contain"
          />
        </Link>

        <p className="mt-4 italic">
          A pro bono initiative of KEO Solutions. Not a paid service.
        </p>

        <p className="mt-2 text-xs text-[#7B7080]">
          Communication. Access. Roots.
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
    <li className="flex gap-4">
      <div
        className="mt-1.5 h-2.5 w-2.5 rounded-full bg-[#68AB64] shrink-0"
        aria-hidden="true"
      />

      <div>
        <p className="font-semibold text-[#501B65]">{title}</p>
        <p className="text-[#514756] mt-1 leading-relaxed">{desc}</p>
      </div>
    </li>
  );
}

  
  

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#FBF9FC]">
      {/* HEADER */}
      <header className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/keo-logo.png"
              alt="KEO Solutions"
              width={220}
              height={90}
              className="h-12 w-auto object-contain sm:h-14 md:h-16"
              priority
            />
          </Link>

          <nav aria-label="Primary" className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/sign-in"
              className="rounded-lg border border-[#501B65] px-3 py-2.5 text-sm font-medium text-[#501B65] transition hover:bg-[#F8F3FA] focus:outline-none focus:ring-2 focus:ring-[#8D4BAE] focus:ring-offset-2 sm:px-5 sm:text-base"
            >
              Sign in
            </Link>

            <Link
              href="/sign-up"
              className="rounded-lg bg-[#501B65] px-3 py-2.5 text-sm font-medium text-white transition hover:bg-[#48165C] focus:outline-none focus:ring-2 focus:ring-[#8D4BAE] focus:ring-offset-2 sm:px-5 sm:text-base"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-12 md:pb-24 md:pt-16">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="mb-5 inline-flex rounded-full bg-[#F1E7F5] px-4 py-2 text-sm font-medium text-[#501B65]">
              Sponsored by KEO Solutions
            </p>

            <h1 className="font-serif text-5xl font-medium leading-[1.05] tracking-tight text-[#501B65] md:text-6xl">
              Where access
              <br />
              takes <em className="not-italic text-[#568F54]">root.</em>
            </h1>

            <div className="mt-6 max-w-lg space-y-4 text-lg leading-relaxed text-[#514756]">
              <p>
                Some of life's most important gatherings do not come with a
                clear path to communication access. These are the moments where
                access matters deeply—and where there may be no organization
                responsible for arranging it.
              </p>

              <p>
                CAccessRoots connects Deaf people with nationally certified
                interpreters who volunteer their time for those moments. No
                agency, no invoice, no contract. Just people showing up for each
                other, the way this work started.
              </p>
            </div>

           {/* BUTTONS */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/sign-up"
                className="px-6 py-3 rounded-lg bg-[#501B65] text-white font-medium hover:bg-[#48165C] transition focus:outline-none focus:ring-2 focus:ring-[#8D4BAE] focus:ring-offset-2"
              >
                Request An Interpreter
              </Link>

              <Link
                href="/sign-up?role=interpreter"
                className="px-6 py-3 rounded-lg border border-[#501B65] text-[#501B65] font-medium hover:bg-[#F1E7F5] transition focus:outline-none focus:ring-2 focus:ring-[#8D4BAE] focus:ring-offset-2"
              >
                Volunteer To Interpret
              </Link>
            </div>

                <p className="mt-3 text-sm leading-relaxed text-[#665C6B]">
                  Share just enough to make a match. Personal details stay
                  between you and your interpreter once you&apos;re connected.
                </p>
              </div>

            <p className="mt-6 text-sm font-medium italic text-[#7D3EA2]">
              Communication. Access. Roots.
            </p>
          </div>

          {/* MATCHING CARD */}
          <div className="rounded-2xl border border-[#EADCEF] bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-6 font-serif text-2xl text-[#501B65]">
              How a match happens
            </h2>

            <ul className="space-y-5 text-sm">
              <Feature
                title="Close to home"
                desc="Matching starts with geography. Interpreters see requests within a distance they can actually travel, so giving back fits around real life."
              />

              <Feature
                title="Your circle, respected"
                desc="Deaf communities are small. Name anyone you’d rather not be matched with, and they’ll never see your request. No explanation needed."
              />

              <Feature
                title="A person looks first"
                desc="Tender requests—a funeral, a family conflict, a first meeting—get a coordinator’s eyes before anyone is matched. You don’t have to explain why the moment is tender."
              />

              <Feature
                title="Rooted in community"
                desc="Deaf organizations can vouch for their members and see what’s happening locally. This grows through people who already know each other."
              />
            </ul>
          </div>
        </div>
      </section>

      {/* EXPECTATIONS */}
      <section
        aria-labelledby="expectations-heading"
        className="border-y border-[#EADCEF] bg-[#F8F3FA] py-16"
      >
        <div className="mx-auto max-w-6xl px-6">
          <h2 id="expectations-heading" className="sr-only">
            What to know before getting started
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <ExpectationCard title="Before you request">
              <p>
                Every interpreter here is volunteering. There&apos;s no fee and no
                guaranteed match—we&apos;ll do our best to find one.
              </p>
              <p>
                Tell us the basics: date, location, and type of event. Keep
                sensitive details out of the form.
              </p>
              <p>
                Once you&apos;re matched, share what your interpreter should
                know—names, signs, family dynamics, and anything else that will
                help them serve you well.
              </p>
              <p>
                If an employer, school, healthcare provider, public agency,
                venue, or another organization may be responsible for providing
                access, ask that organization first. CAccessRoots is not a
                substitute for an existing access obligation.
              </p>
            </ExpectationCard>

            <ExpectationCard title="Before you volunteer">
              <p>
                These are unpaid commitments. Nothing here is billable, and no
                one will ask you to invoice.
              </p>
              <p>
                Interpreting at a wedding, memorial, or family gathering is
                intimate work. Come prepared to meet the people, not just the
                event.
              </p>
              <p>
                Coordination is handled by volunteers and ITP students learning
                the work. Grace goes both directions.
              </p>
            </ExpectationCard>
          </div>
        </div>
      </section>

      {/* COMMUNITY SECTION */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-serif text-3xl text-[#501B65] md:text-4xl">
            For the moments that matter.
          </h2>

          <div
            className="mx-auto mt-5 h-1 w-12 rounded-full bg-[#68AB64]"
            aria-hidden="true"
          />

          <div className="mx-auto mt-5 max-w-2xl space-y-4 leading-relaxed text-[#514756]">
            <p>
              A wedding toast. A graveside remembrance. A grandparent&apos;s
              birthday dinner. A family reunion.
            </p>
            <p>
              When no organization is responsible for arranging access, being
              understood still matters—not as a transaction, but as a quiet kind
              of belonging.
            </p>
            <p>
              Interpreters and Deaf people built this profession together, in
              living rooms and church basements, long before there were
              contracts. CAccessRoots is a way back to that.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-10 text-center text-sm text-[#665C6B]">
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
            className="h-12 w-auto object-contain md:h-14"
          />
        </Link>

        <p className="mt-4 italic">
          A pro bono initiative of KEO Solutions. No fees, no invoices, no
          contracts—for anyone.
        </p>

        <p className="mt-2 text-xs text-[#7B7080]">
          Communication. Access. Roots.
        </p>
      </footer>
    </main>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <li className="flex gap-4">
      <div
        className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#68AB64]"
        aria-hidden="true"
      />

      <div>
        <p className="font-semibold text-[#501B65]">{title}</p>
        <p className="mt-1 leading-relaxed text-[#514756]">{desc}</p>
      </div>
    </li>
  );
}

function ExpectationCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-[#EADCEF] bg-white p-6 shadow-sm md:p-8">
      <h3 className="font-serif text-2xl text-[#501B65]">{title}</h3>
      <div className="mt-5 space-y-4 leading-relaxed text-[#514756]">
        {children}
      </div>
    </article>
  );
}

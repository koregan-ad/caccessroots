import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      {/* HEADER */}
      <header className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/applied-development-logo.png"
              alt="Applied Development"
              width={220}
              height={90}
              className="h-12 w-auto object-contain sm:h-14 md:h-16"
              priority
            />
          </Link>

          <nav aria-label="Primary" className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/sign-in"
              className="rounded-lg border border-[#DB1F26] px-3 py-2.5 text-sm font-medium text-[#DB1F26] transition hover:bg-[#FCEBEC] focus:outline-none focus:ring-2 focus:ring-[#DB1F26] focus:ring-offset-2 sm:px-5 sm:text-base"
            >
              Sign in
            </Link>

            <Link
              href="/sign-up"
              className="rounded-lg bg-[#DB1F26] px-3 py-2.5 text-sm font-medium text-white transition hover:bg-[#B8171D] focus:outline-none focus:ring-2 focus:ring-[#DB1F26] focus:ring-offset-2 sm:px-5 sm:text-base"
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
            <p className="mb-5 inline-flex rounded-full bg-[#FCEBEC] px-4 py-2 text-sm font-medium text-[#DB1F26]">
              Powered by Applied Development
            </p>

            <h1 className="font-serif text-5xl font-medium leading-[1.05] tracking-tight text-[#0A0D12] md:text-6xl">
              Where access
              <br />
              takes <em className="not-italic text-[#DB1F26]">root.</em>
            </h1>

            <div className="mt-6 max-w-lg space-y-4 text-lg leading-relaxed text-[#374151]">
              <p>
                Nobody is required to provide an interpreter at a wedding. Or
                a funeral. Or a family meeting about your mother’s care. These
                are the rooms where being understood matters most, and they are
                exactly the rooms the law does not reach.
              </p>

              <p>
                CAccessRoots connects Deaf people with qualified interpreters
                who volunteer their time for these moments. No agency. No
                invoice. No contract. Just people showing up for each other,
                the way this work started.
              </p>
            </div>

            <div className="mt-8">
              <div className="flex flex-nowrap gap-3 sm:gap-4">
                <Link
                  href="/sign-up"
                  className="inline-flex min-h-12 min-w-0 flex-1 items-center justify-center rounded-lg bg-[#DB1F26] px-3 py-3 text-center text-sm font-medium leading-tight text-white transition hover:bg-[#B8171D] focus:outline-none focus:ring-2 focus:ring-[#DB1F26] focus:ring-offset-2 sm:px-6 sm:text-base"
                >
                  Request an interpreter
                </Link>

                <Link
                  href="/sign-up?role=interpreter"
                  className="inline-flex min-h-12 min-w-0 flex-1 items-center justify-center rounded-lg border border-[#DB1F26] px-3 py-3 text-center text-sm font-medium leading-tight text-[#DB1F26] transition hover:bg-[#FCEBEC] focus:outline-none focus:ring-2 focus:ring-[#DB1F26] focus:ring-offset-2 sm:px-6 sm:text-base"
                >
                  Volunteer to interpret
                </Link>
              </div>

              <p className="mt-4 max-w-lg text-center text-sm leading-relaxed text-[#6B7280]">
                Share just enough to make a match. Personal details stay
                between you and your interpreter once you’re connected.
              </p>
            </div>

            <p className="mt-6 text-sm font-medium italic text-[#DB1F26]">
              Communication. Access. Roots.
            </p>
          </div>

          {/* MATCHING CARD */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-6 font-serif text-2xl text-[#0A0D12]">
              Why CAccessRoots
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
                desc="Tender requests, like a funeral, a family conflict, or a first meeting, get a coordinator’s eyes before anyone is matched. You don’t have to explain why it’s tender."
              />

              <Feature
                title="Rooted in community"
                desc="Deaf organizations can vouch for their members and see what’s happening locally. This grows through people who already know each other."
              />
            </ul>
          </div>
        </div>
      </section>

      <CoverageGuide />

      {/* EXPECTATIONS */}
      <section
        aria-labelledby="expectations-heading"
        className="border-y border-[#E5E7EB] bg-[#F5F6F7] py-16"
      >
        <div className="mx-auto max-w-6xl px-6">
          <h2 id="expectations-heading" className="sr-only">
            What to know before getting started
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <ExpectationCard title="Before you request">
              <p>
                Every interpreter here is volunteering. There&apos;s no fee,
                and there&apos;s no guarantee—we&apos;ll do our best to find a
                match.
              </p>

              <p>
                Tell us the basics: date, location, and type of event. Keep
                sensitive details out of the form.
              </p>

              <p>
                Once you&apos;re matched, share what your interpreter should
                know—names, signs, family dynamics, and anything that helps
                them serve you well.
              </p>
            </ExpectationCard>

            <ExpectationCard title="Before you volunteer">
              <p>
                These are unpaid assignments. Nothing here is billable, and no
                one will ask you to invoice.
              </p>

              <p>
                Interpreting a wedding or a funeral is intimate work. Come
                prepared to meet the family, not just the event.
              </p>

              <p>
                Coordination is handled by volunteers and ITP students
                learning the work. Grace goes both directions.
              </p>
            </ExpectationCard>
          </div>
        </div>
      </section>

      {/* COMMUNITY SECTION */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center font-serif text-3xl text-[#0A0D12] md:text-4xl">
            For the moments no one is required to cover
          </h2>

          <div
            className="mx-auto mt-5 h-1 w-12 rounded-full bg-[#DB1F26]"
            aria-hidden="true"
          />

          <div className="mx-auto mt-8 max-w-3xl space-y-6 text-lg leading-relaxed text-[#374151]">
            <p className="text-center">
              Funerals. Wedding ceremonies. A family meeting about Mom’s care.
              A hiking group that meets every Saturday morning.
            </p>

            <p>
              The law follows institutions. It requires communication access
              at the hospital, the courthouse, the school, and the employer.
              It stops at the church door, the graveside, the reception hall,
              and the living room. In those rooms, nobody may be legally
              required to provide access.
            </p>

            <p>
              That means the moments most likely to go unshared are often the
              ones a person actually remembers—not the deposition, but the
              eulogy.
            </p>

            <p>
              Researchers have a name for what can happen instead: dinner
              table syndrome—sitting in a room full of family, watching
              conversations happen, and waiting to be caught up.
            </p>

            <blockquote className="rounded-r-xl border-l-4 border-[#DB1F26] bg-[#FCEBEC] px-6 py-5 italic text-[#374151]">
              <p>“I so wanted to be a part of that. I felt so alone.”</p>
              <footer className="mt-2 text-sm not-italic text-[#6B7280]">
                Study participant, Meek (2020)
              </footer>
            </blockquote>

            <p>
              Interpreters and Deaf people built this profession together, in
              living rooms and church basements, long before there were
              contracts. CAccessRoots is a way back to that.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-10 text-center text-sm text-[#6B7280]">
        <Link
          href="/"
          className="inline-flex items-center justify-center"
          aria-label="Applied Development home"
        >
          <Image
            src="/applied-development-logo.png"
            alt="Applied Development"
            width={180}
            height={75}
            className="h-12 w-auto object-contain md:h-14"
          />
        </Link>

        <p className="mt-4 italic">
          A pro bono initiative of Applied Development. No fees, no invoices,
          no contracts—for anyone.
        </p>

        <p className="mt-2 text-xs text-[#6B7280]">
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
        className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#DB1F26]"
        aria-hidden="true"
      />

      <div>
        <p className="font-semibold text-[#0A0D12]">{title}</p>
        <p className="mt-1 leading-relaxed text-[#374151]">{desc}</p>
      </div>
    </li>
  );
}

function CoverageGuide() {
  const covered = [
    {
      where: "Hospitals, doctors, dentists, therapists, urgent care, and labs",
      detail: "The provider. Every appointment, regardless of practice size.",
    },
    {
      where:
        "Courts, police, jury duty, DMV, city council, and government offices",
      detail: "The government agency.",
    },
    {
      where: "Public schools",
      detail:
        "The school district—including IEP meetings, parent-teacher conferences, disciplinary hearings, and school events.",
    },
    {
      where: "Colleges, universities, trade schools, and adult education",
      detail: "The institution.",
    },
    {
      where: "Your job, if your employer has 15 or more employees",
      detail:
        "Your employer—including interviews, meetings, training, and workplace events.",
    },
    {
      where: "Businesses open to the public",
      detail:
        "The business—including hotels, restaurants, banks, gyms, theaters, retail stores, funeral homes, and salons.",
    },
    {
      where: "Programs that receive federal money",
      detail:
        "The program, including many nonprofits, clinics, and housing programs.",
    },
  ];

  const notCovered = [
    {
      where: "Religious organizations and activities they operate",
      detail:
        "Religious organizations are generally exempt from the ADA. This can include weddings, funerals, baptisms, and services held in houses of worship.",
    },
    {
      where: "Private homes",
      detail:
        "Family dinners, baby showers, birthday parties, and family meetings normally have no covered organization responsible for access.",
    },
    {
      where: "Events hosted by a private person",
      detail:
        "Wedding receptions, graduation parties, memorials at someone’s home, and private retirement dinners.",
    },
    {
      where: "Informal and volunteer-run groups",
      detail:
        "Book clubs, neighborhood associations, informal sports, and similar groups may not be covered entities.",
    },
    {
      where: "Private clubs that genuinely limit membership",
      detail: "Private clubs may be exempt from the ADA.",
    },
    {
      where: "Your job, if your employer has fewer than 15 employees",
      detail: "Federal employment protections generally begin at 15 employees.",
    },
    {
      where: "The graveside",
      detail:
        "The funeral home’s services may be covered, while the cemetery service and gathering afterward usually are not.",
    },
  ];

  return (
    <section
      id="coverage-guide"
      aria-labelledby="coverage-heading"
      className="border-y border-[#E5E7EB] bg-white py-16 md:py-20"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#DB1F26]">
            Know your rights
          </p>

          <h2
            id="coverage-heading"
            className="mt-3 font-serif text-3xl leading-tight text-[#0A0D12] md:text-4xl"
          >
            Before you ask us, check whether someone already owes you.
          </h2>

          <p className="mt-5 text-lg leading-relaxed text-[#374151]">
            Plenty of places are legally required to provide communication
            access and pay for it. If your event is one of them, ask that
            organization first. CAccessRoots exists for moments nobody is
            required to cover.
          </p>
        </div>

        <div className="mt-12">
          <CoverageTable
            title="Covered: someone else is responsible"
            description="You should not have to pay for these, and you should not need a volunteer."
            detailHeading="Who is responsible"
            rows={covered}
          />
        </div>

        <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-[#F3C4C6] bg-[#FCEBEC] p-6 md:p-8">
          <h3 className="font-serif text-2xl text-[#0A0D12]">
            Two things worth knowing
          </h3>

          <div className="mt-4 space-y-4 leading-relaxed text-[#374151]">
            <p>
              A covered organization generally cannot charge a person with a
              disability for the cost of an interpreter or other auxiliary
              aid.
            </p>

            <p>
              The standard is effective communication—not necessarily an
              interpreter in every situation. For complex, high-stakes, or
              long conversations, a qualified interpreter is often
              appropriate.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <CoverageTable
            title="Not covered: nobody may be required to provide it"
            description="This is where CAccessRoots may be able to help."
            detailHeading="Why it may not be covered"
            rows={notCovered}
          />
        </div>

        <div className="mx-auto mt-12 max-w-4xl">
          <h3 className="font-serif text-2xl text-[#0A0D12] md:text-3xl">
            It depends: the confusing middle
          </h3>

          <div className="mt-6 space-y-6 leading-relaxed text-[#374151]">
            <div>
              <h4 className="font-semibold text-[#0A0D12]">A funeral</h4>
              <p className="mt-1">
                The funeral home’s arrangements, paperwork, and conversations
                may be covered. A church service, eulogy, graveside service, or
                private reception may not be.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[#0A0D12]">
                A wedding at a hotel or venue
              </h4>
              <p className="mt-1">
                The venue may be responsible for access to its own services,
                such as the front desk and event staff. That does not
                necessarily cover the vows, toasts, or speeches.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[#0A0D12]">
                A recreation league or community class
              </h4>
              <p className="mt-1">
                A program operated by a city, public library, or college may be
                covered. An informal group organized by neighbors may not be.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[#0A0D12]">
                Your state may provide additional protections
              </h4>
              <p className="mt-1">
                State and local requirements can go beyond federal law. Check
                with your state’s Deaf and hard-of-hearing commission before
                assuming an event is not covered.
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-4xl border-t border-[#E5E7EB] pt-8">
          <p className="leading-relaxed text-[#374151]">
            Even where the law is on your side, requesting and receiving access
            can be two different things. If a covered organization refuses,
            that is worth pursuing. If nobody was required to provide access,
            that is worth a request here.
          </p>

          <p className="mt-5 text-sm italic leading-relaxed text-[#6B7280]">
            This is a plain-language summary, not legal advice. If you have
            been denied an interpreter by an organization that may be required
            to provide one, contact the National Association of the Deaf or
            your state’s Deaf and hard-of-hearing commission.
          </p>
        </div>
      </div>
    </section>
  );
}

function CoverageTable({
  title,
  description,
  detailHeading,
  rows,
}: {
  title: string;
  description: string;
  detailHeading: string;
  rows: Array<{ where: string; detail: string }>;
}) {
  return (
    <div>
      <h3 className="text-center font-serif text-2xl text-[#0A0D12] md:text-3xl">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-3xl text-center leading-relaxed text-[#374151]">
        {description}
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-[#D1D5DB]">
        <table className="w-full min-w-[700px] border-collapse bg-white text-left">
          <thead className="bg-[#071B2A] text-white">
            <tr>
              <th scope="col" className="w-2/5 px-5 py-4 font-semibold">
                Where
              </th>
              <th scope="col" className="px-5 py-4 font-semibold">
                {detailHeading}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#D1D5DB]">
            {rows.map((row, index) => (
              <tr
                key={row.where}
                className={index % 2 === 0 ? "bg-white" : "bg-[#F5F6F7]"}
              >
                <th
                  scope="row"
                  className="px-5 py-4 align-top font-semibold text-[#0A0D12]"
                >
                  {row.where}
                </th>

                <td className="px-5 py-4 align-top leading-relaxed text-[#374151]">
                  {row.detail}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
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
    <article className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm md:p-8">
      <h3 className="text-center font-serif text-2xl text-[#0A0D12]">
        {title}
      </h3>

      <div className="mt-5 space-y-4 leading-relaxed text-[#374151]">
        {children}
      </div>
    </article>
  );
}

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
          Nobody is required to provide an interpreter at a wedding. Or a funeral. Or a family meeting about 
          your mother’s care. These are the rooms where being understood matters most, and they are exactly the
          rooms the law does not reach.
          </p>

          <p>
          CAccessRoots connects Deaf people with qualified interpreters who volunteer their time for these
          moments. No agency. No invoice. No contract. Just people showing up for each other, the way this 
          work started.
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
          Share just enough to make a match. Personal details stay between you and your
          interpreter once you’re connected.
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
            Every interpreter here is volunteering. There&apos;s no fee, and
            there&apos;s no guarantee — we&apos;ll do our best to find a match.
          </p>
          <p>
            Tell us the basics: date, location, type of event. Keep
            sensitive details out of the form.
          </p>
          <p>
            Once you&apos;re matched, share what your interpreter should know —
            names, signs, family dynamics, anything that helps them serve you
            well.
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
      <h2 className="text-center font-serif text-3xl text-[#0A0D12] md:text-4xl">
        For the moments that matter
      </h2>

      <div
        className="mx-auto mt-5 h-1 w-12 rounded-full bg-[#DB1F26]"
        aria-hidden="true"
      />

      <div className="mx-auto mt-5 max-w-2xl space-y-4 leading-relaxed text-[#374151]">
        <p>
          Funerals. Weddings. Parent–teacher nights. A grandparent&apos;s
          birthday dinner.
        </p>
        <p>
          No statute covers these rooms. No one is entitled to access and no
          one is entitled to be paid. And yet this is where being understood
          matters most — not as a legal accommodation, but as a quiet kind of
          belonging.
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
  <footer className="px-6 py-10 text-center text-sm text-[#6B7280]">
    <Link
      href="/"
      className="inline-flex items-center justify-center"
      aria-label="KEO Solutions home"
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
      A pro bono initiative of Applied Development. No fees, no invoices, no
      contracts — for anyone.
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

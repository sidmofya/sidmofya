import type { Metadata } from "next";
import Section from "@/components/Section";
import { siteConfig } from "@/lib/site";

const description =
  "Capability statement for Sid Mofya: roles, assignments, sectors, jurisdictions, qualifications and languages.";

export const metadata: Metadata = {
  title: "Capability | Sid Mofya",
  description,
  alternates: { canonical: "/capability" },
  openGraph: {
    title: "Capability | Sid Mofya",
    description,
    url: "/capability",
    type: "profile",
  },
};

/**
 * Deliberately plain. One reader: a bid lead at an implementing contractor
 * checking whether Sid fits a technical proposal, with thirty seconds to spend.
 * No hero, no numbered sections, no marketing voice. Closer to a CV than to the
 * rest of the site — keep it that way.
 *
 * Anything rendered through <Pending> is unconfirmed and must be replaced
 * before this page is used in a bid.
 */

const labelClass =
  "text-[0.8125rem] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]";
const headingClass =
  "text-[0.8125rem] uppercase tracking-[0.14em] text-[var(--color-copper)] mb-5";
const cellClass = "border-t border-[var(--color-rule)] py-3 pr-6 align-top";

/** Visible marker so an unfilled field can never be mistaken for a fact. */
function Pending({ children }: { children: React.ReactNode }) {
  return <span className="text-[var(--color-ink-muted)] italic">[{children}]</span>;
}

const profile: { label: string; value: string | null }[] = [
  { label: "Name", value: "Sid Mofya" },
  {
    label: "Current roles",
    value:
      "Founder, MOTIF 54. Co-founder, CopperCloud. Independent adviser and facilitator.",
  },
  { label: "Contracting entity", value: "CXB Ventures LLC (California, USA)" },
  { label: "Location", value: "San Francisco Bay Area, California, USA" },
  {
    label: "Countries of residence",
    value: "Zambia, United Kingdom, United States, Tanzania",
  },
  { label: "Availability", value: "By arrangement" },
];

type Assignment = {
  client: string | null;
  jurisdiction: string | null;
  sector: string | null;
  role: string | null;
  dates: string | null;
};

// ASSIGNMENTS — Sid supplies these. Replace both placeholder rows below, then
// add one object per assignment, most recent first. Keep entries factual and
// short enough to scan: no descriptions, no outcomes, no adjectives.
const assignments: Assignment[] = [
  { client: null, jurisdiction: null, sector: null, role: null, dates: null },
  { client: null, jurisdiction: null, sector: null, role: null, dates: null },
];

const sectors = [
  "Energy and power",
  "Critical minerals and mining",
  "AI and compute infrastructure",
  "Digital and telecommunications infrastructure",
  "Venture capital and private capital formation",
  "Institutional decision-making and governance",
];

// JURISDICTIONS means where work has actually been delivered — the field a bid
// lead scans to see whether Sid has operated in their country. It is not where
// he has lived; residency is carried separately in `profile` above.
const jurisdictions = [
  "Zambia",
  "Democratic Republic of the Congo",
  "United States",
];

const languages = [
  "English — fluent",
  "Bemba — fluent",
  "Swahili — conversational",
];

// Drawn from /about. The degree designation and years are not stated anywhere
// on the site, so they are left for Sid rather than guessed at.
const qualifications: { entity: string; detail: string; pending?: string }[] = [
  {
    entity: "University of Sheffield",
    detail: "BEng Chemical Process Engineering, 2002",
  },
  {
    entity: "MBA, 2010",
    detail: "",
    pending: "awarding institution",
  },
  { entity: "Kauffman Fellows", detail: "Kauffman Fellow" },
  { entity: "Draper Venture Network", detail: "Executive Director (former)" },
  { entity: "Royal Dutch Shell", detail: "Technologist (former)" },
  { entity: "MOTIF 54", detail: "Founder" },
];

export default function Page() {
  return (
    <Section className="!pt-16 md:!pt-20 !pb-24 md:!pb-32">
      <div className="max-w-4xl">
        <h1 className="font-display text-3xl md:text-4xl text-[var(--color-ink)]">
          Capability statement
        </h1>

        <dl className="mt-10">
          {profile.map((row) => (
            <div
              key={row.label}
              className="border-t border-[var(--color-rule)] py-4 grid gap-1 sm:grid-cols-[14rem_1fr] sm:gap-8"
            >
              <dt className={labelClass}>{row.label}</dt>
              <dd className="text-[var(--color-ink)]">
                {row.value ?? <Pending>availability to be confirmed</Pending>}
              </dd>
            </div>
          ))}
        </dl>

        <section className="mt-16">
          <h2 className={headingClass}>Assignments</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem] text-left text-[0.9375rem]">
              <thead>
                <tr className={labelClass}>
                  <th scope="col" className="pb-3 pr-6 font-normal">
                    Client
                  </th>
                  <th scope="col" className="pb-3 pr-6 font-normal">
                    Jurisdiction
                  </th>
                  <th scope="col" className="pb-3 pr-6 font-normal">
                    Sector
                  </th>
                  <th scope="col" className="pb-3 pr-6 font-normal">
                    Role
                  </th>
                  <th scope="col" className="pb-3 font-normal">
                    Dates
                  </th>
                </tr>
              </thead>
              <tbody className="text-[var(--color-ink)]">
                {assignments.map((row, i) => (
                  <tr key={i}>
                    <td className={cellClass}>
                      {row.client ?? <Pending>client</Pending>}
                    </td>
                    <td className={cellClass}>
                      {row.jurisdiction ?? <Pending>jurisdiction</Pending>}
                    </td>
                    <td className={cellClass}>
                      {row.sector ?? <Pending>sector</Pending>}
                    </td>
                    <td className={cellClass}>
                      {row.role ?? <Pending>role</Pending>}
                    </td>
                    <td className={`${cellClass} !pr-0`}>
                      {row.dates ?? <Pending>dates</Pending>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="mt-16 grid gap-12 sm:grid-cols-2">
          <section>
            <h2 className={headingClass}>Sectors</h2>
            <ul className="space-y-2 text-[var(--color-ink)]">
              {sectors.map((sector) => (
                <li key={sector}>{sector}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className={headingClass}>Jurisdictions</h2>
            <ul className="space-y-2 text-[var(--color-ink)]">
              {jurisdictions.map((jurisdiction) => (
                <li key={jurisdiction}>{jurisdiction}</li>
              ))}
            </ul>
            <p className="mt-4 text-[0.875rem]">
              <Pending>confirm the full list before use in a bid</Pending>
            </p>
          </section>
        </div>

        <section className="mt-16">
          <h2 className={headingClass}>Qualifications</h2>
          <dl>
            {qualifications.map((row) => (
              <div
                key={row.entity}
                className="border-t border-[var(--color-rule)] py-4 grid gap-1 sm:grid-cols-[20rem_1fr] sm:gap-8"
              >
                <dt className="text-[var(--color-ink)]">{row.entity}</dt>
                <dd className="text-[var(--color-ink-muted)]">
                  {row.detail}
                  {row.pending && (
                    <>
                      {" "}
                      <Pending>{row.pending}</Pending>
                    </>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-16">
          <h2 className={headingClass}>Languages</h2>
          <ul className="space-y-2 text-[var(--color-ink)]">
            {languages.map((language) => (
              <li key={language}>{language}</li>
            ))}
          </ul>
        </section>

        <section className="mt-16 border-t border-[var(--color-rule)] pt-8">
          <h2 className={headingClass}>Documents and contact</h2>
          <p>
            <a href="/cv.pdf" className="link-copper font-medium">
              Download one-page CV (PDF)
            </a>
          </p>
          <p className="mt-3 text-[0.875rem]">
            <Pending>cv.pdf not yet supplied; this link 404s until it is</Pending>
          </p>
          <p className="mt-6 text-[var(--color-ink)]">
            <a href={`mailto:${siteConfig.contactEmail}`} className="link-copper">
              {siteConfig.contactEmail}
            </a>
          </p>
        </section>
      </div>
    </Section>
  );
}

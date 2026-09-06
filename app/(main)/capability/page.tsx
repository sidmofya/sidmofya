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

// ASSIGNMENTS — clients are anonymised to descriptors at Sid's instruction.
// Keep them that way unless he confirms a client may be named; a descriptor can
// always be replaced by a name, but a name cannot be taken back once indexed.
//
// Dates are outstanding for every row. They are a column a bid lead reads for
// recency and duration, so they render as visible placeholders rather than being
// estimated. Fill them in as "Mon YYYY – Mon YYYY", most recent row first.
const assignments: Assignment[] = [
  {
    client: "Continental intergovernmental organisation",
    jurisdiction: "Multi-country (Africa)",
    sector: "Venture capital and private capital formation",
    role: "Design of a diaspora investment marketplace",
    dates: null,
  },
  {
    client: "Donor-funded enterprise development programme",
    jurisdiction: "Multi-country (Africa)",
    sector: "Enterprise development",
    role: "Programme to train 100,000 entrepreneurs",
    dates: null,
  },
  {
    client: "South East Asian energy company",
    jurisdiction: "United States",
    sector: "Energy and power",
    role: "Cross-border strategy; design and establishment of a venture fund",
    dates: null,
  },
  {
    client: "US media technology company",
    jurisdiction: "United States",
    sector: "Technology and intellectual property",
    role: "Innovation strategy and IP commercialisation analysis",
    dates: null,
  },
  {
    client: null,
    jurisdiction: "Tanzania",
    sector: "Institutional decision-making and governance",
    role: "Forensic investigation into financial irregularities, and remediation",
    dates: null,
  },
  {
    client: "US-headquartered organisation",
    jurisdiction: "Tanzania",
    sector: "Government and corporate relations",
    role: "In-country representation to government and corporates",
    dates: null,
  },
  {
    client: "Mineral exploration company",
    jurisdiction: "Zambia",
    sector: "Critical minerals and mining",
    role: "Mandate to secure project funding",
    dates: null,
  },
  {
    client: null,
    jurisdiction: "United Kingdom",
    sector: "Energy and power",
    role: "Energy project development and fundraising",
    dates: null,
  },
];

// Every value used in the assignments table above must appear here, or a reader
// sees a sector claimed in one place and absent from the other.
const sectors = [
  "Energy and power",
  "Critical minerals and mining",
  "AI and compute infrastructure",
  "Digital and telecommunications infrastructure",
  "Venture capital and private capital formation",
  "Institutional decision-making and governance",
  "Enterprise development",
  "Technology and intellectual property",
  "Government and corporate relations",
];

// JURISDICTIONS means where work has actually been delivered — the field a bid
// lead scans to see whether Sid has operated in their country. It is not where
// he has lived; residency is carried separately in `profile` above, though the
// two overlap for Zambia, the UK, the US and Tanzania.
//
// DRC is deliberately absent. The DRC Investment Forum on /speaking was hosted
// in the United States, so it is not evidence of work delivered in DRC. Add it
// only against an actual DRC assignment.
const jurisdictions = [
  "Kenya",
  "Rwanda",
  "South Africa",
  "Tanzania",
  "United Kingdom",
  "United States",
  "Zambia",
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
  { entity: "Acton School of Business", detail: "MBA, 2010" },
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
            <p className="mt-4 text-[0.875rem] text-[var(--color-ink-muted)]">
              Countries where work has been delivered.
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

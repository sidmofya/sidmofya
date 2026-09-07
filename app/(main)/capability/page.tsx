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

/** Two-column rows shared by Qualifications and Professional history. */
function EntryList({ entries }: { entries: Entry[] }) {
  return (
    <dl>
      {entries.map((row) => (
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
  );
}

const profile: { label: string; value: string | null }[] = [
  { label: "Name", value: "Sid Mofya" },
  {
    // Full stop after Kafwego, not a comma: with a comma the three trailing
    // roles read as further titles held at Kafwego rather than standalone ones.
    label: "Current roles",
    value:
      "Founder, MOTIF 54. Co-founder, CopperCloud. Strategy and Finance Lead, Kafwego Resources (Zambia). Independent adviser, board member and facilitator.",
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

// ASSIGNMENTS — most recent first.
//
// Public-sector clients are named with Sid's consent. Commercial clients are
// anonymised to descriptors: a descriptor can be replaced by a name later, but a
// name cannot be withdrawn once indexed. Do not name a commercial client without
// checking with him first.
const assignments: Assignment[] = [
  {
    client: "National industrial research agency",
    jurisdiction: "Zambia",
    sector: "AI and compute infrastructure",
    role: "Digital transformation, modernisation and data sovereignty; engaged via CopperCloud",
    dates: "July 2026 - present",
  },
  {
    client: "Mineral exploration company",
    jurisdiction: "Zambia",
    sector: "Critical minerals and mining",
    role: "Mandate to secure project funding",
    dates: "July 2026",
  },
  {
    client: "African Union and European Union",
    jurisdiction: "Multi-country (Africa)",
    sector: "Venture capital and private capital formation",
    role: "Design of a diaspora investment marketplace",
    dates: "Nov 2021 - Dec 2024",
  },
  {
    client: "South East Asian energy company",
    jurisdiction: "United States",
    sector: "Energy and power",
    role: "Cross-border strategy; design and establishment of a venture fund",
    dates: "2021 - 2023",
  },
  {
    client: "US media technology company",
    jurisdiction: "United States",
    sector: "Technology and intellectual property",
    role: "Innovation strategy and IP commercialisation analysis",
    dates: "2021 - 2022",
  },
  {
    client: "United States Department of State",
    jurisdiction: "Multi-country (Africa)",
    sector: "Enterprise development",
    role: "Partnership to train 100,000 African entrepreneurs",
    dates: "2018 - 2020",
  },
  {
    client: "US public health NGO",
    jurisdiction: "Tanzania",
    sector: "Institutional decision-making and governance",
    role: "Forensic investigation into financial irregularities, and remediation",
    dates: "2014",
  },
  {
    client: "US-headquartered organisation",
    jurisdiction: "Tanzania",
    sector: "Government and corporate relations",
    role: "In-country representation to government and corporates",
    dates: "2010 - 2014",
  },
  {
    client: "National government agency",
    jurisdiction: "United Kingdom",
    sector: "Energy and power",
    role: "Energy project development and fundraising",
    dates: "Sept 2008 - Aug 2009",
  },
];

// Each sector carries where that work has been delivered — the pairing a bid
// lead actually wants, since "do they do energy?" and "do they do energy in our
// region?" are different questions.
//
// Scope is broader than the assignments table above, because it also reflects
// in-house roles such as the Draper Venture Network. The note rendered beneath
// the list says so, rather than leaving a reader to find the mismatch.
//
// Digital and telecommunications infrastructure was removed: nothing evidenced it.
const sectors: { name: string; scope: string }[] = [
  { name: "Energy and power", scope: "United Kingdom, United States, Korea" },
  { name: "Critical minerals and mining", scope: "Zambia" },
  { name: "AI and compute infrastructure", scope: "Zambia" },
  {
    name: "Venture capital and private capital formation",
    scope: "United States, Africa, global",
  },
  {
    name: "Institutional decision-making and governance",
    scope: "Tanzania, Kenya, Rwanda, global",
  },
  { name: "Enterprise development", scope: "Africa, global" },
  {
    name: "Technology and intellectual property",
    scope: "United States, Zambia, global",
  },
  {
    name: "Government and corporate relations",
    scope: "United States, United Kingdom, Tanzania, Zambia",
  },
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
  "Korea",
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

// Degrees, awards and dates supplied by Sid. Professional history is drawn from
// /about. Nothing here is inferred. Most recent first.
type Entry = { entity: string; detail: string; pending?: string };

const qualifications: Entry[] = [
  { entity: "African Diaspora Luminaire Award", detail: "2026" },
  { entity: "Kauffman Fellows", detail: "Kauffman Fellow, 2016" },
  {
    entity: "Acton School of Business",
    detail: "MBA, 2010; Acton Fellowship, 2009; valedictorian of graduating class",
  },
  {
    entity: "University of Sheffield",
    detail: "BEng Chemical Process Engineering, 2002",
  },
];

// Year obtained, not a currency claim. Sid has not confirmed either is still
// active, and PRINCE2 Practitioner in particular requires renewal — so these
// state when they were earned and nothing more. If a bid asks for a *current*
// certification, check before answering yes.
const certifications: Entry[] = [
  { entity: "PRINCE2 Practitioner", detail: "Certified 2009" },
  { entity: "Project Management Institute", detail: "Member from 2012" },
];

const professionalHistory: Entry[] = [
  { entity: "MOTIF 54", detail: "Founder" },
  { entity: "Draper Venture Network", detail: "Executive Director (former)" },
  { entity: "Royal Dutch Shell", detail: "Technologist (former)" },
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
                {row.value ?? <Pending>to be confirmed</Pending>}
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
            <ul className="space-y-3">
              {sectors.map((sector) => (
                <li key={sector.name}>
                  <span className="text-[var(--color-ink)]">{sector.name}</span>
                  <span className="block text-[0.875rem] text-[var(--color-ink-muted)]">
                    {sector.scope}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[0.875rem] text-[var(--color-ink-muted)]">
              Sector scope reflects both the assignments above and prior in-house
              roles.
            </p>
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
          <h2 className={headingClass}>Qualifications and awards</h2>
          <EntryList entries={qualifications} />
        </section>

        <section className="mt-16">
          <h2 className={headingClass}>Certifications and memberships</h2>
          <EntryList entries={certifications} />
        </section>

        <section className="mt-16">
          <h2 className={headingClass}>Professional history</h2>
          <EntryList entries={professionalHistory} />
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
          {/*
            The CV is sent on request rather than published. Formal bids demand
            their own template anyway, and a public CV would carry named clients
            this page deliberately anonymises.
          */}
          <p className="text-[var(--color-ink)]">
            Full CV, including named clients and detailed employment history,
            available on request.
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

import type { Metadata } from "next";
import Section from "@/components/Section";
import { siteConfig } from "@/lib/site";
import data from "@/data/profile.json";

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

type Entry = { entity: string; detail: string; pending?: string };

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

// All data comes from data/profile.json, which is shared with the generated CV
// (scripts/generate_cv.py). Edit that file, not this one, so the public page and
// the document Sid sends to bid leads cannot drift apart.
const profile: { label: string; value: string }[] = [
  { label: "Name", value: data.name },
  { label: "Current roles", value: data.currentRoles },
  { label: "Contracting entity", value: data.contractingEntity },
  { label: "Location", value: data.location },
  { label: "Availability", value: data.availability },
];

type Assignment = {
  client: string;
  jurisdiction: string;
  sector: string;
  role: string;
  dates: string;
};

// Client engagements only. Roles that were full-time employment — the Henry M.
// Jackson Foundation, the UK Ministry of Justice — sit under Professional
// history instead. They were previously listed here under a column headed
// "Client", which a bid reviewer would have read as consultancy and questioned.
//
// A consequence: two sectors (institutional decision-making and governance,
// government and corporate relations) are now evidenced by employment rather
// than by a row in this table. The note under Sectors points there.
const assignments: Assignment[] = data.assignments;
const sectors: { name: string; scope: string }[] = data.sectors;
const jurisdictions = data.jurisdictions;
const languages: string[] = data.languages;
const qualifications: Entry[] = data.qualifications;
const certifications: Entry[] = data.certifications;

// Only the employment entries carrying a capabilitySummary surface here. The CV
// lists the full history; this page shows the three that establish standing
// without turning into a CV itself.
const professionalHistory: Entry[] = data.employment
  .filter((role) => Boolean(role.capabilitySummary))
  .map((role) => ({
    entity: role.employer,
    detail: role.capabilitySummary as string,
  }));

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
              Sector scope reflects both the assignments above and the roles held
              under Professional history below.
            </p>
          </section>

          <section>
            <h2 className={headingClass}>Jurisdictions</h2>
            <p className={labelClass}>Primary</p>
            <ul className="mt-2 space-y-2 text-[var(--color-ink)]">
              {jurisdictions.primary.map((jurisdiction) => (
                <li key={jurisdiction}>{jurisdiction}</li>
              ))}
            </ul>
            <p className="mt-2 text-[0.875rem] text-[var(--color-ink-muted)]">
              Lived and worked.
            </p>

            <p className={`${labelClass} mt-6`}>Also delivered</p>
            <ul className="mt-2 space-y-2 text-[var(--color-ink)]">
              {jurisdictions.other.map((jurisdiction) => (
                <li key={jurisdiction}>{jurisdiction}</li>
              ))}
            </ul>
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

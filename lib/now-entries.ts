import { siteConfig } from "@/lib/site";

/**
 * The /now page. THIS IS THE ONLY FILE YOU NEED TO EDIT.
 *
 * How to keep it alive:
 *   - Update `nowLastUpdated` every time you touch this file. The date is
 *     printed under the page title, and a stale /now reads as abandonment.
 *   - Order by what is most live, not by what is most impressive.
 *   - Entries retire. When something ships or dies, delete it. This is a
 *     snapshot, not an archive. Six entries is the ceiling.
 *   - Two or three sentences each. Where a thing has its own home, link and
 *     stop — /now indexes, it does not contain.
 *   - Commercial and non-commercial entries are rendered identically. That is
 *     deliberate. Do not add headings or grouping.
 */

export type NowEntry = {
  title: string;
  /** A date, a stage, or a state. Rendered beside the title, styled quietly. */
  status: string;
  body: string;
  /** Where the thing lives, if it has a home yet. */
  href?: string;
  linkLabel?: string;
  external?: boolean;
  /** Plain text shown instead of, or alongside, a link. No destination. */
  note?: string;
};

export const nowLastUpdated = "November 2026";

export const nowEntries: NowEntry[] = [
  {
    title: "What AI Is Made Of",
    status: "Open research",
    body: "An interactive exploration of the physical infrastructure behind AI, starting with a model of a one-gigawatt data centre. Take it apart, follow the copper, and examine the research and assumptions behind the numbers.",
    href: "https://ai.sidmofya.com",
    linkLabel: "Explore the model",
    external: true,
  },
  {
    title: "CopperCloud",
    status: "Development and pilots",
    body: "Developing verifiable compute infrastructure for Africa, starting in Zambia. The work spans software for governing and verifying workloads, and a Growth Campus concept bringing new power generation, modular compute and productive enterprise together. Co-founded with Mabvuto Kaela.",
    href: "https://coppercloud.ai",
    linkLabel: "CopperCloud",
    external: true,
  },
  {
    title: "Executive briefings and boardrooms",
    status: "Booking into 2027",
    body: "The Sovereign Stack briefing on how AI, energy, minerals and capital are rewriting power. I speak to investors and leadership teams, and facilitate private rooms where an allocation, partnership or strategy question is live.",
    href: "/speaking",
    linkLabel: "Speaking",
  },
  {
    title: "MOTIF 54",
    status: "Live mandates",
    body: "Capital structuring for African energy, minerals and AI infrastructure projects. The recurring question is which projects can actually close, what is preventing it, and who has to believe what before capital moves.",
    href: siteConfig.motif54Url,
    linkLabel: "MOTIF 54",
    external: true,
  },
  {
    title: "KwaZuri",
    status: "Slow build",
    body: "An African storyworld. Xamaris, a planet where music is a mined resource, and the people who remember what it sounded like before the extraction. Fiction, music and design, moving at the pace the rest of the work allows.",
    href: "/kwazuri",
    linkLabel: "KwaZuri",
    note: "Getting its own home at kwazuri.com",
  },
];

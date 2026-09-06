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

export const nowLastUpdated = "September 2026";

export const nowEntries: NowEntry[] = [
  {
    title: "Partner Room",
    status: "Booking rooms for Q4",
    body: "One founder, five venture investors, one decision room. The founder presents, the investors question, then the founder goes silent and listens to the deliberation that normally happens after they leave. I convene the room and facilitate it.",
    href: siteConfig.partnerRoomUrl,
    linkLabel: "Partner Room",
    external: true,
  },
  {
    title: "Executive briefings and boardrooms",
    status: "Booking into Q4 and Q1",
    body: "The Sovereign Stack briefing, and facilitation for boards and investment committees working a live allocation or partnership question. Most of this work is private rooms rather than stages.",
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
    title: "CopperCloud",
    status: "Building",
    body: "Compute infrastructure for Africa's AI economy, built so that the claims a buyer makes about where and how their workload ran can be independently verified. Co-founded with Mabvuto Kaela.",
    href: "https://coppercloud.ai",
    linkLabel: "CopperCloud",
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
  {
    title: "23° South",
    status: "Publishing monthly",
    body: "Writing on matter, energy, capital, technology and culture, including Sovereign Tea. Seeing the changing world from a different latitude.",
    href: "/23-south",
    linkLabel: "23° South",
    note: "Getting its own home at 23degreessouth.com",
  },
];

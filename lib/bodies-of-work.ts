import { siteConfig } from "@/lib/site";

/**
 * The public architecture: three bodies of work, declared once and consumed by
 * the homepage doors and the About page's "The Work" rows so the two can never
 * drift apart.
 */
export type BodyOfWork = {
  mode: "BUILD" | "PUBLISH" | "IMAGINE";
  name: string;
  /** Homepage door copy. */
  copy: string;
  /** Shorter line used on the About page. */
  aboutCopy: string;
  cta: string;
  href: string;
  external?: boolean;
};

export const bodiesOfWork: BodyOfWork[] = [
  {
    mode: "BUILD",
    name: "MOTIF 54",
    copy: "Industry-led work across African energy, minerals, AI infrastructure, capital and institutional decision-making.",
    aboutCopy: "Capital, infrastructure and industry.",
    cta: "Visit MOTIF 54",
    href: siteConfig.motif54Url,
    external: true,
  },
  {
    mode: "PUBLISH",
    name: "23° SOUTH",
    copy: "Writing and frameworks for seeing the changing world from a different latitude.",
    aboutCopy: "Writing, research and frameworks.",
    cta: "Explore 23° South",
    href: "/23-south",
  },
  {
    mode: "IMAGINE",
    name: "KWAZURI",
    copy: "A living African storyworld spanning fiction, music, technology, ritual and play.",
    aboutCopy: "Story, culture and possible worlds.",
    cta: "Enter KwaZuri",
    href: "/kwazuri",
  },
];

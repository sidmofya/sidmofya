import { siteConfig } from "@/lib/site";

/** The public work index, shared by the homepage and About page. */
export type BodyOfWork = {
  mode: "UNDERSTAND" | "BUILD" | "IMAGINE";
  name: string;
  copy: string;
  aboutCopy: string;
  cta: string;
  href: string;
  external?: boolean;
  marker?: string;
  descriptor?: string;
  scope?: string;
};

export const bodiesOfWork: BodyOfWork[] = [
  {
    mode: "UNDERSTAND",
    name: "What AI Is Made Of",
    copy: "Take apart a one-gigawatt AI data centre and explore the power, materials and machines behind artificial intelligence.",
    aboutCopy: "The physical foundations of artificial intelligence.",
    cta: "Explore the model",
    href: siteConfig.aiResearchUrl,
    external: true,
    marker: "1 GW",
    descriptor: "Anatomy of an AI data centre",
    scope: "A reference model, not an operating facility.",
  },
  {
    mode: "UNDERSTAND",
    name: "From Copper to Compute",
    copy: "Trace copper from the rock it comes from to the machines that power AI. Explore the materials, energy and industrial processes along the way.",
    aboutCopy: "The journey from mineral extraction to AI infrastructure.",
    cta: "Explore the copper journey",
    href: siteConfig.copperResearchUrl,
    external: true,
    marker: "Cu",
    descriptor: "Anatomy of a supply chain",
    scope: "From the mine to the AI data centre.",
  },
  {
    mode: "BUILD",
    name: "CopperCloud",
    copy: "Developing verifiable compute infrastructure for Africa, starting in Zambia. Bringing power, compute and productive enterprise together.",
    aboutCopy: "Energy and compute infrastructure for Africa.",
    cta: "Visit CopperCloud",
    href: siteConfig.copperCloudUrl,
    external: true,
  },
  {
    mode: "BUILD",
    name: "MOTIF 54",
    copy: "Capital structuring and strategy across African energy, minerals and AI infrastructure.",
    aboutCopy: "Capital, infrastructure and industry.",
    cta: "Visit MOTIF 54",
    href: siteConfig.motif54Url,
    external: true,
  },
  {
    mode: "IMAGINE",
    name: "KwaZuri",
    copy: "An African storyworld where music is a mined resource. An exploration of culture, imagination and possibility through fiction, music and design.",
    aboutCopy: "Story, culture and possible worlds.",
    cta: "Enter KwaZuri",
    href: "/kwazuri",
  },
];

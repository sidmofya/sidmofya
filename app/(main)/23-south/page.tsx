import type { Metadata } from "next";
import Section from "@/components/Section";
import LatitudeRule from "@/components/LatitudeRule";
import SelectedWork, { type Work } from "@/components/SelectedWork";
import { siteConfig } from "@/lib/site";

const description =
  "23° South is Sid Mofya's publishing home for essays, frameworks and field notes on capital, sovereignty, technology, culture and the structures shaping what comes next.";

export const metadata: Metadata = {
  title: "23° South | Sid Mofya",
  description,
  alternates: { canonical: "/23-south" },
  openGraph: {
    title: "23° South | Sid Mofya",
    description,
    url: "/23-south",
    type: "website",
  },
};

const works: Work[] = [
  {
    title: "The Wealth of Resource Nations",
    description:
      "A framework for how resource-rich countries convert geology into durable national wealth: not simply by extracting more, but by building the capabilities, institutions and ownership structures that allow value to compound locally.",
  },
  {
    title: "Sovereign Geometry",
    description:
      "An inquiry into the recurring structures beneath sovereignty, value, scarcity, ownership, coordination and power, and how those structures shape what people and institutions are able to build.",
  },
  {
    title: "Canon Before Capital",
    description:
      "The case that durable capital formation begins upstream of money: with shared meaning, legitimacy, standards, memory and a coherent account of what is worth building and preserving.",
  },
  {
    title: "Futurecraft",
    description:
      "A framework for making better strategic choices when technology changes faster than institutions, categories and conventional planning.",
  },
];

export default function Page() {
  return (
    <>
      <Section className="!pt-20 md:!pt-28 !pb-14 md:!pb-20">
        <div className="max-w-3xl">
          <p className="eyebrow mb-6">23° South</p>
          <h1 className="h-hero text-[var(--color-ink)]">
            A latitude from which to see the world.
          </h1>
          <p className="lede mt-8 text-[var(--color-ink)]">
            Essays, frameworks and field notes on capital, sovereignty, technology,
            culture and the structures shaping what comes next.
          </p>
        </div>
        <LatitudeRule className="mt-14 md:mt-20" />
      </Section>

      <Section divider>
        <div className="grid gap-8 md:grid-cols-[18rem_1fr] md:gap-16">
          <h2 className="eyebrow">A latitude, not a niche</h2>
          <div className="prose-narrow text-[var(--color-ink)]">
            <p>The world looks different depending on where you stand.</p>
            <p>
              23° South begins with a point of view: looking at the world from the
              intersection of resource economies, Silicon Valley, capital markets,
              technological change, culture and the long arc of sovereignty.
            </p>
            <p>
              The subject is not one geography. It is the changing world, viewed from
              a different latitude.
            </p>
          </div>
        </div>
      </Section>

      <Section divider>
        <div className="grid gap-8 md:grid-cols-[18rem_1fr] md:gap-16">
          <h2 className="eyebrow">The newsletter</h2>
          <div>
            <p className="h-section text-[var(--color-ink)]">Sovereign Tea</p>
            <p className="lede mt-4 text-[var(--color-ink)]">
              Dispatches from the long view.
            </p>
            <p className="mt-5 max-w-xl text-[var(--color-ink-muted)]">
              Shorter observations on capital, sovereignty and the structures
              underneath the news.
            </p>
            <p className="mt-8">
              <a
                href={siteConfig.sovereignTeaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-copper font-medium"
              >
                Read Sovereign Tea on LinkedIn ↗
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </p>
          </div>
        </div>
      </Section>

      <Section divider className="!pb-24 md:!pb-32">
        <h2 className="eyebrow mb-10">Selected writing &amp; frameworks</h2>
        <SelectedWork works={works} />
      </Section>
    </>
  );
}

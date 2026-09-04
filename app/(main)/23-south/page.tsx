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
    title: "Real Economik",
    description:
      "A framework for understanding the informal economy through the roles that different participants play regardless of institutional recognition.",
  },
  {
    title: "FutureCraft",
    description:
      "Africa is a supercomputer humming beneath the surface: copper in the ground, memory in the body, knowledge in language, trade routes crossing old borders. FutureCraft is the work of reconnecting those circuits until the continent can generate its own futures again.",
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

        <nav
          aria-label="On this page"
          className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.8125rem] uppercase tracking-[0.14em]"
        >
          {[
            { label: "Premise", href: "#premise" },
            { label: "Sovereign Tea", href: "#sovereign-tea" },
            { label: "Selected Works", href: "#selected-works" },
          ].map((item, index) => (
            <span key={item.href} className="flex items-center gap-3">
              {index > 0 && (
                <span aria-hidden="true" className="text-[var(--color-rule)]">
                  ·
                </span>
              )}
              <a
                href={item.href}
                className="text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-copper)]"
              >
                {item.label}
              </a>
            </span>
          ))}
        </nav>
      </Section>

      <Section id="premise" divider className="scroll-mt-20">
        <div className="grid gap-8 md:grid-cols-[18rem_1fr] md:gap-16">
          <h2 className="eyebrow">A latitude</h2>
          <div className="prose-narrow text-[var(--color-ink)]">
            <p>The world looks different depending on where you stand.</p>
            <p>
              23° South views the world from a specific latitude and examines the
              intersection of resource economies, Silicon Valley, capital markets,
              technological change, culture and the long arc of sovereignty.
            </p>
            <p>
              The result of a different lens is a changed perception, which leads to
              different actions.
            </p>
          </div>
        </div>
      </Section>

      <Section id="sovereign-tea" divider className="scroll-mt-20">
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

      <Section id="selected-works" divider className="scroll-mt-20 !pb-24 md:!pb-32">
        <h2 className="eyebrow mb-10">Selected writing &amp; frameworks</h2>
        <SelectedWork works={works} />
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import Section from "@/components/Section";
import CTAButton from "@/components/CTAButton";

export const metadata: Metadata = {
  title: "Speaking & Executive Briefings | Sid Mofya",
  description:
    "Sid Mofya briefs boards, investors, founders, and leadership teams on The Sovereign Stack: how AI, energy, minerals, compute, capital, culture, and coordination are reshaping power, risk, and opportunity.",
};

const bestFor = [
  "Boards and executive teams",
  "Investors and family offices",
  "Venture networks and corporate development teams",
  "Energy, mining, and infrastructure leaders",
  "AI infrastructure and digital infrastructure operators",
  "Africa-focused capital allocators",
  "Leadership offsites and private strategic rooms",
];

const outcomes = [
  "See why AI is also an energy, minerals, capital, and sovereignty story.",
  "Understand Africa's role in the next infrastructure and resource cycle.",
  "Identify where technology, capital, energy, and trust are likely to misalign.",
  "Use the Sovereign Stack as a practical lens for strategy, allocation, partnership, and positioning decisions.",
];

const formats = [
  "Keynote",
  "Executive briefing",
  "Boardroom session",
  "Investor roundtable",
  "Leadership offsite",
  "Strategic moderator / conversation architect",
];

function SimpleList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-[var(--color-ink)]">
          <span className="text-[var(--color-copper)] mt-1">-</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Page() {
  return (
    <>
      <Section className="!pt-24 md:!pt-28 !pb-16">
        <div className="max-w-3xl">
          <div className="eyebrow mb-5">Speaking &amp; Executive Briefings</div>
          <h1 className="h-hero text-[var(--color-ink)]">The Sovereign Stack</h1>
          <p className="lede mt-6 text-[var(--color-ink)]">
            How AI, energy, minerals, compute, capital, and culture are rewriting power.
          </p>
          <div className="prose-narrow mt-8 text-[var(--color-ink-muted)]">
            <p>
              Sid Mofya helps serious rooms make sense of the new power stack: the convergence of
              AI infrastructure, energy security, critical minerals, compute, capital allocation,
              African resources, cultural trust, and strategic coordination.
            </p>
            <p>
              This is not a generic future-of-Africa talk or a generic AI keynote. It is a
              strategic briefing for rooms where decisions about capital, risk, partnerships,
              infrastructure, and positioning are live.
            </p>
          </div>
        </div>
      </Section>

      <Section divider className="!py-16 md:!py-24">
        <div className="grid md:grid-cols-[18rem_1fr] gap-10 md:gap-16">
          <div>
            <h2 className="h-section text-[var(--color-ink)]">
              The Sovereign Stack: How AI, Energy, Minerals, Capital, and Culture Are Rewriting
              Power
            </h2>
          </div>
          <div className="prose-narrow text-[var(--color-ink)]">
            <p>
              AI needs energy. Energy needs minerals. Minerals need capital. Capital needs trust.
              Trust needs narrative. And none of it works without coordination and agency.
            </p>
            <p>
              The Sovereign Stack helps leaders see these forces as one connected system, not
              separate trends.
            </p>
          </div>
        </div>
      </Section>

      <Section divider className="!py-16 md:!py-24">
        <div className="grid md:grid-cols-[18rem_1fr] gap-10 md:gap-16">
          <div>
            <h2 className="h-section text-[var(--color-ink)]">Best for</h2>
          </div>
          <SimpleList items={bestFor} />
        </div>
      </Section>

      <Section divider className="!py-16 md:!py-24">
        <div className="grid md:grid-cols-[18rem_1fr] gap-10 md:gap-16">
          <div>
            <h2 className="h-section text-[var(--color-ink)]">Audience outcomes</h2>
            <p className="mt-5 text-[var(--color-ink-muted)]">After the briefing, the room will be able to:</p>
          </div>
          <SimpleList items={outcomes} />
        </div>
      </Section>

      <Section divider className="!py-16 md:!py-24">
        <div className="grid md:grid-cols-[18rem_1fr] gap-10 md:gap-16">
          <div>
            <h2 className="h-section text-[var(--color-ink)]">Available formats</h2>
          </div>
          <SimpleList items={formats} />
        </div>
      </Section>

      <Section divider className="!py-16 md:!py-24">
        <div className="grid md:grid-cols-[18rem_1fr] gap-10 md:gap-16">
          <div>
            <h2 className="h-section text-[var(--color-ink)]">Why Sid</h2>
          </div>
          <div className="prose-narrow text-[var(--color-ink)]">
            <p>
              Sid Mofya works at the edge of capital and culture. He is the Founder of MOTIF 54,
              former CEO and Director of Draper Venture Network, and a Kauffman Fellow. His work
              spans venture networks, African capital formation, energy, minerals, compute,
              cultural strategy, and strategic convening.
            </p>
            <p>
              He is especially useful in rooms where the terrain is unclear, the stakes are live,
              and leaders need a better map before they allocate capital, choose partners, or
              commit to a strategic direction.
            </p>
          </div>
        </div>
      </Section>

      <Section divider className="!py-20 md:!py-28">
        <div className="max-w-2xl">
          <h2 className="h-section text-[var(--color-ink)]">Bring the real decision.</h2>
          <p className="mt-5 lede text-[var(--color-ink)]">
            If you are convening a board, investor group, executive team, founder network, or
            private room around AI infrastructure, energy security, critical minerals, Africa
            investment, private capital, or geopolitical risk, start here.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <CTAButton href="/work-with-me?interest=speaking">Request a Briefing</CTAButton>
            <CTAButton href="https://motif54.com" variant="secondary">
              Explore MOTIF 54
            </CTAButton>
          </div>
        </div>
      </Section>
    </>
  );
}

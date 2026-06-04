import type { Metadata } from "next";
import Link from "next/link";
import Section from "@/components/Section";
import CTAButton from "@/components/CTAButton";
import { videos as patternVideos } from "@/lib/pattern-cognition";

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

type PlaylistEntry = {
  title: string;
  signal: string;
  label: string;
};

// Curated arc: AI → infrastructure → energy → ownership → capital structures → trust → culture → coordination.
// Titles must match an entry in lib/pattern-cognition.ts exactly. If any title goes missing
// (renamed or removed upstream), the resolver below will warn in dev and skip it; do not
// substitute a different video without explicit direction.
const sovereignStackPlaylist: PlaylistEntry[] = [
  {
    title: "If you're still treating AI like a typing assistant, you're missing the point",
    signal:
      "AI is not just a productivity tool. It is changing the operating layer of work, strategy, and agency.",
    label: "AI / Agency",
  },
  {
    title: "We Can Not Have a Tech Future Without Investing into the Right Assets",
    signal:
      "The future is not built on software alone. Technology depends on physical assets, infrastructure, energy, and capital.",
    label: "Compute / Infrastructure / Assets",
  },
  {
    title: "Challenges like the Energy Crisis in Zambia are opportunities",
    signal:
      "Energy constraints are not only problems. They can reveal where infrastructure, capital, and industrial strategy need to move next.",
    label: "Energy / Africa / Resilience",
  },
  {
    title: "Africa is Rich, But Who Exactly Owns Its Wealth?",
    signal:
      "The core question is not whether Africa has resources. It is who owns, controls, finances, and captures the value.",
    label: "Ownership / Capital / Sovereignty",
  },
  {
    title:
      "New Investment Structures are Making Investing into Mining Accessible to More Investors",
    signal:
      "Critical minerals are becoming more investable as new structures change access, ownership, and capital formation.",
    label: "Minerals / Capital / Access",
  },
  {
    title: "Who You Invest With MATTERS Most in Emerging Markets Investing",
    signal:
      "In emerging markets, partner quality, trust, governance, and execution matter as much as the asset itself.",
    label: "Trust / Capital / Partner Risk",
  },
  {
    title: "Culture Can Bring More Capital",
    signal:
      "Culture is not decoration. Narrative, legitimacy, and trust can shape where capital flows and why.",
    label: "Culture / Narrative / Capital",
  },
  {
    title: "The Value of Hosting a Conference is Bringing People Together",
    signal:
      "The room itself is part of the strategy. Convening creates coordination, trust, commitments, and next moves.",
    label: "Coordination / Rooms / Action",
  },
];

const videoIndexByTitle = new Map(patternVideos.map((v) => [v.title, v.id]));

const resolvedPlaylist = sovereignStackPlaylist.flatMap((entry) => {
  const id = videoIndexByTitle.get(entry.title);
  if (!id) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(
        `[speaking] Sovereign Stack playlist: no Pattern Cognition video found for title "${entry.title}". Skipping.`,
      );
    }
    return [];
  }
  return [{ ...entry, id }];
});

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
        <div className="max-w-2xl mb-12 md:mb-16">
          <div className="eyebrow mb-3">Watch</div>
          <h2 className="h-section text-[var(--color-ink)]">The Sovereign Stack in 8 Signals</h2>
          <p className="mt-5 text-[var(--color-ink-muted)]">
            A curated set from{" "}
            <Link href="/patterncognition" className="link-copper">
              Pattern Cognition
            </Link>
            , Sid&rsquo;s short-video archive on recurring patterns across capital, culture, AI,
            Africa, creative practice, strategy, and inner life.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {resolvedPlaylist.map((entry) => (
            <article
              key={entry.id}
              className="flex flex-col bg-[var(--color-bg-elev)] border border-[var(--color-rule)] overflow-hidden"
            >
              <div
                className="relative w-full bg-black"
                style={{ aspectRatio: "16 / 9" }}
              >
                <iframe
                  loading="lazy"
                  src={`https://www.youtube-nocookie.com/embed/${entry.id}?rel=0`}
                  title={entry.title}
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
              <div className="flex flex-col gap-3 p-6 md:p-7">
                <h3 className="font-display text-lg leading-snug text-[var(--color-ink)]">
                  {entry.title}
                </h3>
                <p className="text-[0.9375rem] text-[var(--color-ink-muted)] leading-relaxed">
                  {entry.signal}
                </p>
                <div className="eyebrow !text-[0.75rem] mt-1">{entry.label}</div>
              </div>
            </article>
          ))}
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

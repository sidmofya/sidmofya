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

type Testimonial = {
  quote: string;
  name: string;
  title: string;
};

// Add a third quote (e.g. Almaz Negash) by appending one entry here. No markup change needed.
const testimonials: Testimonial[] = [
  {
    quote:
      "Sid spoke at our annual summit and absolutely delivered. He brought original thinking that actually shifted how people in the room see opportunities, not just the usual talking points you hear at every conference. His frameworks on sovereignty and global capital flows hit hard. We had LPs and founders coming up afterward asking for intros. What makes Sid different is he doesn't just present information, he changes how you think about entire markets. Would book him again in a heartbeat.",
    name: "Alon Goren",
    title: "DGH Ventures",
  },
  {
    quote:
      "Sid moderated a high-level conversation on investment in Africa for us, holding a room that included Zambia's Ambassador to the US and the Minister of Transport. He kept a demanding panel focused and made the substance land for the audience. A real asset to any serious convening.",
    name: "Rajen Ranchhod",
    title: "Honorary Consul of Zambia to the State of California",
  },
];

function SimpleList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-[var(--color-ink)]">
          <span className="text-[var(--color-copper)] mt-1">·</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Page() {
  return (
    <>
      {/* 1. Hero: title, subhead, disqualifier. Headshot drops in here once supplied. */}
      <Section className="!pt-24 md:!pt-28 !pb-16">
        <div className="max-w-3xl">
          <div className="eyebrow mb-5">Speaking &amp; Executive Briefings</div>
          <h1 className="h-hero text-[var(--color-ink)]">The Sovereign Stack</h1>
          <p className="lede mt-6 text-[var(--color-ink)]">
            How AI, energy, minerals, capital, and culture are rewriting power.
          </p>
          <div className="prose-narrow mt-8 text-[var(--color-ink-muted)]">
            <p>
              Not a future-of-Africa talk or an AI keynote. A strategic briefing for rooms where
              decisions about capital, risk, partnerships, and positioning are live.
            </p>
          </div>
        </div>
      </Section>

      {/* 2. Thesis chain: stands alone, no competing header. */}
      <Section divider className="!py-20 md:!py-28">
        <div className="max-w-2xl">
          <p className="h-section text-[var(--color-ink)]">
            AI needs energy. Energy needs minerals. Minerals need capital. Capital needs trust.
            Trust needs narrative. And none of it works without coordination and agency.
          </p>
          <p className="mt-6 lede text-[var(--color-ink-muted)]">
            The Sovereign Stack helps leaders see these forces as one connected system, not
            separate trends.
          </p>
        </div>
      </Section>

      {/* 3. See a talk (ADIS clip) drops in here once the URL is supplied:
            a single swappable YouTube id rendered as a 16:9 horizontal embed,
            captioned with the venue (African Diaspora Investment Symposium). */}

      {/* 4. Audience outcomes: forwardable line, then the bullets. Before "Best for". */}
      <Section divider className="!py-16 md:!py-24">
        <div className="grid md:grid-cols-[18rem_1fr] gap-10 md:gap-16">
          <div>
            <h2 className="h-section text-[var(--color-ink)]">Audience outcomes</h2>
            <p className="mt-5 lede text-[var(--color-ink)]">
              Your team leaves with a single working lens for allocation, partnership, and
              positioning decisions.
            </p>
          </div>
          <SimpleList items={outcomes} />
        </div>
      </Section>

      {/* 5. Best for */}
      <Section divider className="!py-16 md:!py-24">
        <div className="grid md:grid-cols-[18rem_1fr] gap-10 md:gap-16">
          <div>
            <h2 className="h-section text-[var(--color-ink)]">Best for</h2>
          </div>
          <SimpleList items={bestFor} />
        </div>
      </Section>

      {/* 6. Why Sid + testimonials */}
      <Section divider className="!py-16 md:!py-24">
        <div className="grid md:grid-cols-[18rem_1fr] gap-10 md:gap-16">
          <div>
            <h2 className="h-section text-[var(--color-ink)]">Why Sid</h2>
          </div>
          <div className="prose-narrow text-[var(--color-ink)]">
            <p>
              Sid Mofya is a capital and strategy operator working at the intersection of venture,
              energy, resources, technology, and emerging markets. He is the Founder of MOTIF 54,
              former Executive Director of Draper Venture Network, and a Kauffman Fellow. His work
              focuses on capital formation, investment strategy, critical minerals, energy, compute
              infrastructure, and building bridges between global investors and frontier markets.
            </p>
            <p>
              He has spoken, hosted, and facilitated conversations for investors, founders,
              policymakers, and technology leaders at events including MIT, the African Diaspora
              Investment Symposium, Draper Venture Network LP Day, investment forums in Zambia and
              the DRC, and Mobile World Congress (4YFN).
            </p>
            <p>
              His work helps leaders understand how shifts in AI, energy, minerals, capital, and
              geopolitics interact, and what those shifts mean for investment strategy, risk,
              opportunity, and long-term positioning.
            </p>

            <div className="mt-10 space-y-8">
              {testimonials.map((t) => (
                <figure key={t.name} className="border-l-2 border-[var(--color-copper)] pl-5">
                  <blockquote className="text-[var(--color-ink)]">{t.quote}</blockquote>
                  <figcaption className="mt-3 text-[0.9375rem] text-[var(--color-ink-muted)]">
                    {t.name}, {t.title}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* 7. Available formats */}
      <Section divider className="!py-16 md:!py-24">
        <div className="grid md:grid-cols-[18rem_1fr] gap-10 md:gap-16">
          <div>
            <h2 className="h-section text-[var(--color-ink)]">Available formats</h2>
          </div>
          <SimpleList items={formats} />
        </div>
      </Section>

      {/* 8. Call to action. Low-friction "Watch a talk" and "Download the speaker one-sheet (PDF)"
            join here as the primary actions once the ADIS clip and one-sheet are supplied;
            "Request a briefing" then becomes secondary. */}
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
          </div>
        </div>
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import Section from "@/components/Section";
import CTAButton from "@/components/CTAButton";
import SpeakingInquiryForm from "@/components/SpeakingInquiryForm";

const description =
  "Sid Mofya briefs boards, investors, founders, and leadership teams on The Sovereign Stack: how AI, energy, minerals, capital, and culture are rewriting power, risk, and opportunity.";

export const metadata: Metadata = {
  title: "Speaking & Executive Briefings | Sid Mofya",
  description,
  alternates: { canonical: "/speaking" },
  openGraph: {
    title: "Speaking & Executive Briefings | Sid Mofya",
    description,
    url: "/speaking",
    type: "website",
    images: ["/sid-mofya.jpg"],
  },
};

// Swap this single field when a better ADIS cut is ready (currently a placeholder Short shown 16:9).
const ADIS_VIDEO_ID = "uUJo_7UiFzA";

// Headshot lives in public/. Delivered separately; reference is stable.
const HEADSHOT_SRC = "/sid-mofya.jpg";

const venues = [
  "MIT",
  "African Diaspora Investment Symposium",
  "Draper Venture Network LP Day",
  "Zambia US Roadshow",
  "DRC Investment Forum",
  "Mobile World Congress (4YFN)",
  "TEC de Monterrey",
  "Deutsche Bank",
  "Telefonica",
];

const credentials = [
  "Founder, MOTIF 54",
  "Former Executive Director, Draper Venture Network",
  "Kauffman Fellow",
];

// Sid's thesis chain, rendered as the literal stack. Reconstructs the sentence top to bottom.
const stackLayers = [
  { name: "AI", note: "needs energy" },
  { name: "Energy", note: "needs minerals" },
  { name: "Minerals", note: "needs capital" },
  { name: "Capital", note: "needs trust" },
  { name: "Trust", note: "needs narrative" },
  { name: "Narrative", note: "needs coordination" },
  { name: "Coordination and agency", note: "holds the stack together" },
];

const outcomes = [
  "See why AI is also an energy, minerals, capital, and sovereignty story.",
  "Understand Africa's role in the next infrastructure and resource cycle.",
  "Identify where technology, capital, energy, and trust are likely to misalign.",
  "Use the Sovereign Stack as a practical lens for strategy, allocation, partnership, and positioning decisions.",
];

const bestFor = [
  "Boards and executive teams",
  "Investors and family offices",
  "Venture networks and corporate development teams",
  "Energy, mining, and infrastructure leaders",
  "AI infrastructure and digital infrastructure operators",
  "Africa-focused capital allocators",
  "Leadership offsites and private strategic rooms",
];

const formats = [
  "Keynote",
  "Executive briefing",
  "Boardroom session",
  "Investor roundtable",
  "Leadership offsite",
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
  {
    quote:
      "Sid moderated one of the most engaged sessions at ADIS. He drew real substance out of Tammy and Eva and kept the room with him from start to finish. I'd have him back without hesitation.",
    name: "Almaz Negash",
    title: "CEO & Founder, African Diaspora Network",
  },
];

export default function Page() {
  return (
    <>
      {/* Hero: copy + headshot, the disqualifier up front, two clear next steps. */}
      <Section className="relative !pt-24 md:!pt-28 !pb-12 md:!pb-16">
        <div className="doors" aria-hidden="true">
          <span />
        </div>
        <div className="relative grid items-center gap-12 md:grid-cols-[1.05fr_0.95fr] md:gap-16">
          <div className="max-w-xl">
            <div className="eyebrow mb-5">Speaking &amp; Executive Briefings</div>
            <h1 className="h-hero text-[var(--color-ink)]">The Sovereign Stack</h1>
            <p className="lede mt-6 text-[var(--color-ink)]">
              How AI, energy, minerals, capital, and culture are rewriting power.
            </p>
            <p className="mt-6 max-w-md text-[var(--color-ink-muted)]">
              Not a future-of-Africa talk or an AI keynote. A strategic briefing for rooms where
              decisions about capital, risk, partnerships, and positioning are live.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <CTAButton href="#request-a-briefing">Request a briefing</CTAButton>
              <CTAButton href="#see-a-talk" variant="secondary">
                Watch a talk
              </CTAButton>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm md:max-w-none">
            {/* Background recolored to --color-bg so the subject floats on the page. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={HEADSHOT_SRC}
              alt="Sid Mofya"
              className="w-full aspect-[4/5] object-cover object-top"
            />
          </div>
        </div>
      </Section>

      {/* Credibility strip: instant authority before the argument. */}
      <Section className="!pt-0 !pb-12 md:!pb-16">
        <div className="text-[0.8125rem] tracking-wider text-[var(--color-ink-muted)]">
          <span className="uppercase text-[var(--color-copper)]">Previous rooms</span>
          <span className="mx-3 text-[var(--color-rule)]" aria-hidden="true">
            :
          </span>
          {venues.map((v, i) => (
            <span key={v}>
              {i > 0 && (
                <span className="mx-2 text-[var(--color-rule)]" aria-hidden="true">
                  |
                </span>
              )}
              {v}
            </span>
          ))}
        </div>
      </Section>

      {/* Thesis = the stack. Statement, then the layers, then the supporting line. */}
      <Section divider className="bg-[var(--color-bg-elev)] !py-16 md:!py-24">
        <div className="grid gap-12 md:grid-cols-[1fr_minmax(0,26rem)] md:gap-16 md:items-start">
          <div className="max-w-xl">
            <div className="eyebrow mb-4">The thesis</div>
            <p className="h-section text-[var(--color-ink)]">
              AI needs energy. Energy needs minerals. Minerals need capital. Capital needs trust.
              Trust needs narrative. And none of it works without coordination and agency.
            </p>
            <p className="mt-6 text-[var(--color-ink-muted)]">
              The Sovereign Stack helps leaders see these forces as one connected system, not
              separate trends.
            </p>
          </div>

          <ol className="border border-[var(--color-rule)] bg-[var(--color-bg)]">
            {stackLayers.map((layer, i) => (
              <li
                key={layer.name}
                className="flex items-baseline gap-4 px-5 py-3.5 border-t border-[var(--color-rule)] first:border-t-0"
              >
                <span className="text-[0.75rem] tabular-nums text-[var(--color-copper)] w-5 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-lg text-[var(--color-ink)]">{layer.name}</span>
                <span className="ml-auto text-[0.9375rem] text-[var(--color-ink-muted)]">
                  {layer.note}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* See a talk: the proof block. Highest-value moment on the page. */}
      <Section id="see-a-talk" divider className="scroll-mt-20 !py-16 md:!py-24">
        <div className="max-w-2xl mb-10 md:mb-12">
          <div className="eyebrow mb-3">See a talk</div>
          <h2 className="h-section text-[var(--color-ink)]">From the stage</h2>
          <p className="mt-5 text-[var(--color-ink-muted)]">
            A strategic briefing for an investor audience at the African Diaspora Investment
            Symposium.
          </p>
        </div>
        <figure className="max-w-4xl">
          <div className="relative aspect-video w-full overflow-hidden border border-[var(--color-rule)] bg-black">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${ADIS_VIDEO_ID}?rel=0`}
              title="Sid Mofya speaking at the African Diaspora Investment Symposium"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 h-full w-full"
            />
          </div>
          <figcaption className="mt-3 text-[0.8125rem] text-[var(--color-ink-muted)]">
            African Diaspora Investment Symposium
          </figcaption>
        </figure>
      </Section>

      {/* Audience outcomes: forwardable line, then outcomes as cards. */}
      <Section divider className="bg-[var(--color-bg-elev)] !py-16 md:!py-24">
        <div className="max-w-2xl mb-10 md:mb-12">
          <div className="eyebrow mb-3">Audience outcomes</div>
          <p className="h-card text-[var(--color-ink)]">
            Your team leaves with a single working lens for allocation, partnership, and positioning
            decisions.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {outcomes.map((outcome, i) => (
            <div
              key={outcome}
              className="flex gap-4 border border-[var(--color-rule)] bg-[var(--color-bg)] p-6 md:p-7"
            >
              <span className="font-display text-xl tabular-nums text-[var(--color-copper)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[var(--color-ink)]">{outcome}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Best for: a fast self-qualification scan as chips. */}
      <Section divider className="!py-16 md:!py-24">
        <div className="grid gap-8 md:grid-cols-[18rem_1fr] md:gap-16">
          <div>
            <h2 className="h-section text-[var(--color-ink)]">Best for</h2>
          </div>
          <ul className="flex flex-wrap gap-2.5 self-start">
            {bestFor.map((item) => (
              <li
                key={item}
                className="border border-[var(--color-rule)] px-3.5 py-2 text-[0.9375rem] text-[var(--color-ink)] transition-colors hover:border-[var(--color-copper)] hover:text-[var(--color-copper)]"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Why Sid: bio + credential panel, then testimonials as cards. */}
      <Section divider className="bg-[var(--color-bg-elev)] !py-16 md:!py-24">
        <div className="grid gap-10 md:grid-cols-[1fr_17rem] md:gap-16">
          <div>
            <h2 className="h-section text-[var(--color-ink)]">Why Sid</h2>
            <div className="prose-narrow mt-6 text-[var(--color-ink)]">
              <p>
                Sid Mofya is a capital and strategy operator working at the intersection of venture,
                energy, resources, technology, and emerging markets. His work focuses on capital
                formation, investment strategy, critical minerals, energy, compute infrastructure,
                and building bridges between global investors and frontier markets.
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
            </div>
          </div>

          <div className="md:border-l md:border-[var(--color-rule)] md:pl-8">
            <div className="eyebrow mb-4">Credentials</div>
            <ul className="space-y-3">
              {credentials.map((c) => (
                <li key={c} className="flex items-start gap-3 text-[0.9375rem] text-[var(--color-ink)]">
                  <span className="mt-1 text-[var(--color-copper)]">·</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col border border-[var(--color-rule)] bg-[var(--color-bg)] p-7 md:p-8"
            >
              <blockquote className="text-[var(--color-ink)]">{t.quote}</blockquote>
              <figcaption className="mt-5 border-t border-[var(--color-rule)] pt-4 text-[0.9375rem] text-[var(--color-ink-muted)]">
                <span className="text-[var(--color-ink)]">{t.name}</span>, {t.title}
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* Available formats: cards, with the moderator role surfaced as the differentiator. */}
      <Section divider className="!py-16 md:!py-24">
        <div className="max-w-2xl mb-10 md:mb-12">
          <h2 className="h-section text-[var(--color-ink)]">Available formats</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {formats.map((format) => (
            <div
              key={format}
              className="border border-[var(--color-rule)] bg-[var(--color-bg-elev)] p-6 text-[var(--color-ink)]"
            >
              {format}
            </div>
          ))}
        </div>
        <div className="mt-4 border border-[var(--color-copper)]/50 bg-[var(--color-bg-elev)] p-7 md:p-8">
          <div className="eyebrow mb-2">Differentiator</div>
          <div className="font-display text-xl text-[var(--color-ink)]">
            Strategic moderator and conversation architect
          </div>
          <p className="mt-3 max-w-2xl text-[var(--color-ink-muted)]">
            Sid can hold a demanding room as moderator, shaping the conversation in real time and
            making the substance land for the audience.
          </p>
        </div>
      </Section>

      {/* Closing CTA: one contrasting band, the decision made easy. */}
      <Section className="bg-[var(--color-ink)] !py-20 md:!py-28">
        <div className="max-w-2xl">
          <h2 className="h-section text-[var(--color-bg)]">Bring the real decision.</h2>
          <p className="mt-5 lede text-[color-mix(in_oklab,var(--color-bg)_78%,transparent)]">
            If you are convening a board, investor group, executive team, founder network, or
            private room around AI infrastructure, energy security, critical minerals, Africa
            investment, private capital, or geopolitical risk, start here.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <CTAButton href="#request-a-briefing">Request a briefing</CTAButton>
            <CTAButton href="#see-a-talk" variant="secondary">
              Watch a talk
            </CTAButton>
          </div>
        </div>
      </Section>

      {/* Speaking-specific inquiry, coherent with this page's proposition. */}
      <Section id="request-a-briefing" divider className="scroll-mt-20 !py-16 md:!py-24">
        <div className="grid gap-10 md:grid-cols-[18rem_1fr] md:gap-16">
          <div>
            <div className="eyebrow mb-3">Request a briefing</div>
            <h2 className="h-section text-[var(--color-ink)]">Start here.</h2>
            <p className="mt-5 text-[var(--color-ink-muted)]">
              Tell me about the room and what is live in it.
            </p>
          </div>
          <SpeakingInquiryForm />
        </div>
      </Section>
    </>
  );
}

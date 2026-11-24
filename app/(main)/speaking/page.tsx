import type { Metadata } from "next";
import { mainSiteShareImage } from "@/lib/site";
import Section from "@/components/Section";
import CTAButton from "@/components/CTAButton";
import SpeakingInquiryForm from "@/components/SpeakingInquiryForm";
import { testimonials, venues } from "@/lib/speaking";

const description =
  "Keynotes, executive briefings and private decision rooms with Sid Mofya on AI, energy, minerals, capital and what becomes valuable as intelligence grows abundant.";

export const metadata: Metadata = {
  title: "Speaking & Executive Briefings | Sid Mofya",
  description,
  alternates: { canonical: "/speaking" },
  openGraph: {
    title: "Speaking & Executive Briefings | Sid Mofya",
    description,
    url: "/speaking",
    type: "website",
    images: [mainSiteShareImage],
  },
};

const offers = [
  {
    format: "Keynote or executive briefing",
    title: "The Sovereign Stack",
    question: "Follow the physical foundations of the AI economy.",
    body: "Follow the physical foundations of AI, from energy and minerals to compute and capital. See where constraints, investment opportunities and geopolitical risks converge.",
    audience: "For investors, capital allocators and industrial leaders.",
  },
  {
    format: "Keynote or executive briefing",
    title: "The Next Scarcity",
    question: "What becomes valuable when intelligence becomes abundant?",
    body: "As AI changes the cost of producing and processing information, judgment, trust and coordination matter in new ways. Explore what leaders should cultivate when intelligence is no longer the only scarce resource.",
    audience: "For boards, founders and leadership teams.",
  },
  {
    format: "Private facilitation",
    title: "The Decision Room",
    question: "What is the question your leadership team has not resolved?",
    body: "Bring a live allocation, partnership or strategy question. I design and facilitate the conversation, surface the real disagreement, and leave the room with a written synthesis of decisions and open questions.",
    audience: "For boards, investment committees and private gatherings.",
  },
];

export default function Page() {
  return (
    <>
      {/* 01 / The proposition */}
      <Section className="!pt-24 md:!pt-28 !pb-14 md:!pb-20">
        <div className="grid items-center gap-10 md:grid-cols-[1.35fr_0.65fr] md:gap-16">
          <div className="max-w-2xl">
            <div className="eyebrow mb-5">Speaking &amp; Executive Briefings</div>
            <h1 className="h-hero text-[var(--color-ink)]">
              Where does value accrue in the next industrial era?
            </h1>
            <p className="lede mt-6 text-[var(--color-ink)]">
              AI, energy, minerals and capital are reshaping the global economy.
              I help investors, boards and leadership teams see where these forces
              converge, what is becoming scarce, and what it means for their decisions.
            </p>
            <p className="mt-5 text-sm text-[var(--color-ink-muted)]">
              Keynotes · Executive briefings · Private decision rooms
            </p>
            <div className="mt-8">
              <CTAButton href="#request-a-briefing">Discuss your next gathering</CTAButton>
            </div>
          </div>
          <figure className="mx-auto w-full max-w-[19rem] md:max-w-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/sid-mofya.jpg"
              alt="Sid Mofya"
              className="w-full aspect-[4/5] object-cover object-top"
              fetchPriority="high"
            />
          </figure>
        </div>
      </Section>

      {/* 02 / What to book */}
      <Section divider id="what-to-book" className="!py-14 md:!py-20 scroll-mt-20">
        <h2 className="h-section text-[var(--color-ink)]">What to book</h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {offers.map((offer, index) => (
            <article
              key={offer.title}
              className={`flex flex-col border p-6 md:p-7 ${index === 0 ? "border-[var(--color-copper)]" : "border-[var(--color-rule)]"}`}
            >
              <p className="eyebrow mb-4">{offer.format}</p>
              <h3 className="h-card text-[var(--color-ink)]">{offer.title}</h3>
              <p className="mt-4 font-medium text-[var(--color-ink)]">{offer.question}</p>
              <p className="mt-3 text-[var(--color-ink-muted)]">{offer.body}</p>
              <p className="mt-auto pt-6 text-sm text-[var(--color-ink-muted)]">
                {offer.audience}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-7">
          <CTAButton href="#request-a-briefing">Discuss your next gathering</CTAButton>
        </div>
      </Section>

      {/* 03 / Demonstrate the work. Preserve the old inbound video anchor. */}
      <Section divider id="see-a-talk" className="!py-14 md:!py-20 bg-[var(--color-bg-elev)] scroll-mt-20">
        <div className="eyebrow mb-4">Original research</div>
        <h2 className="h-section text-[var(--color-ink)]">Explore my Work</h2>
        <article className="mt-8 grid border border-[var(--color-rule)] bg-[var(--color-bg)] md:grid-cols-[0.7fr_1.3fr]">
          <div className="flex min-h-44 flex-col justify-center border-b border-[var(--color-rule)] p-7 md:border-b-0 md:border-r md:p-9">
            <p className="eyebrow">Anatomy of an AI data centre</p>
            <p className="mt-3 font-display text-6xl leading-none tracking-tight text-[var(--color-copper)] md:text-7xl">
              1 GW
            </p>
            <p className="mt-4 text-sm text-[var(--color-ink-muted)]">
              A reference model, not an operating facility.
            </p>
          </div>
          <div className="p-7 md:p-9">
            <h3 className="h-card text-[var(--color-ink)]">What AI Is Made Of</h3>
            <p className="mt-4 max-w-lg text-[var(--color-ink-muted)]">
              An interactive model of a one-gigawatt AI data centre, from power
              and cooling to chips and copper. Take it apart and inspect the
              research and assumptions behind the numbers.
            </p>
            <div className="mt-6">
              <CTAButton href="https://ai.sidmofya.com" variant="secondary" newTab>
                Explore the model
              </CTAButton>
            </div>
          </div>
        </article>
        <article className="mt-4 grid border border-[var(--color-rule)] bg-[var(--color-bg)] md:grid-cols-[0.7fr_1.3fr]">
          <div className="flex min-h-44 flex-col justify-center border-b border-[var(--color-rule)] p-7 md:border-b-0 md:border-r md:p-9">
            <p className="eyebrow">Anatomy of a supply chain</p>
            <p className="mt-3 font-display text-6xl leading-none tracking-tight text-[var(--color-copper)] md:text-7xl">
              Cu
            </p>
            <p className="mt-4 text-sm text-[var(--color-ink-muted)]">
              From the mine to the AI data centre.
            </p>
          </div>
          <div className="p-7 md:p-9">
            <h3 className="h-card text-[var(--color-ink)]">From Copper to Compute</h3>
            <p className="mt-4 max-w-lg text-[var(--color-ink-muted)]">
              Follow copper from the rock it comes from to the machines that
              power AI. Explore the materials, energy and industrial processes
              behind the copper in a one-gigawatt AI data centre.
            </p>
            <div className="mt-6">
              <CTAButton href="https://ai.sidmofya.com/copper" variant="secondary" newTab>
                Explore the copper journey
              </CTAButton>
            </div>
          </div>
        </article>
      </Section>

      {/* 04 / Selected experience and independent voices */}
      <Section divider className="!py-14 md:!py-20">
        <div className="grid gap-8 md:grid-cols-[1fr_1fr] md:gap-12">
          <div>
            <h2 className="h-section text-[var(--color-ink)]">Why me</h2>
            <p className="mt-5 text-[var(--color-ink-muted)]">
              My industrial operating experience as a technologist at Shell, my global
              venture capital experience at Draper Venture Network and my active
              infrastructure work with CopperCloud offer a unique vantage point
              for understanding how our world is changing.
            </p>
            <p className="mt-4 text-[var(--color-ink-muted)]">
              Founder, MOTIF 54. Former Executive Director, Draper Venture
              Network. Kauffman Fellow.
            </p>
          </div>
          <div className="border-t border-[var(--color-rule)] pt-6 md:border-l md:border-t-0 md:pl-10 md:pt-0">
            <h3 className="eyebrow mb-4">Previous rooms</h3>
            <p className="text-[var(--color-ink)] leading-relaxed">
              {venues.join(" · ")}
            </p>
            <a
              href="https://www.youtube.com/watch?v=uUJo_7UiFzA"
              className="mt-5 inline-block text-sm underline underline-offset-4 text-[var(--color-ink-muted)]"
              target="_blank"
              rel="noopener noreferrer"
            >
              ADIS 2026 Diaspora Luminaire recognition video
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
        <div className="mt-9 grid gap-4 md:grid-cols-2">
          {testimonials.slice(0, 2).map((testimonial) => (
            <figure
              key={testimonial.name}
              className="flex flex-col border border-[var(--color-rule)] bg-[var(--color-bg-elev)] p-6 md:p-7"
            >
              <blockquote className="text-[var(--color-ink)]">{testimonial.quote}</blockquote>
              <figcaption className="mt-auto pt-5 text-sm text-[var(--color-ink-muted)]">
                <span className="font-medium text-[var(--color-ink)]">{testimonial.name}</span>
                {", "}{testimonial.title}
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* 05 / One inquiry, with explicit offer selection */}
      <Section divider id="request-a-briefing" className="!py-14 md:!py-20 scroll-mt-20">
        <div className="grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
          <div>
            <div className="eyebrow mb-4">Inquiries</div>
            <h2 className="h-section text-[var(--color-ink)]">Bring the real question.</h2>
            <p className="mt-5 max-w-sm text-[var(--color-ink-muted)]">
              Tell me who will be in the room, what is at stake, and what you
              want the conversation to accomplish.
            </p>
          </div>
          <SpeakingInquiryForm />
        </div>
      </Section>
    </>
  );
}

import Link from "next/link";
import Section from "@/components/Section";
import CTAButton from "@/components/CTAButton";
import OfferCard from "@/components/OfferCard";
import { offers } from "@/lib/offers";

export default function Home() {
  return (
    <>
      {/* 1. Hero */}
      <section className="relative px-6 md:px-10 pt-16 md:pt-24 pb-20 md:pb-28">
        <div className="doors" aria-hidden="true">
          <span />
        </div>
        <div className="relative mx-auto max-w-[72rem]">
          <div className="max-w-3xl">
            <div className="eyebrow mb-6">Sid Mofya</div>
            <h1 className="h-hero text-[var(--color-ink)]">For people building across worlds.</h1>
            <p className="lede mt-7 text-[var(--color-ink)]">
              I help founders, artists, and conveners turn complex work into clear offers, trusted
              rooms, and revenue-ready possibilities.
            </p>
            <p className="mt-5 text-[var(--color-ink-muted)] max-w-2xl">
              The work sits where culture becomes commercially active: identity, story, trust,
              creative rights, rooms, and capital movement.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <CTAButton href="/work-with-me">Work With Me</CTAButton>
              <CTAButton href="#offers" variant="secondary">
                See the Offers
              </CTAButton>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Offers */}
      <Section id="offers" divider>
        <div className="max-w-2xl mb-12 md:mb-16">
          <h2 className="h-section text-[var(--color-ink)]">
            Choose the work that matches your threshold.
          </h2>
          <p className="mt-5 text-[var(--color-ink-muted)] lede">
            Each sprint is designed for a live moment: a launch, a room, a decision, a rights
            question, or a story that needs to become easier to trust and buy.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {offers.map((offer, i) => (
            <OfferCard key={offer.slug} offer={offer} index={i} />
          ))}
        </div>
      </Section>

      {/* 3. The work is translation */}
      <Section divider className="text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="h-section text-[var(--color-ink)]">The work is translation.</h2>
          <div className="mt-8 space-y-4 text-[var(--color-ink)] text-lg">
            <p>Some things are powerful before they are legible.</p>
            <p className="text-[var(--color-ink-muted)]">A founder&rsquo;s strange edge.</p>
            <p className="text-[var(--color-ink-muted)]">A room full of possibility.</p>
            <p className="text-[var(--color-ink-muted)]">
              A song, voice, catalog, or fan relationship.
            </p>
            <p className="text-[var(--color-ink-muted)]">
              A story that people feel before they know how to buy.
            </p>
            <p className="pt-4">
              My work helps make the invisible structure visible, so the right people can
              understand, trust, and move.
            </p>
          </div>
        </div>
      </Section>

      {/* 4. Built for live thresholds */}
      <Section divider>
        <div className="max-w-2xl mb-12">
          <h2 className="h-section text-[var(--color-ink)]">Built for live thresholds.</h2>
          <p className="mt-5 text-[var(--color-ink-muted)] lede">
            This is for people and organizations at the point where the old language is no longer
            enough.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <div>
            <div className="eyebrow mb-4">For</div>
            <ul className="space-y-2">
              {[
                "founders with complex stories and unclear offers",
                "artists and managers facing AI rights questions",
                "conveners designing rooms where trust must become action",
                "advisors moving into a clearer commercial category",
                "cultural entrepreneurs creating new forms of value",
                "institutions that need meaning, structure, and outcomes in the same room",
              ].map((f) => (
                <li key={f} className="flex items-start gap-3 text-[var(--color-ink)]">
                  <span className="text-[var(--color-copper)] mt-1">·</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="eyebrow mb-4 !text-[var(--color-ink-muted)]">Not for</div>
            <ul className="space-y-2">
              {[
                "generic personal branding",
                "curiosity-only conversations",
                "vague coaching requests",
                "events that only need moderation",
                "AI hype projects",
                "creative work with no commercial question",
                "people seeking endless exploration without a decision",
              ].map((f) => (
                <li key={f} className="flex items-start gap-3 text-[var(--color-ink-muted)]">
                  <span className="mt-1">·</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* 5. About */}
      <Section divider>
        <div className="grid md:grid-cols-[16rem_1fr] gap-10 md:gap-16">
          <div>
            <h2 className="h-section text-[var(--color-ink)]">Led by Sid Mofya.</h2>
          </div>
          <div className="prose-narrow">
            <p className="text-[var(--color-ink)]">
              Sid Mofya works at the edge of capital and culture.
            </p>
            <p className="text-[var(--color-ink)] mt-4">
              He has led a global venture network, worked across African investment and
              infrastructure ecosystems, advised founders and institutions, built creative worlds,
              and released music through AI-assisted creative practice.
            </p>
            <p className="text-[var(--color-ink)] mt-4">
              His work helps people make the invisible structure visible: the room, the story, the
              trust, the offer, the capital logic, and the next move.
            </p>
            <p className="text-[var(--color-ink-muted)] text-[0.9375rem] mt-6 border-l-2 border-[var(--color-copper)] pl-4">
              Former CEO and Director of Draper Venture Network. Kauffman Fellow. Founder of MOTIF
              54. Builder across Africa&rsquo;s energy, minerals, compute, capital, and culture
              stack.
            </p>
            <div className="mt-8">
              <Link href="/about" className="link-copper font-medium">
                Read More About Sid →
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* 6. Final CTA */}
      <Section divider>
        <div className="max-w-2xl">
          <h2 className="h-section text-[var(--color-ink)]">Bring the live threshold.</h2>
          <p className="mt-5 lede text-[var(--color-ink)]">
            Tell me what you are trying to make clear, protect, design, or move. I will recommend
            the right sprint or say plainly if there is not a fit.
          </p>
          <div className="mt-8">
            <CTAButton href="/work-with-me">Work With Me</CTAButton>
          </div>
        </div>
      </Section>
    </>
  );
}

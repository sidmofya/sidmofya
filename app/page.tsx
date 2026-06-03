import Link from "next/link";
import Section from "@/components/Section";
import CTAButton from "@/components/CTAButton";
import OfferCard from "@/components/OfferCard";
import { visibleOffers } from "@/lib/offers";

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
              I help founders, conveners, and mid-career professionals turn complex transitions
              into clear offers, trusted rooms, and practical next moves.
            </p>
            <p className="mt-5 text-[var(--color-ink-muted)] max-w-2xl">
              The work sits where identity, story, trust, rooms, and action meet.
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

      {/* 2. Speaking bridge */}
      <Section divider>
        <div className="grid md:grid-cols-[18rem_1fr] gap-10 md:gap-16 items-start">
          <div>
            <div className="eyebrow mb-5">Speaking &amp; Executive Briefings</div>
            <h2 className="h-section text-[var(--color-ink)]">The Sovereign Stack</h2>
          </div>
          <div className="prose-narrow">
            <p className="lede text-[var(--color-ink)]">
              I also brief boards, investors, founders, and leadership teams on how AI, energy,
              minerals, compute, capital, culture, and coordination are reshaping power, risk, and
              opportunity.
            </p>
            <p className="mt-5 text-[var(--color-ink-muted)]">
              The next strategic cycle will not be won by leaders who understand software, energy,
              finance, or geopolitics in isolation. It will be won by those who can see the full
              stack.
            </p>
            <p className="mt-5 text-[var(--color-ink-muted)]">
              Available for keynotes, executive briefings, boardroom sessions, investor
              roundtables, leadership offsites, and private strategic rooms.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <CTAButton href="/speaking">Explore Speaking &amp; Briefings</CTAButton>
              <CTAButton href="https://motif54.com" variant="secondary">
                Visit MOTIF 54
              </CTAButton>
            </div>
          </div>
        </div>
      </Section>

      {/* 3. Offers */}
      <Section id="offers" divider>
        <div className="max-w-2xl mb-12 md:mb-16">
          <h2 className="h-section text-[var(--color-ink)]">
            Choose the threshold you are facing.
          </h2>
          <p className="mt-5 text-[var(--color-ink-muted)] lede">
            Each sprint is designed for a live moment where the old language is no longer enough
            and the next move needs to become clear.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {visibleOffers.map((offer, i) => (
            <OfferCard key={offer.slug} offer={offer} index={i} />
          ))}
        </div>
      </Section>

      {/* 4. The work is translation */}
      <Section divider className="text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="h-section text-[var(--color-ink)]">The work is translation.</h2>
          <div className="mt-8 space-y-4 text-[var(--color-ink)] text-lg">
            <p>Some things are powerful before they are legible.</p>
            <p className="text-[var(--color-ink-muted)]">A founder&rsquo;s strange edge.</p>
            <p className="text-[var(--color-ink-muted)]">A room full of possibility.</p>
            <p className="text-[var(--color-ink-muted)]">
              A career chapter that has ended before the next one has fully arrived.
            </p>
            <p className="text-[var(--color-ink-muted)]">
              A story people feel before they know how to trust or buy.
            </p>
            <p className="pt-4">
              My work helps make the invisible structure visible, so the right people can
              understand, trust, and move.
            </p>
          </div>
        </div>
      </Section>

      {/* 5. Built for live thresholds */}
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
                "conveners designing rooms where trust must become action",
                "mid-career professionals facing a meaningful next move",
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
                "career tactics with no deeper decision",
                "endless exploration without a next move",
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

      {/* 6. About */}
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

      {/* 7. Final CTA */}
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

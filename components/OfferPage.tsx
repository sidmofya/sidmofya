import type { Offer } from "@/lib/offers";
import Section from "@/components/Section";
import CTAButton from "@/components/CTAButton";

export default function OfferPage({ offer }: { offer: Offer }) {
  return (
    <>
      {/* Hero */}
      <Section className="!pt-24 md:!pt-28 !pb-16 md:!pb-20">
        <div className="max-w-3xl">
          <div className="eyebrow mb-5">Sprint</div>
          <h1 className="h-hero text-[var(--color-ink)]">{offer.title}</h1>
          <p className="lede mt-6 text-[var(--color-ink-muted)]">{offer.subhead}</p>
          <div className="mt-10">
            <CTAButton href="/work-with-me">Request This Sprint</CTAButton>
          </div>
        </div>
      </Section>

      {/* The pressure */}
      <Section divider className="!py-16 md:!py-24">
        <div className="grid md:grid-cols-[16rem_1fr] gap-10 md:gap-16">
          <div>
            <h2 className="h-section text-[var(--color-ink)]">The pressure</h2>
          </div>
          <div className="prose-narrow text-[var(--color-ink)]">
            {offer.pressure.map((p, i) => (
              <p key={i} className={i === 0 ? "" : "mt-4"}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </Section>

      {/* The better question */}
      <Section divider className="!py-16 md:!py-24">
        <div className="grid md:grid-cols-[16rem_1fr] gap-10 md:gap-16">
          <div>
            <h2 className="h-section text-[var(--color-ink)]">The better question</h2>
          </div>
          <div className="prose-narrow">
            <p className="text-[var(--color-ink-muted)]">Not:</p>
            <p className="font-display text-2xl mt-1 text-[var(--color-ink)]">
              {offer.betterQuestion.not}
            </p>
            <p className="text-[var(--color-ink-muted)] mt-6">The better question is:</p>
            <p className="font-display text-2xl mt-1 text-[var(--color-copper)]">
              {offer.betterQuestion.instead}
            </p>
          </div>
        </div>
      </Section>

      {/* What happens */}
      <Section divider className="!py-16 md:!py-24">
        <div className="grid md:grid-cols-[16rem_1fr] gap-10 md:gap-16">
          <div>
            <h2 className="h-section text-[var(--color-ink)]">What happens</h2>
          </div>
          <div className="prose-narrow text-[var(--color-ink)]">
            <p>{offer.whatHappens.intro}</p>
            <p className="mt-4 text-[var(--color-ink-muted)]">We clarify:</p>
            <ul className="mt-2 space-y-1.5">
              {offer.whatHappens.points.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span className="text-[var(--color-copper)] mt-1">·</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            {offer.whatHappens.note && (
              <p className="mt-6 text-[var(--color-ink-muted)] text-[0.9375rem] border-l-2 border-[var(--color-copper)] pl-4">
                {offer.whatHappens.note}
              </p>
            )}
          </div>
        </div>
      </Section>

      {/* What you leave with */}
      <Section divider className="!py-16 md:!py-24">
        <div className="grid md:grid-cols-[16rem_1fr] gap-10 md:gap-16">
          <div>
            <h2 className="h-section text-[var(--color-ink)]">What you leave with</h2>
          </div>
          <div>
            <ul className="grid sm:grid-cols-2 gap-y-2 gap-x-8">
              {offer.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-3 text-[var(--color-ink)]">
                  <span className="text-[var(--color-copper)] mt-1">·</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Best fit / Not a fit */}
      <Section divider className="!py-16 md:!py-24">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <div>
            <h2 className="h-section mb-3 text-[var(--color-ink)]">Best fit</h2>
            <p className="text-[var(--color-ink-muted)] mb-5">{offer.bestFitIntro}</p>
            <ul className="space-y-1.5">
              {offer.bestFit.map((f) => (
                <li key={f} className="flex items-start gap-3 text-[var(--color-ink)]">
                  <span className="text-[var(--color-copper)] mt-1">·</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="h-section mb-3 text-[var(--color-ink-muted)]">Not a fit</h2>
            <p className="text-[var(--color-ink-muted)] mb-5">{offer.notFitIntro}</p>
            <ul className="space-y-1.5">
              {offer.notFit.map((f) => (
                <li key={f} className="flex items-start gap-3 text-[var(--color-ink-muted)]">
                  <span className="mt-1">·</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <Section divider className="!py-20 md:!py-28">
        <div className="max-w-2xl">
          <h2 className="h-section text-[var(--color-ink)]">{offer.finalCta.headline}</h2>
          <p className="mt-5 text-[var(--color-ink)] lede">{offer.finalCta.copy}</p>
          {offer.ctaNote && (
            <p className="mt-5 text-[0.9375rem] text-[var(--color-ink-muted)] border-l-2 border-[var(--color-copper)] pl-4">
              {offer.ctaNote}
            </p>
          )}
          <div className="mt-8">
            <CTAButton href="/work-with-me">Request This Sprint</CTAButton>
          </div>
        </div>
      </Section>
    </>
  );
}

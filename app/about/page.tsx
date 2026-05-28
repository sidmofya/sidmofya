import type { Metadata } from "next";
import Section from "@/components/Section";
import CTAButton from "@/components/CTAButton";

export const metadata: Metadata = {
  title: "About Sid Mofya",
  description:
    "Sid Mofya works at the edge of capital and culture, helping founders, artists, conveners, and institutions make complex work clearer, more trusted, and commercially active.",
};

const otherWork = [
  {
    title: "MOTIF 54",
    copy: "Capital rooms, Africa, sovereign stack, infrastructure, and investor-facing work.",
    href: "https://motif54.com",
    external: true,
  },
  {
    title: "Sovereign Tea",
    copy: "Writing on capital, culture, AI, Africa, and the maps that are wrong.",
    href: "https://sovereigntea.substack.com",
    external: true,
  },
  {
    title: "54 Worlds",
    copy: "Creative worlds, songs, and experiments in story, sound, and participation.",
    href: "https://54caravan.com",
    external: true,
  },
];

export default function Page() {
  return (
    <>
      {/* Hero */}
      <Section className="!pt-24 md:!pt-28 !pb-16">
        <div className="max-w-3xl">
          <div className="eyebrow mb-5">About</div>
          <h1 className="h-hero text-[var(--color-ink)]">
            I work at the edge of capital and culture.
          </h1>
          <div className="prose-narrow mt-8 text-[var(--color-ink)]">
            <p>My work is about translation.</p>
            <p>Between story and structure.</p>
            <p>Between culture and capital.</p>
            <p>Between the room and the result.</p>
            <p>Between what a person carries and what the market can understand.</p>
            <p className="mt-4">
              I help people make the invisible structure visible, so the right next move becomes
              possible.
            </p>
          </div>
        </div>
      </Section>

      {/* Short bio */}
      <Section divider className="!py-16 md:!py-24">
        <div className="grid md:grid-cols-[16rem_1fr] gap-10 md:gap-16">
          <div>
            <h2 className="h-section text-[var(--color-ink)]">Background</h2>
          </div>
          <div className="prose-narrow text-[var(--color-ink)]">
            <p>
              Sid Mofya is the founder of MOTIF 54 and works across Africa&rsquo;s energy,
              minerals, compute, capital, and culture stack.
            </p>
            <p className="mt-4">
              He previously served as CEO and Director of Draper Venture Network, a global network
              of venture capital firms. He is a Kauffman Fellow and serves across African venture,
              investment, and infrastructure advisory networks.
            </p>
            <p className="mt-4">
              His current work spans focused sprints, convening design, cultural strategy, music,
              writing, and new models for turning trust, story, and creative energy into durable
              value.
            </p>
          </div>
        </div>
      </Section>

      {/* What I help with */}
      <Section divider className="!py-16 md:!py-24">
        <div className="grid md:grid-cols-[16rem_1fr] gap-10 md:gap-16">
          <div>
            <h2 className="h-section text-[var(--color-ink)]">What I help with</h2>
          </div>
          <div>
            <ul className="space-y-2">
              {[
                "making complex founder stories commercially legible",
                "designing rooms that produce outcomes",
                "helping artists and music organizations navigate AI, rights, and fan revenue",
                "clarifying the capital logic inside cultural work",
                "translating intuition into structure",
                "helping people cross thresholds without becoming smaller",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3 text-[var(--color-ink)]">
                  <span className="text-[var(--color-copper)] mt-1">·</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Other parts of the work */}
      <Section divider className="!py-16 md:!py-24">
        <div className="max-w-2xl mb-10">
          <h2 className="h-section text-[var(--color-ink)]">Other parts of the work</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {otherWork.map((w) => (
            <a
              key={w.title}
              href={w.href}
              className="block bg-[var(--color-bg-elev)] border border-[var(--color-rule)] p-7 hover:border-[var(--color-copper)]/60 transition-colors"
              {...(w.external ? { rel: "noopener" } : {})}
            >
              <h3 className="h-card text-[var(--color-ink)] mb-3">{w.title}</h3>
              <p className="text-[var(--color-ink-muted)] text-[0.9375rem]">{w.copy}</p>
              <span className="inline-block mt-4 text-[var(--color-copper)] text-[0.875rem]">
                Visit →
              </span>
            </a>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section divider className="!py-20 md:!py-28">
        <div className="max-w-2xl">
          <h2 className="h-section text-[var(--color-ink)]">Bring the live threshold.</h2>
          <div className="mt-8">
            <CTAButton href="/work-with-me">Work With Me</CTAButton>
          </div>
        </div>
      </Section>
    </>
  );
}

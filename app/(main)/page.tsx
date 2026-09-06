import Image from "next/image";
import Link from "next/link";
import Section from "@/components/Section";
import LatitudeRule from "@/components/LatitudeRule";
import { bodiesOfWork } from "@/lib/bodies-of-work";
import { featuredTestimonial, venues } from "@/lib/speaking";
import { siteConfig } from "@/lib/site";
import PartnerRoomPage from "@/app/partner-room/page";
import { metadata as partnerRoomMetadata } from "@/app/partner-room/layout";

/** What someone can actually buy today. Everything else on the page is context. */
const liveOffers = [
  {
    name: "Partner Room",
    line: "Five venture investors reach a judgment on your company while you listen to the deliberation founders never hear.",
    href: siteConfig.partnerRoomUrl,
    cta: "Partner Room",
    external: true,
  },
  {
    name: "Executive briefings",
    line: "The Sovereign Stack, and facilitation for boards and investment committees with a decision in front of them.",
    href: "/speaking",
    cta: "Speaking & Executive Briefings",
  },
];

const homeMetadata = {
  title: "Sid Mofya | Capital, Infrastructure & Story",
  description:
    "Sid Mofya is a Zambian builder and writer based in Silicon Valley, working across capital, infrastructure and story. He builds through MOTIF 54, publishes through 23° South and imagines through KwaZuri.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Sid Mofya | Capital, Infrastructure & Story",
    description:
      "A Zambian builder and writer working across capital, infrastructure and story.",
    url: "/",
    type: "website",
    images: ["/sid-mofya.jpg"],
  },
};

export function generateMetadata() {
  return process.env.SITE_VARIANT === "partner-room"
    ? partnerRoomMetadata
    : homeMetadata;
}

/** Deliberately different texture per door; the shared grid supplies coherence. */
function doorVisual(name: string) {
  if (name === "MOTIF 54") {
    return (
      <div
        aria-hidden="true"
        className="h-full min-h-[9rem] border border-[var(--color-rule)] bg-[var(--color-bg-elev)] p-6 flex flex-col justify-end gap-2"
      >
        {[92, 68, 44, 24].map((width) => (
          <span
            key={width}
            className="block h-px bg-[color-mix(in_oklab,var(--color-copper)_45%,transparent)]"
            style={{ width: `${width}%` }}
          />
        ))}
      </div>
    );
  }

  if (name === "23° SOUTH") {
    return (
      <div className="h-full min-h-[9rem] border border-[var(--color-rule)] bg-[var(--color-bg-elev)] p-6 flex items-center">
        <LatitudeRule />
      </div>
    );
  }

  // Concentric rings, after the resonance diagrams that recur in the Codex.
  return (
    <div className="h-full min-h-[9rem] border border-[var(--color-rule)] bg-[var(--color-bg-elev)] p-6 flex items-center justify-center">
      <svg
        viewBox="0 0 120 120"
        aria-hidden="true"
        className="h-24 w-24 text-[var(--color-copper)]"
      >
        {[10, 22, 34, 46].map((r, i) => (
          <circle
            key={r}
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity={0.55 - i * 0.11}
          />
        ))}
        <circle cx="60" cy="60" r="2.5" fill="currentColor" opacity="0.6" />
      </svg>
    </div>
  );
}

export default function Home() {
  if (process.env.SITE_VARIANT === "partner-room") {
    return <PartnerRoomPage />;
  }

  return (
    <>
      {/* Still asks for nothing directly. The offers immediately below are the CTA. */}
      <section className="px-6 md:px-10 pt-20 md:pt-32 pb-16 md:pb-24">
        <div className="mx-auto max-w-[72rem]">
          <div className="max-w-3xl">
            <p className="eyebrow mb-6">Sid Mofya</p>
            <h1 className="h-hero text-[var(--color-ink)]">
              Capital. Infrastructure. Story.
            </h1>
            <p className="lede mt-8 max-w-2xl text-[var(--color-ink)]">
              Sid Mofya is a Zambian builder and writer based in Silicon Valley,
              working across capital, infrastructure and story.
            </p>
            <p className="mt-10 text-[0.8125rem] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
              Build · Publish · Imagine
            </p>
          </div>
        </div>
      </section>

      {/* Two live offers. The first thing on the page that can be bought. */}
      <Section divider className="!py-14 md:!py-20">
        <div className="grid gap-10 md:grid-cols-[18rem_1fr] md:gap-16">
          <div>
            <p className="eyebrow">Working with Sid</p>
          </div>
          <div>
            {liveOffers.map((offer) => (
              <div
                key={offer.name}
                className="border-t border-[var(--color-rule)] py-7 first:border-t-0 first:pt-0"
              >
                <h2 className="h-card text-[var(--color-ink)]">{offer.name}</h2>
                <p className="mt-3 max-w-2xl text-[var(--color-ink-muted)]">
                  {offer.line}
                </p>
                <p className="mt-4">
                  {offer.external ? (
                    <a
                      href={offer.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-copper font-medium"
                    >
                      {offer.cta} ↗
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  ) : (
                    <Link href={offer.href} className="link-copper font-medium">
                      {offer.cta} →
                    </Link>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* The three doors: the wider body of work, below the offers. */}
      <section className="px-6 md:px-10 pt-8 pb-8">
        <div className="mx-auto max-w-[72rem]">
          {bodiesOfWork.map((work, index) => (
            <article
              key={work.name}
              className="border-t border-[var(--color-rule)] py-12 md:py-16 grid gap-8 md:grid-cols-[1fr_22rem] md:gap-16 md:items-center"
            >
              <div>
                <p className="eyebrow mb-5">
                  {String(index + 1).padStart(2, "0")} / {work.mode}
                </p>
                <h2 className="h-section text-[var(--color-ink)]">{work.name}</h2>
                <p className="lede mt-5 max-w-xl text-[var(--color-ink-muted)]">
                  {work.copy}
                </p>
                {work.name === "23° SOUTH" && (
                  <p className="mt-4 max-w-xl text-[0.9375rem] text-[var(--color-ink-muted)]">
                    Capital. Sovereignty. Technology. Culture. Institutions. The future.
                  </p>
                )}
                <p className="mt-8">
                  {work.external ? (
                    <a
                      href={work.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-copper font-medium"
                    >
                      {work.cta} ↗<span className="sr-only">(opens in a new tab)</span>
                    </a>
                  ) : (
                    <Link href={work.href} className="link-copper font-medium">
                      {work.cta} →
                    </Link>
                  )}
                </p>
              </div>

              <div className="order-first md:order-last">{doorVisual(work.name)}</div>
            </article>
          ))}
        </div>
      </section>

      {/* Rooms held: the proof, lifted from /speaking so both read one source. */}
      <Section divider>
        <div className="grid gap-10 md:grid-cols-[18rem_1fr] md:gap-16">
          <div>
            <p className="eyebrow mb-5">Rooms held</p>
          </div>
          <div>
            <div className="text-[0.8125rem] tracking-wider text-[var(--color-ink-muted)]">
              {venues.map((venue, i) => (
                <span key={venue}>
                  {i > 0 && (
                    <span className="mx-2 text-[var(--color-rule)]" aria-hidden="true">
                      |
                    </span>
                  )}
                  {venue}
                </span>
              ))}
            </div>

            <figure className="mt-8 border border-[var(--color-rule)] bg-[var(--color-bg-elev)] p-7 md:p-8">
              <blockquote className="text-[var(--color-ink)]">
                {featuredTestimonial.quote}
              </blockquote>
              <figcaption className="mt-5 border-t border-[var(--color-rule)] pt-4 text-[0.9375rem] text-[var(--color-ink-muted)]">
                <span className="text-[var(--color-ink)]">{featuredTestimonial.name}</span>,{" "}
                {featuredTestimonial.title}
              </figcaption>
            </figure>
          </div>
        </div>
      </Section>

      <Section divider>
        <div className="grid gap-10 md:grid-cols-[20rem_1fr] md:gap-16">
          <div>
            <h2 className="eyebrow mb-5">About</h2>
            <Image
              src="/sid-mofya.jpg"
              alt="Sid Mofya"
              width={640}
              height={800}
              sizes="(min-width: 768px) 20rem, 100vw"
              className="w-full max-w-xs aspect-[4/5] object-cover object-top"
            />
          </div>
          <div className="prose-narrow text-[var(--color-ink)]">
            <p>
              Sid Mofya is a Zambian builder, writer and former venture executive
              based in Silicon Valley. He works across capital, infrastructure and
              story.
            </p>
            <p>
              He is the founder of MOTIF 54 and creator of KwaZuri. His work spans
              African energy, critical minerals, AI infrastructure, venture capital,
              institutional decision-making and cultural worldbuilding.
            </p>
            <p>
              Previously, he served as Executive Director of the Draper Venture
              Network, and as a Technologist at Royal Dutch Shell. He is a Kauffman
              Fellow and trained as a chemical engineer.
            </p>
            <p className="!mt-8">
              <Link href="/about" className="link-copper font-medium">
                More about Sid →
              </Link>
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}

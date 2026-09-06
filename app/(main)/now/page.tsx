import type { Metadata } from "next";
import Link from "next/link";
import Section from "@/components/Section";
import { nowEntries, nowLastUpdated } from "@/lib/now-entries";
import { siteConfig } from "@/lib/site";

const description =
  "What Sid Mofya is working on right now, across Partner Room, executive briefings, MOTIF 54, CopperCloud, KwaZuri and 23° South.";

export const metadata: Metadata = {
  title: "Now | Sid Mofya",
  description,
  alternates: { canonical: "/now" },
  openGraph: {
    title: "Now | Sid Mofya",
    description,
    url: "/now",
    type: "website",
    images: ["/sid-mofya.jpg"],
  },
};

/**
 * Deliberately flat. Every entry gets the same weight, whether it earns money
 * or not — that equivalence is the argument the page is making. Edit the
 * entries in lib/now-entries.ts; this file only renders them.
 */
export default function Page() {
  return (
    <>
      <Section className="!pt-20 md:!pt-28 !pb-8">
        <div className="max-w-3xl">
          <h1 className="h-hero text-[var(--color-ink)]">Now</h1>
          <p className="lede mt-6 text-[var(--color-ink)]">
            What&rsquo;s live right now. Last update{" "}
            <span className="text-[var(--color-copper)]">{nowLastUpdated}</span>.
          </p>
        </div>
      </Section>

      <Section className="!pt-0 !pb-16 md:!pb-20">
        <div className="max-w-3xl">
          {nowEntries.map((entry) => (
            <article
              key={entry.title}
              className="border-t border-[var(--color-rule)] py-9 md:py-11"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
                <h2 className="h-card text-[var(--color-ink)]">{entry.title}</h2>
                <p className="text-[0.8125rem] uppercase tracking-[0.14em] text-[var(--color-ink-muted)] sm:text-right sm:shrink-0">
                  {entry.status}
                </p>
              </div>

              <p className="mt-4 text-[var(--color-ink)]">{entry.body}</p>

              {(entry.href || entry.note) && (
                <p className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-2">
                  {entry.href &&
                    (entry.external ? (
                      <a
                        href={entry.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-copper font-medium"
                      >
                        {entry.linkLabel} ↗
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    ) : (
                      <Link href={entry.href} className="link-copper font-medium">
                        {entry.linkLabel} →
                      </Link>
                    ))}
                  {entry.note && (
                    <span className="text-[0.9375rem] text-[var(--color-ink-muted)]">
                      {entry.note}
                    </span>
                  )}
                </p>
              )}
            </article>
          ))}
        </div>
      </Section>

      <Section divider className="!py-14 md:!py-16">
        <p className="max-w-2xl text-[var(--color-ink)]">
          If something here is close to a question you are sitting with, reach out at{" "}
          <a href={`mailto:${siteConfig.contactEmail}`} className="link-copper">
            {siteConfig.contactEmail}
          </a>
          .
        </p>
      </Section>
    </>
  );
}

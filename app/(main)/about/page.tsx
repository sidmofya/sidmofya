import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Section from "@/components/Section";
import { bodiesOfWork } from "@/lib/bodies-of-work";
import { now } from "@/lib/now";

const description =
  "Sid Mofya is a Zambian builder, writer and former venture executive based in Silicon Valley. He works across capital, infrastructure and story.";

export const metadata: Metadata = {
  title: "About Sid Mofya",
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Sid Mofya",
    description,
    url: "/about",
    type: "profile",
    images: ["/sid-mofya.jpg"],
  },
};

const background = [
  { org: "MOTIF 54", role: "Founder" },
  { org: "Draper Venture Network", role: "Executive Director" },
  { org: "Royal Dutch Shell", role: "Technologist" },
  { org: "Kauffman Fellows", role: "Kauffman Fellow" },
  { org: "University of Sheffield", role: "Chemical Engineering" },
];

export default function Page() {
  return (
    <>
      <Section className="!pt-20 md:!pt-28 !pb-16 md:!pb-20">
        <div className="grid gap-10 md:grid-cols-[20rem_1fr] md:gap-16">
          <div>
            <Image
              src="/sid-mofya.jpg"
              alt="Sid Mofya"
              width={640}
              height={800}
              priority
              sizes="(min-width: 768px) 20rem, 100vw"
              className="w-full aspect-[4/5] object-cover object-top"
            />
          </div>
          <div>
            <h1 className="h-hero text-[var(--color-ink)]">Sid Mofya</h1>
            <div className="prose-narrow mt-8 text-[var(--color-ink)]">
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
            </div>
          </div>
        </div>
      </Section>

      <Section divider>
        <h2 className="eyebrow mb-10">The work</h2>
        <div>
          {bodiesOfWork.map((work) => (
            <article
              key={work.name}
              className="border-t border-[var(--color-rule)] py-9 md:py-12 grid gap-4 md:grid-cols-[10rem_1fr_auto] md:gap-12 md:items-baseline"
            >
              <p className="text-[0.8125rem] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
                {work.mode}
              </p>
              <div>
                <h3 className="h-card text-[var(--color-ink)]">{work.name}</h3>
                <p className="mt-2 text-[var(--color-ink-muted)]">{work.aboutCopy}</p>
              </div>
              {work.external ? (
                <a
                  href={work.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-copper font-medium whitespace-nowrap"
                >
                  {work.cta} ↗<span className="sr-only">(opens in a new tab)</span>
                </a>
              ) : (
                <Link
                  href={work.href}
                  className="link-copper font-medium whitespace-nowrap"
                >
                  {work.cta} →
                </Link>
              )}
            </article>
          ))}
        </div>
      </Section>

      <Section divider>
        <div className="grid gap-8 md:grid-cols-[18rem_1fr] md:gap-16">
          <h2 className="eyebrow">Background</h2>
          <dl className="max-w-2xl">
            {background.map((entry) => (
              <div
                key={entry.org}
                className="border-t border-[var(--color-rule)] py-5 grid gap-1 sm:grid-cols-2 sm:gap-8"
              >
                <dt className="text-[0.9375rem] uppercase tracking-[0.12em] text-[var(--color-ink)]">
                  {entry.org}
                </dt>
                <dd className="text-[var(--color-ink-muted)]">{entry.role}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Section divider className="!pb-24 md:!pb-32">
        <div className="grid gap-8 md:grid-cols-[18rem_1fr] md:gap-16">
          <h2 className="eyebrow">Now</h2>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {now.map((group) => (
              <div key={group.heading}>
                <h3 className="text-[0.8125rem] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
                  {group.heading}
                </h3>
                <ul className="mt-4 space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="text-[var(--color-ink)]">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import Section from "@/components/Section";
import ContactForm from "@/components/ContactForm";
import { mainSiteShareImage, siteConfig } from "@/lib/site";

const description =
  "Get in touch about speaking and executive briefings, capital and industrial partnerships, CopperCloud, original research or KwaZuri.";

export const metadata: Metadata = {
  title: "Contact | Sid Mofya",
  description,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | Sid Mofya",
    description,
    url: "/contact",
    type: "website",
    images: [mainSiteShareImage],
  },
};

const doors = [
  {
    label: "Capital and industrial partnerships",
    cta: "MOTIF 54",
    href: siteConfig.motif54Url,
    external: true,
  },
  {
    label: "Speaking and executive briefings",
    cta: "Speaking",
    href: "/speaking",
  },
  { label: "Energy and compute infrastructure", cta: "CopperCloud", href: siteConfig.copperCloudUrl, external: true },
  { label: "KwaZuri", cta: "KwaZuri", href: "/kwazuri" },
];

export default function Page() {
  return (
    <>
      <Section className="!pt-20 md:!pt-28 !pb-12">
        <div className="max-w-3xl">
          <p className="eyebrow mb-6">Contact</p>
          <h1 className="h-hero text-[var(--color-ink)]">Find the right door.</h1>
        </div>
      </Section>

      <Section className="!pt-4 !pb-16">
        <div className="max-w-3xl">
          {doors.map((door) => (
            <div
              key={door.cta}
              className="border-t border-[var(--color-rule)] py-7 grid gap-2 sm:grid-cols-[1fr_auto] sm:gap-10 sm:items-baseline"
            >
              <p className="text-[var(--color-ink)]">{door.label}</p>
              {door.external ? (
                <a
                  href={door.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-copper font-medium whitespace-nowrap"
                >
                  {door.cta} ↗<span className="sr-only">(opens in a new tab)</span>
                </a>
              ) : (
                <Link
                  href={door.href}
                  className="link-copper font-medium whitespace-nowrap"
                >
                  {door.cta} →
                </Link>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section divider className="!pb-24 md:!pb-32">
        <div className="grid gap-8 md:grid-cols-[18rem_1fr] md:gap-16">
          <h2 className="eyebrow">Something else</h2>
          <div>
            <p className="mb-8 max-w-xl text-[var(--color-ink-muted)]">
              Or email{" "}
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="link-copper"
              >
                {siteConfig.contactEmail}
              </a>
              .
            </p>
            <ContactForm />
          </div>
        </div>
      </Section>
    </>
  );
}

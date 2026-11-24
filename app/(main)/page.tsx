import Image from "next/image";
import Link from "next/link";
import Section from "@/components/Section";
import CTAButton from "@/components/CTAButton";
import { bodiesOfWork } from "@/lib/bodies-of-work";
import { featuredTestimonial, venues } from "@/lib/speaking";
import { mainSiteShareImage, siteConfig } from "@/lib/site";
import PartnerRoomPage from "@/app/partner-room/page";
import { metadata as partnerRoomMetadata } from "@/app/partner-room/layout";

const description =
  "Sid Mofya is a Zambian builder and strategist based in Silicon Valley, working across capital, energy, minerals and technology, with a particular interest in Africa's place in the next industrial economy.";

const homeMetadata = {
  title: "Sid Mofya | Capital, Infrastructure & Story",
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Sid Mofya | Capital, Infrastructure & Story",
    description,
    url: "/",
    type: "website",
    images: [mainSiteShareImage],
  },
};

export function generateMetadata() {
  return process.env.SITE_VARIANT === "partner-room"
    ? partnerRoomMetadata
    : homeMetadata;
}

const research = bodiesOfWork.filter((work) => work.mode === "UNDERSTAND");
const ventures = bodiesOfWork.filter((work) => work.mode === "BUILD");
const creative = bodiesOfWork.filter((work) => work.mode === "IMAGINE");

export default function Home() {
  if (process.env.SITE_VARIANT === "partner-room") {
    return <PartnerRoomPage />;
  }

  return (
    <>
      {/* 01 / The worldview */}
      <Section className="!pt-24 md:!pt-28 !pb-14 md:!pb-20">
        <div className="grid items-center gap-10 md:grid-cols-[1.35fr_0.65fr] md:gap-16">
          <div className="max-w-2xl">
            <p className="eyebrow mb-5">Sid Mofya</p>
            <h1 className="h-hero text-[var(--color-ink)]">
              How the next economy gets built.
            </h1>
            <p className="lede mt-6 text-[var(--color-ink)]">
              I work across capital, energy, minerals and technology, with a
              particular interest in Africa&apos;s place in the emerging industrial economy.
            </p>
            <p className="mt-5 max-w-xl text-[var(--color-ink-muted)]">
              My work is informed by industrial operating experience, global venture
              capital and the conviction that the future is something we participate in building.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CTAButton href="#work">Explore my Work</CTAButton>
              <CTAButton href="#working-with-sid" variant="secondary">Working with me</CTAButton>
            </div>
            <p className="mt-7 text-sm text-[var(--color-ink-muted)]">
              Capital. Infrastructure. Story.
            </p>
          </div>
          <Image
            src="/sid-mofya.jpg"
            alt="Sid Mofya"
            width={640}
            height={800}
            priority
            sizes="(min-width: 768px) 35vw, 100vw"
            className="mx-auto w-full max-w-[19rem] md:max-w-none aspect-[4/5] object-cover object-top"
          />
        </div>
        <p className="mt-10 border-t border-[var(--color-rule)] pt-5 text-sm leading-relaxed text-[var(--color-ink-muted)]">
          Former Shell technologist · Former Executive Director, Draper Venture Network ·
          Founder, MOTIF 54 · Co-founder, CopperCloud · Kauffman Fellow
        </p>
      </Section>

      {/* 02 / Understand */}
      <Section divider id="work" className="!py-14 md:!py-20 bg-[var(--color-bg-elev)] scroll-mt-20">
        <p className="eyebrow mb-4">Understand · Original research</p>
        <h2 className="h-section text-[var(--color-ink)]">Understanding the world</h2>
        <div className="mt-8 grid gap-4">
          {research.map((work) => (
            <article key={work.name} className="grid border border-[var(--color-rule)] bg-[var(--color-bg)] md:grid-cols-[0.7fr_1.3fr]">
              <div className="flex min-h-44 flex-col justify-center border-b border-[var(--color-rule)] p-7 md:border-b-0 md:border-r md:p-9">
                <p className="eyebrow">{work.descriptor}</p>
                <p className="mt-3 font-display text-6xl leading-none tracking-tight text-[var(--color-copper)] md:text-7xl">
                  {work.marker}
                </p>
                <p className="mt-4 text-sm text-[var(--color-ink-muted)]">{work.scope}</p>
              </div>
              <div className="p-7 md:p-9">
                <h3 className="h-card text-[var(--color-ink)]">{work.name}</h3>
                <p className="mt-4 max-w-lg text-[var(--color-ink-muted)]">{work.copy}</p>
                <div className="mt-6">
                  <CTAButton href={work.href} variant="secondary" newTab>{work.cta}</CTAButton>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* 03 / Build */}
      <Section divider className="!py-14 md:!py-20">
        <p className="eyebrow mb-4">Build · Active ventures</p>
        <h2 className="h-section text-[var(--color-ink)]">Building in the world</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {ventures.map((work) => (
            <article key={work.name} className="flex flex-col border border-[var(--color-rule)] p-7 md:p-9">
              <h3 className="h-card text-[var(--color-ink)]">{work.name}</h3>
              <p className="mt-4 text-[var(--color-ink-muted)]">{work.copy}</p>
              <div className="mt-auto pt-6">
                <CTAButton href={work.href} variant="secondary" newTab>{work.cta}</CTAButton>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* 04 / Engagement */}
      <Section divider id="working-with-sid" className="!py-14 md:!py-20 scroll-mt-20">
        <h2 className="h-section text-[var(--color-ink)]">Working with me</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <article className="flex flex-col border border-[var(--color-copper)] p-7 md:p-9">
            <p className="eyebrow mb-4">Speaking &amp; executive briefings</p>
            <h3 className="h-card text-[var(--color-ink)]">Bring the real question.</h3>
            <p className="mt-4 text-[var(--color-ink-muted)]">
              Keynotes, strategic briefings and private decision rooms for investors,
              boards and leadership teams navigating a changing world.
            </p>
            <div className="mt-auto pt-6">
              <CTAButton href="/speaking">Explore speaking and briefings</CTAButton>
            </div>
          </article>
          <article className="flex flex-col border border-[var(--color-rule)] p-7 md:p-9">
            <p className="eyebrow mb-4">Capital &amp; industrial partnerships</p>
            <h3 className="h-card text-[var(--color-ink)]">Build with the right partners.</h3>
            <p className="mt-4 text-[var(--color-ink-muted)]">
              I work with partners on energy, minerals, infrastructure and capital
              formation, particularly in Africa.
            </p>
            <div className="mt-auto pt-6">
              <CTAButton href={siteConfig.motif54Url} variant="secondary" newTab>Explore MOTIF 54</CTAButton>
            </div>
          </article>
        </div>
      </Section>

      {/* 05 / Imagine */}
      <Section divider className="!py-14 md:!py-20 bg-[var(--color-bg-elev)]">
        <p className="eyebrow mb-4">Imagine · Creative work</p>
        <h2 className="h-section text-[var(--color-ink)]">Imagining other worlds</h2>
        {creative.map((work) => (
          <article key={work.name} className="mt-8 grid items-center gap-6 border border-[var(--color-rule)] bg-[var(--color-bg)] p-7 md:grid-cols-[1fr_12rem] md:p-9">
            <div>
              <h3 className="h-card text-[var(--color-ink)]">{work.name}</h3>
              <p className="mt-4 max-w-lg text-[var(--color-ink-muted)]">{work.copy}</p>
              <div className="mt-6">
                <CTAButton href={work.href} variant="secondary">{work.cta}</CTAButton>
              </div>
            </div>
            <svg viewBox="0 0 120 120" aria-hidden="true" className="mx-auto h-28 w-28 text-[var(--color-copper)]">
              {[10, 22, 34, 46].map((r, i) => (
                <circle key={r} cx="60" cy="60" r={r} fill="none" stroke="currentColor" strokeWidth="1" opacity={0.65 - i * 0.12} />
              ))}
              <circle cx="60" cy="60" r="2.5" fill="currentColor" />
            </svg>
          </article>
        ))}
      </Section>

      {/* 06 / About and independent evidence */}
      <Section divider className="!py-14 md:!py-20">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <h2 className="h-section text-[var(--color-ink)]">About</h2>
            <p className="mt-5 text-[var(--color-ink-muted)]">
              I am a Zambian builder and strategist based in Silicon Valley. I trained as
              a chemical engineer and have worked across industrial operations,
              global venture capital and emerging markets.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
              <Link href="/about" className="link-copper font-medium">More about me</Link>
              <Link href="/now" className="link-copper font-medium">What I am working on now</Link>
            </div>
            <h3 className="eyebrow mt-8 mb-3">Previous rooms</h3>
            <p className="text-sm leading-relaxed text-[var(--color-ink-muted)]">{venues.join(" · ")}</p>
          </div>
          <figure className="flex flex-col border border-[var(--color-rule)] bg-[var(--color-bg-elev)] p-7 md:p-9">
            <blockquote className="text-[var(--color-ink)]">{featuredTestimonial.quote}</blockquote>
            <figcaption className="mt-auto pt-5 text-sm text-[var(--color-ink-muted)]">
              <span className="font-medium text-[var(--color-ink)]">{featuredTestimonial.name}</span>
              {", "}{featuredTestimonial.title}
            </figcaption>
          </figure>
        </div>
      </Section>
    </>
  );
}

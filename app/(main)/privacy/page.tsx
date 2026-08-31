import type { Metadata } from "next";
import Link from "next/link";
import Section from "@/components/Section";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy | Sid Mofya",
  description:
    "What sidmofya.com collects, why, and how to have it removed.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <>
      <Section className="!pt-20 md:!pt-28 !pb-10">
        <div className="max-w-3xl">
          <p className="eyebrow mb-6">Privacy</p>
          <h1 className="h-hero text-[var(--color-ink)]">
            What this site collects.
          </h1>
          <p className="lede mt-8 text-[var(--color-ink)]">
            Short version: nothing except what you type into a form, plus
            anonymous page counts.
          </p>
        </div>
      </Section>

      <Section className="!pt-6 !pb-24 md:!pb-32">
        <div className="prose-narrow text-[var(--color-ink)]">
          <h2 className="h-card !mt-0 mb-3">Forms</h2>
          <p>
            This site has four forms. Each one collects only the fields shown on
            screen when you submit it:
          </p>
          <ul className="mt-4 space-y-2 list-disc pl-5">
            <li>
              <strong>Request this work</strong> (23° South): name, email, and
              optionally your organization, along with which piece of work you
              asked for.
            </li>
            <li>
              <strong>KwaZuri</strong>: your email address.
            </li>
            <li>
              <strong>Request a briefing</strong> (Speaking): name, email,
              organization, and whatever you choose to write about the room, the
              audience, timing and the decision in play.
            </li>
            <li>
              <strong>Contact</strong>: name, email and your message.
            </li>
          </ul>
          <p className="mt-4">
            Submissions are processed and stored by Netlify, which hosts this
            site, and are read by Sid Mofya. They are used to reply to you and,
            where you asked for something, to send it.
          </p>

          <h2 className="h-card mb-3">KwaZuri signups are kept separate</h2>
          <p>
            If you leave your email on the KwaZuri page, that permission is scoped
            to KwaZuri: launch news and occasional glimpses from the Living Codex.
            It is stored separately from other enquiries and is not added to
            MOTIF 54 marketing, speaking outreach, Sovereign Tea, or any general
            mailing list.
          </p>

          <h2 className="h-card mb-3">Analytics</h2>
          <p>
            This site uses Plausible for aggregate traffic measurement: page
            views, referrers and broad country-level location. Plausible sets no
            cookies, does not track you across sites, and does not collect
            personal data. There is no advertising or behavioural tracking on
            this site.
          </p>

          <h2 className="h-card mb-3">Third parties</h2>
          <p>
            The Speaking page embeds a talk from YouTube using their
            privacy-enhanced player, which loads only when you play the video.
            Links marked ↗ lead to other sites — MOTIF 54, LinkedIn — each
            governed by its own privacy policy, not this one.
          </p>

          <h2 className="h-card mb-3">Retention and removal</h2>
          <p>
            Form submissions are kept for as long as they are useful for the
            conversation you started. To see what is held about you, correct it,
            or have it deleted, email{" "}
            <a href={`mailto:${siteConfig.contactEmail}`} className="link-copper">
              {siteConfig.contactEmail}
            </a>{" "}
            and it will be actioned.
          </p>

          <p className="!mt-10 text-[0.875rem] text-[var(--color-ink-muted)]">
            This page describes how the site actually behaves. It is not legal
            advice. If anything here is unclear, ask via{" "}
            <Link href="/contact" className="link-copper">
              contact
            </Link>
            .
          </p>
        </div>
      </Section>
    </>
  );
}

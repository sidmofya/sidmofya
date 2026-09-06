import type { Metadata } from "next";
import Link from "next/link";
import Section from "@/components/Section";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms | Sid Mofya",
  description:
    "The terms that govern use of sidmofya.com, and what this site is and is not.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

// Adapted from the MOTIF 54 terms. Same contracting entity (CXB Ventures LLC),
// different site and scope. Reviewed by Sid, not by counsel — see /privacy for
// the companion policy.
export default function Page() {
  return (
    <>
      <Section className="!pt-20 md:!pt-28 !pb-10">
        <div className="max-w-3xl">
          <p className="eyebrow mb-6">Terms</p>
          <h1 className="h-hero text-[var(--color-ink)]">
            What this site is, and is not.
          </h1>
          <p className="lede mt-8 text-[var(--color-ink)]">
            Short version: this is an information site. Nothing on it is advice,
            an offer, or a commitment, and reading it does not start a working
            relationship.
          </p>
        </div>
      </Section>

      <Section className="!pt-6 !pb-24 md:!pb-32">
        <div className="prose-narrow text-[var(--color-ink)]">
          <h2 className="h-card !mt-0 mb-3">Who operates this site</h2>
          <p>
            sidmofya.com is operated by CXB Ventures LLC, a California limited
            liability company. &ldquo;We&rdquo; and &ldquo;us&rdquo; below mean
            that company. Partner Room and MOTIF 54 are operated by the same
            entity.
          </p>

          <h2 className="h-card mb-3">This is not professional advice</h2>
          <p>
            Nothing on this site is legal, tax, accounting, engineering,
            technical, investment, securities, financial or other regulated
            professional advice. Nothing here is an offer to sell or a
            solicitation to buy any security or interest in any fund, project or
            transaction.
          </p>

          <h2 className="h-card mb-3">Using the site starts nothing</h2>
          <p>
            Reading this site, downloading something from it, or sending a form
            does not create an advisory, fiduciary, agency or
            investment-management relationship. Engagements begin only under a
            separate written agreement signed by both sides.
          </p>

          <h2 className="h-card mb-3">Forward-looking statements</h2>
          <p>
            Descriptions of projects, markets, rooms and outcomes involve
            estimates, judgment and expectations about the future. Actual results
            may differ materially from anything described here.
          </p>

          <h2 className="h-card mb-3">Accuracy</h2>
          <p>
            We aim to keep this site accurate and current, but we do not warrant
            that it is accurate, complete, current, reliable or free from error.
            Content can change or be removed without notice.
          </p>

          <h2 className="h-card mb-3">What you send us</h2>
          <p>
            Sending information through a form on this site does not oblige us to
            evaluate an opportunity, respond, or treat what you sent as
            confidential. Please do not send anything genuinely confidential
            through a general form. Where confidentiality matters, agree it in
            writing with us first. What the forms collect and how it is handled
            is set out in the{" "}
            <Link href="/privacy" className="link-copper">
              privacy policy
            </Link>
            .
          </p>

          <h2 className="h-card mb-3">Intellectual property</h2>
          <p>
            The writing, frameworks, diagrams and design on this site belong to
            us or to the people credited. You may read them and share them for
            personal or internal use. Republishing, redistributing or building a
            product on them needs written permission first.
          </p>

          <h2 className="h-card mb-3">Acceptable use</h2>
          <p>
            Do not interfere with how the site runs, attempt unauthorised access,
            upload anything malicious, submit unlawful content, or impersonate
            anyone through the forms.
          </p>

          <h2 className="h-card mb-3">Liability</h2>
          <p>
            To the extent the law allows, we are not liable for indirect,
            incidental, consequential or punitive damages arising from your use
            of this site or anything you relied on here.
          </p>

          <h2 className="h-card mb-3">Indemnification</h2>
          <p>
            If your unlawful use of this site, or your breach of these terms,
            causes a claim against us, you agree to cover the resulting costs.
          </p>

          <h2 className="h-card mb-3">Governing law</h2>
          <p>
            These terms are governed by the laws of the State of California,
            without regard to its conflict-of-laws rules.
          </p>

          <h2 className="h-card mb-3">Changes</h2>
          <p>
            These terms may change. The version published here is the one that
            applies.
          </p>

          <h2 className="h-card mb-3">Contact</h2>
          <p>
            Questions about these terms go to{" "}
            <a href={`mailto:${siteConfig.contactEmail}`} className="link-copper">
              {siteConfig.contactEmail}
            </a>
            .
          </p>

          <p className="!mt-10 text-[0.875rem] text-[var(--color-ink-muted)]">
            This page is written in plain language and is not legal advice. If
            anything here is unclear, ask via{" "}
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

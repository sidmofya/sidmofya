import Link from "next/link";
import { currentYear, siteConfig } from "@/lib/site";

const linkClass =
  "uppercase tracking-[0.12em] text-[0.8125rem] text-[var(--color-ink)] hover:text-[var(--color-copper)] transition-colors";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-rule)] mt-10">
      <div className="mx-auto max-w-[72rem] px-6 md:px-10 py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] items-start">
          <Link
            href="/"
            className="font-display text-2xl md:text-3xl uppercase tracking-[0.08em] text-[var(--color-ink)]"
          >
            Sid Mofya
          </Link>

          {/* The fuller map. The nav carries the offers; this keeps 23° South
              and KwaZuri discoverable without putting them beside the offers. */}
          <nav className="grid grid-cols-2 gap-x-12 gap-y-3">
            <a
              href={siteConfig.partnerRoomUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              Partner Room <span aria-hidden="true">↗</span>
            </a>
            <Link href="/speaking" className={linkClass}>
              Speaking
            </Link>
            <Link href="/now" className={linkClass}>
              Now
            </Link>
            <Link href="/about" className={linkClass}>
              About
            </Link>
            <Link href="/23-south" className={linkClass}>
              23° South
            </Link>
            <Link href="/kwazuri" className={linkClass}>
              KwaZuri
            </Link>
            <a
              href={siteConfig.motif54Url}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              MOTIF 54 <span aria-hidden="true">↗</span>
            </a>
            <a
              href={siteConfig.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
          </nav>
        </div>

        <hr className="rule mt-12" />

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.8125rem] text-[var(--color-ink-muted)]">
          <span>&copy; {currentYear()} Sid Mofya</span>
          <Link href="/privacy" className="hover:text-[var(--color-copper)]">
            Privacy
          </Link>
          <Link href="/contact" className="hover:text-[var(--color-copper)]">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}

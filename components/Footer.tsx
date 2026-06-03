import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-rule)] mt-10">
      <div className="mx-auto max-w-[72rem] px-6 md:px-10 py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] items-start">
          <div className="prose-narrow">
            <p className="font-display text-2xl md:text-3xl leading-tight text-[var(--color-ink)]">
              For capital-facing work, visit{" "}
              <a href="https://motif54.com" className="link-copper" rel="noopener">
                MOTIF 54
              </a>
              .
            </p>
            <p className="mt-3 text-[var(--color-ink-muted)]">
              This site is the culture register. MOTIF 54 is the capital register.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-10 gap-y-2 text-[0.9375rem]">
            <a href="https://motif54.com" className="text-[var(--color-ink)] hover:text-[var(--color-copper)]" rel="noopener">
              MOTIF 54
            </a>
            <a href="https://54worlds.com" className="text-[var(--color-ink)] hover:text-[var(--color-copper)]" rel="noopener">
              54 Worlds
            </a>
            <a href="https://www.linkedin.com/in/sidmofya" className="text-[var(--color-ink)] hover:text-[var(--color-copper)]" rel="noopener">
              LinkedIn
            </a>
            <Link href="/speaking" className="text-[var(--color-ink)] hover:text-[var(--color-copper)]">
              Speaking
            </Link>
            <a href="mailto:sid.mofya@gmail.com" className="text-[var(--color-ink)] hover:text-[var(--color-copper)]">
              Contact
            </a>
            <Link href="/work-with-me" className="text-[var(--color-ink)] hover:text-[var(--color-copper)]">
              Work With Me
            </Link>
          </nav>
        </div>

        <hr className="rule mt-12" />

        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-[0.8125rem] text-[var(--color-ink-muted)]">
          <span>&copy; {new Date().getFullYear()} Sid Mofya</span>
          <span>Culture register, v0.1</span>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-[6px] bg-[color-mix(in_oklab,var(--color-bg)_88%,transparent)] border-b border-[var(--color-rule)]/60">
      <nav className="mx-auto max-w-[72rem] px-6 md:px-10 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-lg md:text-xl tracking-tight text-[var(--color-ink)]"
        >
          Sid Mofya
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8 text-[0.9375rem]">
          <details className="group relative">
            <summary className="list-none cursor-pointer select-none flex items-center gap-1 text-[var(--color-ink)] hover:text-[var(--color-copper)]">
              Work
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" className="opacity-60">
                <path d="M2 3.5 L5 6.5 L8 3.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
              </svg>
            </summary>
            <div className="absolute right-0 mt-3 min-w-[18rem] border border-[var(--color-rule)] bg-[var(--color-bg-elev)] shadow-sm">
              <Link
                href="/market-legibility"
                className="block px-5 py-3 hover:bg-[var(--color-bg)] border-b border-[var(--color-rule)]"
              >
                Market Legibility Sprint
              </Link>
              <Link
                href="/room-to-results"
                className="block px-5 py-3 hover:bg-[var(--color-bg)] border-b border-[var(--color-rule)]"
              >
                Room-to-Results Sprint
              </Link>
              <Link
                href="/ai-music-rights"
                className="block px-5 py-3 hover:bg-[var(--color-bg)]"
              >
                AI Music Rights &amp; Fan Revenue Sprint
              </Link>
            </div>
          </details>

          <Link href="/about" className="text-[var(--color-ink)] hover:text-[var(--color-copper)]">
            About
          </Link>

          <Link href="/work-with-me" className="btn btn-primary !py-2 !px-4 text-[0.875rem]">
            Work With Me
          </Link>
        </div>

        {/* Mobile nav */}
        <details className="md:hidden relative">
          <summary className="list-none cursor-pointer p-2 -mr-2" aria-label="Menu">
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
              <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            </svg>
          </summary>
          <div className="fixed inset-x-0 top-16 bg-[var(--color-bg)] border-t border-[var(--color-rule)] px-6 py-6">
            <div className="flex flex-col gap-1">
              <div className="eyebrow mb-2">Work</div>
              <Link href="/market-legibility" className="py-2 text-[var(--color-ink)]">
                Market Legibility Sprint
              </Link>
              <Link href="/room-to-results" className="py-2 text-[var(--color-ink)]">
                Room-to-Results Sprint
              </Link>
              <Link href="/ai-music-rights" className="py-2 text-[var(--color-ink)]">
                AI Music Rights &amp; Fan Revenue Sprint
              </Link>
              <hr className="rule my-4" />
              <Link href="/about" className="py-2 text-[var(--color-ink)]">
                About
              </Link>
              <Link href="/work-with-me" className="btn btn-primary mt-4">
                Work With Me
              </Link>
            </div>
          </div>
        </details>
      </nav>
    </header>
  );
}

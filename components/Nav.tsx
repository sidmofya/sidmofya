"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/site";

type NavItem = { label: string; href: string; external?: boolean };

// Offers first, then the map. 23° South and KwaZuri stay live and reachable
// from /now and the footer; they no longer compete with the offers up here.
const navItems: NavItem[] = [
  { label: "Partner Room", href: siteConfig.partnerRoomUrl, external: true },
  { label: "Speaking", href: "/speaking" },
  { label: "Now", href: "/now" },
  { label: "About", href: "/about" },
  { label: "MOTIF 54", href: siteConfig.motif54Url, external: true },
];

const linkBase =
  "uppercase tracking-[0.12em] text-[0.8125rem] text-[var(--color-ink)] hover:text-[var(--color-copper)] transition-colors";

function NavLink({ item, className = "" }: { item: NavItem; className?: string }) {
  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${linkBase} ${className}`}
      >
        {item.label} <span aria-hidden="true">↗</span>
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    );
  }

  return (
    <Link href={item.href} className={`${linkBase} ${className}`}>
      {item.label}
    </Link>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Escape closes the drawer and returns focus to the control that opened it.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-[6px] bg-[color-mix(in_oklab,var(--color-bg)_88%,transparent)] border-b border-[var(--color-rule)]/60">
      <nav className="mx-auto max-w-[72rem] px-6 md:px-10 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-lg md:text-xl uppercase tracking-[0.08em] text-[var(--color-ink)]"
        >
          Sid Mofya
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink key={item.label} item={item} />
          ))}
        </div>

        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="md:hidden p-2 -mr-2 text-[var(--color-ink)]"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
            {open ? (
              <path
                d="M5 5l12 12M17 5L5 17"
                stroke="currentColor"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M3 6h16M3 11h16M3 16h16"
                stroke="currentColor"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div
          id="mobile-nav"
          className="md:hidden fixed inset-x-0 top-16 bottom-0 bg-[var(--color-bg)] border-t border-[var(--color-rule)] px-6 py-8 overflow-y-auto"
        >
          <div className="flex flex-col">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                item={item}
                className="py-4 border-b border-[var(--color-rule)] !text-base"
              />
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

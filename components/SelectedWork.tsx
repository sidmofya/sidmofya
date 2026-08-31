"use client";

import { useState } from "react";
import RequestWorkModal from "@/components/RequestWorkModal";

export type Work = { title: string; description: string };

export default function SelectedWork({ works }: { works: Work[] }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <>
      <div>
        {works.map((work) => (
          <article
            key={work.title}
            className="border-t border-[var(--color-rule)] py-10 md:py-14 grid gap-6 md:grid-cols-[1fr_auto] md:gap-16 md:items-end"
          >
            <div className="max-w-2xl">
              <h3 className="h-card text-[var(--color-ink)]">{work.title}</h3>
              <p className="mt-4 text-[var(--color-ink-muted)]">{work.description}</p>
              <p className="mt-5 text-[0.8125rem] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
                Available on request
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActive(work.title)}
              className="link-copper font-medium justify-self-start whitespace-nowrap"
            >
              Request this work →
            </button>
          </article>
        ))}
      </div>

      {active && <RequestWorkModal work={active} onClose={() => setActive(null)} />}
    </>
  );
}

"use client";

import { useState } from "react";
import RequestWorkModal from "@/components/RequestWorkModal";

export type Work = { title: string; description: string };

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Reads as + when closed, − when open. State itself is announced via aria-expanded. */
function PlusMinus({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="shrink-0 text-[var(--color-copper)]"
    >
      <line x1="1" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1.25" />
      <line
        x1="8"
        y1="1"
        x2="8"
        y2="15"
        stroke="currentColor"
        strokeWidth="1.25"
        className="origin-center transition-transform duration-300 ease-out"
        style={{ transform: open ? "scaleY(0)" : "scaleY(1)" }}
      />
    </svg>
  );
}

/**
 * An editorial index: titles only until asked. One entry open at a time, and a
 * single shared request modal rather than a form per work.
 */
export default function SelectedWork({ works }: { works: Work[] }) {
  const [openTitle, setOpenTitle] = useState<string | null>(null);
  const [requested, setRequested] = useState<string | null>(null);

  return (
    <>
      <div className="border-b border-[var(--color-rule)]">
        {works.map((work) => {
          const slug = slugify(work.title);
          const isOpen = openTitle === work.title;

          return (
            <div key={work.title} className="border-t border-[var(--color-rule)]">
              <h3>
                <button
                  type="button"
                  id={`${slug}-trigger`}
                  aria-expanded={isOpen}
                  aria-controls={`${slug}-panel`}
                  onClick={() => setOpenTitle(isOpen ? null : work.title)}
                  className="flex w-full items-center justify-between gap-6 py-7 text-left md:py-8"
                >
                  <span className="h-card uppercase tracking-[0.06em] text-[var(--color-ink)]">
                    {work.title}
                  </span>
                  <PlusMinus open={isOpen} />
                </button>
              </h3>

              {/* 0fr -> 1fr transitions to auto height without measuring. */}
              <div
                id={`${slug}-panel`}
                role="region"
                aria-labelledby={`${slug}-trigger`}
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div
                  className={`overflow-hidden ${isOpen ? "visible" : "invisible"}`}
                >
                  <div className="max-w-2xl pb-9 md:pb-11">
                    <p className="text-[var(--color-ink-muted)]">{work.description}</p>
                    <p className="mt-6">
                      <button
                        type="button"
                        onClick={() => setRequested(work.title)}
                        className="link-copper font-medium"
                      >
                        Request this work →
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {requested && (
        <RequestWorkModal work={requested} onClose={() => setRequested(null)} />
      )}
    </>
  );
}

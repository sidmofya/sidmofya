"use client";

import { useRef, useState } from "react";

export type SpeakingPlaylistEntry = {
  id: string;
  title: string;
  signal: string;
  label: string;
};

type SpeakingPlaylistProps = {
  entries: SpeakingPlaylistEntry[];
};

export default function SpeakingPlaylist({ entries }: SpeakingPlaylistProps) {
  const [activeId, setActiveId] = useState<string | null>(entries[0]?.id ?? null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  if (entries.length === 0 || !activeId) return null;

  const activeIdx = Math.max(
    0,
    entries.findIndex((e) => e.id === activeId),
  );
  const active = entries[activeIdx];
  const nextEntry = entries[(activeIdx + 1) % entries.length];

  function handleSelect(id: string) {
    setActiveId(id);
    setHasInteracted(true);
    playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div ref={playerRef} className="scroll-mt-20">
      {/* Jump-to chips: 1 row of arc steps, each clickable */}
      <nav
        aria-label="Jump to a Sovereign Stack signal"
        className="mb-8 md:mb-10 flex flex-wrap gap-2"
      >
        {entries.map((entry, idx) => {
          const isActive = entry.id === activeId;
          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => handleSelect(entry.id)}
              aria-current={isActive ? "true" : undefined}
              className={`inline-flex items-baseline gap-2 px-3 py-1.5 border text-[0.75rem] tracking-wider uppercase transition-colors ${
                isActive
                  ? "border-[var(--color-copper)] bg-[var(--color-copper)]/10 text-[var(--color-copper)]"
                  : "border-[var(--color-rule)] text-[var(--color-ink-muted)] hover:border-[var(--color-copper)]/60 hover:text-[var(--color-ink)]"
              }`}
            >
              <span className="tabular-nums">{String(idx + 1).padStart(2, "0")}</span>
              <span>{entry.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="grid gap-8 md:gap-12 md:grid-cols-[minmax(0,320px)_1fr] items-start">
      {/* Player column */}
      <div className="w-full max-w-[320px] mx-auto md:mx-0">
        <div
          className="relative w-full overflow-hidden border border-[var(--color-rule)] bg-black"
          style={{ aspectRatio: "9 / 16" }}
        >
          <iframe
            key={active.id}
            src={`https://www.youtube-nocookie.com/embed/${active.id}?rel=0${
              hasInteracted ? "&autoplay=1" : ""
            }`}
            title={active.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </div>

      {/* Caption column */}
      <div className="flex flex-col gap-6">
        <div>
          <div className="eyebrow mb-3">{active.label}</div>
          <h3 className="font-display text-xl md:text-2xl leading-snug text-[var(--color-ink)] mb-4">
            {active.title}
          </h3>
          <p className="lede text-[var(--color-ink-muted)]">{active.signal}</p>
        </div>

        <div className="text-[0.8125rem] tabular-nums text-[var(--color-ink-muted)]">
          {activeIdx + 1} of {entries.length}
        </div>

        <button
          type="button"
          onClick={() => handleSelect(nextEntry.id)}
          className="group flex items-start gap-3 py-3 px-4 border border-[var(--color-rule)] hover:border-[var(--color-copper)]/60 hover:bg-[var(--color-bg-elev)] transition-colors text-left"
        >
          <div className="flex-1 min-w-0">
            <div className="eyebrow mb-1">Next up</div>
            <div className="text-[0.9375rem] text-[var(--color-ink)] leading-snug">
              {nextEntry.title}
            </div>
          </div>
          <span
            aria-hidden="true"
            className="text-[var(--color-copper)] mt-1 group-hover:translate-x-0.5 transition-transform"
          >
            →
          </span>
        </button>
      </div>
      </div>
    </div>
  );
}

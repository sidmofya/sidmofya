"use client";

import { useState } from "react";
import { videos } from "@/lib/pattern-cognition";

export default function PatternCognition() {
  const [activeId, setActiveId] = useState<string | null>(videos[0]?.id ?? null);

  if (videos.length === 0 || !activeId) {
    return (
      <div className="border-l-2 border-[var(--color-copper)] pl-6 py-2">
        <p className="text-[var(--color-ink-muted)] lede">Videos coming soon.</p>
      </div>
    );
  }

  const activeVideo = videos.find((v) => v.id === activeId) ?? videos[0];

  return (
    <div className="grid gap-12 md:gap-16 md:grid-cols-[minmax(0,360px)_1fr] items-start">
      {/* Player */}
      <div className="md:sticky md:top-24">
        <div
          className="relative w-full overflow-hidden border border-[var(--color-rule)] bg-black"
          style={{ aspectRatio: "9 / 16" }}
        >
          <iframe
            key={activeVideo.id}
            src={`https://www.youtube-nocookie.com/embed/${activeVideo.id}?rel=0`}
            title={activeVideo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
        <p className="mt-4 font-display text-lg leading-snug text-[var(--color-ink)]">
          {activeVideo.title}
        </p>
      </div>

      {/* List */}
      <div>
        <div className="eyebrow mb-4">All shorts</div>
        <ul className="border-t border-[var(--color-rule)]">
          {videos.map((video) => {
            const isActive = video.id === activeId;
            return (
              <li key={video.id} className="border-b border-[var(--color-rule)]">
                <button
                  type="button"
                  onClick={() => setActiveId(video.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={`w-full text-left flex items-start gap-4 py-4 px-4 transition-colors border-l-2 ${
                    isActive
                      ? "border-[var(--color-copper)] bg-[var(--color-bg-elev)]"
                      : "border-transparent hover:bg-[var(--color-bg-elev)] hover:border-[var(--color-copper)]/40"
                  }`}
                >
                  <span
                    className={`mt-1 text-[var(--color-copper)] text-[0.8125rem] tabular-nums ${
                      isActive ? "opacity-100" : "opacity-60"
                    }`}
                  >
                    {isActive ? "▶" : "·"}
                  </span>
                  <span
                    className={`flex-1 text-[0.9375rem] ${
                      isActive
                        ? "text-[var(--color-ink)] font-medium"
                        : "text-[var(--color-ink)]"
                    }`}
                  >
                    {video.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

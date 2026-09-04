"use client";

import { useEffect } from "react";
import styles from "@/app/partner-room/partner-room.module.css";
import { createPartnerRoomAnalytics } from "@/lib/partner-room-analytics.mjs";
import {
  emitPlausible,
  installPartnerRoomEventRouting,
} from "@/lib/partner-room-enhancements.mjs";
import FrameworkDialog from "./FrameworkDialog";

type Plausible = (name: string, options?: { props?: Record<string, string> }) => void;

function reconcileArchitectureIntersections(
  visibleArchitectures: Map<string, number>,
  entries: IntersectionObserverEntry[],
) {
  const next = new Map(visibleArchitectures);

  for (const entry of entries) {
    const architecture = entry.target.getAttribute("data-architecture");
    if (!architecture) continue;
    if (entry.isIntersecting) next.set(architecture, entry.intersectionRatio);
    else next.delete(architecture);
  }

  return next;
}

function selectActiveArchitecture(visibleArchitectures: Map<string, number>) {
  return [...visibleArchitectures.entries()]
    .sort(([firstArchitecture, firstRatio], [secondArchitecture, secondRatio]) => (
      secondRatio - firstRatio || firstArchitecture.localeCompare(secondArchitecture)
    ))[0]?.[0];
}

export default function PartnerRoomEnhancements() {
  useEffect(() => {
    const analytics = createPartnerRoomAnalytics((name, props) => {
      emitPlausible((window as typeof window & { plausible?: Plausible }).plausible, name, props);
    });
    const architectureContainer = document.getElementById("architectures");
    const architectureElements = Array.from(document.querySelectorAll<HTMLElement>("[data-architecture]"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const removeAnalyticsRouting = installPartnerRoomEventRouting({
      document,
      window,
      analytics,
      prefersReducedMotion: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });

    let architectureObserver: IntersectionObserver | undefined;
    let revealObserver: IntersectionObserver | undefined;
    let visibleArchitectures = new Map<string, number>();

    if ("IntersectionObserver" in window) {
      architectureObserver = new IntersectionObserver(
        (entries) => {
          visibleArchitectures = reconcileArchitectureIntersections(visibleArchitectures, entries);
          const activeArchitecture = selectActiveArchitecture(visibleArchitectures);
          if (!architectureContainer) return;

          if (activeArchitecture) architectureContainer.dataset.activeArchitecture = activeArchitecture;
          else architectureContainer.removeAttribute("data-active-architecture");
          for (const element of architectureElements) {
            element.classList.toggle(
              styles.architectureActive,
              element.dataset.architecture === activeArchitecture,
            );
          }
        },
        { rootMargin: "-20% 0px -45%", threshold: [0, 0.5, 1] },
      );
      for (const element of architectureElements) architectureObserver.observe(element);

      if (!reduceMotion) {
        const revealElements = Array.from(document.querySelectorAll<HTMLElement>(
          "[data-partner-room] main > section[id], [data-partner-room] [data-architecture], [data-partner-room] [data-room-judgment]",
        ));
        revealObserver = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (!entry.isIntersecting) continue;
              entry.target.classList.add(styles.reveal);
              revealObserver?.unobserve(entry.target);
            }
          },
          { threshold: 0.12 },
        );
        for (const element of revealElements) revealObserver.observe(element);
      }
    }

    return () => {
      removeAnalyticsRouting();
      architectureObserver?.disconnect();
      revealObserver?.disconnect();
      architectureContainer?.removeAttribute("data-active-architecture");
      for (const element of architectureElements) element.classList.remove(styles.architectureActive);
      for (const element of document.querySelectorAll<HTMLElement>(`.${styles.reveal}`)) {
        element.classList.remove(styles.reveal);
      }
    };
  }, []);

  return <FrameworkDialog />;
}

"use client";

import { useEffect } from "react";
import styles from "@/app/partner-room/partner-room.module.css";
import {
  createPartnerRoomAnalytics,
  isSectionDepthQualified,
  reconcileArchitectureIntersections,
  selectActiveArchitecture,
  toArchitectureIntersection,
} from "@/lib/partner-room-analytics.mjs";

type Plausible = (name: string, options?: { props?: Record<string, string> }) => void;

export default function PartnerRoomEnhancements() {
  useEffect(() => {
    const analytics = createPartnerRoomAnalytics((name, props) => {
      (window as typeof window & { plausible?: Plausible }).plausible?.(name, { props });
    });
    const architectureContainer = document.getElementById("architectures");
    const architectureElements = Array.from(document.querySelectorAll<HTMLElement>("[data-architecture]"));
    const milestoneElements = ["mechanism", "architectures", "founding-room", "request-seat"]
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element instanceof HTMLElement);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function handleSeatLink(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>("a[data-cta-location]");
      if (!link) return;

      const location = link.dataset.ctaLocation;
      if (location) analytics.trackCta(location);
      if (link.getAttribute("href") !== "#request-seat") return;

      const requestSection = document.getElementById("request-seat");
      const requestHeading = document.getElementById("request-seat-title");
      if (!requestSection || !requestHeading) return;

      event.preventDefault();
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      requestHeading.focus({ preventScroll: true });
      requestSection.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      window.history.replaceState(null, "", "#request-seat");
    }

    function handleApplicationStart() {
      analytics.trackApplicationStart();
    }

    function handleApplicationComplete() {
      analytics.trackApplicationComplete();
    }

    function handlePageHide() {
      analytics.trackApplicationAbandon();
    }

    document.addEventListener("click", handleSeatLink);
    window.addEventListener("partner-room:application-start", handleApplicationStart);
    window.addEventListener("partner-room:application-complete", handleApplicationComplete);
    window.addEventListener("pagehide", handlePageHide);

    let architectureObserver: IntersectionObserver | undefined;
    let milestoneObserver: IntersectionObserver | undefined;
    let revealObserver: IntersectionObserver | undefined;
    let visibleArchitectures = new Map<string, number>();

    if ("IntersectionObserver" in window) {
      architectureObserver = new IntersectionObserver(
        (entries) => {
          visibleArchitectures = reconcileArchitectureIntersections(
            visibleArchitectures,
            entries.flatMap((entry) => {
              const architecture = entry.target.getAttribute("data-architecture");
              return architecture ? [toArchitectureIntersection(entry, architecture)] : [];
            }),
          );
          const activeArchitecture = selectActiveArchitecture(visibleArchitectures);
          if (!architectureContainer) return;

          if (activeArchitecture) {
            architectureContainer.dataset.activeArchitecture = activeArchitecture;
          } else {
            architectureContainer.removeAttribute("data-active-architecture");
          }
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

      milestoneObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!isSectionDepthQualified(entry)) continue;
            analytics.trackSectionDepth(entry.target.id);
            milestoneObserver?.unobserve(entry.target);
          }
        },
        { threshold: 0.25 },
      );
      for (const element of milestoneElements) milestoneObserver.observe(element);

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
      document.removeEventListener("click", handleSeatLink);
      window.removeEventListener("partner-room:application-start", handleApplicationStart);
      window.removeEventListener("partner-room:application-complete", handleApplicationComplete);
      window.removeEventListener("pagehide", handlePageHide);
      architectureObserver?.disconnect();
      milestoneObserver?.disconnect();
      revealObserver?.disconnect();
      architectureContainer?.removeAttribute("data-active-architecture");
      for (const element of architectureElements) element.classList.remove(styles.architectureActive);
      for (const element of document.querySelectorAll<HTMLElement>(`.${styles.reveal}`)) {
        element.classList.remove(styles.reveal);
      }
    };
  }, []);

  return null;
}

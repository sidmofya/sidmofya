"use client";

import { useEffect } from "react";

export default function PartnerRoomEnhancements() {
  useEffect(() => {
    function handleSeatLink(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>('a[data-cta-location][href="#request-seat"]');
      if (!link) return;

      const requestSection = document.getElementById("request-seat");
      const requestHeading = document.getElementById("request-seat-title");
      if (!requestSection || !requestHeading) return;

      event.preventDefault();
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      requestHeading.focus({ preventScroll: true });
      requestSection.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      window.history.replaceState(null, "", "#request-seat");
    }

    document.addEventListener("click", handleSeatLink);
    return () => document.removeEventListener("click", handleSeatLink);
  }, []);

  return null;
}

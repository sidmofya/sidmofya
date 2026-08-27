"use client";

import { useEffect, useState } from "react";
import { shouldShowMobileCta } from "@/lib/partner-room-interactions.mjs";
import styles from "@/app/partner-room/partner-room.module.css";

export default function PartnerRoomEnhancements() {
  const [heroVisible, setHeroVisible] = useState(true);
  const [formVisible, setFormVisible] = useState(false);

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

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const hero = document.getElementById("partner-room-hero");
    const form = document.getElementById("request-seat");
    if (!hero || !form) return;

    const heroObserver = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );
    const formObserver = new IntersectionObserver(
      ([entry]) => setFormVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );

    heroObserver.observe(hero);
    formObserver.observe(form);
    return () => {
      heroObserver.disconnect();
      formObserver.disconnect();
    };
  }, []);

  if (!shouldShowMobileCta({ heroVisible, formVisible })) return null;

  return (
    <div className={styles.mobileSticky}>
      <a className={styles.primaryCta} href="#request-seat" data-cta-location="mobile-sticky">
        Request a Seat
      </a>
    </div>
  );
}

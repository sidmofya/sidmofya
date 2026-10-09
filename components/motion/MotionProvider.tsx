"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/**
 * The site's single motion controller. Pages stay server-rendered and declare
 * intent with data attributes; this component is the only place that turns
 * them into animation:
 *
 *   data-reveal              fade and rise once, on entering the viewport
 *   data-reveal-delay="0.4"  seconds to hold a reveal (hero sequencing)
 *   data-reveal-children     each direct child reveals in turn
 *   data-draw                a hairline that draws left to right
 *   data-draw-var            same, for pseudo-elements driven by --draw
 *   data-unveil              an image wiped into view from the top
 *   data-motif="bars|rings"  the homepage door drawings
 *   data-stack               the Sovereign Stack, assembled by scrolling
 *
 * The hidden starting states are in globals.css under html[data-motion].
 */
export default function MotionProvider() {
  const pathname = usePathname();

  // Smooth scrolling, driven from GSAP's clock so both stay on one frame.
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.motionReady = "true";

    const query = window.matchMedia(MOTION_OK);
    const syncPreference = () => {
      if (query.matches) root.setAttribute("data-motion", "");
      else root.removeAttribute("data-motion");
    };
    syncPreference();
    query.addEventListener("change", syncPreference);

    const lenis = new Lenis({
      autoRaf: false,
      anchors: true,
      stopInertiaOnNavigate: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Anything that locks the page (the mobile menu does) also pauses Lenis.
    const lock = new MutationObserver(() => {
      if (document.body.style.overflow === "hidden") lenis.stop();
      else lenis.start();
    });
    lock.observe(document.body, { attributes: true, attributeFilter: ["style"] });

    return () => {
      query.removeEventListener("change", syncPreference);
      lock.disconnect();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  // Rebuilt on every route change; the previous page's triggers are reverted.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const reveals = gsap.utils.toArray<HTMLElement>(
          "[data-reveal], [data-reveal-children] > *",
        );
        gsap.set(reveals, { y: 20 });
        ScrollTrigger.batch(reveals, {
          start: "top 90%",
          once: true,
          onEnter: (batch) => {
            batch.forEach((el, index) => {
              const hold = Number((el as HTMLElement).dataset.revealDelay ?? 0);
              gsap.to(el, {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: "power3.out",
                delay: hold + index * 0.08,
              });
            });
          },
        });

        gsap.utils.toArray<HTMLElement>("[data-draw]").forEach((line) => {
          gsap.fromTo(
            line,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.3,
              ease: "power2.inOut",
              scrollTrigger: { trigger: line, start: "top 92%", once: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-draw-var]").forEach((el) => {
          gsap.fromTo(
            el,
            { "--draw": 0 },
            {
              "--draw": 1,
              duration: 1.8,
              ease: "power2.inOut",
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-unveil]").forEach((frame) => {
          const trigger = { trigger: frame, start: "top 85%", once: true };
          gsap.fromTo(
            frame,
            { clipPath: "inset(0% 0% 100% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.4,
              ease: "power3.inOut",
              scrollTrigger: trigger,
            },
          );
          gsap.fromTo(
            frame.querySelectorAll("img"),
            { scale: 1.12 },
            { scale: 1, duration: 1.8, ease: "power3.out", scrollTrigger: trigger },
          );
        });

        // MOTIF 54 builds: its bars extend one after another.
        gsap.utils.toArray<HTMLElement>('[data-motif="bars"]').forEach((motif) => {
          gsap.fromTo(
            motif.children,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.1,
              ease: "power3.out",
              stagger: { each: 0.12, from: "end" },
              scrollTrigger: { trigger: motif, start: "top 80%", once: true },
            },
          );
        });

        // KwaZuri imagines: its rings spread outward from the centre.
        gsap.utils.toArray<SVGElement>('[data-motif="rings"]').forEach((motif) => {
          gsap.fromTo(
            motif.querySelectorAll("circle"),
            { scale: 0.35, svgOrigin: "60 60" },
            {
              scale: 1,
              // Each ring keeps the opacity it was drawn with.
              opacity: (_index, ring: SVGCircleElement) =>
                Number(ring.getAttribute("opacity") ?? 1),
              duration: 1.5,
              ease: "power2.out",
              stagger: { each: 0.14, from: "end" },
              scrollTrigger: { trigger: motif, start: "top 80%", once: true },
            },
          );
        });

        // The header hairline tracks how far down the page the reader is.
        gsap.fromTo(
          ".scroll-progress",
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
          },
        );

        return () => gsap.set(".scroll-progress", { clearProps: "transform" });
      });

      // The Sovereign Stack: each sentence of the thesis lays down its layer.
      const buildStack = (synced: boolean) => {
        gsap.utils.toArray<HTMLElement>("[data-stack]").forEach((stack) => {
          const lines = stack.querySelectorAll("[data-stack-line]");
          const layers = stack.querySelectorAll("[data-stack-layer]");
          const dim = { opacity: 0.22 };
          const lit = { opacity: 1, ease: "none", stagger: 1, duration: 1 };

          if (synced) {
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: stack,
                  start: "top 78%",
                  end: "center 42%",
                  scrub: 0.5,
                },
              })
              .fromTo(lines, { ...dim }, { ...lit }, 0)
              .fromTo(layers, { ...dim }, { ...lit }, 0);
            return;
          }

          // Stacked on small screens, so each half follows its own position.
          [lines, layers].forEach((group) => {
            if (!group.length) return;
            const block = group[0].parentElement;
            gsap.fromTo(group, { ...dim }, {
              ...lit,
              scrollTrigger: {
                trigger: block,
                start: "top 82%",
                end: "bottom 62%",
                scrub: 0.5,
              },
            });
          });
        });
      };

      mm.add(`${MOTION_OK} and (min-width: 768px)`, () => buildStack(true));
      mm.add(`${MOTION_OK} and (max-width: 767px)`, () => buildStack(false));

      // Web fonts change line heights, so measure again once they land.
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}

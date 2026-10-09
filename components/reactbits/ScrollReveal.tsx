"use client";

/*
 * Adapted from React Bits (https://reactbits.dev), ScrollReveal.
 * Copyright (c) 2026 David Haz. MIT + Commons Clause, see ./LICENSE.md.
 *
 * Changes for this site: renders the tag it is given instead of a fixed
 * heading, drops the rotation, does nothing under prefers-reduced-motion, and
 * cleans up only its own scroll triggers rather than every trigger on the page.
 */
import { useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ScrollRevealProps {
  children: string;
  as?: "p" | "blockquote";
  className?: string;
  /** Opacity of a word before the reader reaches it. Keep in step with globals.css. */
  baseOpacity?: number;
  /** Pixels of blur on unread words; 0 turns the effect off. */
  blurStrength?: number;
  start?: string;
  end?: string;
}

export default function ScrollReveal({
  children,
  as: Tag = "p",
  className = "",
  baseOpacity = 0.18,
  blurStrength = 2,
  start = "top 88%",
  end = "bottom 68%",
}: ScrollRevealProps) {
  const ref = useRef<HTMLQuoteElement & HTMLParagraphElement>(null);

  const words = useMemo(
    () =>
      children.split(/(\s+)/).map((word, index) =>
        /^\s+$/.test(word) ? (
          word
        ) : (
          <span className="word inline-block" key={index}>
            {word}
          </span>
        ),
      ),
    [children],
  );

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          el.querySelectorAll(".word"),
          {
            opacity: baseOpacity,
            filter: blurStrength ? `blur(${blurStrength}px)` : "none",
          },
          {
            opacity: 1,
            filter: blurStrength ? "blur(0px)" : "none",
            ease: "none",
            stagger: 0.05,
            scrollTrigger: { trigger: el, start, end, scrub: true },
          },
        );
      });
    },
    { dependencies: [children, baseOpacity, blurStrength, start, end], scope: ref },
  );

  return (
    <Tag ref={ref} data-words="" className={className}>
      {words}
    </Tag>
  );
}

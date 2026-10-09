"use client";

/*
 * Adapted from React Bits (https://reactbits.dev), SplitText.
 * Copyright (c) 2026 David Haz. MIT + Commons Clause, see ./LICENSE.md.
 *
 * Changes for this site: masked reveals, a start delay, left alignment by
 * default, no animation under prefers-reduced-motion, the text is hidden by
 * CSS until it is split (no flash of the finished headline), and the split is
 * undone once the animation completes so the heading returns to plain text.
 */
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

export interface SplitTextProps {
  text: string;
  className?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  splitType?: "chars" | "words" | "lines";
  /** Clip each piece so it rises out of its own line instead of fading in. */
  mask?: boolean;
  /** Milliseconds between pieces. */
  delay?: number;
  /** Seconds before the first piece moves. */
  startDelay?: number;
  duration?: number;
  ease?: string;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  /** ScrollTrigger start position. */
  start?: string;
}

export default function SplitText({
  text,
  className = "",
  tag: Tag = "p",
  splitType = "words",
  mask = false,
  delay = 50,
  startDelay = 0,
  duration = 1.1,
  ease = "power3.out",
  from = mask ? { yPercent: 115 } : { opacity: 0, y: 40 },
  to = mask ? { yPercent: 0 } : { opacity: 1, y: 0 },
  start = "top 90%",
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Splitting before the web font arrives would measure the wrong line breaks.
  useEffect(() => {
    let active = true;
    document.fonts.ready.then(() => {
      if (active) setFontsLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !text || !fontsLoaded) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = new GSAPSplitText(el, {
          type: splitType,
          mask: mask ? splitType : undefined,
          autoSplit: splitType === "lines",
          linesClass: "split-line",
          wordsClass: "split-word",
          charsClass: "split-char",
          onSplit: (self: GSAPSplitText) => {
            gsap.set(el, { visibility: "visible" });
            return gsap.fromTo(
              self[splitType],
              { ...from },
              {
                ...to,
                duration,
                ease,
                delay: startDelay,
                stagger: delay / 1000,
                scrollTrigger: { trigger: el, start, once: true },
                onComplete: () => self.revert(),
              },
            );
          },
        });

        return () => split.revert();
      });
    },
    {
      dependencies: [
        text,
        splitType,
        mask,
        delay,
        startDelay,
        duration,
        ease,
        JSON.stringify(from),
        JSON.stringify(to),
        start,
        fontsLoaded,
      ],
      scope: ref,
      revertOnUpdate: true,
    },
  );

  return (
    // @ts-expect-error -- one ref type cannot satisfy every heading tag.
    <Tag ref={ref} data-split="" className={className}>
      {text}
    </Tag>
  );
}

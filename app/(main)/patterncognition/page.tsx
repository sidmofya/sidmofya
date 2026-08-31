import type { Metadata } from "next";
import Section from "@/components/Section";
import PatternCognition from "@/components/PatternCognition";

export const metadata: Metadata = {
  title: "Pattern Cognition | Sid Mofya",
  description:
    "Short videos on noticing — recurring shapes, signals, and patterns across capital, culture, and creative work.",
  alternates: { canonical: "/patterncognition" },
};

export default function Page() {
  return (
    <>
      <Section className="!pt-24 md:!pt-28 !pb-12">
        <div className="max-w-3xl">
          <div className="eyebrow mb-5">Pattern Cognition</div>
          <h1 className="h-hero text-[var(--color-ink)]">Pattern Cognition</h1>
          <p className="lede mt-6 text-[var(--color-ink-muted)]">
            Short videos on noticing — recurring shapes, signals, and patterns across capital,
            culture, and creative work.
          </p>
        </div>
      </Section>

      <Section className="!pt-4 !pb-28">
        <PatternCognition />
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import Section from "@/components/Section";
import SovereignGeometryWaitlistForm from "@/components/SovereignGeometryWaitlistForm";

export const metadata: Metadata = {
  title: "The Sovereign Geometry",
  description: "Join the first readers of The Sovereign Geometry by Sid Mofya.",
};

export default function Page() {
  return (
    <Section className="!pt-24 md:!pt-32 !pb-28">
      <div className="mx-auto max-w-xl">
        <div className="eyebrow mb-5">The Sovereign Geometry</div>
        <h1 className="h-hero text-[var(--color-ink)]">The Sovereign Geometry</h1>
        <p className="lede mt-6 text-[var(--color-ink)]">
          Ten enduring patterns for the Sovereign Age.
        </p>
        <p className="mt-10 font-display text-2xl md:text-3xl leading-tight text-[var(--color-ink)]">
          Join the first readers.
        </p>
        <div className="mt-8">
          <SovereignGeometryWaitlistForm />
        </div>
      </div>
    </Section>
  );
}

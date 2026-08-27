import type { Metadata } from "next";
import Section from "@/components/Section";
import WorkWithMeForm from "@/components/WorkWithMeForm";

export const metadata: Metadata = {
  title: "Work With Sid Mofya",
  description:
    "Request a focused sprint or briefing with Sid Mofya around market legibility, room design, or strategic rooms.",
};

type PageProps = {
  searchParams?: Promise<{
    interest?: string;
  }>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const defaultSprint =
    params?.interest === "speaking" ? "Speaking / Executive Briefing" : undefined;

  return (
    <>
      <Section className="!pt-24 md:!pt-28 !pb-12">
        <div className="max-w-3xl">
          <div className="eyebrow mb-5">Request a sprint or briefing</div>
          <h1 className="h-hero text-[var(--color-ink)]">Work With Me</h1>
          <p className="lede mt-6 text-[var(--color-ink-muted)]">
            Tell me what threshold you are facing. I will recommend the right sprint or say plainly
            if there is not a fit.
          </p>
        </div>
      </Section>

      <Section className="!pt-4 !pb-28">
        <div className="max-w-2xl">
          <WorkWithMeForm defaultSprint={defaultSprint} />
        </div>
      </Section>
    </>
  );
}

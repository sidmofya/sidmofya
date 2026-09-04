import type { Metadata } from "next";
import CodexPlate from "@/components/CodexPlate";
import KwaZuriSignupForm from "@/components/KwaZuriSignupForm";

const description =
  "KwaZuri is a living African storyworld spanning fiction, music, technology, ritual and play.";

export const metadata: Metadata = {
  title: "KwaZuri | A World Is Forming",
  description,
  alternates: { canonical: "/kwazuri" },
  openGraph: {
    title: "KwaZuri | A World Is Forming",
    description,
    url: "/kwazuri",
    type: "website",
    images: ["/kwazuri/mvua-basin-og.jpg"],
  },
};

export default function Page() {
  return (
    <div className="kwazuri">
      {/* First contact. The image does most of the work. */}
      <section className="px-6 md:px-10 pt-16 md:pt-24 pb-10 md:pb-16">
        <div className="mx-auto max-w-[72rem]">
          <div className="max-w-2xl">
            <p className="eyebrow mb-6">KwaZuri</p>
            <h1 className="h-hero text-[var(--kz-charcoal)]">A world is forming.</h1>
            <p className="lede mt-7 text-[var(--kz-ink)]">
              A living African storyworld spanning fiction, music, technology, ritual
              and play.
            </p>
            <p className="mt-12 text-[0.8125rem] uppercase tracking-[0.18em] text-[var(--kz-muted)]">
              Enter the Living Codex ↓
            </p>
          </div>
        </div>
      </section>

      {/* PLACE */}
      <section className="px-6 md:px-10 pb-20 md:pb-28">
        <div className="mx-auto max-w-[72rem]">
          <div className="mb-8 flex flex-wrap items-baseline gap-x-8 gap-y-2">
            <p className="eyebrow">Place</p>
            <h2 className="h-card text-[var(--kz-charcoal)]">M&rsquo;vua Basin</h2>
          </div>
          {/* The complete artifact is preserved rather than cropped to a hero band. */}
          <CodexPlate
            src="/kwazuri/mvua-basin.webp"
            alt="A codex leaf mapping the M'vua Basin: a great water basin ringed by monumental towers, baobabs, bridges and terraced settlements."
            width={1672}
            height={941}
            priority
          />
          <p className="mt-6 text-[0.8125rem] text-[var(--kz-muted)]">
            Tap any plate to enlarge.
          </p>
        </div>
      </section>

      {/* CRAFT */}
      <section className="px-6 md:px-10 pb-20 md:pb-28">
        <div className="mx-auto max-w-[72rem]">
          <hr className="rule mb-12" />
          <div className="mb-8 flex flex-wrap items-baseline gap-x-8 gap-y-2">
            <p className="eyebrow">Craft</p>
            <h2 className="h-card text-[var(--kz-charcoal)]">Ekundela</h2>
          </div>
          <CodexPlate
            src="/kwazuri/ekundela-codex.webp"
            alt="A codex field leaf for the Ekundela, a single-string instrument: anatomy notes on its curved neck, raffia binding, woven lattice, carved bridge and calabash resonator, with a player seated beside them."
            width={1448}
            height={1086}
          />
        </div>
      </section>

      {/* PEOPLE */}
      <section className="px-6 md:px-10 pb-24 md:pb-32">
        <div className="mx-auto max-w-[72rem]">
          <hr className="rule mb-12" />
          <div className="mb-8 flex flex-wrap items-baseline gap-x-8 gap-y-2">
            <p className="eyebrow">People</p>
            <h2 className="h-card text-[var(--kz-charcoal)]">Repair is remembrance.</h2>
          </div>
          <CodexPlate
            src="/kwazuri/repair-is-remembrance.webp"
            alt="A codex leaf on Ekundela restoration: an elder guides a young apprentice's hands over the instrument, surrounded by studies of the bridge, the hands in dialogue, and the retuning sequence."
            width={1448}
            height={1086}
          />
        </div>
      </section>

      {/* The edge of what has currently been revealed. */}
      <section className="px-6 md:px-10 pt-8 pb-28 md:pt-20 md:pb-40">
        <div className="mx-auto max-w-[72rem]">
          <div className="grid gap-8 md:grid-cols-[18rem_1fr] md:gap-16">
            <p className="eyebrow">The gates aren&rsquo;t open yet</p>
            <div>
              <h2 className="h-section text-[var(--kz-charcoal)]">
                Be there when they are.
              </h2>
              <p className="mt-6 text-[var(--kz-ink)]">
                KwaZuri is currently in development.
              </p>
              <div className="mt-8">
                <KwaZuriSignupForm />
              </div>
              <p className="mt-6 max-w-md text-[0.875rem] text-[var(--kz-muted)]">
                No regular newsletter. Just launch news and occasional glimpses from
                the Living Codex.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

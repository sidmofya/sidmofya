import Link from "next/link";
import type { Offer } from "@/lib/offers";

export default function OfferCard({ offer, index }: { offer: Offer; index: number }) {
  return (
    <Link
      href={`/${offer.slug}`}
      className="group flex flex-col bg-[var(--color-bg-elev)] border border-[var(--color-rule)] p-8 md:p-10 transition-colors hover:border-[var(--color-copper)]/60"
    >
      <div className="flex items-baseline gap-3 mb-6">
        <span className="font-display text-[var(--color-copper)] text-2xl tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="eyebrow !text-[var(--color-ink-muted)]">Sprint</span>
      </div>

      <h3 className="h-card mb-3 text-[var(--color-ink)]">{offer.title}</h3>
      <p className="text-[var(--color-ink-muted)] text-[0.9375rem] mb-5">{offer.cardFor}</p>
      <p className="text-[var(--color-ink)] mb-6">{offer.cardCopy}</p>

      <div className="mt-auto pt-6 border-t border-[var(--color-rule)]">
        <div className="eyebrow mb-3">You leave with</div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-[0.9375rem] text-[var(--color-ink)] mb-6">
          {offer.cardDeliverables.map((d) => (
            <li key={d} className="flex items-start gap-2">
              <span className="text-[var(--color-copper)] mt-1">·</span>
              <span>{d}</span>
            </li>
          ))}
        </ul>

        <span className="inline-flex items-center gap-2 text-[var(--color-copper)] font-medium text-[0.9375rem] group-hover:gap-3 transition-all">
          {offer.cardCta}
          <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}

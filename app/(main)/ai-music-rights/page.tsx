import type { Metadata } from "next";
import OfferPage from "@/components/OfferPage";
import { getOffer } from "@/lib/offers";

export const metadata: Metadata = {
  title: "AI Music Rights & Fan Revenue Sprint | Sid Mofya",
  description:
    "A practical sprint for artists, managers, collectives, and music organizations navigating AI, rights, consent, remixing, and permissioned fan revenue.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <OfferPage offer={getOffer("ai-music-rights")} />;
}

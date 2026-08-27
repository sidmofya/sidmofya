import type { Metadata } from "next";
import OfferPage from "@/components/OfferPage";
import { getOffer } from "@/lib/offers";

export const metadata: Metadata = {
  title: "Room-to-Results Sprint | Sid Mofya",
  description:
    "A focused sprint for conveners who need events, roundtables, demo days, salons, or investor rooms to produce measurable outcomes after everyone leaves.",
};

export default function Page() {
  return <OfferPage offer={getOffer("room-to-results")} />;
}

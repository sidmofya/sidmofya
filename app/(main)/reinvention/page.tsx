import type { Metadata } from "next";
import OfferPage from "@/components/OfferPage";
import { getOffer } from "@/lib/offers";

export const metadata: Metadata = {
  title: "ReInvention Sprint | Sid Mofya",
  description:
    "A focused sprint for mid-career professionals navigating transition, identity shift, and their next meaningful professional move.",
};

export default function Page() {
  return <OfferPage offer={getOffer("reinvention")} />;
}

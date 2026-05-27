import type { Metadata } from "next";
import OfferPage from "@/components/OfferPage";
import { getOffer } from "@/lib/offers";

export const metadata: Metadata = {
  title: "Market Legibility Sprint | Sid Mofya",
  description:
    "A focused sprint for founders, advisors, and operators whose real edge crosses categories and needs to become easier for the market to understand, trust, and buy.",
};

export default function Page() {
  return <OfferPage offer={getOffer("market-legibility")} />;
}

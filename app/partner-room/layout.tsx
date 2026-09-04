import type { Metadata } from "next";
import Analytics from "@/components/Analytics";
import styles from "./partner-room.module.css";
import PartnerRoomEnhancements from "@/components/partner-room/PartnerRoomEnhancements";

const title = "Partner Room | See How Your Series A Gets Decided";
const description =
  "Five venture investors evaluate your company while you listen to the deliberation founders normally never hear. A live Series A decision room facilitated by Sid Mofya.";
const socialTitle = "Your Series A is decided in a room you will never be in.";
const socialDescription =
  "Partner Room puts your company in front of five venture investors and lets you hear the deliberation that normally happens after the founder leaves.";
const socialImage = {
  url: "/partner-room/opengraph-image",
  width: 1200,
  height: 630,
  alt: "PARTNER ROOM — Your Series A is decided in a room you will never be in.",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://partnerroom.sidmofya.com"),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title: socialTitle,
    description: socialDescription,
    url: "/",
    siteName: "Partner Room",
    type: "website",
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: socialTitle,
    description: socialDescription,
    images: [socialImage.url],
  },
};

export default function PartnerRoomLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell} data-partner-room>
      <a className={styles.skipLink} href="#partner-room-main">
        Skip to content
      </a>
      {children}
      <PartnerRoomEnhancements />
      <Analytics />
    </div>
  );
}

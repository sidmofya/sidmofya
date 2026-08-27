import type { Metadata } from "next";
import styles from "./partner-room.module.css";

const title = "Partner Room | Rehearse the Room That Decides Your Series A";
const description =
  "Partner Room puts founders inside six venture investment decision architectures before they raise. Six founders. Six live Zoom sessions. One Founder seat. Five rotating Partner seats.";

export const metadata: Metadata = {
  metadataBase: new URL("https://partnerroom.sidmofya.com"),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "Partner Room",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function PartnerRoomLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell} data-partner-room>
      <a className={styles.skipLink} href="#partner-room-main">
        Skip to content
      </a>
      {children}
    </div>
  );
}

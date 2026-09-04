import type { Metadata } from "next";
import Analytics from "@/components/Analytics";
import styles from "./partner-room.module.css";

const title = "Partner Room — See How Your Series A Gets Decided";
const description =
  "Partner Room puts six Series A founders inside the investment decision process: five rooms as an investor, one as the founder.";
const socialTitle = "Your Series A is decided in a room you will never be in.";
const socialDescription = "Five rooms as an investor. One as the founder.";

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
  },
  twitter: {
    card: "summary_large_image",
    title: socialTitle,
    description: socialDescription,
  },
};

export default function PartnerRoomLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell} data-partner-room>
      <a className={styles.skipLink} href="#partner-room-main">
        Skip to content
      </a>
      {children}
      <Analytics />
    </div>
  );
}

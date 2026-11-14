import type { Metadata } from "next";
import { mainSiteShareImage } from "@/lib/site";
import Analytics from "@/components/Analytics";
import Footer from "@/components/Footer";
import MotionProvider from "@/components/motion/MotionProvider";
import Nav from "@/components/Nav";
import PartnerRoomLayout from "@/app/partner-room/layout";

// The dedicated Partner Room deployment also serves pages from this route group.
export const metadata: Metadata =
  process.env.SITE_VARIANT === "partner-room"
    ? {}
    : {
        icons: {
          icon: { url: "/sid-mofya-icon.svg", type: "image/svg+xml", sizes: "any" },
        },
        openGraph: {
          type: "website",
          images: [mainSiteShareImage],
        },
        // Next.js fills the card's title, description and image from Open Graph.
        twitter: { card: "summary_large_image" },
      };

/**
 * Runs before first paint. Switches on the hidden-until-animated styles in
 * globals.css, but only for visitors who have not asked for reduced motion,
 * and switches them back off if the motion code has not started within four
 * seconds, so a failed script can never leave content invisible.
 */
const motionGate = `(function(){try{var d=document.documentElement;if(!matchMedia("(prefers-reduced-motion: no-preference)").matches)return;d.setAttribute("data-motion","");setTimeout(function(){if(!d.hasAttribute("data-motion-ready"))d.removeAttribute("data-motion")},4000)}catch(e){}})()`;

export default function MainSiteLayout({ children }: { children: React.ReactNode }) {
  if (process.env.SITE_VARIANT === "partner-room") {
    return <PartnerRoomLayout>{children}</PartnerRoomLayout>;
  }

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: motionGate }} />
      <MotionProvider />
      <Nav />
      <main>{children}</main>
      <Footer />
      <Analytics />
    </>
  );
}

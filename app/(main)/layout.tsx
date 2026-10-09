import Analytics from "@/components/Analytics";
import Footer from "@/components/Footer";
import MotionProvider from "@/components/motion/MotionProvider";
import Nav from "@/components/Nav";
import PartnerRoomLayout from "@/app/partner-room/layout";

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

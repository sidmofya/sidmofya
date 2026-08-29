import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import PartnerRoomLayout from "@/app/partner-room/layout";

export default function MainSiteLayout({ children }: { children: React.ReactNode }) {
  if (process.env.SITE_VARIANT === "partner-room") {
    return <PartnerRoomLayout>{children}</PartnerRoomLayout>;
  }

  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  );
}

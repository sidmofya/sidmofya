import Footer from "@/components/Footer";
import Nav from "@/components/Nav";

export default function MainSiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  );
}

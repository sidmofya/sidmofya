import Link from "next/link";
import Analytics from "@/components/Analytics";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main>
        <section className="px-6 md:px-10 py-32 md:py-40">
          <div className="mx-auto max-w-[72rem]">
            <div className="max-w-xl">
              <div className="eyebrow mb-5">404</div>
              <h1 className="h-hero text-[var(--color-ink)]">Not here.</h1>
              <p className="lede mt-6 text-[var(--color-ink-muted)]">
                The page you are looking for does not exist on this site.
              </p>
              <p className="mt-8">
                <Link href="/" className="link-copper font-medium">
                  Return home →
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <Analytics />
    </>
  );
}

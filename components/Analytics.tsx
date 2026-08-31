import Script from "next/script";

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

/**
 * Plausible, gated on NEXT_PUBLIC_PLAUSIBLE_DOMAIN so the script is simply
 * absent when the variable is unset. Render this exactly once per document.
 */
export default function Analytics() {
  if (!plausibleDomain) return null;

  return (
    <>
      <Script id="plausible-queue" strategy="afterInteractive">
        {"window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)}"}
      </Script>
      <Script
        defer
        data-domain={plausibleDomain}
        src="https://plausible.io/js/script.js"
        strategy="afterInteractive"
      />
    </>
  );
}

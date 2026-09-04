/**
 * @param {((name: string, options?: { props?: Record<string, string> }) => void) | undefined} plausible
 * @param {string} name
 * @param {Record<string, string> | undefined} props
 */
export function emitPlausible(plausible, name, props) {
  if (!plausible) return;
  if (props) plausible(name, { props });
  else plausible(name);
}

/** @param {unknown} target @param {string} selector */
function closest(target, selector) {
  return target && typeof target === "object" && "closest" in target && typeof target.closest === "function"
    ? target.closest(selector)
    : null;
}

/** @param {unknown} event */
function roleFromEvent(event) {
  if (!event || typeof event !== "object" || !("detail" in event)) return undefined;
  const detail = event.detail;
  return detail && typeof detail === "object" && typeof detail.role === "string" ? detail.role : undefined;
}

/**
 * Installs Partner Room analytics event routing at the DOM boundary.
 * @param {{
 *   document: Pick<Document, "addEventListener" | "removeEventListener" | "getElementById">,
 *   window: Pick<Window, "addEventListener" | "removeEventListener" | "history">,
 *   analytics: ReturnType<import("./partner-room-analytics.mjs").createPartnerRoomAnalytics>,
 *   prefersReducedMotion: () => boolean,
 * }} dependencies
 */
export function installPartnerRoomEventRouting({ document, window, analytics, prefersReducedMotion }) {
  function handleRequestClick(event) {
    const link = closest(event.target, "a[data-request-source]");
    if (!link) return;

    analytics.trackRequestClick(link.dataset.requestSource ?? "");
    if (link.getAttribute("href") !== "#request-room") return;

    const requestSection = document.getElementById("request-room");
    const requestHeading = document.getElementById("request-room-title");
    if (!requestSection || !requestHeading) return;

    event.preventDefault();
    requestHeading.focus({ preventScroll: true });
    requestSection.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
    window.history.replaceState(null, "", "#request-room");
  }

  function handleFrameworkClick(event) {
    const trigger = closest(event.target, "[data-framework-trigger]");
    if (!trigger) return;
    analytics.trackFrameworkClick(trigger.dataset.frameworkSource ?? "");
  }

  function handleRequestSubmitted() {
    analytics.trackRequestSubmitted();
  }

  function handleFrameworkLead(event) {
    analytics.trackFrameworkLead(roleFromEvent(event));
  }

  function handleFrameworkDownload() {
    analytics.trackFrameworkDownload();
  }

  document.addEventListener("click", handleRequestClick);
  document.addEventListener("click", handleFrameworkClick);
  window.addEventListener("partner-room:request-submitted", handleRequestSubmitted);
  window.addEventListener("partner-room:framework-lead-submitted", handleFrameworkLead);
  window.addEventListener("partner-room:framework-download-completed", handleFrameworkDownload);

  return () => {
    document.removeEventListener("click", handleRequestClick);
    document.removeEventListener("click", handleFrameworkClick);
    window.removeEventListener("partner-room:request-submitted", handleRequestSubmitted);
    window.removeEventListener("partner-room:framework-lead-submitted", handleFrameworkLead);
    window.removeEventListener("partner-room:framework-download-completed", handleFrameworkDownload);
  };
}

const requestSources = new Set(["nav", "hero", "room"]);
const frameworkSources = new Set(["framework-primary", "framework-secondary"]);
const roles = new Set(["founder", "investor", "other"]);

/**
 * Creates the provider-independent event guards for Partner Room analytics.
 * @param {(name: string, props?: Record<string, string>) => void} emit
 */
export function createPartnerRoomAnalytics(emit) {
  let requestSubmitted = false;
  let frameworkLeadSubmitted = false;
  let frameworkDownloadCompleted = false;

  return {
    /** @param {string} source */
    trackRequestClick(source) {
      if (!requestSources.has(source)) return;
      emit("partner_room_request_clicked", { source_section: source });
    },
    trackRequestSubmitted() {
      if (requestSubmitted) return;
      requestSubmitted = true;
      emit("partner_room_request_submitted");
    },
    /** @param {string} source */
    trackFrameworkClick(source) {
      if (!frameworkSources.has(source)) return;
      emit("framework_download_clicked", { source_section: source });
    },
    /** @param {unknown} role */
    trackFrameworkLead(role) {
      if (frameworkLeadSubmitted) return;
      frameworkLeadSubmitted = true;

      const normalizedRole = typeof role === "string" ? role.trim().toLowerCase() : "";
      emit("framework_lead_submitted", roles.has(normalizedRole) ? { role: normalizedRole } : undefined);
    },
    trackFrameworkDownload() {
      if (frameworkDownloadCompleted) return;
      frameworkDownloadCompleted = true;
      emit("framework_download_completed");
    },
  };
}

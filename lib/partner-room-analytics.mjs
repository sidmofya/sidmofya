const milestoneSections = new Set([
  "mechanism",
  "architectures",
  "founding-room",
  "request-seat",
]);

/**
 * Creates the provider-independent event guards for Partner Room analytics.
 * @param {(name: string, props?: Record<string, string>) => void} emit
 */
export function createPartnerRoomAnalytics(emit) {
  let started = false;
  let completed = false;
  let abandoned = false;
  const depths = new Set();

  return {
    trackCta(location) {
      emit("partner_room_cta_click", { location });
    },
    trackApplicationStart() {
      if (started) return;
      started = true;
      emit("partner_room_application_start");
    },
    trackApplicationComplete() {
      if (completed) return;
      completed = true;
      emit("partner_room_application_complete");
    },
    trackApplicationAbandon() {
      if (!started || completed || abandoned) return;
      abandoned = true;
      emit("partner_room_application_abandon");
    },
    trackSectionDepth(section) {
      if (!milestoneSections.has(section) || depths.has(section)) return;
      depths.add(section);
      emit("partner_room_section_depth", { section });
    },
  };
}

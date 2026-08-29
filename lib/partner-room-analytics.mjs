const milestoneSections = new Set([
  "mechanism",
  "architectures",
  "founding-room",
  "request-seat",
]);

/** @param {{ isIntersecting: boolean, intersectionRatio: number }} entry */
export function isSectionDepthQualified(entry) {
  return entry.isIntersecting && entry.intersectionRatio >= 0.25;
}

/**
 * @param {{ isIntersecting: boolean, intersectionRatio: number }} entry
 * @param {string} architecture
 */
export function toArchitectureIntersection(entry, architecture) {
  return {
    architecture,
    isIntersecting: entry.isIntersecting,
    intersectionRatio: entry.intersectionRatio,
  };
}

/**
 * @param {Map<string, number>} visibleArchitectures
 * @param {{ architecture: string, isIntersecting: boolean, intersectionRatio: number }[]} entries
 */
export function reconcileArchitectureIntersections(visibleArchitectures, entries) {
  const next = new Map(visibleArchitectures);

  for (const entry of entries) {
    if (entry.isIntersecting) {
      next.set(entry.architecture, entry.intersectionRatio);
    } else {
      next.delete(entry.architecture);
    }
  }

  return next;
}

/** @param {Map<string, number>} visibleArchitectures */
export function selectActiveArchitecture(visibleArchitectures) {
  return [...visibleArchitectures.entries()]
    .sort(([firstArchitecture, firstRatio], [secondArchitecture, secondRatio]) => (
      secondRatio - firstRatio || firstArchitecture.localeCompare(secondArchitecture)
    ))[0]?.[0];
}

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

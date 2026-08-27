const PARTNER_ROOM_HOST = "partnerroom.sidmofya.com";
const MAIN_HOSTS = new Set(["sidmofya.com", "www.sidmofya.com"]);

/**
 * @typedef {
 *   | { type: "next" }
 *   | { type: "rewrite", pathname: string }
 *   | { type: "redirect", pathname: string }
 *   | { type: "redirect", url: string }
 * } PartnerRoomRouteDecision
 */

/**
 * @param {{ hostname: string, pathname: string, method: string, siteVariant?: string }} input
 * @returns {PartnerRoomRouteDecision}
 */
export function resolvePartnerRoomRoute({ hostname, pathname, method, siteVariant }) {
  if (method !== "GET" && method !== "HEAD") {
    return { type: "next" };
  }

  const normalizedHost = hostname.toLowerCase().split(":")[0];
  const isPartnerRoomSite =
    siteVariant === "partner-room" || normalizedHost === PARTNER_ROOM_HOST;

  if (isPartnerRoomSite) {
    if (pathname.startsWith("/partner-room/opengraph-image")) {
      return { type: "next" };
    }

    if (pathname === "/") {
      return { type: "rewrite", pathname: "/partner-room" };
    }

    return { type: "redirect", pathname: "/" };
  }

  if (MAIN_HOSTS.has(normalizedHost) && pathname === "/partner-room") {
    return { type: "redirect", url: `https://${PARTNER_ROOM_HOST}/` };
  }

  return { type: "next" };
}

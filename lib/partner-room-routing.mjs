const PARTNER_ROOM_HOST = "partnerroom.sidmofya.com";
const MAIN_HOSTS = new Set(["sidmofya.com", "www.sidmofya.com"]);
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);
const FRAMEWORK_PATH = "/decision-architecture-framework";
const INTERNAL_FRAMEWORK_PATH = "/partner-room/decision-architecture-framework";
const FRAMEWORK_PDF_PATH = "/downloads/how-venture-rooms-decide.pdf";

/**
 * @param {{ requestUrl: string, pathname?: string, url?: string }} input
 */
export function buildPartnerRoomUrl({ requestUrl, pathname, url }) {
  const request = new URL(requestUrl);
  const destination = url ? new URL(url) : new URL(request);

  if (pathname) destination.pathname = pathname;
  destination.search = request.search;

  return destination;
}

/**
 * @typedef {
 *   | { type: "next" }
 *   | { type: "rewrite", pathname: string }
 *   | { type: "redirect", pathname: string }
 *   | { type: "redirect", url: string }
 * } PartnerRoomRouteDecision
 */

/**
 * @param {{ hostname: string, pathname: string, method: string, siteVariant?: string, isDevelopment?: boolean }} input
 * @returns {PartnerRoomRouteDecision}
 */
export function resolvePartnerRoomRoute({
  hostname,
  pathname,
  method,
  siteVariant,
  isDevelopment = false,
}) {
  if (method !== "GET" && method !== "HEAD") {
    return { type: "next" };
  }

  const normalizedHost = hostname.toLowerCase().split(":")[0];
  const isPartnerRoomSite =
    siteVariant === "partner-room" || normalizedHost === PARTNER_ROOM_HOST;

  if (isPartnerRoomSite) {
    if (pathname === "/partner-room/opengraph-image") {
      return { type: "next" };
    }

    if (pathname === "/") {
      return { type: "next" };
    }

    if (pathname === FRAMEWORK_PATH) {
      return { type: "next" };
    }

    if (pathname === FRAMEWORK_PDF_PATH) {
      return { type: "next" };
    }

    return { type: "redirect", pathname: "/" };
  }

  if (pathname === INTERNAL_FRAMEWORK_PATH) {
    if (isDevelopment && LOCAL_HOSTS.has(normalizedHost)) {
      return { type: "next" };
    }

    return {
      type: "redirect",
      url: `https://${PARTNER_ROOM_HOST}${FRAMEWORK_PATH}`,
    };
  }

  if (pathname === FRAMEWORK_PATH) {
    if (isDevelopment && LOCAL_HOSTS.has(normalizedHost)) {
      return { type: "redirect", pathname: INTERNAL_FRAMEWORK_PATH };
    }

    return {
      type: "redirect",
      url: `https://${PARTNER_ROOM_HOST}${FRAMEWORK_PATH}`,
    };
  }

  if (MAIN_HOSTS.has(normalizedHost) && pathname === "/partner-room") {
    return { type: "redirect", url: `https://${PARTNER_ROOM_HOST}/` };
  }

  return { type: "next" };
}

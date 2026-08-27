import { NextResponse, type NextRequest } from "next/server";
import { resolvePartnerRoomRoute } from "@/lib/partner-room-routing.mjs";

const INTERNAL_REWRITE_HEADER = "x-partner-room-internal-rewrite";

export function middleware(request: NextRequest) {
  const decision = resolvePartnerRoomRoute({
    hostname: request.nextUrl.hostname,
    pathname: request.nextUrl.pathname,
    method: request.method,
    siteVariant: process.env.SITE_VARIANT,
    isInternalRewrite: request.headers.get(INTERNAL_REWRITE_HEADER) === "1",
  });

  if (decision.type === "rewrite") {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(INTERNAL_REWRITE_HEADER, "1");

    return NextResponse.rewrite(new URL(decision.pathname, request.url), {
      request: { headers: requestHeaders },
    });
  }

  if (decision.type === "redirect") {
    return NextResponse.redirect(
      "url" in decision ? new URL(decision.url) : new URL(decision.pathname, request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|__forms.html).*)"],
};

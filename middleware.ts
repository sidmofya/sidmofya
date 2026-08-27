import { NextResponse, type NextRequest } from "next/server";
import { resolvePartnerRoomRoute } from "@/lib/partner-room-routing.mjs";

export function middleware(request: NextRequest) {
  const decision = resolvePartnerRoomRoute({
    hostname: request.nextUrl.hostname,
    pathname: request.nextUrl.pathname,
    method: request.method,
    siteVariant: process.env.SITE_VARIANT,
  });

  if (decision.type === "rewrite") {
    return NextResponse.rewrite(new URL(decision.pathname, request.url));
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

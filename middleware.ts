import { NextResponse, type NextRequest } from "next/server";
import {
  buildPartnerRoomUrl,
  resolvePartnerRoomRoute,
} from "@/lib/partner-room-routing.mjs";

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

    return NextResponse.rewrite(buildPartnerRoomUrl({
      requestUrl: request.url,
      pathname: decision.pathname,
    }), {
      request: { headers: requestHeaders },
    });
  }

  if (decision.type === "redirect") {
    return NextResponse.redirect(buildPartnerRoomUrl({
      requestUrl: request.url,
      ...("url" in decision ? { url: decision.url } : { pathname: decision.pathname }),
    }));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|__forms.html).*)"],
};

import { NextResponse, type NextRequest } from "next/server";
import {
  buildPartnerRoomUrl,
  resolvePartnerRoomRoute,
} from "@/lib/partner-room-routing.mjs";

export function middleware(request: NextRequest) {
  const decision = resolvePartnerRoomRoute({
    hostname: request.nextUrl.hostname,
    pathname: request.nextUrl.pathname,
    method: request.method,
    siteVariant: process.env.SITE_VARIANT,
  });

  if (decision.type === "rewrite") {
    return NextResponse.rewrite(buildPartnerRoomUrl({
      requestUrl: request.url,
      pathname: decision.pathname,
    }));
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

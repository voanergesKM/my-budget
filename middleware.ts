import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { hasLocale } from "next-intl";
import createMiddleware from "next-intl/middleware";

import { getValidToken } from "@/app/lib/utils/getValidToken";

import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const AUTH_PAGES = ["/login", "/register"];

export default async function middleware(request: NextRequest) {
  const { pathname, origin, search } = request.nextUrl;
  const pathnameParts = pathname.split("/");

  const cookieLocale = request.cookies.get("locale")?.value;

  const segment = pathnameParts[1];

  const locale = hasLocale(routing.locales, segment)
    ? segment
    : cookieLocale && hasLocale(routing.locales, cookieLocale)
      ? cookieLocale
      : routing.defaultLocale;

  const pathnameWithoutLocale = "/" + pathnameParts.slice(2).join("/");

  const isAuthPage = AUTH_PAGES.includes(pathnameWithoutLocale);
  const isPublicPage = isAuthPage || pathnameWithoutLocale === "/";

  const token = await getValidToken(request);
  const isLoggedIn = !!token;

  if (!isLoggedIn && !isPublicPage) {
    const callbackUrl = encodeURIComponent(pathname + search);
    return NextResponse.redirect(
      new URL(`/${locale}/login?callbackUrl=${callbackUrl}`, origin)
    );
  }

  if (isLoggedIn && isAuthPage) {
    const params = new URLSearchParams(search);
    const callbackUrl = params.get("callbackUrl") || `/${locale}`;
    return NextResponse.redirect(new URL(callbackUrl, origin));
  }

  if (!hasLocale(routing.locales, segment)) {
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}${search}`, origin)
    );
  }

  const response = intlMiddleware(request);
  if (response) return response;

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.[^/]+$).*)"],
};

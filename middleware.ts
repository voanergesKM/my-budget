import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getValidToken } from "@/app/lib/utils/getValidToken";

export async function middleware(request: NextRequest) {
  const token = await getValidToken(request);

  const isLoggedIn = !!token;
  const { pathname, origin, search } = request.nextUrl;

  const isAuthPage = ["/login", "/register"].includes(pathname);
  const isPublicPage = pathname === "/" || isAuthPage;

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isLoggedIn && !isPublicPage) {
    const callbackUrl = encodeURIComponent(pathname + search);
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, origin)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.[^/]+$).*)"],
};

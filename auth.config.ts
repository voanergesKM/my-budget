import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  // callbacks: {
  //   authorized({ auth, request: { nextUrl } }) {
  //     const isLoggedIn = !!auth?.user;
  //     const isPublicPage = ["/login", "/register"].some((p) =>
  //       nextUrl.pathname.startsWith(p)
  //     );

  //     if (!isLoggedIn && !isPublicPage) return false;
  //     return true;
  //   },
  // },
  providers: [],
} satisfies NextAuthConfig;

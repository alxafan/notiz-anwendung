import NextAuth from "next-auth";
import { authConfig } from "~/server/auth/config";
import { auth } from "~/auth";

export const { auth: middleware } = NextAuth(authConfig);

export default auth((req) => {
  const excludedPaths = [
    "/auth/signin",
    "/auth/signup",
    "/auth/reset-password",
  ];
  if (!req.auth && !excludedPaths.includes(req.nextUrl.pathname)) {
    const newUrl = new URL("/auth/signin", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth/signup).*)"],
};

import NextAuth from "next-auth";
import { authConfig } from "~/server/auth/config";
import { auth } from "~/auth";

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|auth/signup|auth/getmail|auth/reset-password/*).*)",
  ],
};

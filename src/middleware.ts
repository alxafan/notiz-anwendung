import NextAuth from "next-auth";
import { authConfig } from "~/server/auth/config";
import { auth } from "~/auth";

export const { auth: middleware } = NextAuth(authConfig);

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname !== "/auth/signin") {
    const newUrl = new URL("/auth/signin", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

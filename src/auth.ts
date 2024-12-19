import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "~/server/db";
import { authConfig } from "~/server/auth/config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(db),
  ...authConfig,
});

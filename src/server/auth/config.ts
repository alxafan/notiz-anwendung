import { type DefaultSession, type NextAuthConfig } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "~/server/db";
import { z } from "zod";

const credentialsSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(100, "Username is too long"),
  password: z
    .string()
    .min(1, "Password is required")
    .max(200, "Password is too long"),
});

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    DiscordProvider,
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req: Request) {
        try {
          // Validate credentials using zod
          const validatedCredentials = credentialsSchema.parse(credentials);

          const { username, password } = validatedCredentials;

          // Logging on server

          // Access request headers
          console.log("User-Agent:", req.headers.get("user-agent"));

          // Access query parameters
          console.log("Redirect URL:", req.redirect);

          const user = await db.user.findUnique({ where: { name: username } });

          if (!user || !password || !user.password) {
            throw new Error("Invalid username or password");
          }

          const isValidPassword = await bcrypt.compare(password, user.password);

          if (!isValidPassword) {
            throw new Error("Invalid username or password");
          }

          return user;
        } catch (error) {
          // Handle validation errors
          console.error("Validation error:", error);
          throw new Error("Invalid username or password");
        }
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
        },
      };
    },
  },
} satisfies NextAuthConfig;

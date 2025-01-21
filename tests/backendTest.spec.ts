/* eslint-disable */
import { test, expect } from "@playwright/test";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "~/server/api/root";
import superjson from "superjson";
import { error } from "console";
//backend test
test.describe("backend test", () => {
  test("create user", async ({}) => {
    //erstellen einen TRPC-Client
    const client = createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: "http://localhost:3000/api/trpc",
          transformer: superjson,
        }),
      ],
    });
    // erwarten, dass die Anmeldung fehlschlägt, da das Passwort zu schwach ist
    try {
      await expect(
        client.auth.signup.mutate({
          username: "test",
          email: "testusermail@mail.com",
          password: "123",
        }),
      ).rejects.toThrowError(
        'Häufige Zeichenfolgen wie "abc" sind leicht zu erraten.',
      );
    } catch (error) {
      console.log(error);
    }
  });
});

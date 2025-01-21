import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "~/server/api/root";
import superjson from "superjson";

const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http/localhost:3000",
      transformer: superjson,
    }),
  ],
});

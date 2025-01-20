/* eslint-disable  */
import { describe, it, expect, jest } from "@jest/globals";
import { appRouter } from "~/server/api/root"; // Stelle sicher, dass der Router korrekt importiert wird
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

jest.mock("@prisma/client"); // Prisma Mock
jest.mock("../server/db", () => {
  const prismaMock = {
    note: {
      create: jest.fn(),
    },
  };
});

// Mock für Benutzer-Authentifizierung
interface User {
  id: string;
  name: string;
  email: string;
}

interface Session {
  user: User;
}

interface MockContext {
  session: Session | null;
}

const mockContext = (user: User | null): MockContext => ({
  session: user ? { user } : null, // Hier gibt es eine `session` für den Benutzer
});

describe("API Resolver Test", () => {
  it("should return UNAUTHRIZED if user is not logged in", async () => {
    const context = mockContext(null); // Hier gibt es keine `session` für den Benutzer

    await expect(
      appRouter.note.createNote
        .arguments({
          title: "Test",
          content: "Test",
          isPrivate: false,
        })
        .resolve(context),
    ).rejects.toThrow("Unauthorized: User not logged in");
  });
});

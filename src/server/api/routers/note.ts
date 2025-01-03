import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const noteRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ content: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.note.create({
        data: {
          title: "Untitled",
          content: input.content,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const note = await ctx.db.note.findFirst({
      where: { createdBy: { id: ctx.session.user.id } },
    });

    return note ?? null;
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  //own NoteCreation
  createNote: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        isPrivate: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user) {
        throw new Error("Unauthorized: User not logged in");
      }

      const note = await ctx.db.note.create({
        data: {
          title: input.title,
          content: input.content,
          createdBy: { connect: { id: ctx.session.user.id } },
          isPrivate: input.isPrivate,
        },
      });
      console.log(note);
      return note;
    }),

  getNoteById: protectedProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      const note = await ctx.db.note.findFirst({
        where: {
          id: input,
        },
        select: {
          title: true,
          content: true,
          isPrivate: true,
          createdById: true,
          createdBy: {
            select: {
              name: true, // Name des Erstellers selektieren
            },
          },
        },
      });

      if (!note) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Überprüfung: Zugriff verweigern, wenn die Notiz privat ist und der User nicht der Ersteller ist
      if (note.isPrivate && note.createdById !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      // Rückgabe der Notiz, wenn die Überprüfung bestanden ist
      return note;
    }),
});

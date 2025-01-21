import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const noteRouter = createTRPCRouter({
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

      // Rückgabe der Notiz, wenn die Überprüfung bestanden ist
      return note;
    }),
  getNoteIdByTitle: protectedProcedure
    .input(z.string().nullable())
    .query(async ({ ctx, input }) => {
      if (!input) return [];
      const ids = await ctx.db.note.findMany({
        where: {
          title: {
            search: input,
          },
          createdById: ctx.session.user.id,
        },
        select: {
          title: true,
          id: true,
        },
      });

      if (!ids) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return ids;
    }),
});

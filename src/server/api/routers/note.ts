import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import sanitizeHtml from "sanitize-html";

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
    .input(z.object({ content: z.string().min(1), isPrivate: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user) {
        throw new Error("Unauthorized: User not logged in");
      }

      // Sanitize the content before saving

      const note = await ctx.db.note.create({
        data: {
          content: input.content,
          createdBy: { connect: { id: ctx.session.user.id } },
          isPrivate: input.isPrivate,
        },
      });
      console.log(note);
      return note;
    }),
});

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import bcrypt from "bcryptjs";
import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import * as zxcvbnDePackage from "@zxcvbn-ts/language-de";
import { sendPasswordResetEmail } from "~/utils/mail";
import crypto from "crypto";
import { db } from "~/server/db";

export const authRouter = createTRPCRouter({
  signup: publicProcedure
    .input(
      z.object({
        username: z.string().min(2),
        email: z.string().email(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if the user already has a session
      if (ctx.session?.user) {
        throw new Error("You are already logged in.");
      }

      //Zxcvbn Optionen setzen
      const options = {
        translations: zxcvbnDePackage.translations,
        graphs: zxcvbnCommonPackage.adjacencyGraphs,
        dictionary: {
          ...zxcvbnCommonPackage.dictionary,
          ...zxcvbnDePackage.dictionary,
        },
      };

      zxcvbnOptions.setOptions(options);

      const passValidation = zxcvbn(input.password);
      const pwstrength = passValidation.score;
      //Überprüfen ob alle Felder ausgefüllt sind
      if (
        !input.username.trim() ||
        !input.email.trim() ||
        !input.password.trim()
      ) {
        throw new Error("All fields must be filled out.");
      }
      //Überprüfen ob die Passwörter übereinstimmen
      if (pwstrength < 4) {
        throw new Error(
          passValidation.feedback.warning ?? "Passwort ist zu schwach",
        );
      }
      //Hashen des Passworts
      const hashedPassword = await bcrypt.hash(input.password, 10);
      //Überprüfen ob der Benutzer schon existiert
      const existingUser = await db.user.findFirst({
        where: {
          name: input.username,
        },
      });

      if (existingUser) {
        throw new Error("Username or Email already exists");
      }
      //Überprüfen ob die Email schon existiert
      const existingEmail = await db.user.findFirst({
        where: {
          email: input.email,
        },
      });

      if (existingEmail) {
        throw new Error("Username or Email already exists");
      }
      //Erstellen des Benutzers
      return await db.user.create({
        data: {
          name: input.username,
          email: input.email,
          password: hashedPassword,
        },
      });
    }),

  //query um die Email zu schicken und den Token zu erstellen, um sein PW zurückzusetzen
  forgotPassword: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      // Überprüfe, ob die E-Mail-Adresse in der Datenbank existiert
      const user = await db.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        return { message: "Password reset email sent!" };
      }

      // Generiere ein Reset-Token
      const resetToken: string = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 3600000); // Das Token ist 1 Stunde lang gültig

      // Speichere das Token in der Datenbank und verknüpfe ihn mit dem user
      await db.passwordReset.create({
        data: {
          userId: user.id,
          token: resetToken,
          expiresAt: expiresAt,
        },
      });

      // Sende die E-Mail mit dem Reset-Link
      await sendPasswordResetEmail(input.email, resetToken);

      return { message: "Password reset email sent!" };
    }),

  //Mutation um das PW zurückzusetzen
  resetPassword: publicProcedure
    .input(z.object({ token: z.string(), newPassword: z.string().min(8) }))
    .mutation(async ({ input }) => {
      // Überprüfe ob das Token in der Datenbank existiert
      const reset = await db.passwordReset.findFirst({
        where: {
          token: input.token,
          expiresAt: {
            gte: new Date(),
          },
        },
      });

      if (!reset) {
        throw new Error("Invalid or expired token");
      }
      //Zxcvbn Optionen setzen
      const options = {
        translations: zxcvbnDePackage.translations,
        graphs: zxcvbnCommonPackage.adjacencyGraphs,
        dictionary: {
          ...zxcvbnCommonPackage.dictionary,
          ...zxcvbnDePackage.dictionary,
        },
      };

      zxcvbnOptions.setOptions(options);
      //Überprüfen ob das Passwort stark genug ist
      const passValidation = zxcvbn(input.newPassword);
      const pwstrength = passValidation.score;

      if (pwstrength < 4) {
        throw new Error(
          passValidation.feedback.warning ?? "Password ist zu schwach",
        );
      }

      // Hash des neuen Passworts
      const hashedPassword = await bcrypt.hash(input.newPassword, 10);

      // Setze das neue Passwort für den Benutzer
      await db.user.update({
        where: {
          id: reset.userId,
        },
        data: {
          password: hashedPassword,
        },
      });

      // Lösche das Token aus der Datenbank
      await db.passwordReset.delete({
        where: {
          id: reset.id,
        },
      });

      return { message: "Password reset successful" };
    }),
  //query um den Token zu bekommen, um zu gucken ob er noch gültig ist
  getToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const token = await db.passwordReset.findFirst({
        where: {
          token: input.token,
          expiresAt: {
            gte: new Date(),
          },
        },
      });

      return token;
    }),
});

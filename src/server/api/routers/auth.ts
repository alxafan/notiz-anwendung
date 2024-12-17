import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import checkPw from '~/app/_components/auth/checkPasswordStrength';
import bcrypt from 'bcryptjs';


import { db } from '~/server/db';

export  const authRouter = createTRPCRouter({
    signup: publicProcedure
        .input(
            z.object({
                username: z.string().min(1, "Username is required"),
                email: z.string().email().min(1, "Email is required"),
                password: z.string().min(8),
            })
        )
        .mutation(async ({ input }) => {
            const passValidation = checkPw(input.password);

            if (!input.username.trim() || !input.email.trim() || !input.password.trim()) {
                throw new Error("All fields must be filled out.");
            }

            
            if(passValidation !== "Starkes Passwort!") {
                throw new Error("Password is not strong enough");
            }
            

            const hashedPassword = await bcrypt.hash(input.password, 10);

            const existingUser = await db.user.findFirst({
                where: {
                    name: input.username,
                }
            })

            if(existingUser) {
                throw new Error("Username already exists");
            }

            const existingEmail = await db.user.findFirst({
                where: {
                    email: input.email,
                }
            })

            if(existingEmail) {
                throw new Error("Email already exists");
            }

            return await db.user.create({
                data: {
                    name: input.username,
                    email: input.email,
                    password: hashedPassword,
                }
            });

           

        })
})
  
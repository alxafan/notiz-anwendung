import { test, expect } from "@jest/globals";
import { appRouter } from "~/server/api/root";
import { db } from "../server/db";


test("signup test", async () => {
  const caller = appRouter.createCaller({session: null, db, headers: new Headers() });

  const userData = {
    email: "test@mail.com",
    password: "bhjdhsdhdashadwawdjkdjafkhbhwduwbduwidbduib",  // Make sure the password is strong enough
    username: "testuser"
  };

  const user = await caller.auth.signup({
    email: userData.email,
    password: userData.password,
    username: userData.username
  })

    // Check if the user was created in the database
   expect(user).toMatchObject({id: expect.any(String), name: userData.username, email: userData.email, password: expect.any(String)});
});



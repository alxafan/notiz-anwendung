"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function SignIn() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  //checkt ob Passwort und RepeatPasswort gleich sind
  const isFormValid = username.trim() !== "" && password.trim() !== "";

  // Handle form submit
  async function handleCredentialsSignIn() {
    if (isFormValid) {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });
      if (result?.error) {
        setErrorMessage("Failed to sign in with credentials:");
      } else {
        setErrorMessage(""); // Clear error message
        router.push("/");
      }
    }
  }
  async function handleDiscordSignIn() {
    await signIn("discord", { redirectTo: "/" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-96 rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-semibold text-gray-800">
          Sign In
        </h1>
        <form className="space-y-4" onSubmit={handleCredentialsSignIn}>
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="w-full">
            <button
              type="button"
              className="w-full rounded-lg bg-indigo-600 py-2 font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={handleDiscordSignIn}
            >
              Sign in with Discord
            </button>
          </div>

          <button
            type="button"
            className={`w-full rounded-lg py-2 font-semibold focus:outline-none focus:ring-2 ${
              isFormValid
                ? "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500"
                : "cursor-not-allowed bg-gray-400 text-gray-200"
            }`}
            disabled={!isFormValid}
            onClick={handleCredentialsSignIn}
          >
            Sign In
          </button>
          {errorMessage && (
            <p className="text-sm text-red-500">{errorMessage}</p>
          )}

          <div className="w-full">
            <button
              type="button"
              onClick={() => router.push("/auth/signup")}
              className="text-sm text-blue-500 hover:underline"
            >
              Noch kein Account? Sign Up
            </button>
          </div>
          <div className="w-full">
            <button
              type="button"
              onClick={() => router.push("/auth/getmail")}
              className="text-sm text-blue-500 hover:underline"
            >
              Passwort vergessen?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

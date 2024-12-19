"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function SignUpForm() {
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
    const result = await signIn("discord", { redirect: false });
    if (result?.error) {
      setErrorMessage("Failed to sign in with Discord:");
    } else {
      setErrorMessage(""); // Clear error message
      router.push("/");
    }
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
            className="w-full rounded-lg bg-indigo-600 py-2 font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={!isFormValid}
            onClick={handleCredentialsSignIn}
          >
            Sign In
          </button>
          {errorMessage && (
            <p className="text-sm text-red-500">{errorMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
}

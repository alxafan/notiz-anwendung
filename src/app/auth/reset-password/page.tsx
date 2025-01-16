"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import checkPw from "~/app/_components/auth/checkPasswordStrength";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token"); // Der Token wird aus der URL abgerufen
  const resetPasswordMutation = api.auth.resetPassword.useMutation();

  //checkt ob Passwort und RepeatPasswort gleich sind
  const isFormValid =
    password === confirmPassword &&
    password.trim() !== "" &&
    confirmPassword.trim() !== "";

  //Setzt die Message, ob pw's gleich sind
  useEffect(() => {
    const checkIfFormValid = () => {
      if (password.trim() === "" || confirmPassword.trim() === "") {
        setMessage(""); // Clear message if fields are empty
      } else if (password !== confirmPassword) {
        setMessage("Passwords do not match");
      } else {
        setMessage(""); // Clear message if passwords match
      }
    };
    checkIfFormValid();
  }, [password, confirmPassword]);

  //Beim eingeben Passwortstärke checken
  useEffect(() => {
    if (password.trim() === "") {
      setMessage(""); // Keine Nachricht, wenn das Passwortfeld leer ist
      setPasswordStrength(false); // Setzt Passwortstärke zurück, wenn leer
    } else {
      const strengthMessage = checkPw(password);
      if (typeof strengthMessage === "string") {
        setMessage(strengthMessage);
      } else {
        setMessage("Password strength check failed");
      }
      if (strengthMessage === "Starkes Passwort!") {
        setPasswordStrength(true);
      } else {
        setPasswordStrength(false);
      }
    }
  }, [password]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid && passwordStrength && token) {
      resetPasswordMutation.mutate(
        {
          token: token,
          newPassword: password,
        },
        {
          onSuccess: () => {
            setTimeout(() => {
              router.push("/auth/signin");
            }, 2000);
          },
          onError: (error) => {
            setErrorMessage(error.message);
          },
        },
      );
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-lg border bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-bold">Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 p-2"
            required
          />
        </div>

        {message && <p className="text-sm text-red-500">{message} </p>}
        {errorMessage && (
          <p className="text-sm text-red-500">{errorMessage} </p>
        )}

        <button
          type="submit"
          className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default function PageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
}

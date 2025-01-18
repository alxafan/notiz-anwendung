"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { zxcvbn } from "@zxcvbn-ts/core";

const ResetPasswordPage = ({ token }: { token: string }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const resetPasswordMutation = api.auth.resetPassword.useMutation();
  const { data: userToken, isLoading } = api.auth.getToken.useQuery({
    token: token,
  });
  const [passwordScore, setPasswordScore] = useState(0);

  //checkt ob Passwort und RepeatPasswort gleich sind
  const isFormValid =
    password === confirmPassword &&
    password.trim() !== "" &&
    confirmPassword.trim() !== "";

  //passwortstärke setzen
  useEffect(() => {
    const pwStrength = zxcvbn(password);
    setPasswordScore(pwStrength.score);
  }, [password]);

  //Farbe für Passwortstärke setzen
  const strengthColor = (score: number) => {
    switch (score) {
      case 0:
        return "bg-red-500";
      case 1:
        return "bg-red-300";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-yellow-300";
      case 4:
        return "bg-green-500";
      default:
        return;
    }
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid && token) {
      resetPasswordMutation.mutate(
        {
          token: token,
          newPassword: password,
        },
        {
          onSuccess: () => {
            setMessage("Password reset successful");
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

  if (isLoading) {
    return <div>Loading...</div>;
  }
  //wenn token ungültig oder abgelaufen ist
  if (!userToken) {
    return <div>Invalid or expired token</div>;
  }

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

        <div className="mt-2 flex items-center">
          <div
            className={`h-2 w-1/2 rounded-full ${strengthColor(passwordScore)}`}
          />
        </div>

        {message && <p className="text-sm text-green-500">{message} </p>}
        {errorMessage && (
          <p className="text-sm text-red-500">{errorMessage} </p>
        )}

        <button
          type="submit"
          className={`w-full rounded-lg py-2 font-semibold focus:outline-none focus:ring-2 ${
            isFormValid
              ? "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500"
              : "cursor-not-allowed bg-gray-400 text-gray-200"
          }`}
          disabled={!isFormValid}
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;

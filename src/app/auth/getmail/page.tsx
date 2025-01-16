"use client";
import React, { useState } from "react";
import { api } from "~/trpc/react";

const GetMailPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const forgotPassword = api.auth.forgotPassword.useMutation();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (email !== confirmEmail) {
      setError("Emails do not match");
    } else {
      setError("");
      // Handle successful email submission
      forgotPassword.mutate(
        {
          email,
        },
        {
          onSuccess: () => {
            setMessage("Email sent successfully. Check your inbox.");
          },
        },
      );
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-lg">
      <h1 className="mb-6 text-center text-2xl font-semibold text-gray-700">
        Enter Your Email
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="mb-2 block font-medium text-gray-600">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label className="mb-2 block font-medium text-gray-600">
            Confirm Email:
          </label>
          <input
            type="email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            required
            className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {error && (
          <p className="mb-4 text-center text-sm text-red-500">{error}</p>
        )}
        {message && (
          <p className="mb-4 text-center text-sm text-green-500">{message}</p>
        )}
        <button
          type="submit"
          className="w-full rounded-md bg-blue-500 p-3 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default GetMailPage;

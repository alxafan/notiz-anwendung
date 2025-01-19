"use client";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import * as zxcvbnDePackage from "@zxcvbn-ts/language-de";
export default function SignUpForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);

  const authentication = api.auth.signup.useMutation();

  const options = {
    translations: zxcvbnDePackage.translations,
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
    dictionary: {
      ...zxcvbnCommonPackage.dictionary,
      ...zxcvbnDePackage.dictionary,
    },
  };

  zxcvbnOptions.setOptions(options);
  //checkt ob Passwort und RepeatPasswort gleich sind
  const isFormValid =
    username.trim() !== "" &&
    username.length >= 2 &&
    email.trim() !== "" &&
    password === repeatPassword &&
    password.trim() !== "" &&
    repeatPassword.trim() !== "";

  //Setzt die Message, ob pw's gleich sind
  useEffect(() => {
    const checkIfFormValid = () => {
      if (password.trim() === "" || repeatPassword.trim() === "") {
        setMessage(""); // Clear message if fields are empty
      } else if (password !== repeatPassword) {
        setMessage("Passwords do not match");
      } else {
        setMessage(""); // Clear message if passwords match
      }
    };
    checkIfFormValid();
  }, [password, repeatPassword]);

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
        return "bg-orange-500";
      case 3:
        return "bg-yellow-500";
      case 4:
        return "bg-green-500";
      default:
        return;
    }
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form default submission
    // Check if form is valid... trpc route später noch aufrufen
    setErrorMessage("");
    if (isFormValid) {
      authentication.mutate(
        {
          email,
          password,
          username,
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

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-96 rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-semibold text-gray-800">
          Sign Up
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
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
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={repeatPassword}
              onChange={(e) => {
                setRepeatPassword(e.target.value);
              }}
              className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {message && <p className="text-sm text-red-500">{message} </p>}

          {/* Dropdown für Passwortanforderungen */}
          <div className="relative">
            <button
              type="button"
              onClick={toggleDropdown}
              className="text-sm text-blue-500 hover:underline"
            >
              Passwortanforderungen anzeigen
            </button>
            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 rounded-lg border bg-white p-4 shadow-lg">
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>- Der Balken muss grün sein!</li>
                </ul>
              </div>
            )}
          </div>

          <div className="mt-2 flex items-center">
            <div
              className={`h-2 w-1/2 rounded-full ${strengthColor(passwordScore)}`}
            />
          </div>

          <button
            type="submit"
            className={`w-full rounded-lg py-2 font-semibold focus:outline-none focus:ring-2 ${
              isFormValid
                ? "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500"
                : "cursor-not-allowed bg-gray-400 text-gray-200"
            }`}
            disabled={!isFormValid}
          >
            Sign Up
          </button>
          {errorMessage && (
            <p className="text-sm text-red-500">{errorMessage}</p>
          )}

          <div className="w-full">
            <button
              type="button"
              onClick={() => router.push("/auth/signin")}
              className="text-sm text-blue-500 hover:underline"
            >
              Schon ein Account? Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

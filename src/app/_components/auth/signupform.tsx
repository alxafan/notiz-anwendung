'use client'
import { useEffect, useState } from 'react';
import  checkPw  from './checkPasswordStrength';
import { api } from "~/trpc/react";
import Link from 'next/link';
import { redirect } from 'next/dist/server/api-utils';
import { useRouter } from 'next/navigation';
export default function SignUpForm() {

    const router = useRouter();
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ repeatPassword, setRepeatPassword ] = useState("");
    const [ username, setUsername ] = useState("");
    const [ message, setMessage ] = useState("");
    const [ errorMessage, setErrorMessage ] = useState("");
    const [ isDropdownOpen, setIsDropdownOpen ] = useState(false);
    const [ passwordStrength, setPasswordStrength ] = useState(false);
    const authentication = api.auth.signup.useMutation();



    //checkt ob Passwort und RepeatPasswort gleich sind
    const isFormValid =
      username.trim() !== "" &&
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

    //Beim eingeben Passwortstärke checken
    useEffect(() => {
      if (password.trim() === "") {
        setMessage(""); // Keine Nachricht, wenn das Passwortfeld leer ist
        setPasswordStrength(false); // Setzt Passwortstärke zurück, wenn leer
      } else {
        const strengthMessage = checkPw(password);
        if (typeof strengthMessage === 'string') {
          setMessage(strengthMessage);
        } else {
          setMessage("Password strength check failed");
        }
        if(strengthMessage === "Starkes Passwort!") {
          setPasswordStrength(true);
        } else {
          setPasswordStrength(false);
        }
      }
    }, [password]);

 

    // Handle form submit
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault(); // Prevent form default submission
      // Check if form is valid... trpc route später noch aufrufen
      if (isFormValid && passwordStrength) {
        authentication.mutate({
          email,
          password,
          username,
        }, {
          onSuccess: () => {

            setTimeout(() => {
              router.push("/");
            }, 2000);
          },
          onError: (error) => {
            setErrorMessage(error.message);
          }
          
        });
      }

    };

    const toggleDropdown = () => {
      setIsDropdownOpen((prev) => !prev);
    };

  return(
    
  <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Sign Up</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
        <input
            type="password"
            placeholder="Confirm Password"
            value={repeatPassword}
            onChange={(e) => { setRepeatPassword(e.target.value) }}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        {message && <p className="text-red-500 text-sm">{message} </p>}

          {/* Dropdown für Passwortanforderungen */}
          <div className="relative">
            <button
              type="button"
              onClick={toggleDropdown}
              className="text-blue-500 text-sm hover:underline"
            >
              Passwortanforderungen anzeigen
            </button>
            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 p-4 bg-white border rounded-lg shadow-lg w-72">
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>- Mindestens 8 Zeichen</li>
                  <li>- Ein Großbuchstabe (A-Z)</li>
                  <li>- Ein Kleinbuchstabe (a-z)</li>
                  <li>- Eine Zahl (0-9)</li>
                  <li>- Ein Sonderzeichen (!@#$%^&*...)</li>
                  <li>- Keine mehr als 2 gleiche hintereinander stehenden Zeichen</li>
                  <li>- Keine aufeinanderfolgende Zeichenfolge wie &quot;123&quot; oder &quot;abc&quot;</li>
                </ul>
              </div>
            )}
          </div>

          <div className='w-full'>
            <button
                  
                  className=' w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                ><Link href={"/api/auth/signin"}>
                  {"Sign in with Discord"}
                  </Link>
          </button>
        </div>

        <button
          type="submit"
          className=" w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
          disabled={!isFormValid || !passwordStrength}
        >
          Sign Up
        </button>
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

      </form>
    </div>
  </div>

    
  )
}
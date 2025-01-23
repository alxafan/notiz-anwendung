import React from "react";
import Link from "next/link";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="text-2xl font-bold">
          <Link href="/">Notiz Anwendung</Link>
        </div>
        <ul className="flex space-x-4">
          <li>
            <Link
              href="/"
              className="text-white transition-colors hover:text-blue-200"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/createNote"
              className="text-white transition-colors hover:text-blue-200"
            >
              Notiz erstellen
            </Link>
          </li>
          <li>
            <Link
              href="/documents/search"
              className="text-white transition-colors hover:text-blue-200"
            >
              Notiz suchen
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
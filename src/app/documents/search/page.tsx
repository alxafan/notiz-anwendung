"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, Suspense } from "react";
import { api } from "~/trpc/react";
import Link from "next/link";

function Search() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const { data } = api.note.getNoteIdByTitle.useQuery(query);
  console.log(pathname, data);
  return (
    <div className="container mx-auto p-4">
      <h1>Suche nach Notizen</h1>
      <SearchBar />
      <div className="mt-4">Suchbegriff: {searchParams.get("q")}</div>
      {Array.isArray(data) && data.length > 0 ? (
        <ul className="mt-4">
          {data.map((e) => (
            <li key={e.id}>
              <Link className="text-cyan-500" href={`/documents/${e.id}`}>
                {e.title + ": " + e.id}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4">No notes found.</div>
      )}
    </div>
  );
}

function SearchBar() {
  const [title, setTitle] = useState("");
  const router = useRouter();

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Parameter url encoden für Schutz vor Angriffen
    router.push(`?q=${encodeURIComponent(title)}`);
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Titel der Notiz"
          className="w-full rounded-md border p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search
        </button>
      </form>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchBar />}>
      <Search />
    </Suspense>
  );
}

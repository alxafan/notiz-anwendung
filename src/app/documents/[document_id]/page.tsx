import React from "react";
import { TRPCError } from "@trpc/server";
import { api } from "~/trpc/server";
import Note from "~/app/_components/note";

async function DocumentPage({
  params,
}: {
  params: Promise<{ document_id: string }>;
}) {
  const document_id = (await params).document_id;

  try {
    // Versuche, die Notiz zu laden
    const note = await api.note.getNoteById(document_id);

    if (!note) {
      return <div>No data found.</div>;
    }

    // Erfolgreiches Rendern der Notiz
    return (
      <div className="rounded-lg bg-gray-100 p-4 shadow-md">
        <h1 className="mb-4 text-2xl font-bold">{note.title}</h1>
        <Note content={note.content} />
        <h2 className="mt-4">Erstellt von {note.createdBy.name}</h2>
      </div>
    );
  } catch (error) {
    // Fehler abfangen und rendern
    let errorMessage = "An unexpected error occurred.";

    if (error instanceof TRPCError) {
      switch (error.code) {
        case "NOT_FOUND":
          errorMessage = "The requested note was not found.";
          break;
        case "FORBIDDEN":
          errorMessage = "You do not have access to this note.";
          break;
        default:
          errorMessage = "Something went wrong. Please try again later.";
          break;
      }
    }

    return (
      <div className="rounded-lg bg-red-100 p-4 text-red-800 shadow-md">
        <h1 className="mb-4 text-2xl font-bold">Error</h1>
        <p>{errorMessage}</p>
      </div>
    );
  }
}

export default DocumentPage;

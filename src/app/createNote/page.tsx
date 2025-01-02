"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { api } from "~/trpc/react";
import DOMPurify from "dompurify";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

export default function CreateNotPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const createNoteMutation = api.note.createNote.useMutation();

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setContent(event.target.value);
  };

  const handlePrivacyToggle = () => {
    setIsPrivate(!isPrivate);
  };

  useEffect(() => {
    if (content) {
      setPreview(DOMPurify.sanitize(content));
    }
  }, [content]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Bereinige den Inhalt vor der Speicherung
    const sanitizedContent = DOMPurify.sanitize(content);

    try {
      // Notiz erstellen
      await createNoteMutation.mutateAsync({
        title: title,
        content: sanitizedContent,
        isPrivate,
      });
      setMessage("Notiz erfolgreich erstellt");
      setTimeout(() => {
        setTitle("");
        setContent("");
        setPreview("");
        setMessage("");
        setErrorMessage("");
      }, 3000);
    } catch (error) {
      setErrorMessage("Es gab einen Fehler beim Erstellen der Notiz");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Erstelle eine Notiz</h1>
      <p className="mb-2 text-sm text-gray-500">
        nach einem html tag muss eine Zeile frei sein, um mit markdown
        fortzufahren
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Titel der Notiz"
          className="w-full rounded-md border p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Schreibe hier deine Markdown/HTML-Tag Notiz..."
          rows={10}
          cols={50}
          className="w-full rounded-md border p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={handlePrivacyToggle}
            className="mr-2"
          />
          <label className="text-sm">Mache diese Notiz privat</label>
        </div>

        <button
          type="submit"
          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Speichern
        </button>
        <p className="text-green-500">{message}</p>
        <p className="text-red-500">{errorMessage}</p>
      </form>

      <h3 className="mt-6 text-xl font-semibold">Vorschau:</h3>
      <div className="preview min-h-40 rounded-md border p-4 shadow-sm">
        <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
          {preview}
        </ReactMarkdown>
      </div>
    </div>
  );
}

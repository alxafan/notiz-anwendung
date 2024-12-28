"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { api } from "~/trpc/react";
import DOMPurify from "dompurify";
import rehypeRaw from "rehype-raw";

export default function CreateNotPage() {
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [message, setMessage] = useState("");

  const createNoteMutation = api.note.createNote.useMutation();

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
      createNoteMutation.mutate({
        content: sanitizedContent,
        isPrivate,
      });
      setMessage("Note created successfully");
    } catch (error) {
      setMessage("An error occurred while creating the note");
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Create a New Note</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Write your markdown here..."
          rows={10}
          cols={50}
          className="textarea"
        />

        <div>
          <label>
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={handlePrivacyToggle}
            />
            Make this note private
          </label>
        </div>

        <button type="submit">Save Note</button>
        <p>{message}</p>
      </form>

      <h3>Preview:</h3>
      <div className="preview">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{preview}</ReactMarkdown>
      </div>
    </div>
  );
}

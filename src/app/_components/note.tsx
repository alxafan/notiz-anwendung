"use client";
import DOMPurify from "dompurify";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

export default function Note({ content }: { content: string }) {
  const sanitizedContent = DOMPurify.sanitize(content);
  return (
    <div className="preview w-auto rounded-md border p-4 shadow-sm">
      <ReactMarkdown
        className="prose items-center justify-center"
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
      >
        {sanitizedContent}
      </ReactMarkdown>
    </div>
  );
}

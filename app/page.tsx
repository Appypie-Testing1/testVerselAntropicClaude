"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import Image from "next/image";
import type { Attachment } from "ai";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat();

  // Define your attachments as URLs
  // This follows the exact pattern from the Vercel AI SDK documentation
  const [attachments] = useState<Attachment[]>([
    {
      name: "example-image.jpg",
      contentType: "image/jpeg",
      // Replace this with your actual hosted image URL
      url: "https://pub-41b5387f42d14cd2972b55faa125b6dd.r2.dev/1websitedesign(1).png",
    },
    // You can add more attachments here
  ]);

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap mb-4">
          <div className="font-bold mb-1">{m.role === "user" ? "User: " : "AI: "}</div>
          <div>{m.content}</div>
          <div className="mt-2">
            {m?.experimental_attachments
              ?.filter(
                (attachment) =>
                  attachment?.contentType?.startsWith("image/") ||
                  attachment?.contentType?.startsWith("application/pdf")
              )
              .map((attachment, index) =>
                attachment.contentType?.startsWith("image/") ? (
                  <Image
                    key={`${m.id}-${index}`}
                    src={attachment.url}
                    width={500}
                    height={500}
                    alt={attachment.name ?? `attachment-${index}`}
                  />
                ) : attachment.contentType?.startsWith("application/pdf") ? (
                  <iframe
                    key={`${m.id}-${index}`}
                    src={attachment.url}
                    width={500}
                    height={600}
                    title={attachment.name ?? `attachment-${index}`}
                  />
                ) : null
              )}
          </div>
        </div>
      ))}

      <form
        className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl space-y-2"
        onSubmit={(event) => {
          handleSubmit(event, {
            experimental_attachments: attachments,
          });
        }}
      >
        <div className="flex flex-col space-y-2">
          <div className="text-sm text-green-600">
            Using predefined image URLs
          </div>
          
          <input
            className="w-full p-2 border rounded"
            value={input}
            placeholder="Send message..."
            onChange={handleInputChange}
            disabled={status !== 'ready'}
          />
          
          <button 
            type="submit" 
            className="p-2 bg-blue-500 text-white rounded"
            disabled={status !== 'ready'}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
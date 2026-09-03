"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";

function ScoreCard({
  isCorrect,
  score,
  feedback,
}: {
  isCorrect: boolean;
  score: number;
  feedback: string;
}) {
  return (
    <div
      className={`mt-2 rounded-xl border-2 p-4 transition-all ${
        isCorrect
          ? "border-green-400 bg-green-50"
          : score > 0
          ? "border-orange-400 bg-orange-50"
          : "border-red-400 bg-red-50"
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl">{isCorrect ? "✅" : score > 0 ? "🟠" : "❌"}</span>
        <span className="text-lg font-bold">{score}/100</span>
      </div>
      <p className="text-sm text-gray-700">{feedback}</p>
    </div>
  );
}

function ToolStatus({ label }: { label: string }) {
  return (
    <div className="mt-2 flex items-center gap-2 rounded-xl border bg-gray-100 px-4 py-3 text-sm text-gray-500 animate-pulse">
      <span className="h-2 w-2 rounded-full bg-gray-400 animate-ping" />
      {label}
    </div>
  );
}

function ToolError() {
  return (
    <div className="mt-2 rounded-xl border-2 border-red-400 bg-red-50 p-4 text-sm text-red-600">
      Couldn&apos;t check this answer. Please try again.
    </div>
  );
}

export default function GeneratePage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();

  const isLoading = status === "submitted" || status === "streaming";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  }

  return (
    <main className="min-h-screen flex flex-col max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-1">Generate a Quiz or Flashcards</h1>
      <p className="text-gray-500 text-sm mb-4">
        Paste your notes or a topic below, and AI will build study material for you.
      </p>

      <div className="flex-1 overflow-y-auto flex flex-col gap-3 mb-4 min-h-[300px] max-h-[55vh] border rounded-lg p-4 bg-gray-50">
        {messages.length === 0 && (
          <p className="text-gray-400 text-sm text-center mt-8">
            Try: &quot;Make me a 5-question quiz on the water cycle.&quot;
          </p>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
              message.role === "user"
                ? "self-end bg-primary text-white"
                : "self-start bg-white border text-foreground"
            }`}
          >
            {message.parts.map((part, i) => {
              // plain text
              if (part.type === "text") {
                return <span key={i}>{part.text}</span>;
              }

              // our checkAnswer tool — render each lifecycle state distinctly
              if (part.type === "tool-checkAnswer") {
                if (part.state === "input-streaming") {
                  return <ToolStatus key={i} label="Reading the answer..." />;
                }
                if (part.state === "input-available") {
                  return <ToolStatus key={i} label="Checking your answer..." />;
                }
                if (part.state === "output-available") {
                  const output = part.output as {
                    isCorrect: boolean;
                    score: number;
                    feedback: string;
                  };
                  return <ScoreCard key={i} {...output} />;
                }
                if (part.state === "output-error") {
                  return <ToolError key={i} />;
                }
              }

              return null;
            })}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your notes or a topic..."
          disabled={isLoading}
          className="flex-1 border rounded-full px-4 py-3 text-sm outline-none focus:border-primary disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-5 py-3 rounded-full bg-primary text-white text-sm font-medium disabled:opacity-50"
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
    </main>
  );
}
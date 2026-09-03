"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { ScoreCard } from "./ScoreCard";

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

function MessageSkeleton() {
  return (
    <div className="self-start max-w-[85%] px-4 py-3 rounded-2xl bg-white border animate-pulse w-64">
      <div className="h-3 bg-gray-200 rounded w-full mb-2" />
      <div className="h-3 bg-gray-200 rounded w-5/6 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-2/3" />
    </div>
  );
}

function EmptyState({ onExampleClick }: { onExampleClick: (text: string) => void }) {
  const examples = [
    "Make me a 5-question quiz on the water cycle",
    "Create flashcards on World War II key events",
    "Quiz me on basic React hooks",
  ];

  return (
    <div className="flex flex-col items-center justify-center text-center py-10 gap-3">
      <div className="text-3xl">📚</div>
      <p className="text-gray-500 text-sm">
        No quizzes yet — try one of these to get started:
      </p>
      <div className="flex flex-col gap-2 w-full max-w-sm">
        {examples.map((ex) => (
          <button
            key={ex}
            onClick={() => onExampleClick(ex)}
            className="text-sm text-left px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 text-gray-700"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function GeneratePage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error, regenerate } = useChat();

  const isLoading = status === "submitted" || status === "streaming";
  const hasError = status === "error";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  }

  function handleExampleClick(text: string) {
    if (isLoading) return;
    sendMessage({ text });
  }

  return (
    <main className="min-h-[100dvh] flex flex-col max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-1">Generate a Quiz or Flashcards</h1>
      <p className="text-gray-500 text-sm mb-4">
        Paste your notes or a topic below, and AI will build study material for you.
      </p>

      <div className="flex-1 overflow-y-auto flex flex-col gap-3 mb-4 min-h-[300px] max-h-[55vh] border rounded-lg p-4 bg-gray-50">
        {messages.length === 0 && !isLoading && (
          <EmptyState onExampleClick={handleExampleClick} />
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
              if (part.type === "text") {
                return <span key={i}>{part.text}</span>;
              }

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

        {status === "submitted" && <MessageSkeleton />}

        {hasError && (
          <div className="self-start max-w-[85%] rounded-xl border-2 border-red-400 bg-red-50 p-4 text-sm">
            <p className="text-red-600 mb-2">
              {error?.message?.includes("429") || error?.message?.toLowerCase().includes("rate")
                ? "Too many requests right now — please wait a moment."
                : "Something interrupted the response. Your message wasn't lost."}
            </p>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => regenerate()}
              className="px-4 py-2 rounded-full bg-red-500 text-white text-xs font-medium disabled:opacity-50"
            >
              {isLoading ? "Retrying..." : "Retry"}
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your notes or a topic..."
          disabled={isLoading}
          inputMode="text"
          className="flex-1 border rounded-full px-4 py-3 text-base sm:text-sm outline-none focus:border-primary disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-5 py-3 rounded-full bg-primary text-white text-sm font-medium disabled:opacity-50 shrink-0"
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
    </main>
  );
}
"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function GeneratePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (isAtBottomRef.current && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    isAtBottomRef.current = distanceFromBottom < 40;
  }

  function stop() {
    abortControllerRef.current?.abort();
    setIsLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
    };

    const assistantId = crypto.randomUUID();
    const nextMessages = [...messages, userMessage];

    setMessages([...nextMessages, { id: assistantId, role: "assistant", content: "" }]);
    setInput("");
    setIsLoading(true);
    isAtBottomRef.current = true;

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: controller.signal,
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        accumulated += decoder.decode(value, { stream: true });

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: accumulated } : m
          )
        );
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: "Something went wrong. Please try again." }
              : m
          )
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }

  return (
    <main className="min-h-screen flex flex-col max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-1">Generate a Quiz or Flashcards</h1>
      <p className="text-gray-500 text-sm mb-4">
        Paste your notes or a topic below, and AI will build study material for you.
      </p>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto flex flex-col gap-3 mb-4 min-h-[300px] max-h-[55vh] border rounded-lg p-4 bg-gray-50"
      >
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
            {message.content || (isLoading ? "Thinking..." : "")}
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
        {isLoading ? (
          <button
            type="button"
            onClick={stop}
            className="px-5 py-3 rounded-full bg-red-500 text-white text-sm font-medium"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-5 py-3 rounded-full bg-primary text-white text-sm font-medium disabled:opacity-50"
          >
            Send
          </button>
        )}
      </form>
    </main>
  );
}
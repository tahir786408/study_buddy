"use client";

import { useState, useRef } from "react";

type ButtonState = "idle" | "loading" | "success" | "error";

export default function ButtonDemoPage() {
  const [state, setState] = useState<ButtonState>("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleClick() {
    // interruptible: clicking mid-transition restarts cleanly instead of stacking
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setState("loading");

    const delay = 1200 + Math.random() * 800; // fake async call
    const willFail = Math.random() < 0.2; // 20% failure rate

    timeoutRef.current = setTimeout(() => {
      setState(willFail ? "error" : "success");
      timeoutRef.current = setTimeout(() => setState("idle"), 1800);
    }, delay);
  }

  const isDisabled = state === "loading";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-6">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold mb-2">Buttons with a Brain</h1>
        <p className="text-sm text-gray-500">
          Click the button below. It has a 20% random chance of failing, so click a
          few times to see both success and error states.
        </p>
      </div>

      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={`
          relative overflow-hidden flex items-center justify-center gap-2
          px-6 py-3 rounded-full font-medium text-white
          transition-all duration-300 ease-out
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
          disabled:cursor-not-allowed
          motion-reduce:transition-none
          ${state === "idle" ? "bg-primary hover:bg-primary/90 hover:scale-[1.03] w-40" : ""}
          ${state === "loading" ? "bg-primary/80 w-40" : ""}
          ${state === "success" ? "bg-green-500 w-40" : ""}
          ${state === "error" ? "bg-red-500 w-40 motion-safe:animate-[shake_0.4s_ease-in-out]" : ""}
        `}
      >
        {state === "idle" && <span>Send</span>}

        {state === "loading" && (
          <>
            <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            <span>Sending...</span>
          </>
        )}

        {state === "success" && (
          <>
            <svg
              className="h-4 w-4 motion-safe:animate-[pop_0.3s_ease-out]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Sent!</span>
          </>
        )}

        {state === "error" && <span>Failed — Retry</span>}
      </button>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        @keyframes pop {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </main>
  );
}
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center max-w-md mx-auto p-6 text-center">
      <div className="text-4xl mb-3">⚠️</div>
      <h2 className="text-lg font-bold mb-2">Something went wrong</h2>
      <p className="text-sm text-gray-500 mb-6">
        The quiz generator hit an unexpected error. This has been logged — try again.
      </p>
      <button
        onClick={reset}
        className="px-5 py-3 rounded-full bg-primary text-white text-sm font-medium"
      >
        Try again
      </button>
    </main>
  );
}
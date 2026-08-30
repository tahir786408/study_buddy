import { useState, useId, ReactNode } from "react";

interface DisclosureProps {
  summary: string;
  children: ReactNode;
}

export default function Disclosure({ summary, children }: DisclosureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = useId();

  return (
    <div className="border rounded-lg">
      <button
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex justify-between items-center px-4 py-3 text-left font-medium"
      >
        {summary}
        <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && (
        <div id={contentId} className="px-4 pb-3 text-gray-600">
          {children}
        </div>
      )}
    </div>
  );
}
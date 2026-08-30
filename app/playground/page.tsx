"use client";

import { useState } from "react";
import Modal from "./Modal";
import Tabs from "./Tabs";
import Disclosure from "./Disclosure";

export default function PlaygroundPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tabsData = [
    { id: "one", label: "First Tab", content: "Content for the first tab." },
    { id: "two", label: "Second Tab", content: "Content for the second tab." },
    { id: "three", label: "Third Tab", content: "Content for the third tab." },
  ];

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto flex flex-col gap-10">
      <h1 className="text-2xl font-bold">Accessibility Playground</h1>

      <section>
        <h2 className="text-lg font-semibold mb-3">Modal Dialog</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-primary text-white rounded"
        >
          Open Modal
        </button>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Example Modal"
        >
          <p>Try pressing Tab to see focus stay trapped inside, and Escape to close.</p>
          <input
            type="text"
            placeholder="A focusable field"
            className="border mt-3 px-3 py-2 rounded w-full"
          />
        </Modal>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Tabs</h2>
        <Tabs tabs={tabsData} />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Disclosure</h2>
        <Disclosure summary="Click to expand">
          This content is hidden until the disclosure is opened.
        </Disclosure>
      </section>
    </main>
  );
}
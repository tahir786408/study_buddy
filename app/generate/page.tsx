import GenerateIcon from "../components/GenerateIcon";

export default function GeneratePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 gap-6 text-center">
      <GenerateIcon />
      <h1 className="text-3xl font-bold">Generate a Quiz or Flashcards</h1>
      <p className="text-gray-500">Paste your notes or topic here, and AI will build study material for you.</p>
    </main>
  );
}
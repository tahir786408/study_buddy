import StudyIcon from "../components/StudyIcon";

export default function StudyPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 gap-6 text-center">
      <StudyIcon />
      <h1 className="text-3xl font-bold">Your Study Session</h1>
      <p className="text-gray-500">Your generated quiz or flashcards will appear here.</p>
    </main>
  );
}
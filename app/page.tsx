import HeroIcon from "./components/HeroIcon";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center gap-6">
      <HeroIcon />
      <h1 className="text-4xl font-bold">StudyBuddy</h1>
      <p className="text-gray-500 max-w-md">
        Turn your notes into quizzes and flashcards, instantly, using AI.
      </p>
    </main>
  );
}
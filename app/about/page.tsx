import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center gap-6">
      <Image
        src="/profile.jpeg"
        alt="Muhammad Tahir Fareed"
        width={140}
        height={140}
        className="rounded-full object-cover"
      />
      <h1 className="text-3xl font-bold">About StudyBuddy</h1>
      <p className="text-gray-500 max-w-md">
        StudyBuddy helps students turn their notes into quizzes and flashcards using AI —
        making revision faster and more effective.
      </p>
    </main>
  );
}
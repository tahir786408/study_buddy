import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-200">
      <Link href="/" className="font-bold text-lg">
        StudyBuddy
      </Link>
      <div className="flex gap-6 text-sm font-medium">
        <Link href="/generate">Generate</Link>
        <Link href="/study">Study</Link>
        <Link href="/about">About</Link>
      </div>
    </nav>
  );
}
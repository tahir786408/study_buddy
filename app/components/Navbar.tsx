import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white">
      <Link href="/" className="font-bold text-lg text-primary">
        StudyBuddy
      </Link>
      <div className="flex gap-6 text-sm font-medium text-foreground">
        <Link href="/generate" className="hover:text-primary transition-colors">
          Generate
        </Link>
        <Link href="/study" className="hover:text-primary transition-colors">
          Study
        </Link>
        <Link href="/about" className="hover:text-primary transition-colors">
          About
        </Link>
      </div>
    </nav>
  );
}
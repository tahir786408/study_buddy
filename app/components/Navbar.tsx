import Link from 'next/link';
import Logo from './logo';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white">
      <Link href="/" className="flex items-center gap-3 font-bold text-lg text-primary">
        <Logo size={36} />
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
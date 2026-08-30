export default function HeroIcon() {
    return (
      <svg
        width="180"
        height="180"
        viewBox="0 0 180 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Back card */}
        <rect x="30" y="40" width="110" height="80" rx="12" fill="#EDE9FE" />
        {/* Front card */}
        <rect x="45" y="55" width="110" height="80" rx="12" fill="#7C3AED" />
        {/* Lines representing text on the front card */}
        <rect x="65" y="80" width="60" height="8" rx="4" fill="white" opacity="0.9" />
        <rect x="65" y="96" width="40" height="8" rx="4" fill="white" opacity="0.6" />
        {/* Small checkmark badge */}
        <circle cx="140" cy="130" r="18" fill="#22C55E" />
        <path
          d="M132 130l5 5 10-10"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
export default function StudyIcon() {
    return (
      <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Back flashcard */}
        <rect x="30" y="35" width="90" height="65" rx="10" fill="#EDE9FE" />
        {/* Front flashcard, slightly rotated for a "stack" feel */}
        <g transform="rotate(-4 80 75)">
          <rect x="40" y="55" width="90" height="65" rx="10" fill="#7C3AED" />
          <rect x="55" y="75" width="50" height="6" rx="3" fill="white" opacity="0.9" />
          <rect x="55" y="90" width="34" height="6" rx="3" fill="white" opacity="0.6" />
        </g>
        {/* Progress dots below, representing multiple cards to study */}
        <circle cx="60" cy="135" r="4" fill="#7C3AED" />
        <circle cx="76" cy="135" r="4" fill="#7C3AED" opacity="0.5" />
        <circle cx="92" cy="135" r="4" fill="#7C3AED" opacity="0.3" />
      </svg>
    );
  }
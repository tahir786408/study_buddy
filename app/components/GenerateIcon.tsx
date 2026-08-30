export default function GenerateIcon() {
    return (
      <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Notes/document */}
        <rect x="20" y="30" width="60" height="80" rx="8" fill="#EDE9FE" />
        <rect x="32" y="48" width="36" height="6" rx="3" fill="#7C3AED" opacity="0.5" />
        <rect x="32" y="62" width="36" height="6" rx="3" fill="#7C3AED" opacity="0.5" />
        <rect x="32" y="76" width="24" height="6" rx="3" fill="#7C3AED" opacity="0.5" />
  
        {/* Arrow */}
        <path d="M88 70 H108" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" />
        <path d="M100 62 L110 70 L100 78" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  
        {/* Quiz card result */}
        <rect x="118" y="40" width="26" height="60" rx="6" fill="#7C3AED" />
        <circle cx="131" cy="58" r="6" fill="white" opacity="0.9" />
        <rect x="124" y="70" width="14" height="4" rx="2" fill="white" opacity="0.7" />
        <rect x="124" y="78" width="14" height="4" rx="2" fill="white" opacity="0.5" />
      </svg>
    );
  }
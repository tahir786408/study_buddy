export default function Logo({ size = 40 }: { size?: number }) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9F67F0" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
        {/* Outer ring for a refined, framed feel */}
        <circle cx="20" cy="20" r="19" fill="none" stroke="#EDE9FE" strokeWidth="1" />
        {/* Filled badge */}
        <circle cx="20" cy="20" r="16" fill="url(#logoGradient)" />
        {/* Monogram */}
        <text
          x="20"
          y="26"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="15"
          fontWeight="600"
          fill="white"
          letterSpacing="0.5"
        >
          MF
        </text>
      </svg>
    );
  }
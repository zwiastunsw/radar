type RadarIconProps = {
  size?: number | string;
  className?: string;
};

export function RadarIcon({ size = 48, className }: RadarIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <radialGradient
          id="radarGlow"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(32 32) rotate(90) scale(30)"
        >
          <stop offset="0" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="0.55" stopColor="currentColor" stopOpacity="0.08" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* delikatne tło */}
      <circle cx="32" cy="32" r="30" fill="url(#radarGlow)" />

      {/* okręgi */}
      <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="32" cy="32" r="18" stroke="currentColor" strokeWidth="1.8" opacity="0.6" />
      <circle cx="32" cy="32" r="10" stroke="currentColor" strokeWidth="1.4" opacity="0.35" />

      {/* linia radaru */}
      <path
        d="M32 32 L46 22"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
      />

      {/* 🔴 punkt wykrycia — PRZENIESIONY na pierwszy wewnętrzny okrąg */}
      <circle cx="46" cy="22" r="3.2" fill="currentColor" />

      {/* środek */}
      <circle cx="32" cy="32" r="3.2" fill="currentColor" />

      {/* subtelny łuk */}
      <path
        d="M32 6 A26 26 0 0 1 58 32"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.18"
      />
    </svg>
  );
}
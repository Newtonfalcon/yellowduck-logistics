"use client";

/**
 * Yellowduck Logo Component
 * SVG-based minimalist duck mark + wordmark
 * Colors: Electric Amber (#FFB800) + Deep Navy (#0F172A)
 *
 * Props:
 *   size    — "sm" | "md" | "lg" (default: "md")
 *   variant — "full" | "mark" (default: "full")  mark = duck only
 *   theme   — "dark" | "light" (default: "dark")  affects wordmark color
 */
export default function Logo({
  size = "md",
  variant = "full",
  theme = "dark",
}) {
  const scales = { sm: 0.75, md: 1, lg: 1.35 };
  const scale = scales[size] ?? 1;

  // Duck mark is 32×32 px at scale=1
  const markW = 32 * scale;
  const markH = 32 * scale;

  // Wordmark
  const wordmarkColor = theme === "dark" ? "#0F172A" : "#FFFFFF";

  const DuckMark = () => (
    <svg
      width={markW}
      height={markH}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Body — rounded oval */}
      <ellipse cx="16" cy="21" rx="11" ry="8" fill="#FFB800" />

      {/* Wing detail — slightly darker amber */}
      <ellipse
        cx="14.5"
        cy="22"
        rx="6"
        ry="3.5"
        fill="#E8A600"
        opacity="0.6"
      />

      {/* Head */}
      <circle cx="24" cy="13" r="6" fill="#FFB800" />

      {/* Eye */}
      <circle cx="26.2" cy="11.6" r="1.4" fill="#0F172A" />
      <circle cx="26.7" cy="11.1" r="0.45" fill="#ffffff" />

      {/* Beak */}
      <path
        d="M29.8 13.5 L32 12.8 L31.2 15 Z"
        fill="#FF8C00"
      />

      {/* Tail feather */}
      <path
        d="M5.5 18 Q3 15 4.5 12 Q6 15.5 7.5 17.5 Z"
        fill="#E8A600"
      />

      {/* Feet hint */}
      <rect x="12" y="28.5" width="3" height="1.5" rx="0.75" fill="#E8A600" />
      <rect x="17" y="28.5" width="3" height="1.5" rx="0.75" fill="#E8A600" />

      {/* Water ripple */}
      <path
        d="M5 29 Q10.5 27 16 29 Q21.5 31 27 29"
        stroke="#0F172A"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        opacity="0.18"
      />
    </svg>
  );

  if (variant === "mark") {
    return (
      <span
        role="img"
        aria-label="Yellowduck logo mark"
        style={{ display: "inline-flex", alignItems: "center" }}
      >
        <DuckMark />
      </span>
    );
  }

  return (
    <span
      role="img"
      aria-label="Yellowduck"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: `${8 * scale}px`,
        textDecoration: "none",
        userSelect: "none",
      }}
    >
      <DuckMark />

      {/* Wordmark */}
      <svg
        width={`${130 * scale}`}
        height={`${24 * scale}`}
        viewBox="0 0 130 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/*
          "Yellowduck" in a tight, modern sans weight.
          "Yellow" in Deep Navy, "duck" in Electric Amber.
          Rendered as a text path at 17px/700 so the SVG is self-contained
          and doesn't depend on font loading.
        */}
        <text
          y="18"
          fontFamily="-apple-system, 'Geist', 'Inter', sans-serif"
          fontSize="17"
          fontWeight="700"
          letterSpacing="-0.5"
          fill={wordmarkColor}
        >
          Yellow
        </text>
        <text
          x="62"
          y="18"
          fontFamily="-apple-system, 'Geist', 'Inter', sans-serif"
          fontSize="17"
          fontWeight="700"
          letterSpacing="-0.5"
          fill="#FFB800"
        >
          duck
        </text>
      </svg>
    </span>
  );
}
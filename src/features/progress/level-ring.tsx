import type { Rating } from "./rules.ts";

const radius = 15;
const circumference = 2 * Math.PI * radius;

// Decorative summary; callers render the rating as text next to it.
export function LevelRing({
  rating,
  size = 56,
}: {
  rating: Rating | null;
  size?: number;
}) {
  return (
    <svg
      className="level-ring"
      viewBox="0 0 36 36"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <circle className="level-ring-track" cx="18" cy="18" r={radius} />
      {rating === null ? null : (
        <circle
          className="level-ring-value"
          cx="18"
          cy="18"
          r={radius}
          strokeDasharray={`${(rating / 5) * circumference} ${circumference}`}
          transform="rotate(-90 18 18)"
        />
      )}
      <text x="18" y="22" textAnchor="middle">
        {rating ?? "–"}/5
      </text>
    </svg>
  );
}

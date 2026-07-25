export function Logo({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="9" fill="var(--primary)" />
      <g transform="rotate(-5 16 18)">
        <rect
          x="7"
          y="11"
          width="18"
          height="14"
          rx="2.5"
          fill="white"
          fillOpacity="0.96"
        />
      </g>
      <g transform="rotate(-6 14 8.5)">
        <rect
          x="9"
          y="6"
          width="10"
          height="5"
          rx="1"
          fill="var(--tape-amber)"
        />
      </g>
    </svg>
  );
}
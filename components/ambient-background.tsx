'use client';

interface AmbientBackgroundProps {
  variant?: 'light' | 'dark';
  intensity?: 'default' | 'subtle';
}

// Drop this inside any `relative overflow-hidden` container. Same visual
// language (grid + drifting tape-colored blobs) used on landing, auth, and
// dashboard so all three surfaces feel like one environment.
export function AmbientBackground({
  variant = 'light',
  intensity = 'default',
}: AmbientBackgroundProps) {
  const isDark = variant === 'dark';
  const gridColor = isDark ? '#ffffff' : '#16181D';
  const gridOpacity = isDark ? 0.06 : intensity === 'subtle' ? 0.025 : 0.04;
  const blobOpacity = intensity === 'subtle' ? 0.14 : isDark ? 0.35 : 0.22;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
          opacity: gridOpacity,
        }}
      />
      <div
        className="absolute -top-24 left-[15%] h-72 w-72 rounded-full bg-tape-violet blur-3xl motion-safe:animate-[drift-a_20s_ease-in-out_infinite]"
        style={{ opacity: blobOpacity }}
      />
      <div
        className="absolute top-1/3 right-[10%] h-64 w-64 rounded-full bg-tape-cyan blur-3xl motion-safe:animate-[drift-b_24s_ease-in-out_infinite]"
        style={{ opacity: blobOpacity * 0.85 }}
      />
      <div
        className="absolute -bottom-16 left-1/3 h-72 w-72 rounded-full bg-tape-emerald blur-3xl motion-safe:animate-[drift-a_26s_ease-in-out_infinite]"
        style={{ opacity: blobOpacity * 0.7 }}
      />
    </div>
  );
}
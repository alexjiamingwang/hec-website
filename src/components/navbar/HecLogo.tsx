"use client";

interface HecLogoProps {
  color: string;
  size?: number;
}

export function HecLogo({ color, size = 52 }: HecLogoProps) {
  const cx = 100, cy = 90;

  // Point at radius r and angle deg (degrees from 12-o'clock, clockwise)
  const pt = (r: number, deg: number): [number, number] => {
    const rad = (deg - 90) * (Math.PI / 180);
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  };

  const rInner = 56;
  const rOuter = 66;

  // Each handle: a thick short line (strokeLinecap="round" makes it pill-shaped)
  // starting just at the outer rim and extending outward
  const handleStart = rOuter - 1;
  const handleEnd   = rOuter + 15;  // regular handle length
  const handleTopEnd = rOuter + 22; // top handle is longer

  const spokeAngles = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <svg
      width={size}
      height={Math.round(size * 230 / 200)}
      viewBox="0 0 200 230"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Hokkaido Elite Club"
      style={{ color, stroke: "currentColor", transition: "color 0.5s ease" }}
    >
      {/* ── Wheel rim: two concentric circles ───────────────────────────────── */}
      <circle cx={cx} cy={cy} r={rInner} strokeWidth="2" />
      <circle cx={cx} cy={cy} r={rOuter} strokeWidth="2.5" />

      {/* ── 8 pill-shaped handles sticking outward from rim ─────────────────── */}
      {spokeAngles.map((deg) => {
        const isTop = deg === 0;
        const [x1, y1] = pt(handleStart, deg);
        const [x2, y2] = pt(isTop ? handleTopEnd : handleEnd, deg);
        return (
          <line
            key={deg}
            x1={x1} y1={y1}
            x2={x2} y2={y2}
            strokeWidth="7"
            strokeLinecap="round"
          />
        );
      })}

      {/* ── Mountains (3 peaks inside wheel) ────────────────────────────────── */}
      <polyline
        strokeWidth="2"
        points="70,104 79,85 86,92 94,71 101,81 108,76 116,90 124,104"
      />

      {/* ── Horizon wave line ────────────────────────────────────────────────── */}
      <path
        strokeWidth="2"
        d="M 68 108 C 80 104 90 112 100 108 C 110 104 120 110 132 108"
      />

      {/* ── Skis (3 thick diagonal strokes, lower-right of wheel interior) ───── */}
      <line strokeWidth="4.5" strokeLinecap="round" x1="100" y1="107" x2="111" y2="77" />
      <line strokeWidth="4.5" strokeLinecap="round" x1="106" y1="107" x2="117" y2="77" />
      <line strokeWidth="4.5" strokeLinecap="round" x1="112" y1="107" x2="123" y2="77" />

      {/* ── Text ─────────────────────────────────────────────────────────────── */}
      <text
        x={cx} y="183"
        fontFamily="var(--font-body, 'DM Sans'), Arial, sans-serif"
        fontSize="14"
        letterSpacing="4"
        textAnchor="middle"
        stroke="none"
        fill="currentColor"
        fontWeight="700"
      >
        HOKKAIDO
      </text>
      <text
        x={cx} y="200"
        fontFamily="var(--font-body, 'DM Sans'), Arial, sans-serif"
        fontSize="11"
        letterSpacing="3.5"
        textAnchor="middle"
        stroke="none"
        fill="currentColor"
        fontWeight="400"
      >
        ELITE CLUB
      </text>
    </svg>
  );
}

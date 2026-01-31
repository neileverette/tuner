import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface GradientRingProps {
  size: number;
  strokeWidth: number;
}

export const GradientRing: React.FC<GradientRingProps> = ({
  size,
  strokeWidth,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring scale animation starting at frame 15
  const scaleSpring = spring({
    frame: frame - 15,
    fps,
    config: {
      damping: 15,
      stiffness: 80,
      mass: 1,
    },
  });

  // Clamp scale to 0 before frame 15
  const scale = frame < 15 ? 0 : scaleSpring;

  // Rotation: 720° → 0° during frames 15-60 (two full spins)
  const rotation = interpolate(
    frame,
    [15, 60],
    [720, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const radius = size / 2 - strokeWidth / 2;
  const center = size / 2;

  return (
    <div
      style={{
        width: size,
        height: size,
        transform: `scale(${scale}) rotate(${rotation}deg)`,
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          {/* Conic gradient simulated with linear gradients */}
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#600072" />
            <stop offset="100%" stopColor="#ff0000" />
          </linearGradient>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff0000" />
            <stop offset="100%" stopColor="#ffc000" />
          </linearGradient>
          <linearGradient id="grad3" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffc000" />
            <stop offset="100%" stopColor="#97f813" />
          </linearGradient>
          <linearGradient id="grad4" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#97f813" />
            <stop offset="100%" stopColor="#02a0fb" />
          </linearGradient>
          <linearGradient id="grad5" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#02a0fb" />
            <stop offset="100%" stopColor="#0a00b2" />
          </linearGradient>
          <linearGradient id="grad6" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0a00b2" />
            <stop offset="100%" stopColor="#600072" />
          </linearGradient>
        </defs>

        {/* Create ring segments for conic gradient effect */}
        {[0, 60, 120, 180, 240, 300].map((startAngle, i) => {
          const endAngle = startAngle + 60;
          const startRad = (startAngle - 90) * (Math.PI / 180);
          const endRad = (endAngle - 90) * (Math.PI / 180);

          const x1 = center + radius * Math.cos(startRad);
          const y1 = center + radius * Math.sin(startRad);
          const x2 = center + radius * Math.cos(endRad);
          const y2 = center + radius * Math.sin(endRad);

          const gradients = [
            "#600072",
            "#ff0000",
            "#ffc000",
            "#97f813",
            "#02a0fb",
            "#0a00b2",
          ];
          const nextGradients = [
            "#ff0000",
            "#ffc000",
            "#97f813",
            "#02a0fb",
            "#0a00b2",
            "#600072",
          ];

          return (
            <path
              key={i}
              d={`M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`}
              stroke={`url(#ringGrad${i})`}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
            />
          );
        })}

        {/* Better approach: use a single circle with conic gradient via CSS */}
      </svg>

      {/* Overlay with actual conic gradient using CSS */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: size,
          height: size,
          borderRadius: "50%",
          background: `conic-gradient(from 90deg,
            #600072 0deg,
            #ff0000 70deg,
            #ffc000 120deg,
            #97f813 160deg,
            #02a0fb 200deg,
            #0aabf0 240deg,
            #0a00b2 300deg,
            #600072 360deg
          )`,
          mask: `radial-gradient(circle at center,
            transparent ${radius - strokeWidth / 2}px,
            black ${radius - strokeWidth / 2}px,
            black ${radius + strokeWidth / 2}px,
            transparent ${radius + strokeWidth / 2}px
          )`,
          WebkitMask: `radial-gradient(circle at center,
            transparent ${radius - strokeWidth / 2}px,
            black ${radius - strokeWidth / 2}px,
            black ${radius + strokeWidth / 2}px,
            transparent ${radius + strokeWidth / 2}px
          )`,
        }}
      />
    </div>
  );
};

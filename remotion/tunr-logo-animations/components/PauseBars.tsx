import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface PauseBarsProps {
  size: number;
}

export const PauseBars: React.FC<PauseBarsProps> = ({ size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Bouncy spring animation starting at frame 45
  const scaleSpring = spring({
    frame: frame - 45,
    fps,
    config: {
      damping: 8,
      stiffness: 150,
      mass: 0.8,
    },
  });

  // Clamp scale to 0 before frame 45
  const scale = frame < 45 ? 0 : scaleSpring;

  // Impact flash (frames 50-55)
  const flashOpacity = interpolate(
    frame,
    [50, 52, 55],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Shake effect (frames 50-60)
  const shakeX = interpolate(
    frame,
    [50, 52, 54, 56, 58, 60],
    [0, -5, 5, -3, 2, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const shakeY = interpolate(
    frame,
    [50, 53, 55, 57, 60],
    [0, 3, -3, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Bar dimensions proportional to circle size
  const barWidth = size * 0.08;
  const barHeight = size * 0.32;
  const barGap = size * 0.08;
  const barRadius = barWidth * 0.12;

  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        gap: barGap,
        transform: `scale(${scale}) translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      {/* Impact flash overlay */}
      <div
        style={{
          position: "absolute",
          top: -barHeight / 2,
          left: -barWidth - barGap,
          width: barWidth * 2 + barGap * 3,
          height: barHeight * 2,
          background: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, transparent 70%)",
          opacity: flashOpacity,
          pointerEvents: "none",
        }}
      />

      {/* Left bar */}
      <div
        style={{
          width: barWidth,
          height: barHeight,
          backgroundColor: "#FFFFFE",
          borderRadius: barRadius,
          boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
        }}
      />

      {/* Right bar */}
      <div
        style={{
          width: barWidth,
          height: barHeight,
          backgroundColor: "#FFFFFE",
          borderRadius: barRadius,
          boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
        }}
      />
    </div>
  );
};

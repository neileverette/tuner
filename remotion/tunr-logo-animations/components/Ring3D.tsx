import { useCurrentFrame } from "remotion";

interface Ring3DProps {
  size: number;
  strokeWidth: number;
  glowBlur?: number;
  glowDistance?: number;
  glowOpacity?: number;
}

export const Ring3D: React.FC<Ring3DProps> = ({
  size,
  strokeWidth,
  glowBlur = 60,
  glowDistance = 1,
  glowOpacity = 0.5,
}) => {
  const frame = useCurrentFrame();
  const radius = size / 2 - strokeWidth / 2;

  // Slow rotation of the gradient colors
  const gradientRotation = frame * 0.5;

  // Pulsing glow intensity
  const glowPulse = Math.sin(frame * 0.08) * 0.15 + 0.85;

  // Calculate glow sizes based on distance prop
  const outerGlowSize = 1 + 0.3 * glowDistance;
  const midGlowSize = 1 + 0.16 * glowDistance;
  const innerGlowSize = 1 + 0.06 * glowDistance;

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
      }}
    >
      {/* Outer neon glow - largest, most diffuse */}
      <div
        style={{
          position: "absolute",
          top: -size * (outerGlowSize - 1) / 2,
          left: -size * (outerGlowSize - 1) / 2,
          width: size * outerGlowSize,
          height: size * outerGlowSize,
          borderRadius: "50%",
          background: `conic-gradient(
            from ${90 + gradientRotation}deg,
            rgba(255, 0, 128, 0.4) 0deg,
            rgba(255, 0, 0, 0.4) 45deg,
            rgba(255, 128, 0, 0.4) 90deg,
            rgba(255, 255, 0, 0.4) 135deg,
            rgba(128, 255, 0, 0.4) 180deg,
            rgba(0, 255, 128, 0.4) 225deg,
            rgba(0, 255, 255, 0.4) 270deg,
            rgba(0, 128, 255, 0.4) 315deg,
            rgba(255, 0, 128, 0.4) 360deg
          )`,
          filter: `blur(${glowBlur}px)`,
          opacity: glowOpacity * glowPulse,
          zIndex: -3,
        }}
      />

      {/* Mid neon glow */}
      <div
        style={{
          position: "absolute",
          top: -size * (midGlowSize - 1) / 2,
          left: -size * (midGlowSize - 1) / 2,
          width: size * midGlowSize,
          height: size * midGlowSize,
          borderRadius: "50%",
          background: `conic-gradient(
            from ${90 + gradientRotation}deg,
            rgba(255, 0, 128, 0.6) 0deg,
            rgba(255, 0, 0, 0.6) 45deg,
            rgba(255, 128, 0, 0.6) 90deg,
            rgba(255, 255, 0, 0.6) 135deg,
            rgba(128, 255, 0, 0.6) 180deg,
            rgba(0, 255, 128, 0.6) 225deg,
            rgba(0, 255, 255, 0.6) 270deg,
            rgba(0, 128, 255, 0.6) 315deg,
            rgba(255, 0, 128, 0.6) 360deg
          )`,
          filter: `blur(${glowBlur * 0.5}px)`,
          opacity: glowOpacity * 1.2 * glowPulse,
          zIndex: -2,
        }}
      />

      {/* Inner neon glow - tighter, brighter */}
      <div
        style={{
          position: "absolute",
          top: -size * (innerGlowSize - 1) / 2,
          left: -size * (innerGlowSize - 1) / 2,
          width: size * innerGlowSize,
          height: size * innerGlowSize,
          borderRadius: "50%",
          background: `conic-gradient(
            from ${90 + gradientRotation}deg,
            rgba(255, 100, 180, 0.8) 0deg,
            rgba(255, 100, 100, 0.8) 45deg,
            rgba(255, 180, 100, 0.8) 90deg,
            rgba(255, 255, 150, 0.8) 135deg,
            rgba(180, 255, 100, 0.8) 180deg,
            rgba(100, 255, 180, 0.8) 225deg,
            rgba(100, 255, 255, 0.8) 270deg,
            rgba(100, 180, 255, 0.8) 315deg,
            rgba(255, 100, 180, 0.8) 360deg
          )`,
          filter: `blur(${glowBlur * 0.2}px)`,
          opacity: glowOpacity * 1.4 * glowPulse,
          zIndex: -1,
        }}
      />

      {/* Dark circle fill inside the ring */}
      <div
        style={{
          position: "absolute",
          top: strokeWidth,
          left: strokeWidth,
          width: size - strokeWidth * 2,
          height: size - strokeWidth * 2,
          borderRadius: "50%",
          backgroundColor: "rgba(10, 10, 15, 0.95)",
          boxShadow: "inset 0 0 30px rgba(0, 0, 0, 0.8)",
        }}
      />

      {/* Main gradient ring - brighter for neon effect */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: size,
          height: size,
          borderRadius: "50%",
          background: `conic-gradient(
            from ${90 + gradientRotation}deg,
            #ff0080 0deg,
            #ff0000 45deg,
            #ff8000 90deg,
            #ffff00 135deg,
            #80ff00 180deg,
            #00ff80 225deg,
            #00ffff 270deg,
            #0080ff 315deg,
            #ff0080 360deg
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

      {/* Bright edge highlight on the ring for extra neon pop */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: size,
          height: size,
          borderRadius: "50%",
          background: `conic-gradient(
            from ${90 + gradientRotation}deg,
            rgba(255, 150, 200, 0.5) 0deg,
            rgba(255, 150, 150, 0.5) 45deg,
            rgba(255, 200, 150, 0.5) 90deg,
            rgba(255, 255, 200, 0.5) 135deg,
            rgba(200, 255, 150, 0.5) 180deg,
            rgba(150, 255, 200, 0.5) 225deg,
            rgba(150, 255, 255, 0.5) 270deg,
            rgba(150, 200, 255, 0.5) 315deg,
            rgba(255, 150, 200, 0.5) 360deg
          )`,
          mask: `radial-gradient(circle at center,
            transparent ${radius - strokeWidth / 2 - 2}px,
            black ${radius - strokeWidth / 2}px,
            transparent ${radius - strokeWidth / 4}px
          )`,
          WebkitMask: `radial-gradient(circle at center,
            transparent ${radius - strokeWidth / 2 - 2}px,
            black ${radius - strokeWidth / 2}px,
            transparent ${radius - strokeWidth / 4}px
          )`,
          filter: "blur(2px)",
        }}
      />
    </div>
  );
};

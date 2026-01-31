import { interpolate, useCurrentFrame } from "remotion";

interface AmbientGlowProps {
  size: number;
}

export const AmbientGlow: React.FC<AmbientGlowProps> = ({ size }) => {
  const frame = useCurrentFrame();

  // Ambient pulse during build phase (frames 0-30)
  const buildPulse = interpolate(
    frame,
    [0, 15, 30],
    [0.2, 0.5, 0.3],
    { extrapolateRight: "clamp" }
  );

  // Intensify as ring appears (frames 15-60)
  const ringIntensity = interpolate(
    frame,
    [15, 30, 45, 60],
    [0.3, 0.6, 0.8, 0.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Impact flash (frames 50-55)
  const impactFlash = interpolate(
    frame,
    [50, 52, 55],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Final subtle pulse (frames 105-150)
  const finalPulse = interpolate(
    frame,
    [105, 120, 135, 150],
    [0.4, 0.5, 0.4, 0.45],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Combine all glow phases
  let glowOpacity: number;
  if (frame < 30) {
    glowOpacity = buildPulse;
  } else if (frame < 60) {
    glowOpacity = ringIntensity;
  } else if (frame < 105) {
    glowOpacity = 0.5 + impactFlash * 0.5;
  } else {
    glowOpacity = finalPulse;
  }

  // Scale grows with intensity
  const glowScale = interpolate(
    frame,
    [0, 30, 60, 105],
    [0.5, 1, 1.2, 1],
    { extrapolateRight: "clamp" }
  );

  // Rotation for the glow (slow spin)
  const glowRotation = interpolate(
    frame,
    [0, 150],
    [0, 360],
    { extrapolateRight: "clamp" }
  );

  const ringRadius = size / 2;
  const glowWidth = 30; // Tight glow width

  return (
    <>
      {/* Inner bright glow - tight like lightsaber core */}
      <div
        style={{
          position: "absolute",
          width: size + glowWidth,
          height: size + glowWidth,
          borderRadius: "50%",
          background: `conic-gradient(from ${90 + glowRotation}deg,
            #600072 0deg,
            #ff0000 40deg,
            #ffc000 130deg,
            #97f813 190deg,
            #02a0fb 255deg,
            #0aabf0 285deg,
            #0a00b2 340deg,
            #600072 360deg
          )`,
          mask: `radial-gradient(circle at center,
            transparent ${ringRadius - glowWidth/2}px,
            black ${ringRadius - glowWidth/4}px,
            black ${ringRadius + glowWidth/4}px,
            transparent ${ringRadius + glowWidth/2}px
          )`,
          WebkitMask: `radial-gradient(circle at center,
            transparent ${ringRadius - glowWidth/2}px,
            black ${ringRadius - glowWidth/4}px,
            black ${ringRadius + glowWidth/4}px,
            transparent ${ringRadius + glowWidth/2}px
          )`,
          opacity: glowOpacity * 1.2,
          transform: `scale(${glowScale})`,
          filter: "blur(8px)",
          pointerEvents: "none",
        }}
      />
      {/* Outer softer glow */}
      <div
        style={{
          position: "absolute",
          width: size + glowWidth * 2,
          height: size + glowWidth * 2,
          borderRadius: "50%",
          background: `conic-gradient(from ${90 + glowRotation}deg,
            rgba(96, 0, 114, 0.8) 0deg,
            rgba(255, 0, 0, 0.8) 40deg,
            rgba(255, 192, 0, 0.8) 130deg,
            rgba(151, 248, 19, 0.8) 190deg,
            rgba(2, 160, 251, 0.8) 255deg,
            rgba(10, 171, 240, 0.8) 285deg,
            rgba(10, 0, 178, 0.8) 340deg,
            rgba(96, 0, 114, 0.8) 360deg
          )`,
          mask: `radial-gradient(circle at center,
            transparent ${ringRadius - glowWidth}px,
            black ${ringRadius}px,
            black ${ringRadius}px,
            transparent ${ringRadius + glowWidth}px
          )`,
          WebkitMask: `radial-gradient(circle at center,
            transparent ${ringRadius - glowWidth}px,
            black ${ringRadius}px,
            black ${ringRadius}px,
            transparent ${ringRadius + glowWidth}px
          )`,
          opacity: glowOpacity * 0.7,
          transform: `scale(${glowScale})`,
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />
    </>
  );
};

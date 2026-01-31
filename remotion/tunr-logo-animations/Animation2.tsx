import { AbsoluteFill, useCurrentFrame } from "remotion";
import { GradientRing } from "./components/GradientRing";
import { PauseBars } from "./components/PauseBars";
import { TunrText } from "./components/TunrText";

export const TunrLogo: React.FC = () => {
  const frame = useCurrentFrame();

  // Logo sizing - scaled up for 1920x1080
  const circleSize = 300;
  const strokeWidth = 24;
  const fontSize = 180;
  const iconTextGap = 40;

  // Shake effect for the whole composition (frames 50-60)
  const shakeMultiplier = frame >= 50 && frame <= 60 ? 1 : 0;
  const shakeProgress = (frame - 50) / 10;
  const shakeX =
    shakeMultiplier *
    Math.sin(shakeProgress * Math.PI * 4) *
    Math.max(0, 1 - shakeProgress) *
    8;
  const shakeY =
    shakeMultiplier *
    Math.cos(shakeProgress * Math.PI * 3) *
    Math.max(0, 1 - shakeProgress) *
    5;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Main container with shake effect */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: iconTextGap,
          transform: `translate(${shakeX}px, ${shakeY}px)`,
        }}
      >
        {/* Icon container (ring + bars) */}
        <div
          style={{
            position: "relative",
            width: circleSize,
            height: circleSize,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Dark circle background */}
          <div
            style={{
              position: "absolute",
              width: circleSize - strokeWidth * 2,
              height: circleSize - strokeWidth * 2,
              borderRadius: "50%",
              backgroundColor: "#141414",
              opacity: frame >= 15 ? 1 : 0,
            }}
          />

          {/* Gradient ring */}
          <div
            style={{
              position: "absolute",
            }}
          >
            <GradientRing size={circleSize} strokeWidth={strokeWidth} />
          </div>

          {/* Pause bars */}
          <PauseBars size={circleSize} />
        </div>

        {/* Text */}
        <TunrText fontSize={fontSize} />
      </div>
    </AbsoluteFill>
  );
};

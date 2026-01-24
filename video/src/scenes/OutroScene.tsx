import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import { FadeIn } from "../components/FadeIn";
import { TextReveal, Subtitle } from "../components/TextReveal";

/**
 * Closing scene with call to action.
 */
export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Fade in
  const fadeIn = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Rainbow gradient animation
  const gradientProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 90,
  });

  const hue = interpolate(gradientProgress, [0, 1], [0, 30]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg,
          hsl(${280 + hue}, 50%, 10%) 0%,
          hsl(${260 + hue}, 40%, 5%) 100%)`,
        opacity: fadeIn,
      }}
    >
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 32,
        }}
      >
        {/* Logo */}
        <Sequence from={20}>
          <FadeIn startFrame={0} slideFrom="none">
            <div
              style={{
                fontSize: 80,
                fontWeight: 700,
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                color: "white",
                letterSpacing: "-0.04em",
              }}
            >
              tunr
            </div>
          </FadeIn>
        </Sequence>

        {/* Tagline */}
        <Sequence from={50}>
          <FadeIn startFrame={0} slideFrom="bottom" slideDistance={20}>
            <Subtitle
              text="Start listening now"
              fontSize={28}
              color="rgba(255, 255, 255, 0.7)"
            />
          </FadeIn>
        </Sequence>

        {/* URL */}
        <Sequence from={80}>
          <FadeIn startFrame={0} slideFrom="bottom" slideDistance={15}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 500,
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                color: "rgba(255, 255, 255, 0.5)",
                letterSpacing: "0.05em",
              }}
            >
              tunr.app
            </div>
          </FadeIn>
        </Sequence>
      </AbsoluteFill>

      {/* Decorative rainbow glow */}
      <RainbowGlow />
    </AbsoluteFill>
  );
};

const RainbowGlow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - 30,
    fps,
    config: { damping: 150 },
    durationInFrames: 60,
  });

  const opacity = interpolate(progress, [0, 1], [0, 0.4]);
  const scale = interpolate(progress, [0, 1], [0.8, 1]);

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: 800,
        height: 800,
        borderRadius: "50%",
        background: `conic-gradient(
          from 0deg,
          #ff0080,
          #ff8c00,
          #40e0d0,
          #8a2be2,
          #ff0080
        )`,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        filter: "blur(120px)",
        zIndex: -1,
      }}
    />
  );
};

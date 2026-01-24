import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import { TextReveal, Subtitle } from "../components/TextReveal";
import { FadeIn } from "../components/FadeIn";

/**
 * Opening scene with logo and tagline.
 * Apple-style minimal intro.
 */
export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Fade out at end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Background gradient animation
  const gradientProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 60,
  });

  const gradientAngle = interpolate(gradientProgress, [0, 1], [120, 135]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${gradientAngle}deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)`,
        opacity: fadeOut,
      }}
    >
      {/* Logo */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <Sequence from={10}>
          <FadeIn startFrame={0} slideFrom="none">
            <div
              style={{
                fontSize: 120,
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

        <Sequence from={40}>
          <FadeIn startFrame={0} slideFrom="bottom" slideDistance={20}>
            <Subtitle
              text="Free, open music discovery"
              fontSize={32}
              color="rgba(255, 255, 255, 0.6)"
            />
          </FadeIn>
        </Sequence>
      </AbsoluteFill>

      {/* Decorative gradient orb */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Sequence from={0}>
          <GlowOrb />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const GlowOrb: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    config: { damping: 100 },
    durationInFrames: 90,
  });

  const scale = interpolate(progress, [0, 1], [0.5, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 0.3]);

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: 600,
        height: 600,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(138, 43, 226, 0.4) 0%, transparent 70%)",
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        filter: "blur(60px)",
      }}
    />
  );
};

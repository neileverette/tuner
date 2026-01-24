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

interface SourceLogoProps {
  name: string;
  color: string;
  delay: number;
}

const SourceLogo: React.FC<SourceLogoProps> = ({ name, color, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 80, stiffness: 200 },
  });

  const scale = interpolate(progress, [0, 1], [0.8, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const y = interpolate(progress, [0, 1], [20, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px) scale(${scale})`,
        padding: "16px 32px",
        borderRadius: 12,
        background: `${color}20`,
        border: `2px solid ${color}40`,
      }}
    >
      <span
        style={{
          fontSize: 28,
          fontWeight: 600,
          color,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        {name}
      </span>
    </div>
  );
};

/**
 * Scene showing the four radio sources.
 * Staggered reveal of source logos.
 */
export const SourcesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Fade in/out
  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const sources = [
    { name: "SomaFM", color: "#FF6600" },
    { name: "Radio Paradise", color: "#663399" },
    { name: "NTS Radio", color: "#00C8FF" },
    { name: "KEXP", color: "#C8102E" },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 100%)",
        opacity: fadeIn * fadeOut,
      }}
    >
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 48,
        }}
      >
        {/* Title */}
        <Sequence from={10}>
          <FadeIn startFrame={0} slideFrom="top" slideDistance={30}>
            <Subtitle
              text="Four legendary stations"
              fontSize={24}
              color="rgba(255, 255, 255, 0.5)"
            />
          </FadeIn>
        </Sequence>

        {/* Source logos grid */}
        <div
          style={{
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 600,
          }}
        >
          {sources.map((source, i) => (
            <SourceLogo
              key={source.name}
              name={source.name}
              color={source.color}
              delay={30 + i * 15}
            />
          ))}
        </div>

        {/* Subtitle */}
        <Sequence from={100}>
          <FadeIn startFrame={0} slideFrom="bottom">
            <Subtitle
              text="All in one place"
              fontSize={36}
              color="rgba(255, 255, 255, 0.9)"
            />
          </FadeIn>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

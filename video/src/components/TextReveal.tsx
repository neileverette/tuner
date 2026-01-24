import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

interface TextRevealProps {
  text: string;
  /** Frame to start the reveal */
  startFrame?: number;
  /** Font size in pixels */
  fontSize?: number;
  /** Font weight */
  fontWeight?: number;
  /** Text color */
  color?: string;
  /** Stagger delay between characters (frames) */
  stagger?: number;
}

/**
 * Reveals text character by character with smooth animation.
 */
export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  startFrame = 0,
  fontSize = 48,
  fontWeight = 600,
  color = "white",
  stagger = 2,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        fontSize,
        fontWeight,
        color,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        display: "flex",
        letterSpacing: "-0.02em",
      }}
    >
      {text.split("").map((char, i) => {
        const charFrame = startFrame + i * stagger;

        const progress = spring({
          frame: frame - charFrame,
          fps,
          config: {
            damping: 100,
            stiffness: 400,
          },
        });

        const opacity = interpolate(progress, [0, 1], [0, 1]);
        const y = interpolate(progress, [0, 1], [20, 0]);

        return (
          <span
            key={i}
            style={{
              opacity,
              transform: `translateY(${y}px)`,
              display: "inline-block",
              whiteSpace: char === " " ? "pre" : "normal",
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};

interface SubtitleProps {
  text: string;
  startFrame?: number;
  fontSize?: number;
  color?: string;
}

/**
 * Simple subtitle that fades in.
 */
export const Subtitle: React.FC<SubtitleProps> = ({
  text,
  startFrame = 0,
  fontSize = 24,
  color = "rgba(255, 255, 255, 0.7)",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: {
      damping: 100,
    },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const y = interpolate(progress, [0, 1], [10, 0]);

  return (
    <div
      style={{
        fontSize,
        color,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontWeight: 400,
        opacity,
        transform: `translateY(${y}px)`,
        letterSpacing: "0.02em",
      }}
    >
      {text}
    </div>
  );
};

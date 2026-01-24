import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

interface FadeInProps {
  children: React.ReactNode;
  /** Frame to start fading in */
  startFrame?: number;
  /** Duration of fade in frames */
  durationInFrames?: number;
  /** Optional slide direction */
  slideFrom?: "bottom" | "top" | "left" | "right" | "none";
  /** Slide distance in pixels */
  slideDistance?: number;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  startFrame = 0,
  durationInFrames = 30,
  slideFrom = "bottom",
  slideDistance = 30,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
    },
    durationInFrames,
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);

  let translateX = 0;
  let translateY = 0;

  if (slideFrom === "bottom") {
    translateY = interpolate(progress, [0, 1], [slideDistance, 0]);
  } else if (slideFrom === "top") {
    translateY = interpolate(progress, [0, 1], [-slideDistance, 0]);
  } else if (slideFrom === "left") {
    translateX = interpolate(progress, [0, 1], [-slideDistance, 0]);
  } else if (slideFrom === "right") {
    translateX = interpolate(progress, [0, 1], [slideDistance, 0]);
  }

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translate(${translateX}px, ${translateY}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

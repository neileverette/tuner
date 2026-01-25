import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type LiveWebsiteRevealProps = {
  url: string;
};

type CameraPose = {
  x: number;
  y: number;
  scale: number;
  rotate: number;
};

type CameraSegment = {
  start: number;
  end: number;
  from: CameraPose;
  to: CameraPose;
  damping: number;
  stiffness: number;
  intent: string;
};

const segments: CameraSegment[] = [
  {
    start: 0,
    end: 36,
    from: { x: 0, y: 0, scale: 1, rotate: 0 },
    to: { x: 0, y: -20, scale: 1.04, rotate: 0 },
    damping: 200,
    stiffness: 60,
    intent: "Establish the full UI with a gentle forward push.",
  },
  {
    start: 36,
    end: 90,
    from: { x: 0, y: -20, scale: 1.04, rotate: 0 },
    to: { x: -240, y: -220, scale: 1.6, rotate: -0.6 },
    damping: 180,
    stiffness: 90,
    intent: "Move to album artwork for a confident close-up.",
  },
  {
    start: 90,
    end: 132,
    from: { x: -240, y: -220, scale: 1.6, rotate: -0.6 },
    to: { x: -200, y: 140, scale: 1.55, rotate: 0.2 },
    damping: 200,
    stiffness: 80,
    intent: "Slide down to the player controls with a tactile shift.",
  },
  {
    start: 132,
    end: 186,
    from: { x: -200, y: 140, scale: 1.55, rotate: 0.2 },
    to: { x: 260, y: 40, scale: 1.45, rotate: 0.4 },
    damping: 170,
    stiffness: 100,
    intent: "Glide across discovery/browse section.",
  },
  {
    start: 186,
    end: 228,
    from: { x: 260, y: 40, scale: 1.45, rotate: 0.4 },
    to: { x: 20, y: -10, scale: 1.08, rotate: 0 },
    damping: 140,
    stiffness: 120,
    intent: "Pull back to a composed, premium framing.",
  },
  {
    start: 228,
    end: 240,
    from: { x: 20, y: -10, scale: 1.08, rotate: 0 },
    to: { x: 0, y: 0, scale: 1, rotate: 0 },
    damping: 200,
    stiffness: 80,
    intent: "Settle with a clean, final alignment.",
  },
];

const getCameraPose = (frame: number, fps: number): CameraPose => {
  const segment =
    segments.find((seg) => frame >= seg.start && frame < seg.end) ||
    segments[segments.length - 1];

  const duration = segment.end - segment.start;

  const progress = spring({
    frame: frame - segment.start,
    fps,
    durationInFrames: duration,
    config: {
      damping: segment.damping,
      stiffness: segment.stiffness,
      mass: 1,
    },
  });

  return {
    x: interpolate(progress, [0, 1], [segment.from.x, segment.to.x]),
    y: interpolate(progress, [0, 1], [segment.from.y, segment.to.y]),
    scale: interpolate(progress, [0, 1], [segment.from.scale, segment.to.scale]),
    rotate: interpolate(progress, [0, 1], [segment.from.rotate, segment.to.rotate]),
  };
};

export const TikTokAppleReveal: React.FC<LiveWebsiteRevealProps> = ({ url }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const camera = getCameraPose(frame, fps);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      {/* Camera guides focus across the live UI with restrained motion. */}
      <AbsoluteFill
        style={{
          transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale}) rotate(${camera.rotate}deg)`,
          transformOrigin: "center center",
        }}
      >
        <iframe
          src={url}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            background: "#000",
          }}
          sandbox="allow-scripts allow-same-origin"
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
